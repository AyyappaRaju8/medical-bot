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
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
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
            text: "That's an interesting question, but it's not related to medicine or health care.  \n\nWould you like to ask me something about those topics? 😊 \n",
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
            text: "That's a great question, but it's not related to medicine or health care.  \n\nWould you like to ask me something about those topics? 😊 \n",
          },
          {
            text: "Okay, I understand. \n\nPlease ask your questions related to medicine and health care, and I'll do my best to help! 😊 \n",
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
      {
        role: "user",
        parts: [{ text: "what are the symptoms of fever\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "That's a great question! A fever itself isn't an illness, but it's a sign that something is going on in your body.  Here are some common symptoms according to the Mayo Clinic:\n\n* **A temperature of 100.4°F (38°C) or higher** is considered a fever in adults.\n* **Feeling too hot or cold**.\n* **Sweating**\n* **Shivering**\n* **Headache**\n* **Muscle aches**\n* **Loss of appetite**\n* **Irritability**\n* **Dehydration**\n* **Weakness and fatigue** \n\n**In young children, you might also see:**\n\n* **Flushed cheeks**\n* **Glassy eyes**\n\n**It's important to remember:**  Fever can sometimes be a symptom of a more serious condition. \n\n**When to See a Doctor**\n\nBe sure to contact a medical professional if:\n\n* **An adult has a fever that reaches 103 F (39.4 C) or higher**\n* **A fever lasts longer than three days**\n* **You experience a fever alongside symptoms like severe headache, stiff neck, confusion, shortness of breath, or other concerning signs** \n\nFor reliable information about fevers, you can visit the Mayo Clinic website: [https://www.mayoclinic.org/diseases-conditions/fever/symptoms-causes/syc-20352759](https://www.mayoclinic.org/diseases-conditions/fever/symptoms-causes/syc-20352759) \n",
          },
        ],
      },
      {
        role: "user",
        parts: [
          {
            text: "Question: What are the common symptoms of dengue fever?\nAnswer: Common symptoms of dengue fever include high fever, severe headache, pain behind the eyes, joint and muscle pain, rash, and mild bleeding (such as nose or gum bleed).\n\nQuestion: How can I prevent malaria?\nAnswer: To prevent malaria, use mosquito nets, apply mosquito repellents, wear long-sleeved clothing, and avoid stagnant water around your home. In high-risk areas, taking antimalarial medication as prescribed by a doctor is also recommended.\n\nQuestion: What should I do if I have symptoms of COVID-19?\nAnswer: If you have symptoms of COVID-19, such as fever, cough, and difficulty breathing, self-isolate, wear a mask, and seek medical advice. Follow local health guidelines and get tested if advised.\n\nQuestion: What is the best diet for managing diabetes?\nAnswer: A healthy diet for managing diabetes includes whole grains, fresh fruits and vegetables, lean proteins, and low-fat dairy. Avoid sugary foods, refined carbs, and saturated fats. Regular meals and portion control are also important.\n\nQuestion: How often should I get a health check-up?\nAnswer: For adults, it is recommended to have a health check-up at least once a year. This includes blood pressure, cholesterol, blood sugar tests, and other screenings as advised by your doctor.\n\nQuestion: What are the signs of a heart attack?\nAnswer: Signs of a heart attack include chest pain or discomfort, pain in the arms, back, neck, jaw, or stomach, shortness of breath, nausea, lightheadedness, and cold sweats. Seek emergency medical help immediately if you experience these symptoms.\n\nQuestion: How can I improve my mental health?\nAnswer: To improve mental health, practice regular physical activity, maintain a healthy diet, get enough sleep, stay connected with loved ones, manage stress through relaxation techniques, and seek professional help if needed.\n\nQuestion: What vaccinations are recommended for children in India?\nAnswer: Recommended vaccinations for children in India include BCG, DPT, OPV, Hepatitis B, MMR, and vaccines for rotavirus, pneumococcus, and HPV, among others. Follow the immunization schedule provided by your pediatrician.\n\nQuestion: How can I maintain a healthy weight?\nAnswer: To maintain a healthy weight, follow a balanced diet, engage in regular physical activity, drink plenty of water, avoid junk food, and monitor your calorie intake. Maintaining a regular eating schedule and getting enough sleep are also important.\n\nQuestion: What are the benefits of yoga for health?\nAnswer: Yoga improves flexibility, strength, and posture. It also helps reduce stress, anxiety, and depression, enhances respiratory and cardiovascular health, boosts mental clarity, and promotes overall well-being.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "This is all great information! It looks like you've got a good grasp of providing helpful and accurate health advice.  Do you have any other questions for me regarding medicine or health care?  😊 \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "what is cricket\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "I'm designed to answer questions about medicine and health care. 🏏\n\nAre you curious about any health topics today? \n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "who won fifa worldcup\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: " I'm designed to answer questions about medicine and healthcare. \n\nDo you have any health-related questions I can assist you with today? \n",
          },
        ],
      },

      {
        role: "user",
        parts: [{ text: "who is messi\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "I understand you're interested in sports, but my expertise lies in medicine and healthcare. \n\nDo you have any questions related to those areas that I can help you with? 😊\n",
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
  if (response === undefined) response = "Please try again.";
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
