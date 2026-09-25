"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import { useScroll } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import * as THREE from "three";

function InteractiveParticles({ count = 4000 }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.05;
      pointsRef.current.rotation.z += delta * 0.02;
    }

    if (groupRef.current) {
      const targetX = mouse.y * -0.15;
      const targetY = mouse.x * 0.15;
      
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.02;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.08} 
          color="#2563eb" 
          transparent 
          opacity={0.8} 
          sizeAttenuation={true} 
        />
      </points>
    </group>
  );
}

function Scene({ starsOnly }: { starsOnly?: boolean }) {
  const { scrollYProgress } = useScroll();
  
  const cloudRef = useRef<THREE.Group>(null!);
  const adSlotRef = useRef<THREE.Group>(null!);
  const audienceRef = useRef<THREE.Group>(null!);
  const analyticsRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (starsOnly) return;
    
    const scroll = scrollYProgress.get(); // Number between 0 and 1

    if (analyticsRef.current) {
      analyticsRef.current.rotation.y = -0.5 + scroll * Math.PI;
      analyticsRef.current.position.y = 3 + (scroll * 4);
    }

    // Cloud (previously Coin) - Top Left moving down
    if (cloudRef.current) {
      cloudRef.current.rotation.y = scroll * Math.PI * 2;
      cloudRef.current.position.y = 4 - (scroll * 8); 
    }

    // Ad Slot (Billboard) - Right moving up
    if (adSlotRef.current) {
      adSlotRef.current.rotation.z = scroll * -Math.PI * 2;
      adSlotRef.current.position.y = -2 + (scroll * 6); 
    }

    // Audience (Torus) - Bottom Left moving up
    if (audienceRef.current) {
      audienceRef.current.rotation.x = (Math.PI / 4) + (scroll * Math.PI * 1.25);
      audienceRef.current.rotation.y = scroll * Math.PI * 2;
      audienceRef.current.position.y = -5 + (scroll * 8); 
    }
  });

  const materialProps = {
    backside: false,
    samples: 4,
    thickness: 1,
    chromaticAberration: 0.1,
    anisotropy: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    roughness: 0.15,
    ior: 1.5,
    transmission: 1,
  };

  return (
    <>
      <Environment preset="studio" />
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 15, 10]} intensity={3} color="#ffffff" />
      <directionalLight position={[-10, -15, -10]} intensity={1} color="#f8fafc" />
      
      {/* Etoiles interactives */}
      <InteractiveParticles count={4000} />

      {!starsOnly && (
        <>
          {/* Cloud (Data / Hosting) */}
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <group ref={cloudRef} position={[-6, 4, -4]} rotation-x={0.5}>
              <mesh position={[0, -0.8, -0.8]} scale={0.8}>
                <extrudeGeometry 
                  args={[
                    (() => {
                      const s = new THREE.Shape();
                      s.moveTo(-1.5, 0);
                      s.lineTo(1.5, 0); // Base
                      s.bezierCurveTo(2.5, 0, 2.5, 1.5, 1.5, 1.5); // Right bump
                      s.bezierCurveTo(1.5, 3.2, -0.5, 3.2, -0.5, 1.8); // Top bump
                      s.bezierCurveTo(-2, 2.5, -2.5, 1.5, -1.5, 0); // Left bump
                      return s;
                    })(),
                    {
                      depth: 1.6,
                      bevelEnabled: true,
                      bevelSegments: 32,
                      steps: 1,
                      bevelSize: 0.5,
                      bevelThickness: 0.8,
                      curveSegments: 64
                    }
                  ]} 
                />
                <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#3b82f6" attenuationDistance={3} />
              </mesh>
            </group>
          </Float>

          {/* Ad Slot (Rounded Box / Billboard) */}
          <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
            <group ref={adSlotRef} position={[7, -2, -6]} rotation-y={0.3}>
              <RoundedBox args={[4, 2.5, 0.4]} radius={0.3} smoothness={4}>
                <MeshTransmissionMaterial 
                  {...materialProps}
                  color="#e2e8f0"
                  attenuationColor="#3b82f6" // Soft blue
                  attenuationDistance={3}
                />
              </RoundedBox>
            </group>
          </Float>

          {/* Audience / Network (Torus / Ring) */}
          <Float speed={2.5} rotationIntensity={0.8} floatIntensity={2}>
            <group ref={audienceRef} position={[-7, -5, -8]}>
              <mesh>
                <torusGeometry args={[1.8, 0.6, 32, 100]} />
                <MeshTransmissionMaterial 
                  {...materialProps}
                  color="#e2e8f0"
                  attenuationColor="#a855f7" // Soft purple
                  attenuationDistance={3}
                />
              </mesh>
            </group>
          </Float>

          {/* Analytics (Chart + Arrow) */}
          <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
            <group ref={analyticsRef} position={[6, 3, -7]} rotation-y={-0.5}>
              {/* Bar 1 */}
              <mesh position={[-1.2, -1, 0]}>
                <boxGeometry args={[0.6, 1.5, 0.6]} />
                <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
              </mesh>
              {/* Bar 2 */}
              <mesh position={[0, -0.25, 0]}>
                <boxGeometry args={[0.6, 3, 0.6]} />
                <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
              </mesh>
              {/* Bar 3 */}
              <mesh position={[1.2, 0.5, 0]}>
                <boxGeometry args={[0.6, 4.5, 0.6]} />
                <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
              </mesh>
              
              {/* Trend Arrow (Stepped / Escalier) */}
              <group position={[0, 0, 0]}>
                {/* H1 */}
                <mesh position={[-1.05, 0.25, 0]}>
                  <boxGeometry args={[0.9, 0.25, 0.25]} />
                  <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
                </mesh>
                {/* V1 */}
                <mesh position={[-0.6, 1.0, 0]}>
                  <boxGeometry args={[0.25, 1.75, 0.25]} />
                  <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
                </mesh>
                {/* H2 */}
                <mesh position={[0, 1.75, 0]}>
                  <boxGeometry args={[1.45, 0.25, 0.25]} />
                  <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
                </mesh>
                {/* V2 */}
                <mesh position={[0.6, 2.5, 0]}>
                  <boxGeometry args={[0.25, 1.75, 0.25]} />
                  <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
                </mesh>
                {/* H3 */}
                <mesh position={[1.1, 3.25, 0]}>
                  <boxGeometry args={[1.25, 0.25, 0.25]} />
                  <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
                </mesh>
                {/* Arrow Head */}
                <mesh position={[2.0, 3.25, 0]} rotation={[0, 0, -Math.PI / 2]}>
                  <coneGeometry args={[0.4, 0.8, 32]} />
                  <MeshTransmissionMaterial {...materialProps} color="#e2e8f0" attenuationColor="#f43f5e" attenuationDistance={3} />
                </mesh>
              </group>
            </group>
          </Float>
        </>
      )}
    </>
  );
}

export default function Background3D({ starsOnly = false }: { starsOnly?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-80" style={{ perspective: '1000px' }}>
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        eventSource={document.body}
      >
        <color attach="background" args={['#f8fafc']} />
        <Scene starsOnly={starsOnly} />
      </Canvas>
    </div>
  );
}
