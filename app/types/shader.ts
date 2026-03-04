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
}

export interface NoiseConfig {
  opacity: number; // 0-1
  scale: number; // множитель размера
}

export interface ShaderProps extends ShaderControls {
  shaderCode: string;
  noise?: NoiseConfig;
  class?: any; // HTMLAttributes['class'] - оставляем any для простоты
}
