// Cross-shaped 3D Virtual Museum Layout Configuration

export const WALKABLE_ZONES = [
  // Level 1: Main Lobby (X: -13.8 to 13.8, Z: -13.8 to 13.8 -- 1.2m wall buffer)
  { minX: -13.8, maxX: 13.8, minZ: -13.8, maxZ: 13.8, level: 1 },

  // Level 1: Corridors (Width 8m, 0.8m wall margin)
  { minX: -3.2, maxX: 3.2, minZ: -27.5, maxZ: -13.8, level: 1 }, // North (Nature)
  { minX: -27.5, maxX: -13.8, minZ: -3.2, maxZ: 3.2, level: 1 }, // West (Street)
  { minX: 13.8, maxX: 27.5, minZ: -3.2, maxZ: 3.2, level: 1 },  // East (Travel)
  { minX: -3.2, maxX: 3.2, minZ: 13.8, maxZ: 27.5, level: 1 },  // South (Portrait)

  // Level 1: Exhibition Halls (1.4m wall & artwork frame buffer -- impossible to enter images!)
  { minX: -13.6, maxX: 13.6, minZ: -75.8, maxZ: -27.5, level: 1 }, // Nature Hall (North Wing)
  { minX: -75.8, maxX: -27.5, minZ: -13.6, maxZ: 13.6, level: 1 }, // Street Hall (West Wing)
  { minX: 27.5, maxX: 75.8, minZ: -13.6, maxZ: 13.6, level: 1 },  // Travel Hall (East Wing)
  { minX: -13.6, maxX: 13.6, minZ: 27.5, maxZ: 75.8, level: 1 },  // Portrait Hall (South Wing)
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
