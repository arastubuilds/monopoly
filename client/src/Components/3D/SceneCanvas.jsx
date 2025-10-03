import { memo, Suspense, useEffect } from 'react';

import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei'

import Dice from './Dice.jsx';
import Board1 from './Board.jsx';
// import Background from './Background.jsx';

// import { usePreloadedTextures } from '../../utils/usePreLoadedTextures.js';
// import { usePreloadedModels } from '../../utils/usePreLoadedModels.js';

const SceneCanvas = memo(function SceneCanvas() {
    // const { textures, isLoading} = usePreloadedTextures();
    // const { models, isLoadingModels} = usePreloadedModels();
    // // console.log("canvas");

    // if (isLoading || isLoadingModels) {
    //     return <div>Loading models & textures...</div>; 
    // }

    return (
    <div id="canvas-container">
        <Suspense fallback={<div>Loading 2...</div>}>
            <Canvas gl={{
                outputColorSpace: THREE.SRGBColorSpace,
                toneMapping: THREE.NoToneMapping,
                antialias: true,
                powerPreference: "high-performance"
            }} dpr={window.devicePixelRatio} flat={true}>
                {/* <Background textures={textures}/> */}
                <CameraController />
                <ambientLight color={0xffffff} intensity={1.5} />
                <directionalLight color={0xffffff} position={[100, 100, 100]} intensity={1.5} />
                <Board1 />
                <Dice />
                <OrbitControls />
                {/* <Preload all/> */}
            </Canvas>   
        </Suspense>
    </div>
    )
});
function CameraController() {
    const {set, camera} = useThree();
    useEffect(() => {
        camera.position.set(0, 80, 90);
        // camera.lookAt(0, 0, 0);
        camera.zoom = 2.55;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();
    }, []);
    return <></>;
}
export default  SceneCanvas;