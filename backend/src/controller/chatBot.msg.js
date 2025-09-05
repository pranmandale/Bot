import Message from "../models/message.model.js";
import stringSimilarity from "string-similarity";

// Your bot dataset
export const botResponses = {
  "hello": "Hi! How can I help you?",
  "hi": "Hi! How can I help you?",
  "hey": "Hey there! How can I help?",
  "can we become friend": "Of course! I’m always here to chat.",
  "how are you": "I'm just a bot, but I'm doing great! How about you?",
  "what is your name?": "I’m ChatBot, your virtual assistant.",
  "who made you": "I was created by developers to help answer your questions.",
  "tell me a joke": "Why don’t skeletons fight each other? They don’t have the guts!",
  "what is the time": "I can’t see a clock, but your device should know.",
  "bye": "Goodbye! Have a great day.",
  "thank you": "You’re welcome!",
  "i love you": "That’s sweet! I’m here to help anytime.",
  "where are you from": "I live in the cloud — no rent, no bills!",
  "what can you do": "I can chat, answer questions, and keep you company.",
  "what is python": "Python is a high-level programming language used in web, AI, and automation.",
  "what is java?": "Java is an object-oriented programming language famous for 'write once, run anywhere'.",
  "what is recursion": "Recursion is when a function calls itself to solve smaller parts of a problem.",
  "who is prime minister of india?": "Narendra Modi is the Prime Minister of India since May 2014.",
  "what is g20": "The G20 is an intergovernmental forum of 19 countries + EU for global economic policy.",
  "tell me about yourself": "I’m a virtual chatbot created to answer your questions and chat with you.",
  "why should we hire you": "I bring value through knowledge, responsiveness, and adaptability.",
  "what is leadership": "Leadership is the ability to inspire and guide others toward goals.",
  "who is virat kohli": "Virat Kohli is one of India’s greatest batsmen and former captain.",
  "what is ipl": "The Indian Premier League is a professional T20 cricket league in India.",
  
  // General knowledge
  "who is the president of usa": "As of 2025, the President of the USA is Joe Biden.",
  "what is the capital of france": "The capital of France is Paris.",
  "what is the largest country": "Russia is the largest country in the world by land area.",
  "what is the smallest country": "Vatican City is the smallest country in the world.",
  "who discovered electricity": "Electricity was studied by many scientists, including Benjamin Franklin.",
  "what is climate change": "Climate change refers to long-term changes in global temperature and weather patterns.",
  
  // Programming & Tech
  "what is html": "HTML stands for HyperText Markup Language, used to create web pages.",
  "what is css": "CSS is used to style HTML elements on a webpage.",
  "what is javascript": "JavaScript is a programming language used to make web pages interactive.",
  "what is node.js": "Node.js is a runtime environment for executing JavaScript on the server.",
  "what is react": "React is a JavaScript library for building user interfaces.",
  "what is mongodb": "MongoDB is a NoSQL database that stores data in JSON-like documents.",
  
  // Science & Math
  "what is gravity": "Gravity is a force that attracts two bodies towards each other.",
  "what is photosynthesis": "Photosynthesis is the process by which plants make food using sunlight.",
  "what is pi": "Pi is a mathematical constant approximately equal to 3.14159.",
  "what is dna": "DNA is the molecule that carries genetic information in living organisms.",
  
  // Sports
  "who won world cup 2019": "England won the ICC Cricket World Cup 2019.",
  "who is sachin tendulkar": "Sachin Tendulkar is a legendary Indian cricketer.",
  "who is ms dhoni": "MS Dhoni is a former Indian cricket captain and wicketkeeper.",
  
  // Casual conversation
  "how old are you": "I don’t have an age, I exist in the cloud.",
  "what is your favorite color": "I don’t see colors, but I like all colors equally!",
  "do you have feelings": "I don’t have emotions, but I can understand yours.",
  "what is love": "Love is a deep feeling of affection and care.",
  "can you help me": "Of course! Ask me anything and I’ll try to answer.",
  
  // Interview questions
  "what are your strengths": "I am knowledgeable, responsive, and adaptable.",
  "what are your weaknesses": "I am still learning new things every day!",
  "where do you see yourself in 5 years": "I aim to assist more users and provide smarter answers.",
  "why do you want this job": "I want to help and provide value to everyone I interact with.",
  
  // Fun / jokes
  "tell me a fun fact": "Honey never spoils. Archaeologists have found edible honey in ancient tombs!",
  "tell me a riddle": "What has keys but can't open locks? A piano.",
  "do you know jokes": "Yes! I love telling jokes. Why did the computer go to therapy? Because it had a hard drive!"
};

export const messages = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }

    // ✅ Save user message (attach logged-in user ID from req.user)
    const userMessage = await Message.create({
      user: req.user._id,    // <-- logged-in user reference
      sender: "user",
      text: message,
    });

    // Normalize input
    const normalizedText = message.toLowerCase().trim();

    // Find best matching question
    const questions = Object.keys(botResponses);
    const match = stringSimilarity.findBestMatch(normalizedText, questions);

    // Choose bot reply
    const botReply =
      match.bestMatch.rating > 0.5
        ? botResponses[match.bestMatch.target]
        : "Sorry, I don't understand that!!!";

    // ✅ Save bot message (also linked to same user)
    const botMessage = await Message.create({
      user: req.user._id,    // <-- same logged-in user
      sender: "bot",
      text: botReply,
    });

    // Send response
    return res.status(200).json({
      userMessage: userMessage.text,
      botMessage: botMessage.text,
    });
  } catch (error) {
    console.error("Error in Message Controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
