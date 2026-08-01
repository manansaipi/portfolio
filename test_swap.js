const heldMedia = { id: '1', category: 'nature', slotIndex: 0 };
const targetMedia = { id: '2', category: 'nature', slotIndex: 1 };
const mediaItems = [ heldMedia, targetMedia ];

let updatedItems = [...mediaItems];
let heldItemIndex = updatedItems.findIndex(m => m.id === heldMedia.id);
let targetItemIndex = updatedItems.findIndex(m => m.id === targetMedia.id);

const heldOrder = heldMedia.slotIndex !== undefined ? heldMedia.slotIndex : heldItemIndex;
const heldCat = heldMedia.category || 'nature-hall';

const targetOrder = targetMedia.slotIndex !== undefined ? targetMedia.slotIndex : targetItemIndex;
const targetCat = targetMedia.category || 'nature-hall';

updatedItems[heldItemIndex] = { ...heldMedia, category: targetCat, order: targetOrder };
updatedItems[targetItemIndex] = { ...targetMedia, category: heldCat, order: heldOrder };

console.log(updatedItems);
