import { useEffect, useRef, useState } from 'react';
import { preloadTextures } from './textureLoader.js';

export function usePreloadedTextures() {
    // const [textures, setTextures] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const texturesRef = useRef(null);
    // const { gl } = useThree();
    useEffect(() => {
        const load = async () => {
            const maxAnisotropy = 16;
            if (!texturesRef.current){
                texturesRef.current = await preloadTextures(maxAnisotropy);
                // setTextures(textureMap);
                setIsLoading(false);
            }
        };

        load();
    }, []);

    return { textures: texturesRef.current, isLoading };
}