const mic = document.getElementById('mic');
const listenText = document.getElementById('listenText');
const colorPicker = document.getElementById('colorPicker');

colorPicker.addEventListener('input', (e) => {
  document.body.style.backgroundColor = e.target.value;
});

function showBubble(message) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerText = message;

  // Random position
  bubble.style.top = `${Math.random() * window.innerHeight}px`;
  bubble.style.left = `${Math.random() * window.innerWidth}px`;

  document.body.appendChild(bubble);

  setTimeout(() => bubble.remove(), 5000);
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-IN';
recognition.interimResults = false;

mic.addEventListener('click', () => {
  listenText.innerText = "Listening...";
  recognition.start();
});

recognition.onresult = async (event) => {
  const userSpeech = event.results[0][0].transcript;
  listenText.innerText = "Listen";
  showBubble(userSpeech);

  try {
    const response = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userSpeech })
    });

    const data = await response.json();
    speak(data.reply);
    showBubble(data.reply);
  } catch (err) {
    speak("Oops! Something went wrong.");
    console.error(err);
  }
};

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-IN';
  speechSynthesis.speak(utter);
}
