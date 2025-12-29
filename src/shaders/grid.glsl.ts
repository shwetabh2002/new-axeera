/**
 * Grid shader for the ground plane
 * Creates a subtle technical grid that fades into distance
 */

export const gridVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const gridFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;

varying vec2 vUv;
varying vec3 vWorldPosition;

float grid(vec2 st, float res) {
  vec2 grid = abs(fract(st * res - 0.5) - 0.5) / fwidth(st * res);
  return 1.0 - min(min(grid.x, grid.y), 1.0);
}

void main() {
  // Distance fade
  float dist = length(vWorldPosition.xz);
  float fade = 1.0 - smoothstep(5.0, 30.0, dist);
  
  // Multi-scale grid
  float gridLarge = grid(vWorldPosition.xz, 0.5) * 0.3;
  float gridSmall = grid(vWorldPosition.xz, 2.0) * 0.15;
  
  float gridPattern = gridLarge + gridSmall;
  
  // Apply fade and opacity
  float alpha = gridPattern * fade * uOpacity;
  
  // Subtle pulse
  alpha *= 0.8 + sin(uTime * 0.5) * 0.1;
  
  gl_FragColor = vec4(uColor, alpha);
}
`;

