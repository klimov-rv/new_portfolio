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

  private _speed: number = 1; // Множитель скорости анимации

  // Управление мышью
  private _mouseMode: MouseMode = 'click';
  private _mouseSensitivity: number = 1.0;
  private _mouseDamping: number = 0; // Инерция движения мыши (0-0.99)
  private _mouseForce: number = 0.3;
  private _mouseSize: number = 0.9;
  private _mouseInnerRatio: number = 0.5;

  private clickStrength: number = 0; // 0-1, сила затухающего эффекта

  // Эффект "вмятины" для нажатия
  private dentStartStrength: number = 0;
  private dentActive: boolean = false;
  private dentStartTime: number = 0;
  private dentDuration: number = 300;

  // Эффект "восстановления" после нажатия
  private decayStartStrength: number = 0;
  private decayActive: boolean = false; // Флаг, что затухание активно
  private decayStartTime: number = 0; // Время начала затухания
  private decayDuration: number = 500; // Длительность затухания в мс

  // Для ещё более плавного перехода можно добавить интерполяцию
  private targetSpeed: number = 1;
  private speedTransitionActive: boolean = false;
  private speedTransitionStart: number = 0;
  private speedTransitionDuration: number = 300; // мс

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
    if (isDown && this.mouseMode != 'hover') {
      this.clickStrength = 1.0;

      this.decayActive = false;

      this.dentActive = true;
      this.dentStartTime = Date.now();
      this.dentStartStrength = this.clickStrength;
    } else if (!isDown) {
      this.dentActive = false;

      this.decayActive = true;
      this.decayStartTime = Date.now();
      this.decayStartStrength = this.clickStrength;
    }
  }

  public updateMouseFromGlobal(x: number, y: number, isClick: boolean = false) {
    const canvas = this.renderer.gl.canvas;

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

    // Плавное движение с damping
    this.iMouse.x =
      this.iMouse.x * this._mouseDamping + newX * (1 - this._mouseDamping);
    this.iMouse.y =
      this.iMouse.y * this._mouseDamping + newY * (1 - this._mouseDamping);

    if (isClick) {
      this.iMouse.clickX = newX;
      this.iMouse.clickY = newY;
      this.clickStrength = 1.0;
    }
  }

  // Респонсив canvas
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

    const fullFragmentShader = this.shaderSource;

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
          uMouseForce: { value: this._mouseForce },
          uMouseSize: { value: this._mouseSize },
          uMouseInnerRatio: { value: this._mouseInnerRatio },
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
    // Плавный переход скорости
    if (this.speedTransitionActive) {
      const elapsed = now - this.speedTransitionStart;

      if (elapsed >= this.speedTransitionDuration) {
        this.speedTransitionActive = false;
        this._speed = this.targetSpeed;
      } else {
        const progress = elapsed / this.speedTransitionDuration;
        // ease-in-out для плавности
        const eased =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const oldSpeed = this._speed;
        this._speed = oldSpeed + (this.targetSpeed - oldSpeed) * eased;

        // Корректируем firstDrawTime для непрерывности
        const currentPlaybackTime =
          (now - this.firstDrawTime) * 0.001 * oldSpeed;
        this.firstDrawTime = now - (currentPlaybackTime / this._speed) * 1000;
      }
    }

    // Обработка вмятины и затухания
    if (this.dentActive || this.decayActive) {
      const now = Date.now();
      const decayElapsed = now - this.decayStartTime;
      const dentElapsed = now - this.dentStartTime;

      if (this.decayActive) {
        if (decayElapsed >= this.decayDuration) {
          // Затухание завершено
          this.decayActive = false;
          this.clickStrength = 0;
        } else {
          // Плавное уменьшение силы (ease-out)
          const progress = decayElapsed / this.decayDuration;
          this.clickStrength =
            this.decayStartStrength * (1 - Math.pow(progress, 1.5));
        }
      }

      if (this.dentActive) {
        if (dentElapsed >= this.dentDuration) {
          this.dentActive = false;
        } else {
          const progress = dentElapsed / this.dentDuration;
          this.clickStrength = this.dentStartStrength * Math.pow(progress, 1.5);
        }
      }
    }

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

      // ✅ iMouse
      this.program.uniforms.iMouse.value = [
        this.iMouse.x,
        this.iMouse.y,
        this.decayActive || this.dentActive ? 0 : 0.0,
        this.clickStrength,
      ];

      this.program.uniforms.iDate.value = iDate;
      this.program.uniforms.iHSV.value = [
        this.hsv.hue,
        this.hsv.saturation,
        this.hsv.brightness,
      ];
      this.program.uniforms.iSpeed.value = this._speed;
      this.program.uniforms.uMouseForce.value = this._mouseForce;
      this.program.uniforms.uMouseSize.value = this._mouseSize;
      this.program.uniforms.uMouseInnerRatio.value = this._mouseInnerRatio;
      // Рендер
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
    // Защита от отрицательных значений
    val = Math.max(0, val);

    // Если скорость не меняется - ничего не делаем
    if (Math.abs(val - this._speed) < 0.001) return;

    // Если анимация не играет - просто меняем скорость
    if (!this.isPlaying || !this.program || !this.mesh) {
      this._speed = val;
      return;
    }

    // Сохраняем текущее время анимации
    const now = Date.now();
    const currentTime = (now - this.firstDrawTime) * 0.001; // время без множителя
    const currentPlaybackTime = currentTime * this._speed; // время с текущим множителем

    // Пересчитываем firstDrawTime для новой скорости
    // Чтобы currentPlaybackTime остался тем же
    this.firstDrawTime = now - (currentPlaybackTime / val) * 1000;

    // Обновляем скорость
    this._speed = val;
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
