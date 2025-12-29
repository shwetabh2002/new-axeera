'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getState } from '@/lib/store';
import { lerp, easeOutExpo } from '@/lib/utils';
import { SCENE_BOUNDARIES } from '@/lib/store';

/**
 * CameraController handles all camera motion
 * 
 * Design philosophy:
 * - Camera motion > object motion
 * - Smooth, engineered easing
 * - Depth-based journey through scenes
 * - Subtle mouse parallax
 */
export function CameraController() {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 10));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Camera positions for each scene
  const cameraKeyframes = {
    // Hero: Looking into the void
    hero: { 
      position: new THREE.Vector3(0, 0, 10), 
      lookAt: new THREE.Vector3(0, 0, 0) 
    },
    // Reveal: Moving through space
    reveal: { 
      position: new THREE.Vector3(0, 1, 5), 
      lookAt: new THREE.Vector3(0, 0, -5) 
    },
    // Capabilities: Elevated view
    capabilities: { 
      position: new THREE.Vector3(2, 3, 8), 
      lookAt: new THREE.Vector3(0, 0, 0) 
    },
    // Work: Side perspective
    work: { 
      position: new THREE.Vector3(-3, 2, 6), 
      lookAt: new THREE.Vector3(0, 0, -2) 
    },
    // Human: Closer, warmer
    human: { 
      position: new THREE.Vector3(0, 1, 4), 
      lookAt: new THREE.Vector3(0, 0, 0) 
    },
    // CTA: Final pull back
    cta: { 
      position: new THREE.Vector3(0, 0, 8), 
      lookAt: new THREE.Vector3(0, 0, 0) 
    },
  };

  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  useFrame(() => {
    const store = getState();
    const { scrollProgress, mousePosition, reducedMotion } = store;
    
    // Determine camera target based on scroll progress
    let targetCam;
    
    if (scrollProgress < SCENE_BOUNDARIES.REVEAL) {
      // Hero to Reveal interpolation
      const t = easeOutExpo(scrollProgress / SCENE_BOUNDARIES.REVEAL);
      targetCam = {
        position: new THREE.Vector3().lerpVectors(
          cameraKeyframes.hero.position,
          cameraKeyframes.reveal.position,
          t
        ),
        lookAt: new THREE.Vector3().lerpVectors(
          cameraKeyframes.hero.lookAt,
          cameraKeyframes.reveal.lookAt,
          t
        ),
      };
    } else if (scrollProgress < SCENE_BOUNDARIES.CAPABILITIES) {
      const t = easeOutExpo((scrollProgress - SCENE_BOUNDARIES.REVEAL) / 
        (SCENE_BOUNDARIES.CAPABILITIES - SCENE_BOUNDARIES.REVEAL));
      targetCam = {
        position: new THREE.Vector3().lerpVectors(
          cameraKeyframes.reveal.position,
          cameraKeyframes.capabilities.position,
          t
        ),
        lookAt: new THREE.Vector3().lerpVectors(
          cameraKeyframes.reveal.lookAt,
          cameraKeyframes.capabilities.lookAt,
          t
        ),
      };
    } else if (scrollProgress < SCENE_BOUNDARIES.WORK) {
      const t = easeOutExpo((scrollProgress - SCENE_BOUNDARIES.CAPABILITIES) / 
        (SCENE_BOUNDARIES.WORK - SCENE_BOUNDARIES.CAPABILITIES));
      targetCam = {
        position: new THREE.Vector3().lerpVectors(
          cameraKeyframes.capabilities.position,
          cameraKeyframes.work.position,
          t
        ),
        lookAt: new THREE.Vector3().lerpVectors(
          cameraKeyframes.capabilities.lookAt,
          cameraKeyframes.work.lookAt,
          t
        ),
      };
    } else if (scrollProgress < SCENE_BOUNDARIES.HUMAN) {
      const t = easeOutExpo((scrollProgress - SCENE_BOUNDARIES.WORK) / 
        (SCENE_BOUNDARIES.HUMAN - SCENE_BOUNDARIES.WORK));
      targetCam = {
        position: new THREE.Vector3().lerpVectors(
          cameraKeyframes.work.position,
          cameraKeyframes.human.position,
          t
        ),
        lookAt: new THREE.Vector3().lerpVectors(
          cameraKeyframes.work.lookAt,
          cameraKeyframes.human.lookAt,
          t
        ),
      };
    } else if (scrollProgress < SCENE_BOUNDARIES.CTA) {
      const t = easeOutExpo((scrollProgress - SCENE_BOUNDARIES.HUMAN) / 
        (SCENE_BOUNDARIES.CTA - SCENE_BOUNDARIES.HUMAN));
      targetCam = {
        position: new THREE.Vector3().lerpVectors(
          cameraKeyframes.human.position,
          cameraKeyframes.cta.position,
          t
        ),
        lookAt: new THREE.Vector3().lerpVectors(
          cameraKeyframes.human.lookAt,
          cameraKeyframes.cta.lookAt,
          t
        ),
      };
    } else {
      targetCam = cameraKeyframes.cta;
    }

    targetPosition.current.copy(targetCam.position);
    targetLookAt.current.copy(targetCam.lookAt);

    // Add mouse parallax (subtle)
    if (!reducedMotion) {
      const parallaxStrength = 0.3;
      targetPosition.current.x += mousePosition.x * parallaxStrength;
      targetPosition.current.y += mousePosition.y * parallaxStrength * 0.5;
    }

    // Smooth camera movement
    const smoothFactor = reducedMotion ? 1 : 0.05;
    
    camera.position.x = lerp(camera.position.x, targetPosition.current.x, smoothFactor);
    camera.position.y = lerp(camera.position.y, targetPosition.current.y, smoothFactor);
    camera.position.z = lerp(camera.position.z, targetPosition.current.z, smoothFactor);

    // Smooth lookAt
    currentLookAt.current.x = lerp(currentLookAt.current.x, targetLookAt.current.x, smoothFactor);
    currentLookAt.current.y = lerp(currentLookAt.current.y, targetLookAt.current.y, smoothFactor);
    currentLookAt.current.z = lerp(currentLookAt.current.z, targetLookAt.current.z, smoothFactor);

    camera.lookAt(currentLookAt.current);
  });

  return null;
}

