// Terminal-Identical Audio & Text Streaming Sync Engine

let currentAudio = null;

export const playAIAudioAndStreamText = (text, audioResult, onProgress, onEnd) => {
  // Stop any previous playing audio or speech
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // ── 1. If ElevenLabs / Backend Audio is present (Exact Terminal Logic!) ──
  if (audioResult && audioResult.audioBlob) {
    const audioUrl = URL.createObjectURL(audioResult.audioBlob);
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    let animFrameId = null;
    const alignment = audioResult.alignment;
    let hasEnded = false;

    const triggerEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      if (onProgress) onProgress(text.length);
      if (onEnd) onEnd();
    };

    const updateTextProgress = () => {
      if (!currentAudio || currentAudio !== audio) return;

      const currentTime = audio.currentTime;
      const duration = isNaN(audio.duration) || !isFinite(audio.duration) ? 0 : audio.duration;
      let spokenCount = 0;

      if (alignment && alignment.character_start_times_seconds) {
        // Precise ElevenLabs timestamp alignment
        const startTimes = alignment.character_start_times_seconds;
        for (let i = 0; i < startTimes.length; i++) {
          if (currentTime >= startTimes[i]) {
            spokenCount = i + 1;
          } else {
            break;
          }
        }
        // Advance to word boundary for natural feel
        while (
          spokenCount > 0 &&
          spokenCount < alignment.characters.length &&
          !/\s/.test(alignment.characters[spokenCount])
        ) {
          spokenCount++;
        }
      } else if (duration > 0) {
        // Audio Duration Progress Estimation
        const progress = Math.min(1, currentTime / duration);
        spokenCount = Math.floor(progress * text.length);
        while (spokenCount > 0 && spokenCount < text.length && !/\s/.test(text[spokenCount])) {
          spokenCount++;
        }
      }

      if (onProgress) onProgress(Math.min(text.length, spokenCount));

      if (audio.ended || (duration > 0 && currentTime >= duration - 0.05)) {
        triggerEnd();
      } else {
        animFrameId = requestAnimationFrame(updateTextProgress);
      }
    };

    audio.play().then(() => {
      animFrameId = requestAnimationFrame(updateTextProgress);
    }).catch(() => {
      // Audio playback blocked -> fallback to Web Speech API
      fallbackWebSpeech(text, onProgress, onEnd);
    });

    audio.onended = () => {
      triggerEnd();
    };

    return;
  }

  // ── 2. Fallback: Web Speech API TTS (Terminal Fallback) ──
  fallbackWebSpeech(text, onProgress, onEnd);
};

const fallbackWebSpeech = (text, onProgress, onEnd) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onProgress) onProgress(text.length);
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Female') ||
        v.name.includes('Natural') ||
        v.name.includes('Samantha') ||
        v.name.includes('Google US English'))
  ) || voices[0];

  if (preferredVoice) utterance.voice = preferredVoice;

  let hasBoundaryFired = false;

  utterance.onboundary = (e) => {
    hasBoundaryFired = true;
    if (onProgress) {
      const charIndex = e.charIndex + (e.charLength || 4);
      onProgress(Math.min(text.length, charIndex));
    }
  };

  let fallbackInterval = null;
  utterance.onstart = () => {
    setTimeout(() => {
      if (!hasBoundaryFired && onProgress) {
        let index = 0;
        const words = text.split(' ');
        let charAcc = 0;
        fallbackInterval = setInterval(() => {
          if (index < words.length) {
            charAcc += words[index].length + 1;
            onProgress(Math.min(text.length, charAcc));
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
    if (onProgress) onProgress(text.length);
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (fallbackInterval) clearInterval(fallbackInterval);
    if (onProgress) onProgress(text.length);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopAIAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
