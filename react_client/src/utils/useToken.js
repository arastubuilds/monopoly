// useTokenManager.js
import { useRef } from 'react';
import * as THREE from 'three';

export function useTokenManager(tokenCount = 4) {
  const tokens = useRef([]); // token refs
  const tokenMap = useRef({}); // tileIndex: [tokenIndexes]

  const registerToken = (index, meshRef) => {
    tokens.current[index] = meshRef;
  };

  const getTilePosition = (tileIndex, tileWidth, cornerSize, totalLength) => {
    // same logic you had, convert tile index to world position
    // implement as needed for your board shape
    return new THREE.Vector3(/* x, y, z */);
  };

  const moveTokenToTile = (tokenIndex, tileIndex) => {
    const token = tokens.current[tokenIndex];
    if (!token?.current) return;

    // Remove from previous tile
    for (const idx in tokenMap.current) {
      const arr = tokenMap.current[idx];
      const i = arr.indexOf(tokenIndex);
      if (i !== -1) {
        arr.splice(i, 1);
        break;
      }
    }

    // Add to new tile
    if (!tokenMap.current[tileIndex]) tokenMap.current[tileIndex] = [];
    tokenMap.current[tileIndex].push(tokenIndex);

    // Get tile center
    const center = getTilePosition(tileIndex, 12.3, 20, 150.7);
    const tokensOnTile = tokenMap.current[tileIndex];
    const count = tokensOnTile.length;

    const radius = 2;
    const spacingAngle = Math.PI * 2 / Math.max(count, 1);

    tokensOnTile.forEach((idx, i) => {
      const angle = spacingAngle * i;
      const offsetX = Math.cos(angle) * radius;
      const offsetZ = Math.sin(angle) * radius;

      const mesh = tokens.current[idx]?.current;
      if (mesh) {
        mesh.position.set(
          center.x + (count === 1 ? 0 : offsetX),
          1,
          center.z + (count === 1 ? 0 : offsetZ)
        );
      }
    });
  };

  const getTokenCurrentTile = (tokenIndex) => {
    for (const tileIndex in tokenMap.current) {
      if (tokenMap.current[tileIndex].includes(tokenIndex)) {
        return parseInt(tileIndex);
      }
    }
    return null;
  };

  const moveTokenToTileAnimated = (tokenIndex, toTileIndex, delay = 300) => {
    const fromTileIndex = getTokenCurrentTile(tokenIndex);
    if (fromTileIndex === null) return;

    const path = [];
    let i = fromTileIndex;
    while (i !== toTileIndex) {
      i = (i + 1) % 40;
      path.push(i);
    }

    let step = 0;
    const moveNext = () => {
      if (step >= path.length) return;
      moveTokenToTile(tokenIndex, path[step]);
      step++;
      setTimeout(moveNext, delay);
    };

    moveNext();
  };

  return {
    registerToken,
    moveTokenToTile,
    moveTokenToTileAnimated,
    getTokenCurrentTile,
  };
}