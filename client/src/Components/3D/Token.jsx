import { useEffect, useMemo, useRef } from "react"
import gsap from "gsap";

import { useTokenStore } from "../../store/useTokenStore";


const TokenInstance = ({index, color="red", size = 1.5, models}) => {    
    const meshRef = useRef();
    // const gltf = models['/lego_spiderman/scene.gltf'];
    // const scene = useMemo(() => gltf?.scene.clone(true), [gltf]);
    // const { scene: originalScene } = useGLTF('/pawn/scene.gltf');
    // console.log(scene);
    // console.log(originalScene);
    
    // const scene = useMemo(() => clone(originalScene), [originalScene]);
    // if (!scene) return null;
    const tileIndex = (useTokenStore((state) => state.tokens[index]?.tileIndex));
    const toTileIndex = (useTokenStore((state) => state.tokens[index]?.toTileIndex));

    // console.log(tileIndex);
    // console.log(toTileIndex);

    const getTokenGroupData = (tileIdx, tokenIdx) => {
        const tokens = useTokenStore.getState().tokens;

        const tokensOnSameTile = tokens
        .map((t, i) => ({...t, index: i}))
        .filter(t => t.tileIndex === tileIdx || t.toTileIndex === tileIdx);

        const groupIndex = tokensOnSameTile.findIndex(t => t.index === tokenIdx);
        const groupCount = tokensOnSameTile.length; 

        
        return { groupIndex, groupCount };
    };

    const moveToTile = (tileIdx) => {
        // tileIdx = getPositionByIndex(tileIdx);
        const pos = getTilePosition(getPositionByIndex(tileIdx));
        // console.log(pos);
        
        if (!meshRef.current || !pos) return;

        const {groupIndex, groupCount} = getTokenGroupData(tileIdx, index);
        const radius = 3;
        const angle = (Math.PI * 2 / groupCount) * groupIndex;
        const offsetX = groupCount === 1 ? 0 : Math.cos(angle) * radius;
        const offsetZ = groupCount === 1 ? 0 : Math.sin(angle) * radius;
        
        meshRef.current.position.set(
            pos.x + offsetX, 
            1, 
            pos.z + offsetZ
        );
    };

    const moveToTileAnimated = async (fromIdx, toIdx, duration = 0.25) => {
        console.log(fromIdx, toIdx);
        
        if (fromIdx == null || toIdx == null || !meshRef.current) return;
        
        const totalTiles = 40;

        const steps = [];
        // for (let i = fromIdx ; i !== toIdx; i++) {
        //     steps.push(getPositionByIndex(i));
        //     if (i === toIdx) break;
        // }
        let i = fromIdx;
        while (i !== toIdx){
            i = (i+1) % 40;
            steps.push(i);
        }
        for (let i = 0; i<steps.length; i++) {
            const currentIdx = steps[i];
            const prevIdx = i === 0 ? fromIdx : steps[i - 1];

            const from = getTilePosition(getPositionByIndex(prevIdx));
            const to = getTilePosition(getPositionByIndex(currentIdx));
    
            if (!from || !to) continue;

            // const {groupIndex, groupCount} = getTokenGroupData(toIdx, index);
            // const radius = 2;
            // const angle = (Math.PI * 2 / groupCount) * groupIndex;
            // const offsetX = groupCount === 1 ? 0 : Math.cos(angle) * radius;
            // const offsetZ = groupCount === 1 ? 0 : Math.sin(angle) * radius;
                
            meshRef.current.position.set(from.x, 1, from.z);
            await new Promise(resolve => {
                gsap.fromTo(meshRef.current.position, {
                    x: from.x,
                    y: 1,
                    z: from.z,
                },
                {
                    x: to.x,
                    y: 1,
                    z: to.z,
                    duration,
                    ease: "power2.inOut",
                    onComplete: resolve,
                });
            });
        }
    };

    useEffect(() => {
        if (meshRef.current && tileIndex !== null){
            // console.log(tileIndex);
            moveToTile(tileIndex);
        } 
    }, [tileIndex]);

    useEffect(() => {
        if (toTileIndex !== null && tileIndex !== null && toTileIndex !== tileIndex) {
            (async ()=> {
                await moveToTileAnimated(tileIndex, toTileIndex);
                useTokenStore.getState().setTokenTileIndex(index, toTileIndex);
                moveToTile(toTileIndex);
            })();
        }
    }, [toTileIndex]);

    return (
        <mesh ref={meshRef} >
            <cylinderGeometry args={[size, size, size, 32]}/>
            <meshPhongMaterial color={color}/>
        </mesh>
    )
}

export default function TokenGroup({models}) {
    const tokens = useTokenStore((state) => state.tokens);
    // console.log("tokens", tokens);
    
    const tokenColors = useTokenStore((state) => state.tokenColors);

    return (
        <group>
            {tokens.map((_, index) => (
                <TokenInstance 
                    key={index}
                    index={index}
                    color={tokenColors[index] || "red"}
                    models={models}
                />
            ))}
        </group>
    );
}
function getTilePosition(index) {
    const tileBreadth = 12.3;
    const tileLength = 20; 
    const boardSize = 150.7;

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
    return {x, z};
}
function getPositionByIndex(index) {
    if (index >=0 && index <= 10) return (30 - index);
    if (index >= 11 && index <= 19) return (30 - index);
    if (index >= 20 && index <= 30) return (10 - (30 - index));
    if (index >=31 && index <=39) return (70 - index); 
    // return (50 - index)
    return index;
}