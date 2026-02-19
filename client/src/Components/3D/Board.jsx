import * as THREE from 'three';
import { memo, useEffect, useMemo, useRef } from "react";
import { useTexture } from '@react-three/drei';

import TokenGroup from './Token.jsx';
import Dice from './Dice.jsx';

const Board1 = memo (({rotateY}) => {
    const groupRef = useRef();
    const dragging = useRef(false);
    const lastX = useRef(0);

    const texture = useTexture('/Board.webp');
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;

    const onPointerDown = (e) => {
        e.stopPropagation();
        dragging.current = true;
        lastX.current = e.clientX;
      };
    
    const onPointerUp = (e) => {
    e.stopPropagation();
    dragging.current = false;
    };
    
    const onPointerMove = (e) => {
    if (!dragging.current) return;
    e.stopPropagation();

    const deltaX = e.clientX - lastX.current;
    lastX.current = e.clientX;

    // rotation speed (tweak this)
    groupRef.current.rotation.y += deltaX * 0.005;
    };

    return (
        <group 
            ref={groupRef}  
            rotation={[0, rotateY, 0]} position={[0, -30, -56]}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onPointerMove={onPointerMove}
        >
            <mesh>
                <boxGeometry args={[150.7, 1, 150.7]} />
                <meshBasicMaterial map={texture} />
            </mesh>
            <BoardBorder />
            <Dice />
            <TokenGroup />
        </group>
    )
});


const BoardBorder = ({
  size = 150.7,
  thickness = 1,
  height = 1,
}) => {
  const half = size / 2;
  const halfWithBorder = half + thickness / 2;

  return (
    <group>
      {/* Front */}
      <mesh position={[0, height / 2, halfWithBorder]}>
        <boxGeometry args={[size + thickness * 2, height, thickness]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Back */}
      <mesh position={[0, height / 2, -halfWithBorder]}>
        <boxGeometry args={[size + thickness * 2, height, thickness]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Left */}
      <mesh position={[-halfWithBorder, height / 2, 0]}>
        <boxGeometry args={[thickness, height, size]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Right */}
      <mesh position={[halfWithBorder, height / 2, 0]}>
        <boxGeometry args={[thickness, height, size]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};



const Board = memo (function Board({rotateY = Math.PI}) {
    // console.log("board");
    const groupRef = useRef();

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y = rotateY;
        }
    }, [rotateY]);

    return (
        <group ref={groupRef} position={[0, -30, -56]} >
            <BoardMembers />
        </group>
    );
});
const BoardMembers = memo(function BoardMembers(){
    const tileBreadth = 12.3;
    const tileLength = 20;
    const tileHeight = 1;
    const boardSize = 150.7;

    const sharedBoxGeometry = useMemo(() => new THREE.BoxGeometry(), []);
    return(
        <>
            {Array.from({ length: 40 }).map((_, index) => {
                const isCorner = index % 10 === 0;

                let width, depth, rotationY = 0;
                if (isCorner) {
                    width = depth = tileLength;
                    if (index === 0 || index === 10) rotationY = Math.PI;
                } else if ((index > 0 && index < 10) || (index > 20 && index < 30)) {
                    width = tileBreadth;
                    depth = tileLength;
                    if (index > 0 && index < 10) rotationY = Math.PI;
                } else {
                    width = tileBreadth;
                    depth = tileLength;
                    rotationY = Math.PI / 2;
                    if (index > 10 && index < 20) rotationY += Math.PI;
                }

                const position = getTilePosition(index, tileBreadth, tileLength, boardSize);
                const textureKey = `/3D/tiles/${getPathFromPosition(getPositionByIndex(index))}.png`;
                // const texture = textures[textureKey];
                const texture = useTexture(textureKey);
                texture.magFilter = THREE.LinearFilter;
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.generateMipmaps = true;
                texture.anisotropy = 16;
                texture.colorSpace = THREE.SRGBColorSpace;
                // Clone material with unique texture
                // const material = useMemo(() => (
                //     new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.FrontSide })
                // ), [texture]);

                return (
                    <mesh
                        key={index}
                        position={position}
                        rotation={[0, rotationY, 0]}
                        geometry={sharedBoxGeometry}
                        scale={[width, tileHeight, depth]}
                    >
                        <meshBasicMaterial map={texture} transparent side={THREE.FrontSide} />
                    </mesh>
                );
            })}
            <Center boardSize={boardSize}/>
            <Chance />
            <Community />
            <Ground boardSize={boardSize}/>
            <Logo />
            <TokenGroup />
            
        </>
    )
});
function Logo(){
    const logoWidth = 100; // You can tweak this
    const logoHeight = 25;
    // console.log("logo");
    
    const texture = useTexture(`/monopoly/3D/monopoly.png`);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    return (
        <mesh position={[3, 1.01, 4]} rotation={[-Math.PI / 2, 0, -Math.PI * 3/4]}>
            <planeGeometry args={[logoWidth, logoHeight]}/>
            <meshBasicMaterial map={texture} transparent alphaTest={0.1}/>
            {/* <meshBasicMaterial color="red" wireframe /> */}
        </mesh>
    );
}
function Center({boardSize}) {
    const innerSize = boardSize - 2*19.99999;

    return (
        <mesh >
            <boxGeometry args={[innerSize, 1, innerSize]} />
            <meshBasicMaterial transparent={true} color={0xd9e7d6} side={THREE.FrontSide}/>
        </mesh>
    );
}
function Chance () {
    
    const angle = -Math.PI * 3 / 4;
    const texture = useTexture('/3D/chance-action.png');
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    // label === "chance-action" ? (offset = 44) : offset = 35;
    const offset = 44;
    const positionOffset = 1;
    const dx = Math.cos(angle) * offset;
    const dz = Math.sin(angle) * offset;
    const cardWidth = 30;
    const cardHeight = 20;

    return (
        <mesh position={[3 + dx * positionOffset, 1.01, 5 + dz * positionOffset]} rotation={[-Math.PI / 2, 0, angle]}>
            <planeGeometry args={[cardWidth, cardHeight]}/>
            <meshBasicMaterial map={texture} alphaTest={0.1}/>
        </mesh>
    );
};
function Community () {
    
    const angle = -Math.PI * 3 / 4;
    const texture = useTexture('/3D/community-action.png');
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    // label === "chance-action" ? (offset = 44) : offset = 35;
    const offset = 35;
    const positionOffset = -1;
    const dx = Math.cos(angle) * offset;
    const dz = Math.sin(angle) * offset;
    const cardWidth = 30;
    const cardHeight = 20;

    return (
        <mesh position={[3 + dx * positionOffset, 1.01, 5 + dz * positionOffset]} rotation={[-Math.PI / 2, 0, angle]}>
            <planeGeometry args={[cardWidth, cardHeight]}/>
            <meshBasicMaterial map={texture} alphaTest={0.1}/>
        </mesh>
    );
};
function Ground({boardSize}) {
    
    
    const texture = useTexture('/3D/ground.png');
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.generateMipmaps = true;
    texture.anisotropy = 16;
    texture.colorSpace = THREE.SRGBColorSpace;
    // console.log("ground");
    
    return (
        <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[boardSize*1.19, boardSize*1.19]} />
            <meshBasicMaterial map={texture} transparent />     
        </mesh>
    )
}

function getTilePosition(index, tileBreadth, tileLength, boardSize) {
    const offset = boardSize / 2;
    let x = 0, z = 0;

    if (index >= 0 && index <= 10){
        x = -offset;
        if (index === 0){
            x += tileLength / 2;
        } else if (index === 10){
            x += tileLength + 9 * tileBreadth + tileLength / 2;
        } else {
            x += tileLength + (index - 1)*tileBreadth + tileBreadth / 2;
        }
        z = -(offset - 10);
    } 
    else if (index >= 11 && index <= 20){
        z = -offset;
        if (index === 20){
            z += tileLength + 9*tileBreadth + tileLength / 2;
        } else {
            z += tileLength + (index - 11) * tileBreadth + tileBreadth / 2;
        }
        x = -(offset - 10);
    } 

    else if (index >= 21 && index <= 30){
        x = -offset;
        if (index === 30){
            x += tileLength + 9 * tileBreadth + tileLength / 2;
        } else {
            x += tileLength + (index - 21) * tileBreadth + tileBreadth / 2;
        }
        z = offset - 10;
    } else if (index >= 31 && index <= 39){ 
        z = offset;
        z -= tileLength + (index - 31) * tileBreadth + tileBreadth / 2;
        x = offset - 10;
    }
    return [x, 0, z];
}
function getPositionByIndex(index) {
    if (index >=0 && index <= 10) return index;
    return (50 - index)
}
function getPathFromPosition(position) {
    let path;
    switch (position) {
        case 0:
            path = "go";
            break;
        case 1:
            path = "oldkent";
            break;
        case 2: 
            path = "community";
            break;
        case 3: 
            path = "whitechapel";
            break;
        case 4: 
            path = "income";
            break;
        case 5: 
            path = "kings";
            break;
        case 6: 
            path = "angel";
            break;
        case 7: 
            path = "chance";
            break;
        case 8: 
            path = "euston";
            break;
        case 9: 
            path = "pentonville";
            break;
        case 10: 
            path = "visit";
            break;
        case 11: 
            path = "pallmall";
            break;
        case 12: 
            path = "electric";
            break;
        case 13: 
            path = "whitehall";
            break;
        case 14: 
            path = "north";
            break;
        case 15: 
            path = "marleybone";
            break;
        case 16: 
            path = "bow";
            break;
        case 17: 
            path = "community";
            break;
        case 18: 
            path = "marl";
            break;
        case 19: 
            path = "vine";
            break;
        case 20: 
            path = "parking";
            break;
        case 21: 
            path = "strand";
            break;
        case 22: 
            path = "chance";
            break;
        case 23: 
            path = "fleet";
            break;
        case 24: 
            path = "traf";
            break;
        case 25: 
            path = "fenchurch";
            break;
        case 26: 
            path = "leicester";
            break;
        case 27: 
            path = "coventry";
            break;
        case 28: 
            path = "water";
            break;
        case 29: 
            path = "piccadilly";
            break;
        case 30: 
            path = "jail";
            break;
        case 31: 
            path = "regent";
            break;
        case 32: 
            path = "oxford";
            break;
        case 33: 
            path = "community";
            break;
        case 34: 
            path = "bond";
            break;
        case 35: 
            path = "liverpool";
            break;
        case 36: 
            path = "chance";
            break;
        case 37: 
            path = "parklane";
            break;
        case 38: 
            path = "super";
            break;
        case 39: 
            path = "mayfair";
            break;
        default:
            break;
    }
    return path;
}
export default Board1;
