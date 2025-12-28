import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

export default ai

// openaiConfig.js
// config/openaiConfig.js
// In your AI config file
// config/openaiConfig.js
// import OpenAI from 'openai';

// console.log("=== OPENAI CONFIGURATION ===");
// console.log("API Key exists:", !!process.env.OPENAI_API_KEY);
// console.log("API Key starts with 'sk-':", process.env.OPENAI_API_KEY?.startsWith('sk-'));
// console.log("API Key length:", process.env.OPENAI_API_KEY?.length);

// const ai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Test the connection
// console.log("OpenAI client initialized");
// export default ai;

