import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particlesCount = 800;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Create a more structured but slightly randomized grid/cloud
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      pointsRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    // @ts-ignore
    <points ref={pointsRef}>
      {/* @ts-ignore */}
      <bufferGeometry>
        {/* @ts-ignore */}
        <bufferAttribute
          attach="attributes-position"
          count={particlesCount}
          array={positions}
          itemSize={3}
        />
      {/* @ts-ignore */}
      </bufferGeometry>
      {/* @ts-ignore */}
      <pointsMaterial
        size={0.03}
        color="#002147" // School Navy for visibility on light
        transparent
        opacity={0.15}
        sizeAttenuation
      />
    {/* @ts-ignore */}
    </points>
  );
};

export const NavThreeBackground = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ParticleField />
      </Canvas>
    </div>
  );
};
