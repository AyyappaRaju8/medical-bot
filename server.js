const express = require("express");
const dotenv = require("dotenv").config();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const path = require("path");

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:
    "Only respond to queries related to medicine, health care, health advice, and medical advice. If irrelevant queries were asked, respond with a message that the query is irrelevant and ask them to enter a proper query. Use the following websites for accurate and up-to-date information: WebMD - http://www.webmd.com/, Mayo Clinic - http://www.mayoclinic.org/, MedlinePlus - www.medlineplus.gov, WHO - http://www.who.int/. Ensure the responses are well-organized and clear, and cite the relevant sources when providing information.",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

async function run(userInput) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "hi\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Hello! 👋  What can I help you with today regarding medicine and health care? \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "What is cricket\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "The question you asked is not related to medicine or health care.\nWould you like to ask me something about those topics? 😊 \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "give me the symptoms of fever\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Fever is a common symptom that can be caused by a variety of factors. Here are some common symptoms associated with fever:\nGeneral Symptoms:**\n* **Elevated body temperature:** This is the most obvious symptom of fever, and it can be measured using a thermometer.  A temperature of 100.4°F (38°C) or higher is generally considered a fever.\n* **Chills:** You may feel cold even though your body temperature is elevated.\n* **Sweating:** You may sweat more than usual, especially when the fever breaks.\n* **Headache:**  You may experience a headache, which can be mild or severe.\n* **Muscle aches and pains:**  These are common with fever, especially in cases of the flu or other viral infections.\n* **Fatigue:** You may feel tired and weak.\n* **Loss of appetite:** You may not feel like eating.\n**Other Possible Symptoms:**\n* **Sore throat:** This is common with viral infections, such as the common cold or strep throat.\n* **Cough:**  A cough can be a sign of respiratory infection.\n* **Runny nose:**  This is also common with viral infections.\n* **Nausea and vomiting:** These symptoms can occur with fever, especially in children.\n* **Diarrhea:**  This can also be a symptom of fever, particularly in cases of food poisoning.\n* **Rash:**  A rash may appear with some types of fever, such as measles or chickenpox.\n**Important Note:**\nIt's important to remember that these are just general symptoms, and the specific symptoms you experience may vary depending on the underlying cause of your fever.\n**If you are concerned about a fever, it is always best to consult a doctor or other healthcare professional.** They can help you determine the cause of your fever and recommend the appropriate treatment. \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "who won the fifa world cup\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "That's a great question, but it's not related to medicine or health care. Would you like to ask me something about those topics? 😊",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "Dont say thats a great question\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: `Okay, I understand.  While that's an interesting question, it's not within the realm of medicine or health care. \nDo you have any other questions, perhaps related to medical conditions, symptoms, or treatments? I'm happy to help with those! 😄 \n`,
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "who won the fifa world cup\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "I understand you're curious about the FIFA World Cup, but I'm designed to provide information about medicine and health care. \nHow about we try a different question? Maybe you'd like to know about:\n* **Common cold symptoms?**\n* **Tips for healthy eating?** \n* **The latest advancements in cancer treatment?**\nI'm ready to share my knowledge on health-related subjects! 😊  \n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "dont give examples. just ask them to give health and medical questions\n",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Okay, I understand. \nPlease ask your questions related to medicine and health care, and I'll do my best to help! 😊 \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "who won the fifa world cup\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "I'm here to provide information about medicine and health care. Please ask me about those topics, and I'll be happy to assist you!  \n",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(userInput);
  const response = result.response
    .text()
    .replace(/\*/g, "</p>\n<p>")
    .replace(/\n\n\n+/g, "\n\n")
    .replace(/\s*<br\s*>/g, "<br>");
  return `<p>${response}</p>`;
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public", "index.html");
});

app.get("/loader.gif", (req, res) => {
  res.sendFile(__dirname + "/loader.gif");
});

app.post("/chat", async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log("incoming /chat req", userInput);
    if (!userInput) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const response = await run(userInput);
    res.json({ response });
  } catch (error) {
    console.error("Error in chat endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`Port ${port} is already in use. Trying a different port...`);
    server.listen(0, () => {
      console.log(`Server is now listening on port ${server.address().port}`);
    });
  } else {
    throw error;
  }
});
