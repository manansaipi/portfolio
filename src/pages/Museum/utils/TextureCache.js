import * as THREE from 'three';

class TextureCache {
  constructor() {
    this.cache = new Map();
    this.loader = new THREE.TextureLoader();
  }

  async preloadAll(urls, onProgress) {
    if (!urls || urls.length === 0) return;
    let loaded = 0;
    const total = urls.length;

    const promises = urls.map(url => 
      this.load(url).then(() => {
        loaded++;
        if (onProgress) onProgress(loaded, total);
      })
    );

    await Promise.all(promises);
  }

  get(url) {
    return this.cache.get(url) || null;
  }

  load(url) {
    if (this.cache.has(url)) {
      return Promise.resolve(this.cache.get(url));
    }

    return new Promise((resolve) => {
      this.loader.setCrossOrigin('anonymous');
      this.loader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.anisotropy = 4;
          texture.generateMipmaps = true;
          texture.needsUpdate = true;
          this.cache.set(url, texture);
          resolve(texture);
        },
        undefined,
        (err) => {
          console.warn(`Failed to load texture at ${url}:`, err);
          resolve(null);
        }
      );
    });
  }

  dispose() {
    this.cache.forEach((texture) => {
      if (texture && texture.dispose) texture.dispose();
    });
    this.cache.clear();
  }
}

export const textureCache = new TextureCache();
