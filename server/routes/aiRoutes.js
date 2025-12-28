import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { enhanceJobDescription, enhanceProfessionalSummary, uploadResume } from '../controllers/aiController.js';
import upload from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum',protect,enhanceProfessionalSummary);
aiRouter.post('/enhance-job-desc',protect,enhanceJobDescription);
aiRouter.post('/upload-resume', protect, upload.single('pdf'), uploadResume);


// Test route to verify the router is working
aiRouter.get('/test', (req, res) => {
  res.status(200).json({ message: "AI router is working!" });
});

// Add this to aiRouter.js for testing
aiRouter.get('/test-route', (req, res) => {
  console.log("✅ AI router test route hit!");
  res.json({ message: "AI router is working!" });
});
// Add this to your aiRouter
// aiRouter.get('/test-openai', protect, async (req, res) => {
//     try {
//         console.log("=== TESTING OPENAI ===");
        
//         // Check environment variables
//         const envVars = {
//             OPENAI_MODEL: process.env.OPENAI_MODEL,
//             OPENAI_API_KEY_SET: !!process.env.OPENAI_API_KEY,
//             JWT_SECRET_SET: !!process.env.JWT_SECRET,
//         };
//         console.log("Environment variables:", envVars);
        
//         // Test a simple OpenAI call
//         const testResponse = await ai.chat.completions.create({
//             model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
//             messages: [{ 
//                 role: "user", 
//                 content: "Say hello in one word" 
//             }],
//             max_tokens: 10,
//         });
        
//         res.status(200).json({ 
//             success: true,
//             envVars,
//             openaiResponse: testResponse.choices[0].message.content,
//             model: testResponse.model
//         });
        
//     } catch (error) {
//         console.error("Test OpenAI error:", error);
//         res.status(500).json({ 
//             success: false, 
//             error: error.message,
//             code: error.code,
//             type: error.type
//         });
//     }
// });

// Add this to your routes
// aiRouter.post('/test', (req, res) => {
//   console.log("Test route called");
//   res.status(200).json({ message: "Backend is working!" });
// });

export default aiRouter