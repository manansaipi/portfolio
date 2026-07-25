// Web Speech API Voice Engine for Museum Tour Guide / AI Assistant NPC

export const speakNPC = (text, onWordBoundary, onEnd) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) setTimeout(onEnd, 3000);
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Natural speaking pace
  utterance.pitch = 1.05; // Friendly pitch

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Female') ||
        v.name.includes('Natural') ||
        v.name.includes('Samantha') ||
        v.name.includes('Zira') ||
        v.name.includes('Google US English'))
  ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  let hasFiredBoundary = false;

  // 1. Precise Word Boundary Synchronization (Word-by-word streaming matched to voice!)
  utterance.onboundary = (event) => {
    hasFiredBoundary = true;
    if (onWordBoundary) {
      // Reveal text up to current word spoken
      const charIndex = event.charIndex + (event.charLength || 4);
      onWordBoundary(Math.min(text.length, charIndex));
    }
  };

  // Fallback timer if browser voice engine doesn't emit onboundary events
  let fallbackInterval = null;
  utterance.onstart = () => {
    setTimeout(() => {
      if (!hasFiredBoundary && onWordBoundary) {
        let index = 0;
        const words = text.split(' ');
        let charAcc = 0;
        fallbackInterval = setInterval(() => {
          if (index < words.length) {
            charAcc += words[index].length + 1;
            onWordBoundary(Math.min(text.length, charAcc));
            index++;
          } else {
            clearInterval(fallbackInterval);
          }
        }, 180);
      }
    }, 200);
  };

  utterance.onend = () => {
    if (fallbackInterval) clearInterval(fallbackInterval);
    if (onWordBoundary) onWordBoundary(text.length);
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (fallbackInterval) clearInterval(fallbackInterval);
    if (onWordBoundary) onWordBoundary(text.length);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopNPCSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
