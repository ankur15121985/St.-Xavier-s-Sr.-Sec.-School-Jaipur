import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Stars, ContactShadows, useScroll, ScrollControls, Scroll } from '@react-three/drei';
import * as THREE from 'three';

const Building = ({ position, args, color, delay = 0 }: { position: [number, number, number], args: [number, number, number], color: string, delay?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
      </mesh>
    </Float>
  );
};

const Tree = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh position={[0, 0.5, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.2, 1, 8]} />
      <meshStandardMaterial color="#5D4037" />
    </mesh>
    <mesh position={[0, 1.2, 0]} castShadow>
      <coneGeometry args={[0.6, 1.5, 8]} />
      <meshStandardMaterial color="#2E7D32" />
    </mesh>
  </group>
);

const CampusSceneContent = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Parallax effect based on scroll
      const offset = scroll.offset;
      groupRef.current.rotation.y = offset * Math.PI * 0.5;
      groupRef.current.position.z = offset * -5;
    }
  });

  return (
    <group ref={groupRef}>
      <Environment preset="city" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />

      {/* Main Building */}
      <Building position={[0, 2, 0]} args={[4, 4, 3]} color="#002147" />
      
      {/* Side Wings */}
      <Building position={[-4, 1.5, 0]} args={[2, 3, 2]} color="#001a38" />
      <Building position={[4, 1.5, 0]} args={[2, 3, 2]} color="#001a38" />

      {/* Clock Tower */}
      <Building position={[0, 5, 1]} args={[1, 6, 1]} color="#D4AF37" />

      {/* Greenery */}
      <Tree position={[-6, 0, 4]} />
      <Tree position={[-8, 0, 2]} />
      <Tree position={[6, 0, 4]} />
      <Tree position={[8, 0, 2]} />
      <Tree position={[0, 0, 8]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <ContactShadows opacity={0.4} scale={20} blur={2.4} far={4.5} />
    </group>
  );
};

export const Campus3D = () => {
  return (
    <div className="w-full h-screen bg-[#050505] relative overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={35} />
        <ScrollControls pages={3} damping={0.1}>
          <CampusSceneContent />
          <Scroll html>
            <div className="w-screen h-[300vh] flex flex-col items-center pointer-events-none">
              <section className="h-screen w-full flex items-center justify-center p-10">
                <div className="max-w-4xl text-center space-y-6">
                  <h2 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter mix-blend-difference">
                    DIGITAL <span className="text-school-gold">CAMPUS.</span>
                  </h2>
                  <p className="text-white/40 text-xl font-light uppercase tracking-[0.5em]">Explore the Horizon of Xavier's</p>
                </div>
              </section>
              
              <section className="h-screen w-full flex items-center justify-start p-20">
                <div className="max-w-xl bg-white/5 backdrop-blur-3xl p-12 rounded-[40px] border border-white/10 space-y-6">
                  <h3 className="text-4xl font-black text-school-gold">Architectural Legacy</h3>
                  <p className="text-white/60 leading-relaxed font-medium">
                    A blend of tradition and modernity, our campus stands as a testament to Jesuit excellence in the heart of Jaipur.
                  </p>
                </div>
              </section>

              <section className="h-screen w-full flex items-center justify-end p-20 text-right">
                <div className="max-w-xl bg-school-navy/40 backdrop-blur-3xl p-12 rounded-[40px] border border-school-gold/20 space-y-6">
                  <h3 className="text-4xl font-black text-white">Future Ready</h3>
                  <p className="text-white/60 leading-relaxed font-medium">
                    State-of-the-art facilities designed to foster innovation, leadership, and integrity in every student.
                  </p>
                </div>
              </section>
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
      
      {/* Overlay Instructions */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Scroll to Navigate</span>
        <div className="w-px h-12 bg-gradient-to-b from-school-gold to-transparent animate-pulse" />
      </div>
    </div>
  );
};
