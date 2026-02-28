import { lazy } from "react";
export const SceneCanvas = lazy(() => import('../Components/3D/SceneCanvas.jsx'));

export const preloadSceneCanvas = () => {
    import(`../Components/3D/SceneCanvas.jsx`);
}