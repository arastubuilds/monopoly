import { useEffect, useRef, useState } from 'react';
import { preloadModels } from '../utils/modelLoader';

const defaultPaths = [
    // '/models/token_car.glb',
    // '/models/token_hat.glb',
    // '/models/token_dog.glb',
    // '/models/house.glb',
    // '/models/hotel.glb',
    '/3D/dice/scene.gltf',
    // '/pawn/scene.gltf',
    // '/lego_man/scene.gltf',
    // '/lego_spiderman/scene.gltf',
    // Add more as needed
];

export function usePreloadedModels() {
    const customPaths = defaultPaths;
    const [models, setModels] = useState(null);
    const [isLoadingModels, setIsLoading] = useState(true);
    const modelsRef = useRef(null);

    useEffect(() => {
        const load = async () => {
            if (!modelsRef.current){
                modelsRef.current = await preloadModels(customPaths);
                // setModels(modelMap);
                setIsLoading(false);
            }
        };

        load();
    }, [customPaths]);

    return { models: modelsRef.current, isLoadingModels };
}