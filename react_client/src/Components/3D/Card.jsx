import * as THREE from "three"
import { RoundedBox, Text } from "@react-three/drei"
import { useState } from "react"
import { useGameStoreUsingSocket } from "../../store/gameStoreUsingSocket"
import boardData from "../../lib/data";

export default function Card({
    position = [0, 18, 10],
  rotation = [-0.8, 0, 0],
})
{
  const viewing = useGameStoreUsingSocket((state) => state.viewing);
  const isViewing = useGameStoreUsingSocket((state) => state.isViewing);
  const property = boardData[viewing];
    console.log(property);
    
  const [hovered, setHovered] = useState(false)

  const color = property?.color || "#ffffff"
  
  if (isViewing){
    return (
    
        <group
        position={position}
        rotation={rotation}
        scale={10}
        // onPointerOver={() => setHovered(true)}
        // onPointerOut={() => setHovered(false)}
        >
        {/* CARD BODY */}
        <RoundedBox
            args={[2.4, 3.6, 0.006]}
            radius={0.008}
            
        >
            <meshStandardMaterial
             color="#ffffff"
             roughness={0.95}
             metalness={0}
             envMapIntensity={0.2}
        
            
            />
        </RoundedBox>

        <CardBorder 
        width={2.4}
        height={3.6}
        thickness={0.02}
        depth={0.015}/>
        {/* COLOR STRIP */}
        <mesh position={[0, 1.45, 0.05]}>
            <boxGeometry args={[2.2, 0.5, 0.01]} />
            <meshStandardMaterial color={color} />
        </mesh>

        {/* PROPERTY NAME */}
        <Text
            position={[0, 1.0, 0.06]}
            fontSize={0.18}
            color="black"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
        >
            {property.name}
        </Text>

        {/* PRICE */}
        <Text
            position={[0, -1.2, 0.06]}
            fontSize={0.22}
            color="black"
            anchorX="center"
            anchorY="middle"
        >
            ${property.price}
        </Text>

        {/* HOVER LIFT EFFECT */}
        {/* {hovered && (
            <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[2.6, 3.8]} />
            <meshBasicMaterial
                color="black"
                transparent
                opacity={0.15}
            />
            </mesh>
        )} */}
        </group>
    
    )
  }else {
    return <group></group>
  }
}


function CardBorder({
  width = 2.4,
  height = 3.6,
  thickness = 0.06,
  depth = 0.02,
  color = "black",
}) {
  const halfW = width / 2
  const halfH = height / 2

  const offsetW = halfW + thickness / 2
  const offsetH = halfH + thickness / 2

  return (
    <group>
      {/* TOP */}
      <mesh position={[0, offsetH, 0]}>
        <boxGeometry args={[width + thickness * 2, thickness, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* BOTTOM */}
      <mesh position={[0, -offsetH, 0]}>
        <boxGeometry args={[width + thickness * 2, thickness, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* LEFT */}
      <mesh position={[-offsetW, 0, 0]}>
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* RIGHT */}
      <mesh position={[offsetW, 0, 0]}>
        <boxGeometry args={[thickness, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}