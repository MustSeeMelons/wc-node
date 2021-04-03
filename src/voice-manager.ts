const say = require("say");

interface IVoiceManager {
  greet: () => void;
  farewell: () => void;
}

export const voiceManagerFactory = () => {
  return {
    greet: () => {
      say.speak("Hello wanker.");
    },
    farewell: () => {
      say.speak("Farewell wanker.");
    },
  };
};
