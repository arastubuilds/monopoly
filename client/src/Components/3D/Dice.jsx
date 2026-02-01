import { useEffect, useRef, useMemo, memo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

import { useGameStore } from '../../store/gameStore';
import { useGLTF } from '@react-three/drei';
import { useGameStoreUsingSocket } from '../../store/gameStoreUsingSocket';


const DiceInstance = memo(function DiceInstance({ position, models, which }) {
  const diceRef = useRef();
  const gltf = useGLTF(`/3D/dice/scene.gltf`);
  const scene = useMemo(() => gltf?.scene.clone(true), [gltf]);
  
  // const isRolling = useGameStore((state) => state.isRolling);
  const isRolling = useGameStoreUsingSocket((state) => state.isRolling);
  
  
  // const isRolling = false;
  // const value = 1;
  // const value = useGameStore((state) => which === 1 ? state.dice.die1 : state.dice.die2);
  const value = useGameStoreUsingSocket((state) => which === 1 ? state.dice.die1 : state.dice.die2);
  
  
  
  // const face = which === 1 ? 1 : 1;

  const getFaceRotations = () => ({
    2: new THREE.Euler(0, Math.PI / 2, 0),
    3: new THREE.Euler(-Math.PI / 2, 0, 0),
    6: new THREE.Euler(0, Math.PI / 2, Math.PI / 2),
    5: new THREE.Euler(0, Math.PI / 2, -Math.PI / 2),
    1: new THREE.Euler(Math.PI / 2, 0, 0),
    4: new THREE.Euler(Math.PI, Math.PI / 2, 0),
  });
  const showFace = (number) => {
      const rotations = getFaceRotations();
      const rotation = rotations[number];

      const mesh = diceRef.current;

      if (!rotation || !mesh) {
          return;
      }
      mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      // mesh.rotation
  }
  const rollToFace = (number, duration = 2) => {
    // console.log("roll to face");
    // console.log("number",number);
    
    const mesh = diceRef.current;
    if (!mesh) return;

    const faceRotations = getFaceRotations();
    const finalRotation = faceRotations[number];
    // console.log("final",finalRotation);
    
    if (!finalRotation) return;

    const randomRotation = {
      x: Math.random() * Math.PI * 10,
      y: Math.random() * Math.PI * 10,
      z: Math.random() * Math.PI * 10,
    };

    gsap.to(mesh.rotation, {
      x: randomRotation.x,
      y: randomRotation.y,
      z: randomRotation.z,
      duration: duration * 0.7,
      ease: 'power1.in',
      onComplete: () => {
        gsap.to(mesh.rotation, {
          x: finalRotation.x,
          y: finalRotation.y,
          z: finalRotation.z,
          duration: duration * 0.3,
          ease: 'power3.out',
        });
        // showFace(value);
      },
    });
  };

  // Set ref when scene is ready
  useEffect(() => {
    if (scene) {
      diceRef.current = scene
    };
    showFace(1);
  }, [scene]);

  // Auto-roll on change of value or isRolling
  useEffect(() => {
    console.log(isRolling, value);
    console.log("Dice "+which+" "+value);
    if (isRolling) {
      console.log("value", value);
      rollToFace(value);
    } else {
      // showFace(value);
    }
    // showFace(value);
  }, [isRolling, value]);

  return scene ? (
    <primitive object={scene} scale={[3, 3, 3]} position={position} />
  ) : null;
});


export default function Dice({ models }) {
  return (
    <group>
      {/* <DiceInstance position={[-5, -26, -26]}  which={1} /> */}
      {/* <DiceInstance position={[6, -26, -26]}  which={2} /> */}
      <DiceInstance position={[-5, 3.5, 36]}  which={1} />
      <DiceInstance position={[5, 3.5, 36]}  which={2} />
    </group>
  );
}