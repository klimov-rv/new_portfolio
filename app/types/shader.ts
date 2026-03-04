export interface HSVControls {
  hue?: number; // 0-360
  saturation?: number; // 0-1
  brightness?: number; // 0-1
}

export interface ShaderControls extends HSVControls {
  speed?: number; // Множитель скорости
  mouseSensitivity?: number; // 0.1-5.0
  damping?: number; // 0-0.99
  mouseMode?: 'click' | 'hover';
  mouseForce?: number; // 0-2, сила воздействия мыши
  mouseSize?: number; // 0.1-0.5, радиус воздействия
}

export interface NoiseConfig {
  opacity: number; // 0-1
  scale: number; // множитель размера
}

export interface ShaderProps extends ShaderControls {
  shaderCode: string;
  noise?: NoiseConfig;
  class?: any;
}

// Опции для useShaderToy - те же что и пропсы, без class/noise
export type UseShaderToyOptions = ShaderControls & {
  shaderCode: string;
};
