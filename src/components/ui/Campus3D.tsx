import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  Text, 
  ContactShadows, 
  Environment,
  OrbitControls,
  Sky,
  useGLTF
} from '@react-three/drei';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { motion } from 'motion/react';
import { DigitalCampus } from '../../types';

const Model = ({ url }: { url: string }) => {
  const isObj = url.toLowerCase().endsWith('.obj');
  
  if (isObj) {
    const obj = useLoader(OBJLoader, url);
    return <primitive object={obj} scale={0.5} />;
  }

  // Default to GLTF/GLB
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const Student = ({ delay = 0, speed = 1, x = 0 }: { delay?: number, speed?: number, x?: number }) => {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ref.current) {
      const time = state.clock.getElapsedTime() + delay;
      // Walking motion: cycle from -15 to 15
      ref.current.position.z = ((time * speed) % 30) - 15;
      // Slight bounce
      ref.current.position.y = Math.abs(Math.sin(time * 8)) * 0.1;
      // Slight rotation
      ref.current.rotation.y = Math.PI + Math.sin(time * 8) * 0.1;
    }
  });

  return (
    // @ts-ignore
    <group ref={ref} position={[x, 0, 0]}>
      {/* Body */}
      {/* @ts-ignore */}
      <mesh position={[0, 1.2, 0]} castShadow>
        {/* @ts-ignore */}
        <sphereGeometry args={[0.3, 16, 16]} />
        {/* @ts-ignore */}
        <meshStandardMaterial color="#002147" roughness={0.3} metalness={0.8} />
      {/* @ts-ignore */}
      </mesh>
      {/* Head */}
      {/* @ts-ignore */}
      <mesh position={[0, 1.8, 0]} castShadow>
        {/* @ts-ignore */}
        <sphereGeometry args={[0.2, 16, 16]} />
        {/* @ts-ignore */}
        <meshStandardMaterial color="#D4AF37" roughness={0.3} />
      {/* @ts-ignore */}
      </mesh>
    {/* @ts-ignore */}
    </group>
  );
};

const CampusSceneContent = ({ modelUrl }: { modelUrl?: string }) => {
  const students = useMemo(() => [
    { x: -6, delay: 0, speed: 2.2 },
    { x: -3, delay: 2, speed: 1.8 },
    { x: 1, delay: 4, speed: 2.0 },
    { x: 5, delay: 1, speed: 2.4 },
    { x: -9, delay: 5.5, speed: 1.6 },
  ], []);

  return (
    <>
      {/* Dynamic Model Overlay or Placeholder */}
      {modelUrl ? (
        <Suspense fallback={<Student x={0} speed={0} />}>
          <Model url={modelUrl} />
        </Suspense>
      ) : (
        <>
          {/* Walking Students */}
          {students.map((s, i) => (
            <Student key={i} {...s} />
          ))}
        </>
      )}

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>

      <ContactShadows 
        position={[0, 0, 0]}
        opacity={0.4} 
        scale={40} 
        blur={2} 
        far={10} 
        resolution={512} 
        color="#000000"
      />
    </>
  );
};

export const Campus3D = ({ config }: { config?: DigitalCampus }) => {
  if (config && config.is_enabled === false) return null;

  const title = config?.title || 'Legacy in Motion.';
  const titleParts = title.split(' ');
  const lastWord = titleParts.pop() || '';
  const firstPart = titleParts.join(' ');

  return (
    <div id="digital-campus-3d" className="w-full min-h-screen md:h-screen bg-[#fcfbf7] dark:bg-slate-950 relative overflow-hidden flex flex-col md:flex-row items-center justify-between p-10 md:p-20">
      <div className="w-full md:w-1/2 z-10 space-y-8 text-center md:text-left py-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="inline-block px-6 py-2 bg-school-accent/10 rounded-full"
        >
          <span className="text-school-accent font-black uppercase tracking-[0.4em] text-[10px]">DIGITAL CAMPUS EXPERIENCE</span>
        </motion.div>
        
        <h2 className="text-5xl md:text-8xl font-black text-school-navy dark:text-white italic tracking-tighter leading-none">
          {firstPart} <span className="text-school-accent underline decoration-school-gold/30">{lastWord}</span>
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl">
          Step into our interactive architectural experience. See the spirit of St. Xavier's Jaipur come to life through this digital walk-through.
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-4">
           {['360° View', 'Interactive', 'Walk of Honor'].map(tag => (
             <span key={tag} className="px-5 py-2 bg-white dark:bg-slate-900 border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-school-navy dark:text-white shadow-sm">
                {tag}
             </span>
           ))}
        </div>
      </div>

      <div className="w-full md:flex-1 h-[600px] relative mt-10 md:mt-0 rounded-[40px] overflow-hidden border border-black/5 bg-white shadow-2xl">
        <Canvas 
          shadows 
          dpr={[1, 2]}
          camera={{ position: [0, 5, 20], fov: 35 }}
          gl={{ antialias: true }}
          style={{ background: '#f8fafc' }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
          <pointLight position={[-10, 5, -5]} color="#002147" intensity={3} />
          
          <CampusSceneContent modelUrl={config?.model_url} />
          
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={1} 
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
        
        {/* Helper UI Overlay */}
        <div className="absolute inset-0 pointer-events-none border-[12px] border-white/50" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border border-black/5">
           <div className="w-2 h-2 bg-school-accent rounded-full animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-school-navy">Digital Interaction Active</span>
        </div>
      </div>
    </div>
  );
};

