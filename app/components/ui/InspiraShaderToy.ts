import { Camera, Geometry, Mesh, Program, Renderer, Transform } from 'ogl';

import type { ShaderControls } from '~/types/shader';

// Конфиг для компиляции шейдера
export interface ShaderConfig {
  source: string;
}

// Состояние мыши в пикселях canvas
export interface MouseState {
  x: number; // Текущая позиция X
  y: number; // Текущая позиция Y
  clickX: number; // Последняя позиция клика по X
  clickY: number; // Последняя позиция клика по Y
}

// HSV управление цветом (Hue-Saturation-Value)
export interface HSVControls {
  hue: number; // 0-360 градусов
  saturation: number; // 0-5 (интенсивность цвета)
  brightness: number; // 0-5 (яркость)
}

// Режим обработки мыши: 'click' = только при клике, 'hover' = постоянно следует
export type MouseMode = 'click' | 'hover';

export class InspiraShaderToy {
  // WebGL объекты
  private renderer: Renderer;
  private camera: Camera;
  private scene: Transform;
  private geometry: Geometry;
  private program: Program | null = null;
  private mesh: Mesh | null = null;

  // Анимация и время
  private isPlaying: boolean = false;
  private firstDrawTime: number = 0;
  private prevDrawTime: number = 0;
  private iFrame: number = 0;

  // Таймирование кадров
  private targetFPS: number = 60;
  private frameInterval: number = 1000 / 60;
  private lastFrameTime: number = 0;

  // Состояние шейдера (передается как uniforms)
  private iMouse: MouseState = { x: 0, y: 0, clickX: 0, clickY: 0 };
  private hsv: HSVControls = { hue: 0, saturation: 1, brightness: 1 };
  private uEffectTime = { value: 0 };

  private _speed: number = 1; // Множитель скорости анимации

  // Управление мышью
  private _mouseMode: MouseMode = 'click';
  private _mouseSensitivity: number = 1.0;
  private _mouseDamping: number = 0; // Инерция движения мыши (0-0.99)

  // Шейдер
  private shaderSource: string = '';

  private readonly vertexShader = `#version 300 es
    #ifdef GL_ES
    precision highp float;
    precision highp int;
    #endif
    in vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  private readonly fragmentShaderHeader = `#version 300 es
    #ifdef GL_ES
    precision highp float;
    precision highp int;
    #endif
    
    uniform vec3      iResolution;     // viewport resolution (in pixels)
    uniform float     iTime;           // shader playback time (in seconds)
    uniform float     iTimeDelta;      // render time (in seconds)
    uniform float     iFrameRate;      // shader frame rate
    uniform int       iFrame;          // shader playback frame
    uniform vec4      iMouse;          // mouse pixel coords. xy: current, zw: click
    uniform vec4      iDate;           // (year, month, day, unixtime in seconds)
    uniform vec3      iHSV;            // HSV controls (hue, saturation, brightness)
    uniform float     iSpeed;          // speed multiplier
    
    out vec4 fragColor;
    
    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    
    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }
    
    vec3 applyHSV(vec3 color, vec3 hsvAdjust) {
        vec3 hsv = rgb2hsv(color);
        hsv.x = fract(hsv.x + hsvAdjust.x / 360.0);
        hsv.y = clamp(hsv.y * hsvAdjust.y, 0.0, 1.0);
        hsv.z = clamp(hsv.z * hsvAdjust.z, 0.0, 1.0);
        return hsv2rgb(hsv);
    }
    
    void mainImage(out vec4 c, in vec2 f);
    
    void main() {
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
        mainImage(color, gl_FragCoord.xy);
        
        if (iHSV.x != 0.0 || iHSV.y != 1.0 || iHSV.z != 1.0) {
            color.rgb = applyHSV(color.rgb, iHSV);
        }
        
        fragColor = color;
    }
  `;

  constructor(
    private container: HTMLElement,
    mouseMode?: MouseMode,
    fps?: number,
  ) {
    if (mouseMode) this._mouseMode = mouseMode;
    if (fps) this.setFrameRate(fps);

    // Инициализируем WebGL рендер (требует WebGL 2)
    this.renderer = new Renderer({
      width: this.container.clientWidth,
      height: this.container.clientHeight,
      dpr: window.devicePixelRatio,
      alpha: true,
      depth: false,
      stencil: false,
      antialias: true,
      powerPreference: 'high-performance',
    });

    this.container.appendChild(this.renderer.gl.canvas);

    // Ортографическая камера для полноэкранного quad
    this.camera = new Camera(this.renderer.gl);
    this.camera.position.z = 1;

    this.scene = new Transform();

    // Полноэкранный quad (два треугольника, 6 вершин)
    this.geometry = new Geometry(this.renderer.gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1, -1, 1, 1, -1]),
      },
    });

    this.setup();
  }

  private setup(): void {
    this.setupResizeHandler();
  }

  // Новый метод для обновления состояния клика
  public setMouseState(isDown: boolean) {
    console.log('INSPIRA_DOWN', isDown);
    if (isDown) {
      console.log(' 11111 this._mouseMode', this._mouseMode);
      this.mouseMode = 'hover';
      console.log('2222 this._mouseMode', this._mouseMode);
    } else if (!isDown) {
      console.log('3333 this._mouseMode', this._mouseMode);
      this.mouseMode = 'click';
      this.iMouse.x = 0;
      this.iMouse.y = 0;
    }
  }

  public updateMouseFromGlobal(
    x: number,
    y: number,
    clickX?: number,
    clickY?: number,
    isDown?: boolean,
  ) {
    console.log('Получаем canvas и его позицию');
    const canvas = this.renderer.gl.canvas;
    let isMouseDown = false;

    // Масштабируем координаты мыши на DPR и применяем чувствительность
    const getScaledMousePos = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio;
      const new_x = x - rect.left;
      // Флипим Y, потому что в GLSL вверх это +Y, а в DOM это -Y
      const new_y = y - rect.top;

      return {
        x: new_x * dpr,
        y: canvas.height - new_y * dpr,
      };
    };

    const { x: newX, y: newY } = getScaledMousePos(x, y);

    console.log('Плавное движение мыши с инерцией (damping)');
    // Плавное движение мыши с инерцией (damping)
    this.iMouse.x =
      this.iMouse.x * this._mouseDamping + newX * (1 - this._mouseDamping);
    this.iMouse.y =
      this.iMouse.y * this._mouseDamping + newY * (1 - this._mouseDamping);

    // В режиме 'hover' клик = текущая позиция мыши
    if (this._mouseMode === 'hover' && !isMouseDown) {
      console.log(' клик 111111111111 ++++');
      this.iMouse.clickX = this.iMouse.x;
      this.iMouse.clickY = this.iMouse.y;
    } else {
      console.log(' клик ---------------');
      this.iMouse.clickX = newX;
      this.iMouse.clickY = newY;
    }
  }

  // Респонсивный шейдер - когда окно меняется, сколируем canvas
  private setupResizeHandler(): void {
    const resizeObserver = new ResizeObserver(() => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;

      this.renderer.setSize(width, height);
      this.renderer.gl.viewport(
        0,
        0,
        width * window.devicePixelRatio,
        height * window.devicePixelRatio,
      );

      // Обновляем разрешение в шейдере
      if (this.program) {
        this.program.uniforms.iResolution.value = [
          width * window.devicePixelRatio,
          height * window.devicePixelRatio,
          window.devicePixelRatio,
        ];
      }
    });

    resizeObserver.observe(this.container);
  }

  // Компилируем шейдер в программу WebGL (частая операция - когда меняется код шейдера)
  private compileProgram(): boolean {
    if (!this.shaderSource) return false;

    const fullFragmentShader = this.fragmentShaderHeader + this.shaderSource;

    try {
      const program = new Program(this.renderer.gl, {
        vertex: this.vertexShader,
        fragment: fullFragmentShader,
        uniforms: {
          iResolution: {
            value: [
              this.container.clientWidth * window.devicePixelRatio,
              this.container.clientHeight * window.devicePixelRatio,
              window.devicePixelRatio,
            ],
          },
          iTime: { value: 0 },
          iTimeDelta: { value: 0 },
          iFrameRate: { value: this.targetFPS },
          iFrame: { value: 0 },
          iMouse: { value: [0, 0, 0, 0] },
          iDate: { value: [0, 0, 0, 0] },
          iHSV: {
            value: [this.hsv.hue, this.hsv.saturation, this.hsv.brightness],
          },
          iSpeed: { value: this._speed },
          uMouseForce: { value: 0.3 },
          uMouseSize: { value: 0.3 },
        },
      });

      this.program = program;
      this.mesh = new Mesh(this.renderer.gl, {
        geometry: this.geometry,
        program,
      });

      return true;
    } catch (error) {
      console.error('Failed to compile shader:', error);
      return false;
    }
  }

  // Отрисовка кадра: обновляем uniforms и рендерим на экран
  private draw(): void {
    if (!this.program || !this.mesh) return;

    const now = this.isPlaying ? Date.now() : this.prevDrawTime;

    // Ограничиваем FPS если нужна низкая частота
    if (this.isPlaying && this.targetFPS < 60) {
      const elapsed = now - this.lastFrameTime;
      if (elapsed < this.frameInterval) {
        requestAnimationFrame(() => this.animate());
        return;
      }
      this.lastFrameTime = now - (elapsed % this.frameInterval);
    }

    // Первый кадр = начало времени анимации
    if (this.firstDrawTime === 0) {
      this.firstDrawTime = now;
    }

    const date = new Date(now);
    const iTimeDelta = (now - this.prevDrawTime) * 0.001 * this._speed;
    const iTime = (now - this.firstDrawTime) * 0.001 * this._speed;
    const iDate = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getTime() * 0.001,
    ];

    if (this.program && this.mesh) {
      // Обновляем все uniforms перед рендером
      this.program.uniforms.iResolution.value = [
        this.container.clientWidth * window.devicePixelRatio,
        this.container.clientHeight * window.devicePixelRatio,
        window.devicePixelRatio,
      ];
      this.program.uniforms.iTime.value = iTime;
      this.program.uniforms.iTimeDelta.value = iTimeDelta;
      this.program.uniforms.iFrameRate.value = this.targetFPS;
      this.program.uniforms.iFrame.value = this.iFrame;
      this.program.uniforms.iMouse.value = [
        this.iMouse.x,
        this.iMouse.y,
        this.iMouse.clickX,
        this.iMouse.clickY,
      ];
      this.program.uniforms.iDate.value = iDate;
      this.program.uniforms.iHSV.value = [
        this.hsv.hue,
        this.hsv.saturation,
        this.hsv.brightness,
      ];
      this.program.uniforms.iSpeed.value = this._speed;

      // Рендер!
      this.renderer.render({ scene: this.mesh, camera: this.camera });
    }

    this.prevDrawTime = now;
    this.iFrame++;
  }

  // RequestAnimationFrame loop
  private animate = (): void => {
    if (this.isPlaying) {
      this.draw();
      requestAnimationFrame(this.animate);
    }
  };

  public setEffectTime(val: number) {
    if (this.program) {
      this.program.uniforms.uEffectTime.value = Math.max(0, Math.min(1, val));
    }
  }

  // =========== PUBLIC INTERFACE ============
  // Загружаем и компилируем код шейдера
  public setShader(config: ShaderConfig): boolean {
    this.shaderSource = config.source;
    const success = this.compileProgram();
    if (success && this.isPlaying) {
      this.draw();
    }
    return success;
  }

  // HSV контролы для цвета
  public setHSV(hsv: Partial<HSVControls>): void {
    if (hsv.hue !== undefined) this.hsv.hue = hsv.hue;
    if (hsv.saturation !== undefined) this.hsv.saturation = hsv.saturation;
    if (hsv.brightness !== undefined) this.hsv.brightness = hsv.brightness;
    if (!this.isPlaying && this.program && this.mesh) this.draw();
  }

  public setHue(val: number) {
    this.hsv.hue = val;
    if (!this.isPlaying && this.program && this.mesh) this.draw();
  }

  public setSaturation(val: number) {
    this.hsv.saturation = val;
    if (!this.isPlaying && this.program && this.mesh) this.draw();
  }

  public setBrightness(val: number) {
    this.hsv.brightness = val;
    if (!this.isPlaying && this.program && this.mesh) this.draw();
  }

  public getHSV(): HSVControls {
    return { ...this.hsv };
  }

  // Скорость анимации (множитель для iTime)
  public setSpeed(val: number): void {
    this._speed = Math.max(0, val);

    if (!this.isPlaying && this.program && this.mesh) this.draw();
  }

  public getSpeed(): number {
    return this._speed;
  }

  public setMouseForce(val: number) {
    if (this.program) {
      this.program.uniforms.uMouseForce.value = Math.max(0, Math.min(2, val));
    }
  }

  public setMouseSize(val: number) {
    if (this.program) {
      this.program.uniforms.uMouseSize.value = Math.max(
        0.1,
        Math.min(0.5, val),
      );
    }
  }

  // Таймирование
  public setFrameRate(fps: number): void {
    this.targetFPS = Math.max(1, Math.min(60, fps));
    this.frameInterval = 1000 / this.targetFPS;
  }

  public getFrameRate(): number {
    return this.targetFPS;
  }

  public time(): number {
    return (this.prevDrawTime - this.firstDrawTime) * 0.001 * this._speed;
  }

  // Управление воспроизведением
  public reset(): void {
    const now = Date.now();
    this.firstDrawTime = now;
    this.prevDrawTime = now;
    this.lastFrameTime = now;
    this.iFrame = 0;
    this.draw();
  }

  public pause(): void {
    this.isPlaying = false;
  }

  public play(): void {
    if (!this.isPlaying) {
      this.isPlaying = true;
      const now = Date.now();
      const elapsed = this.prevDrawTime - this.firstDrawTime;
      this.firstDrawTime = now - elapsed;
      this.prevDrawTime = now;
      this.lastFrameTime = now;
      this.animate();
    }
  }

  public isPlayingState(): boolean {
    return this.isPlaying;
  }

  // Управление мышью
  public setMouseSensitivity(sensitivity: number): void {
    this._mouseSensitivity = Math.max(0.1, Math.min(5.0, sensitivity));
  }

  public getMouseSensitivity(): number {
    return this._mouseSensitivity;
  }

  public setMouseDamping(damping: number): void {
    this._mouseDamping = Math.max(0, Math.min(0.99, damping));
  }

  public getMouseDamping(): number {
    return this._mouseDamping;
  }

  public get mouseMode(): MouseMode {
    return this._mouseMode;
  }

  public set mouseMode(val: MouseMode) {
    this._mouseMode = val;
  }

  public setControls(controls: ShaderControls) {
    if (controls.hue !== undefined) this.setHue(controls.hue);
    if (controls.saturation !== undefined)
      this.setSaturation(controls.saturation);
    if (controls.brightness !== undefined)
      this.setBrightness(controls.brightness);
    if (controls.speed !== undefined) this.setSpeed(controls.speed);
    if (controls.mouseSensitivity !== undefined)
      this.setMouseSensitivity(controls.mouseSensitivity);
    if (controls.damping !== undefined) this.setMouseDamping(controls.damping);
  }

  public getState() {
    return {
      ...this.hsv,
      speed: this._speed,
      isPlaying: this.isPlaying,
    };
  }

  // Очистка
  public dispose(): void {
    this.pause();
    if (this.renderer.gl.canvas.parentElement) {
      this.renderer.gl.canvas.parentElement.removeChild(
        this.renderer.gl.canvas,
      );
    }
  }
}
