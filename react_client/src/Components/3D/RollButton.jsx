// RollDice3DButton.jsx
import { Text } from '@react-three/drei';

export default function RollDice3DButton({ position = [3, 1, 4] }) {
  return (
    <group position={position}>
      {/* Button Base */}
      <mesh
        onClick={() => {}}
        onPointerOver={(e) => (e.stopPropagation(), document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <boxGeometry args={[5, 5, 5]} />
        <meshStandardMaterial color="#ffffff" transparent={false} />
      </mesh>

      {/* Button Label */}
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Roll Dice
      </Text>
    </group>
  );
}