import * as THREE from 'three';

export async function preloadTextures(anisotropy) {
    const textureMap = {};
    const loader = new THREE.TextureLoader();

    const paths = [];

    for (let i = 0; i < 40; i++) {
        let name = getPathFromPosition(getPositionByIndex(i));
        paths.push(`/3D/tiles/${name}.png`); // or use your getPathFromPosition(i)
    }

    paths.push('/3D/monopoly.png');
    paths.push('/3D/ground.png');
    // paths.push('/background.jpg');
    paths.push('/3D/chance-action.png');
    paths.push('/3D/community-action.png');

    const promises = paths.map((path) => {
        return new Promise((resolve, reject) => {
            loader.load(
                path,
                (texture) => {
                    texture.magFilter = THREE.LinearFilter;
                    texture.minFilter = THREE.LinearMipMapLinearFilter;
                    texture.generateMipmaps = true;
                    texture.anisotropy = anisotropy;
                    texture.colorSpace = THREE.SRGBColorSpace;
                    textureMap[path] = texture;
                    resolve();
                },
                undefined,
                (error) => {
                    console.error("Failed to load", path);
                    reject(error);
                }
            );
        });
    });

    await Promise.all(promises);
    // console.log(textureMap);
    return textureMap;
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