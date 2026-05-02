import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = ({ count = 2000 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 15;
      p[i * 3 + 1] = (Math.random() - 0.5) * 15;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
      
      // Pulse effect - particles "focusing" inwards
      const time = state.clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 0.5) * 0.1;
      pointsRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#002D62"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const FocusCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time / 2) * 0.5;
      meshRef.current.rotation.y = Math.cos(time / 2) * 0.5;
      meshRef.current.position.y = Math.sin(time) * 0.2;
    }
    if (outerRef.current) {
      outerRef.current.rotation.y = -time * 0.2;
      outerRef.current.rotation.x = time * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = time * 0.5;
      // Aperture "pulse"
      const s = 1 + Math.sin(time * 2) * 0.05;
      ringRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Inner "Focus" Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1, 0]} />
          <MeshWobbleMaterial 
            color="#0066CC" 
            factor={0.4} 
            speed={2} 
            roughness={0.1} 
            metalness={0.8}
            emissive="#0066CC"
            emissiveIntensity={0.8}
          />
        </mesh>
      </Float>

      {/* Modern Aperture Blades / Geometric Lens */}
      <group ref={ringRef}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
            <boxGeometry args={[0.05, 4, 0.05]} />
            <meshBasicMaterial color="#0066CC" transparent opacity={0.4} />
            <group position={[0, 2, 0]}>
               <mesh rotation={[0, 0, Math.PI / 4]}>
                 <boxGeometry args={[0.8, 0.05, 0.05]} />
                 <meshBasicMaterial color="#0066CC" transparent opacity={0.6} />
               </mesh>
            </group>
          </mesh>
        ))}
      </group>

      {/* Outer Wireframe "Architecture" */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color="#0066CC" wireframe transparent opacity={0.15} />
      </mesh>

      {/* Scanning Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 2.82, 64]} />
        <meshBasicMaterial color="#0066CC" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <ringGeometry args={[3, 3.02, 64]} />
        <meshBasicMaterial color="#0066CC" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

export const FocusVisual: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[700px] absolute inset-0 -z-10 pointer-events-none opacity-40 md:opacity-100">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#0066CC" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#002D62" />
        
        <FocusCore />
        <ParticleField count={1500} />
        
        {/* Subtle motion without blocking scroll */}
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-[at_center_center] from-transparent via-transparent to-school-paper opacity-60" />
    </div>
  );
};
