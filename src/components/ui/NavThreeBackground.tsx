import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWebGLAvailable } from '../../lib/webgl';
import { motion } from 'motion/react';

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

const NavRayBackgroundMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uLightColor: { value: new THREE.Color('#ecc94b') }, // highly vibrant gold
    uDarkColor: { value: new THREE.Color('#001530') },  // deep dark navy shadow
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material && material.uniforms) {
        material.uniforms.uTime.value = state.clock.getElapsedTime();
      }
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.08; // faster rotation
    }
  });

  return (
    // @ts-ignore
    <mesh ref={meshRef} position={[0, 0, -1]}>
      {/* @ts-ignore */}
      <planeGeometry args={[10, 10]} />
      {/* @ts-ignore */}
      <shaderMaterial
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uLightColor;
          uniform vec3 uDarkColor;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv - 0.5;
            float angle = atan(uv.y, uv.x);
            float dist = length(uv);

            // 12 alternating highly visible light & dark rays
            float numRays = 12.0;
            float rayPattern = sin(angle * numRays + uTime * 1.5);
            
            float rayMask = smoothstep(-0.1, 0.1, rayPattern);
            float falloff = smoothstep(0.6, 0.1, dist);

            // Interpolate bright gold & navy rays with extremely elegant subtle alpha
            vec3 finalColor = mix(uDarkColor, uLightColor, rayMask);
            float alpha = falloff * (0.08 + 0.22 * rayMask);

            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    {/* @ts-ignore */}
    </mesh>
  );
};

export const NavThreeBackground = () => {
  const isWebGL = useWebGLAvailable();

  return (
    <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
      {isWebGL ? (
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <NavRayBackgroundMesh />
          <ParticleField />
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none p-10 opacity-30">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                top: `${(i * 15) + 10}%`,
                left: `${(i * 18) + 5}%`,
              }}
              className="absolute w-1.5 h-1.5 rounded-full bg-school-accent/40"
            />
          ))}
        </div>
      )}
    </div>
  );
};
