const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volumeSlider");
const voicePicker = document.getElementById("voicePicker");
const robot = document.getElementById("robot");
const introBubble = document.getElementById("introBubble");

let isMuted = false;
let selectedVoice = null;
let allVoices = [];

const actions = {
  happy: ["Do a happy dance!", "Give someone a high-five!", "Sing your favorite song!"],
  sad: ["Take 3 deep breaths.", "Hug a stuffed animal.", "Draw how you feel."],
  angry: ["Stomp your feet 5 times!", "Roar like a lion!", "Punch a pillow safely!"],
  disappointed: [
    "Take a deep breath and say, 'It’s okay to feel this way.'",
    "Talk to a grown-up about it.",
    "Give yourself a big hug.",
    "Try again or pick a different fun thing to do.",
    "Draw or color how you feel."
  ]
};

const speak = (text) => {
  if (isMuted || parseFloat(volumeSlider.value) === 0) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = parseFloat(volumeSlider.value);
  utterance.pitch = 1.2;
  utterance.rate = 0.9;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  } else {
    const fallback = speechSynthesis.getVoices().find(v => v.lang === "en-US" && v.name.includes("Google")) 
                  || speechSynthesis.getVoices().find(v => v.lang.startsWith("en"));
    utterance.voice = fallback;
    selectedVoice = fallback;
  }

  console.log("Robot is speaking:", text);
  robot.classList.add("robot-speaking");
  utterance.onend = () => {
    console.log("Speech ended");
    robot.classList.remove("robot-speaking");
  };
  utterance.onerror = (e) => {
    console.error("Speech error:", e);
    robot.classList.remove("robot-speaking");
  };

  speechSynthesis.speak(utterance);
};

function updateVolumeIcon() {
  if (isMuted || parseFloat(volumeSlider.value) === 0) {
    volumeIcon.textContent = "🔇";
  } else if (parseFloat(volumeSlider.value) < 0.5) {
    volumeIcon.textContent = "🔈";
  } else {
    volumeIcon.textContent = "🔊";
  }
}

volumeIcon.addEventListener("click", () => {
  isMuted = !isMuted;
  updateVolumeIcon();
});

volumeSlider.addEventListener("input", () => {
  isMuted = parseFloat(volumeSlider.value) === 0;
  updateVolumeIcon();
});

document.querySelectorAll(".emotion").forEach(button => {
  button.addEventListener("click", () => {
    const feeling = button.dataset.feeling;
    const options = actions[feeling];
    const random = options[Math.floor(Math.random() * options.length)];

    if (introBubble) {
      introBubble.textContent = random;
      introBubble.style.opacity = "1";
      introBubble.style.transition = "none";
    }

    speak(random);
  });
});

function populateVoicePicker() {
  allVoices = speechSynthesis.getVoices();
  console.log("Available voices:", allVoices);
  voicePicker.innerHTML = "";

  allVoices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} — ${voice.lang}`;
    if (voice.name === "Zarvox") {
      option.selected = true;
      selectedVoice = voice;
    }
    voicePicker.appendChild(option);
  });

  if (!selectedVoice && allVoices.length > 0) {
    selectedVoice = allVoices.find(v => v.lang.startsWith("en")) || allVoices[0];
  }

  console.log("Selected voice:", selectedVoice);
}

if (speechSynthesis.getVoices().length > 0) {
  populateVoicePicker();
} else {
  speechSynthesis.onvoiceschanged = populateVoicePicker;
  setTimeout(() => {
    if (!selectedVoice) {
      populateVoicePicker();
    }
  }, 1000);
}

updateVolumeIcon();

function speakIntroOnce() {
  console.log("Click received ✅");

  const introText = "Hi, how are you feeling?";
  if (introBubble && selectedVoice) {
    introBubble.textContent = introText;
    introBubble.style.opacity = "1";
    introBubble.style.transition = "none";

    // Speak right here – directly in the gesture handler
    const utterance = new SpeechSynthesisUtterance(introText);
    utterance.voice = selectedVoice;
    utterance.volume = parseFloat(volumeSlider.value);
    utterance.pitch = 1.2;
    utterance.rate = 0.9;

    utterance.onend = () => robot.classList.remove("robot-speaking");
    utterance.onerror = (e) => {
      console.error("Speech error:", e);
      robot.classList.remove("robot-speaking");
    };

    robot.classList.add("robot-speaking");
    speechSynthesis.speak(utterance);
  }

  // Clean up listeners
  document.removeEventListener("click", speakIntroOnce);
  document.removeEventListener("touchstart", speakIntroOnce);
}

document.addEventListener("DOMContentLoaded", () => {
  const bubble = document.getElementById("introBubble");
  if (bubble) {
    bubble.addEventListener("click", speakIntroOnce, { once: true });
    bubble.addEventListener("touchstart", speakIntroOnce, { once: true });
  }
});