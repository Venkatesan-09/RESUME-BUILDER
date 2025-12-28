// test-openai-direct.js
import dotenv from 'dotenv'
import OpenAI from 'openai'

console.log("=== TESTING OPENAI DIRECTLY ===");
//console.log("Current directory:", __dirname);

// Check .env loading
console.log("\n=== ENVIRONMENT CHECK ===");
console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
console.log("Key starts with 'sk-':", process.env.OPENAI_API_KEY?.startsWith('sk-'));
console.log("Key length:", process.env.OPENAI_API_KEY?.length);
console.log("First 20 chars:", process.env.OPENAI_API_KEY?.substring(0, 20) + "...");

if (!process.env.OPENAI_API_KEY) {
  console.error("\n❌ ERROR: OPENAI_API_KEY is not set in .env file!");
  console.log("Please add to .env: OPENAI_API_KEY=sk-your-key-here");
  process.exit(1);
}

const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  console.log("\n=== MAKING OPENAI API CALL ===");
  
  try {
    const response = await ai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say 'OpenAI is working!' if you can read this" }
      ],
      max_tokens: 10,
    });
    
    console.log("✅ SUCCESS!");
    console.log("Response:", response.choices[0].message.content);
    console.log("Model:", response.model);
    console.log("Usage tokens:", response.usage?.total_tokens);
    
  } catch (error) {
    console.log("\n❌ ERROR DETAILS:");
    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    console.log("Error code:", error.code || "No code");
    console.log("Error type:", error.type || "No type");
    
    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);
    }
    
    // Common errors
    if (error.code === 'invalid_api_key') {
      console.log("\n⚠️  FIX: Your API key is invalid");
      console.log("Get a new key from: https://platform.openai.com/api-keys");
    }
    if (error.code === 'insufficient_quota') {
      console.log("\n⚠️  FIX: You have no credits");
      console.log("Add payment: https://platform.openai.com/billing");
      console.log("(They give $5 free credit with payment)");
    }
    if (error.message.includes('401')) {
      console.log("\n⚠️  FIX: Authentication failed - check API key");
    }
  }
}

test();