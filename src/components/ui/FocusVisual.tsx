import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, OrbitControls, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWebGLAvailable } from '../../lib/webgl';
import { motion } from 'motion/react';

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
        color="#0066CC"
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const LightShadowRays = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uLightColor: { value: new THREE.Color('#ecc94b') }, // ultra bright gold-yellow for high impact
    uDarkColor: { value: new THREE.Color('#03010b') },  // pure ink midnight black-purple for shadow contrast
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material && material.uniforms) {
        material.uniforms.uTime.value = state.clock.getElapsedTime();
      }
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.12; // Faster overall rotation
    }
  });

  return (
    // @ts-ignore
    <mesh ref={meshRef} position={[0, 0, -2]}>
      {/* @ts-ignore */}
      <planeGeometry args={[18, 18]} />
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

            // High frequency, fast alternating light and dark beams
            float numRays = 18.0;
            float rayPattern = sin(angle * numRays + uTime * 2.2);
            
            // Secondary counter-rotating wavy flare frequency
            float extraPatterns = cos(angle * 8.0 - uTime * 1.4) * 0.35;
            float combinedRays = rayPattern + extraPatterns;

            // Extremely high contrast step to create crisp, defined shadow/light edges
            float rayMask = smoothstep(-0.04, 0.04, combinedRays);

            // Energy bloom in the core and soft vignette dissipation around outer boundaries
            float coreGlow = 0.08 / (dist + 0.03);
            float boundsFalloff = smoothstep(0.55, 0.08, dist);

            // Interpolate bright gold vectors and absolute dark voids
            vec3 finalColor = mix(uDarkColor, uLightColor, rayMask);
            
            // Core energy flare injection
            finalColor += uLightColor * coreGlow * 0.5;

            // Highly visible opacity, combining transparency with clean contrast
            float alpha = boundsFalloff * (0.2 + 0.8 * rayMask);

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
    // @ts-ignore
    <group>
      {/* Inner "Focus" Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        {/* @ts-ignore */}
        <mesh ref={meshRef}>
          {/* @ts-ignore */}
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
        {/* @ts-ignore */}
        </mesh>
      </Float>

      {/* Modern Aperture Blades / Geometric Lens */}
      {/* @ts-ignore */}
      <group ref={ringRef}>
        {[...Array(6)].map((_, i) => (
          // @ts-ignore
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
            {/* @ts-ignore */}
            <boxGeometry args={[0.05, 4, 0.05]} />
            {/* @ts-ignore */}
            <meshBasicMaterial color="#0066CC" transparent opacity={0.4} />
            {/* @ts-ignore */}
            <group position={[0, 2, 0]}>
               {/* @ts-ignore */}
               <mesh rotation={[0, 0, Math.PI / 4]}>
                 {/* @ts-ignore */}
                 <boxGeometry args={[0.8, 0.05, 0.05]} />
                 {/* @ts-ignore */}
                 <meshBasicMaterial color="#0066CC" transparent opacity={0.6} />
               {/* @ts-ignore */}
               </mesh>
            {/* @ts-ignore */}
            </group>
          {/* @ts-ignore */}
          </mesh>
        ))}
      {/* @ts-ignore */}
      </group>

      {/* Outer Wireframe "Architecture" */}
      {/* @ts-ignore */}
      <mesh ref={outerRef}>
        {/* @ts-ignore */}
        <icosahedronGeometry args={[2.5, 1]} />
        {/* @ts-ignore */}
        <meshBasicMaterial color="#0066CC" wireframe transparent opacity={0.15} />
      {/* @ts-ignore */}
      </mesh>

      {/* Scanning Rings */}
      {/* @ts-ignore */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* @ts-ignore */}
        <ringGeometry args={[2.8, 2.82, 64]} />
        {/* @ts-ignore */}
        <meshBasicMaterial color="#0066CC" transparent opacity={0.3} side={THREE.DoubleSide} />
      {/* @ts-ignore */}
      </mesh>
      {/* @ts-ignore */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        {/* @ts-ignore */}
        <ringGeometry args={[3, 3.02, 64]} />
        {/* @ts-ignore */}
        <meshBasicMaterial color="#0066CC" transparent opacity={0.2} side={THREE.DoubleSide} />
      {/* @ts-ignore */}
      </mesh>
    {/* @ts-ignore */}
    </group>
  );
};


export const FocusVisual: React.FC = () => {
  const isWebGL = useWebGLAvailable();

  return (
    <div className="w-full h-full min-h-[500px] md:min-h-[700px] absolute inset-0 -z-10 pointer-events-none opacity-40 md:opacity-100 flex items-center justify-center overflow-hidden">
      {isWebGL ? (
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          {/* @ts-ignore */}
          <ambientLight intensity={0.5} />
          {/* @ts-ignore */}
          <pointLight position={[10, 10, 10]} intensity={1} color="#0066CC" />
          {/* @ts-ignore */}
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#002D62" />
          
          <LightShadowRays />
          <FocusCore />
          <ParticleField count={1500} />
          
          {/* Subtle motion without blocking scroll */}
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="w-96 h-96 border-2 border-dashed border-school-accent/20 rounded-full flex items-center justify-center relative"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-72 h-72 border border-school-accent/30 rounded-full flex items-center justify-center absolute"
            >
              <div className="w-12 h-12 rounded-full bg-school-accent/10 border border-school-gold/40 flex items-center justify-center">
                <div className="w-3 h-3 bg-school-gold rounded-full animate-ping" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-[at_center_center] from-transparent via-transparent to-school-paper opacity-60" />
    </div>
  );
};
