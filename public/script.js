function redirectToAppointment() {
  window.location.href = "https://lr1pzfbjdjn.typeform.com/to/rvQ0ObEl";
}

function loadGoogleTranslate() {
  new google.translate.TranslateElement("google_element");
}

const chatHistory = document.getElementById("chat-history");
const userInput = document.getElementById("user-input");
const form = document.getElementById("chat-form");

async function sendMessage() {
  const userMessage = userInput.value;
  userInput.value = "";
  console.log(userMessage);
  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: userMessage }),
    });

    const data = await response.json();
    const botMessage = data.response;

    chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
    chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;

    chatHistory.scrollTop = chatHistory.scrollHeight;
  } catch (error) {
    console.error("Error:", error);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const loader = document.getElementById("loader");
  loader.style.display = "block";
  sendMessage().finally(() => {
    loader.style.display = "none";
  });
});

document
  .getElementById("bookButton")
  .addEventListener("click", redirectToAppointment);
