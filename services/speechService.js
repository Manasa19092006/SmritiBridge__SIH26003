// Web Speech API Integration: Text-to-Speech (TTS) & Voice Recognition
// Designed specifically for elderly dementia care with gentle pacing

export const speechService = {
  isSpeaking: false,
  isListening: false,
  currentRecognition: null,

  // Text to Speech
  speak(text, lang = 'en-US', options = {}) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported in this browser');
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    // Senior-friendly calm, clear speaking speed
    utterance.rate = options.rate || 0.88;
    utterance.pitch = options.pitch || 1.05; // Slightly warm tone

    // Regional language mapping
    const langMap = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      bn: 'bn-IN'
    };
    utterance.lang = langMap[lang] || lang || 'en-US';

    // Try finding matched voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (options.onError) options.onError(e);
    };

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  },

  // Voice Input Speech Recognition
  startListening(onResult, onEnd, onError, lang = 'en-IN') {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not supported in this browser. You can type or use picture cards.');
      return null;
    }

    try {
      if (this.currentRecognition) {
        this.currentRecognition.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        this.isListening = true;
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (onResult) onResult(transcript);
      };

      recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event.error);
      };

      recognition.onend = () => {
        this.isListening = false;
        if (onEnd) onEnd();
      };

      recognition.start();
      this.currentRecognition = recognition;
      return recognition;
    } catch (err) {
      if (onError) onError(err);
      return null;
    }
  },

  stopListening() {
    if (this.currentRecognition) {
      this.currentRecognition.stop();
      this.currentRecognition = null;
      this.isListening = false;
    }
  }
};
