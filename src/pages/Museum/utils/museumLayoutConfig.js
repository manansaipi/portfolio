// Cross-shaped 3D Virtual Museum Layout (Level 1 Exhibition Wings + Level 2 Rooftop Penthouse)

export const WALKABLE_ZONES = [
  // Level 1: Main Lobby (X: -14.5 to 14.5, Z: -14.5 to 14.5)
  { minX: -14.5, maxX: 14.5, minZ: -14.5, maxZ: 14.5, level: 1 },

  // Level 1: Corridors (Width 8m, Length 12m)
  { minX: -3.8, maxX: 3.8, minZ: -26.8, maxZ: -14.5, level: 1 }, // North (Nature)
  { minX: -26.8, maxX: -14.5, minZ: -3.8, maxZ: 3.8, level: 1 }, // West (Street)
  { minX: 14.5, maxX: 26.8, minZ: -3.8, maxZ: 3.8, level: 1 },  // East (Travel)
  { minX: -3.8, maxX: 3.8, minZ: 14.5, maxZ: 26.8, level: 1 },  // South (Portrait)

  // Level 1: Exhibition Halls
  { minX: -14.5, maxX: 14.5, minZ: -76.5, maxZ: -26.8, level: 1 }, // Nature Hall (North Wing)
  { minX: -76.5, maxX: -26.8, minZ: -14.5, maxZ: 14.5, level: 1 }, // Street Hall (West Wing)
  { minX: 26.8, maxX: 76.5, minZ: -14.5, maxZ: 14.5, level: 1 },  // Travel Hall (East Wing)
  { minX: -14.5, maxX: 14.5, minZ: 26.8, maxZ: 76.5, level: 1 },  // Portrait Hall (South Wing)
];

export const HALL_CONFIG = {
  nature: {
    title: 'Nature Hall',
    slug: 'nature',
    center: [0, 3.8, -52],
    floorColor: '#252e25',
    wallColor: '#2d3b2d',
    walls: [
      { position: [-14.55, 4.2, -35], rotation: [0, Math.PI / 2, 0] },
      { position: [-14.55, 4.2, -45], rotation: [0, Math.PI / 2, 0] },
      { position: [-14.55, 4.2, -55], rotation: [0, Math.PI / 2, 0] },
      { position: [-14.55, 4.2, -65], rotation: [0, Math.PI / 2, 0] },
      { position: [14.55, 4.2, -35], rotation: [0, -Math.PI / 2, 0] },
      { position: [14.55, 4.2, -45], rotation: [0, -Math.PI / 2, 0] },
      { position: [14.55, 4.2, -55], rotation: [0, -Math.PI / 2, 0] },
      { position: [14.55, 4.2, -65], rotation: [0, -Math.PI / 2, 0] },
      { position: [-8, 4.2, -76.55], rotation: [0, 0, 0] },
      { position: [0, 4.2, -76.55], rotation: [0, 0, 0] },
      { position: [8, 4.2, -76.55], rotation: [0, 0, 0] },
    ]
  },

  street: {
    title: 'Street Hall',
    slug: 'street',
    center: [-52, 3.8, 0],
    floorColor: '#1c1c1e',
    wallColor: '#2b2b2e',
    walls: [
      { position: [-35, 4.2, -14.55], rotation: [0, 0, 0] },
      { position: [-45, 4.2, -14.55], rotation: [0, 0, 0] },
      { position: [-55, 4.2, -14.55], rotation: [0, 0, 0] },
      { position: [-65, 4.2, -14.55], rotation: [0, 0, 0] },
      { position: [-35, 4.2, 14.55], rotation: [0, Math.PI, 0] },
      { position: [-45, 4.2, 14.55], rotation: [0, Math.PI, 0] },
      { position: [-55, 4.2, 14.55], rotation: [0, Math.PI, 0] },
      { position: [-65, 4.2, 14.55], rotation: [0, Math.PI, 0] },
      { position: [-76.55, 4.2, -8], rotation: [0, Math.PI / 2, 0] },
      { position: [-76.55, 4.2, 0], rotation: [0, Math.PI / 2, 0] },
      { position: [-76.55, 4.2, 8], rotation: [0, Math.PI / 2, 0] },
    ]
  },

  travel: {
    title: 'Travel Hall',
    slug: 'travel',
    center: [52, 3.8, 0],
    floorColor: '#2b231d',
    wallColor: '#3d3229',
    walls: [
      { position: [35, 4.2, -14.55], rotation: [0, 0, 0] },
      { position: [45, 4.2, -14.55], rotation: [0, 0, 0] },
      { position: [55, 4.2, -14.55], rotation: [0, 0, 0] },
      { position: [65, 4.2, -14.55], rotation: [0, 0, 0] },
      { position: [35, 4.2, 14.55], rotation: [0, Math.PI, 0] },
      { position: [45, 4.2, 14.55], rotation: [0, Math.PI, 0] },
      { position: [55, 4.2, 14.55], rotation: [0, Math.PI, 0] },
      { position: [65, 4.2, 14.55], rotation: [0, Math.PI, 0] },
      { position: [76.55, 4.2, -8], rotation: [0, -Math.PI / 2, 0] },
      { position: [76.55, 4.2, 0], rotation: [0, -Math.PI / 2, 0] },
      { position: [76.55, 4.2, 8], rotation: [0, -Math.PI / 2, 0] },
    ]
  },

  portrait: {
    title: 'Portrait Hall',
    slug: 'portrait',
    center: [0, 3.8, 52],
    floorColor: '#1d222b',
    wallColor: '#232b38',
    walls: [
      { position: [-14.55, 4.2, 35], rotation: [0, Math.PI / 2, 0] },
      { position: [-14.55, 4.2, 45], rotation: [0, Math.PI / 2, 0] },
      { position: [-14.55, 4.2, 55], rotation: [0, Math.PI / 2, 0] },
      { position: [-14.55, 4.2, 65], rotation: [0, Math.PI / 2, 0] },
      { position: [14.55, 4.2, 35], rotation: [0, -Math.PI / 2, 0] },
      { position: [14.55, 4.2, 45], rotation: [0, -Math.PI / 2, 0] },
      { position: [14.55, 4.2, 55], rotation: [0, -Math.PI / 2, 0] },
      { position: [14.55, 4.2, 65], rotation: [0, -Math.PI / 2, 0] },
      { position: [-8, 4.2, 76.55], rotation: [0, Math.PI, 0] },
      { position: [0, 4.2, 76.55], rotation: [0, Math.PI, 0] },
      { position: [8, 4.2, 76.55], rotation: [0, Math.PI, 0] },
    ]
  },

  signature: {
    title: 'Level 2 Rooftop Penthouse',
    slug: 'signature',
    center: [0, 15.8, 0],
    floorColor: '#18181b',
    wallColor: '#27272a',
    walls: []
  }
};
