const responseBox = document.getElementById("response");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volumeSlider");

let isMuted = false;
let selectedVoice = null;

const actions = {
  happy: [
    "Do a happy dance!",
    "Give someone a high-five!",
    "Sing your favorite song!"
  ],
  sad: [
    "Take 3 deep breaths.",
    "Hug a stuffed animal.",
    "Draw how you feel."
  ],
  angry: [
    "Stomp your feet 5 times!",
    "Roar like a lion!",
    "Punch a pillow safely!"
  ],
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
  }
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
    responseBox.innerHTML = `<p>${random}</p>`;
    speak(random);
  });
});

function setVoicePreference() {
  const voices = speechSynthesis.getVoices();
  selectedVoice = voices.find(v => v.name === "Google US English") || voices[0];
}

window.speechSynthesis.onvoiceschanged = setVoicePreference;
setVoicePreference();
updateVolumeIcon();
