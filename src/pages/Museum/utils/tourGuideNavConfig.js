// Museum Tour Route Waypoints & Exhibit Presentations

export const TOUR_WAYPOINTS = [
  // 0. Lobby Start / Spawn Station
  {
    id: 'lobby_start',
    position: [3, 0, 6],
    facing: [0, 0, 0], // Look toward Lobby center
    action: 'greet',
    speech: "Welcome to our 3D Photography Museum! I'm Maya, your tour guide. Follow me as we explore our four exhibition halls.",
  },

  // 1. Nature Hall Entrance Corridor
  {
    id: 'nature_corridor',
    position: [0, 0, -18],
    facing: [0, 0, -1],
    action: 'walk',
  },

  // 2. Nature Hall Center Presentation
  {
    id: 'nature_exhibit',
    position: [0, 0, -52],
    facing: [0, 0, -1], // Face North back wall artwork
    pointTarget: [0, 4.2, -76.55],
    action: 'explain',
    speech: "Welcome to Nature Hall. Here we celebrate majestic landscapes, wildlife, and natural light contrasts. Notice how the green architectural tones harmonize with the wilderness photography.",
  },

  // 3. Street Hall Transition
  {
    id: 'lobby_hub_1',
    position: [0, 0, 0],
    facing: [-1, 0, 0],
    action: 'walk',
  },
  {
    id: 'street_corridor',
    position: [-18, 0, 0],
    facing: [-1, 0, 0],
    action: 'walk',
  },

  // 4. Street Hall Center Presentation
  {
    id: 'street_exhibit',
    position: [-52, 0, 0],
    facing: [-1, 0, 0], // Face West back wall artwork
    pointTarget: [-76.55, 4.2, 0],
    action: 'explain',
    speech: "This is Street Hall, dedicated to urban exploration, architectural geometry, and candid human moments captured in cityscapes around the world.",
  },

  // 5. Travel Hall Transition
  {
    id: 'lobby_hub_2',
    position: [0, 0, 0],
    facing: [1, 0, 0],
    action: 'walk',
  },
  {
    id: 'travel_corridor',
    position: [18, 0, 0],
    facing: [1, 0, 0],
    action: 'walk',
  },

  // 6. Travel Hall Center Presentation
  {
    id: 'travel_exhibit',
    position: [52, 0, 0],
    facing: [1, 0, 0], // Face East back wall artwork
    pointTarget: [76.55, 4.2, 0],
    action: 'explain',
    speech: "Welcome to Travel Hall! Experience culture, distant horizons, and breathtaking global journeys with warm mahogany acoustic wall finishes.",
  },

  // 7. Portrait Hall Transition
  {
    id: 'lobby_hub_3',
    position: [0, 0, 0],
    facing: [0, 0, 1],
    action: 'walk',
  },
  {
    id: 'portrait_corridor',
    position: [0, 0, 18],
    facing: [0, 0, 1],
    action: 'walk',
  },

  // 8. Portrait Hall Center Presentation
  {
    id: 'portrait_exhibit',
    position: [0, 0, 52],
    facing: [0, 0, 1], // Face South back wall artwork
    pointTarget: [0, 4.2, 76.55],
    action: 'explain',
    speech: "Finally, we enter Portrait Hall. This gallery highlights human emotion, studio lighting mastery, and deep character storytelling.",
  },

  // 9. Return to Lobby Desk
  {
    id: 'lobby_finish',
    position: [3, 0, 6],
    facing: [-1, 0, 0],
    action: 'finish',
    speech: "That concludes our full museum tour! Feel free to walk around and inspect any artwork in detail. Press E whenever you'd like another tour!",
  },
];
