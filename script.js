const responseBox = document.getElementById("response");
const volumeIcon = document.getElementById("volumeIcon");
const volumeSlider = document.getElementById("volumeSlider");

let isMuted = false;

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
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
};

volumeIcon.addEventListener("click", () => {
  isMuted = !isMuted;
  updateVolumeIcon();
});

volumeSlider.addEventListener("input", () => {
  if (parseFloat(volumeSlider.value) === 0) {
    isMuted = true;
  } else {
    isMuted = false;
  }
  updateVolumeIcon();
});

function updateVolumeIcon() {
  if (isMuted || parseFloat(volumeSlider.value) === 0) {
    volumeIcon.textContent = "🔇";
  } else if (parseFloat(volumeSlider.value) < 0.5) {
    volumeIcon.textContent = "🔈";
  } else {
    volumeIcon.textContent = "🔊";
  }
}

document.querySelectorAll(".emotion").forEach(button => {
  button.addEventListener("click", () => {
    const feeling = button.dataset.feeling;
    const options = actions[feeling];
    const random = options[Math.floor(Math.random() * options.length)];
    responseBox.innerHTML = `<p>${random}</p>`;
    speak(random);
  });
});

// Initialize icon
updateVolumeIcon();
