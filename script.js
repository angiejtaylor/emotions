const responseBox = document.getElementById("response");

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
  ]
};

document.querySelectorAll(".emotion").forEach(button => {
  button.addEventListener("click", () => {
    const feeling = button.dataset.feeling;
    const options = actions[feeling];
    const random = options[Math.floor(Math.random() * options.length)];
    responseBox.innerHTML = `<p>${random}</p>`;
  });
});
