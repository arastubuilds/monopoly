import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export async function preloadModels(paths = []) {
    const modelMap = {};
    const loader = new GLTFLoader();

    const promises = paths.map((path) => {
        return new Promise((resolve, reject) => {
            loader.load(
                path,
                (gltf) => {
                    modelMap[path] = gltf;
                    resolve();
                },
                undefined,
                (error) => {
                    console.error("Failed to load model:", path);
                    reject(error);
                }
            );
        });
    });

    await Promise.all(promises);
    // console.log(modelMap);
    
    return modelMap;
}