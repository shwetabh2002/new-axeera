/**
 * Particle shaders for the Axeera 3D experience
 * Creates a field of sharp, crisp star particles
 */

export const particleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uScrollProgress;
uniform vec2 uMouse;

attribute float aScale;
attribute float aRandomness;

varying float vAlpha;
varying float vDepth;

void main() {
  vec3 pos = position;
  
  // Subtle floating motion
  float floatSpeed = 0.3;
  pos.y += sin(uTime * floatSpeed + aRandomness * 6.28) * 0.1;
  pos.x += cos(uTime * floatSpeed * 0.7 + aRandomness * 6.28) * 0.05;
  
  // Parallax based on mouse
  pos.x += uMouse.x * 0.1 * (1.0 - aRandomness);
  pos.y += uMouse.y * 0.05 * (1.0 - aRandomness);
  
  // Move forward based on scroll
  pos.z += uScrollProgress * 20.0;
  
  // Wrap particles that go behind camera
  pos.z = mod(pos.z + 15.0, 30.0) - 15.0;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Smaller, sharper points
  gl_PointSize = aScale * (200.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 8.0);
  
  // Pass depth for fading
  vDepth = -mvPosition.z;
  vAlpha = smoothstep(20.0, 5.0, vDepth) * smoothstep(0.5, 2.0, vDepth);
  
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const particleFragmentShader = /* glsl */ `
uniform vec3 uColor;

varying float vAlpha;
varying float vDepth;

void main() {
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  
  // Sharp circular cutoff
  if (dist > 0.4) discard;
  
  // Sharp edge with bright core
  float core = 1.0 - smoothstep(0.0, 0.15, dist);
  float edge = 1.0 - smoothstep(0.15, 0.4, dist);
  
  // Combine for sharp star appearance
  float alpha = (core * 1.0 + edge * 0.6) * vAlpha;
  
  // Pure bright white
  vec3 color = uColor;
  
  gl_FragColor = vec4(color, alpha);
}
`;
