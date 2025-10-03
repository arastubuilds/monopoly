import * as THREE from 'three';
import { useThree, createPortal, useFrame, useLoader } from '@react-three/fiber';
import { memo, useEffect, useMemo, useRef } from 'react';


const Background = memo(({textures}) =>{
    
    const { size, gl } = useThree();

    const bgTexture = useMemo(() => { 
        const bgTexture = textures['/background.jpg'];
        bgTexture.minFilter = THREE.LinearFilter;
        bgTexture.magFilter = THREE.LinearFilter;
        bgTexture.generateMipmaps = false;
        bgTexture.colorSpace = THREE.NoColorSpace;
        bgTexture.needsUpdate = true;
        return bgTexture;
    }, []);
    
    // Create uniforms
    const uniforms = useMemo(() => ({
        bgTexture: { value: bgTexture },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }), [bgTexture, size]);

    // Camera for full screen quad
    const backgroundCamera = useMemo(
        () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
        []
    );

    // Scene that renders before main scene
    const backgroundScene = useMemo(() => new THREE.Scene(), []);

    // Tell R3F to render background scene manually before main
        useFrame(() => {
        gl.autoClear = false;
        gl.clear();
        gl.render(backgroundScene, backgroundCamera);
    }, -1); // Run this before main scene (priority -1)

    // Ref for dynamic updates if needed later
    const meshRef = useRef();

    return createPortal(
    <>
        <mesh ref={meshRef}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={`
                    varying vec2 vUv;
                    void main() {
                    vUv = uv;
                    gl_Position = vec4(position.xy * 1.001, position.z, 1.0);
                    }
                `}
                fragmentShader={`
                    uniform sampler2D bgTexture;
                    varying vec2 vUv;
                    void main() {
                    gl_FragColor = texture2D(bgTexture, vUv);
                    }
                `}
                depthTest={false}
                depthWrite={false}
            />
        </mesh>
        </>,
        backgroundScene
    );
});
export default Background;