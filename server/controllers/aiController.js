//controller fro enhancing a resume's professional summary
// POST: /api/ai/enhance-pro-sum

import Resume from "../modles/Resume.js";
import ai from '../configs/ai.js'
let pdfParse;
try {
    // Dynamically import the CommonJS module
    const pdfModule = await import('pdf-parse');
    // pdf-parse exports as default in newer versions
    pdfParse = pdfModule.default || pdfModule;
} catch (importError) {
    console.error('Failed to import pdf-parse:', importError);
    pdfParse = null;
}





// export const enhanceProfessionalSummary = async (req, res) => {
//   console.log("🔵 AI request received - Using REAL OpenAI");
  
//   try {
//     const { userContent } = req.body;
    
//     console.log("User content:", userContent);
    
//     if (!userContent || userContent.trim() === '') {
//       return res.status(400).json({ message: "Please provide a summary" });
//     }
    
//     // Check if OpenAI is configured
//     if (!ai) {
//       console.error("OpenAI client not initialized");
//       return res.status(500).json({ message: "AI service not configured" });
//     }
    
//     console.log("Calling OpenAI API...");
    
//     // REAL OPENAI CALL
//     const response = await ai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { 
//           role: "system", 
//           content: `You are an expert resume writer. Enhance the professional summary provided by the user.
          
//           Requirements:
//           1. Make it 2-3 sentences maximum
//           2. Make it ATS-friendly (use industry keywords)
//           3. Highlight skills, experience, and achievements
//           4. Keep it professional and compelling
//           5. Return ONLY the enhanced text, no explanations
          
//           Example input: "I am a Java developer"
//           Example output: "Experienced Java Developer with 5+ years of expertise in building scalable enterprise applications using Spring Boot and microservices architecture. Proficient in cloud technologies and agile methodologies, with a proven track record of delivering high-performance solutions that drive business growth."`
//         },
//         { 
//           role: "user", 
//           content: `Enhance this professional summary: "${userContent}"` 
//         }
//       ],
//       max_tokens: 200,
//       temperature: 0.7,
//     });
    
//     const enhancedContent = response.choices[0].message.content.trim();
    
//     console.log("✅ OpenAI Response received:", enhancedContent);
//     return res.status(200).json({ enhancedContent });
    
//   } catch (error) {
//     console.error("❌ OpenAI Error:", error.message);
//     console.error("Error details:", error);
    
//     // Fallback to mock response if OpenAI fails
//     const mockResponse = `Experienced professional with expertise in ${req.body.userContent || 'relevant field'}. Skilled in delivering high-quality solutions and achieving business objectives through innovative approaches and best practices.`;
    
//     return res.status(200).json({ 
//       enhancedContent: mockResponse,
//       note: "Using fallback response due to OpenAI error"
//     });
//   }
// };


// export const enhanceProfessionalSummary = async (req, res) => {
//     console.log("=== ENHANCE PROFESSIONAL SUMMARY CALLED ===");
//     console.log("Request body:", JSON.stringify(req.body, null, 2));
//     console.log("User ID from token:", req.userId);
    
//     try {
//         const { userContent } = req.body;
//         console.log("User Content received:", userContent);

//         if (!userContent || userContent.trim() === '') {
//             console.log("ERROR: userContent is empty");
//             return res.status(400).json({ message: "Missing or empty userContent field" });
//         }

//         // Check OpenAI configuration
//         console.log("Checking OpenAI configuration...");
//         console.log("OPENAI_MODEL env variable:", process.env.OPENAI_MODEL);
//         console.log("OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
//         console.log("AI object exists:", !!ai);
        
//         if (!process.env.OPENAI_API_KEY) {
//             console.error("ERROR: OPENAI_API_KEY is not set in environment variables");
//             return res.status(500).json({ message: "OpenAI API key not configured" });
//         }

//         if (!process.env.OPENAI_MODEL) {
//             console.error("ERROR: OPENAI_MODEL is not set");
//             return res.status(500).json({ message: "OpenAI model not configured" });
//         }

//         console.log("Making OpenAI API call...");
//         console.log("Model:", process.env.OPENAI_MODEL);
//         console.log("Prompt length:", userContent.length);
        
//         const response = await ai.chat.completions.create({
//             model: process.env.OPENAI_MODEL,
//             messages: [
//                 { 
//                     role: "system", 
//                     content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return text, no additional explanations." 
//                 },
//                 {
//                     role: "user",
//                     content: userContent,
//                 },
//             ],
//             max_tokens: 150,
//             temperature: 0.7,
//         });

//         console.log("OpenAI response received successfully");
//         console.log("Response choices:", response.choices.length);
        
//         const enhancedContent = response.choices[0].message.content;
//         console.log("Enhanced content:", enhancedContent);
        
//         return res.status(200).json({ enhancedContent });
        
//     } catch (error) {
//         console.error("=== ERROR DETAILS ===");
//         console.error("Error name:", error.name);
//         console.error("Error message:", error.message);
//         console.error("Error code:", error.code);
//         console.error("Error type:", error.type);
//         console.error("Full error:", JSON.stringify(error, null, 2));
        
//         // Common OpenAI errors
//         if (error.code === 'invalid_api_key') {
//             return res.status(401).json({ message: "Invalid OpenAI API key" });
//         }
//         if (error.code === 'insufficient_quota') {
//             return res.status(402).json({ message: "OpenAI API quota exceeded" });
//         }
//         if (error.code === 'model_not_found') {
//             return res.status(400).json({ message: `Model ${process.env.OPENAI_MODEL} not found` });
//         }
        
//         return res.status(500).json({ 
//             message: "Internal server error",
//             error: error.message 
//         });
//     }
// };

export const enhanceProfessionalSummary = async(req,res) =>{            
    try {
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message:"Missing required fields"});
        }

        // Try OpenAI first
        try {
            const response = await ai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: "Enhance this professional summary to be 2 sentences, ATS-friendly, highlighting skills and experience. Return only the enhanced text." 
                    },
                    { role: "user", content: userContent },
                ],
                max_tokens: 150,
                temperature: 0.7,
            });

            const enhancedContent = response.choices[0].message.content;
            return res.status(200).json({enhancedContent});
            
        } catch (openaiError) {
            console.log("OpenAI failed, using fallback:", openaiError.message);
            
            // Smart fallback based on input
            const smartFallback = (input) => {
                const lower = input.toLowerCase();
                
                if (lower.includes('web') && lower.includes('developer')) {
                    return "Experienced Web Developer with expertise in modern JavaScript frameworks (React, Vue.js) and backend technologies (Node.js, Python). Skilled in creating responsive, user-centric applications and collaborating in agile teams to deliver high-quality solutions.";
                }
                
                if (lower.includes('software') || lower.includes('engineer')) {
                    return "Software Engineer with strong foundation in full-stack development and system design. Proficient in multiple programming languages and frameworks, with experience in delivering scalable solutions and optimizing application performance.";
                }
                
                return `Experienced ${input} professional with comprehensive skills and expertise. Proven ability to deliver results, solve complex problems, and contribute to organizational success through technical excellence.`;
            };
            
            return res.status(200).json({
                enhancedContent: smartFallback(userContent),
                note: "Enhanced with smart fallback"
            });
        }
        
    } catch (error) {
        console.error("Controller error:", error);
        return res.status(200).json({
            enhancedContent: `Professional ${req.body?.userContent || 'individual'} with relevant skills and experience.`,
            error: error.message
        });
    }
}

//controller fro enhancing a resume's job description
// POST : /api/ai/enhance-job-desc

export const enhanceJobDescription = async(req,res) =>{
    console.log("🤖 ===== ENHANCE JOB DESCRIPTION =====");
    console.log("📝 User content:", req.body.userContent);
    
    try {
        const {userContent} = req.body;

        if(!userContent){
            console.log("❌ No userContent provided");
            return res.status(400).json({message:"Missing required fields"});
        }

        // Check OpenAI config
        console.log("🔧 OpenAI config check...");
        console.log("- OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY);
        console.log("- OPENAI_MODEL:", process.env.OPENAI_MODEL || "Not set");
        
        // If OpenAI not configured, return mock response
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-dummy')) {
            console.log("⚠️ Using mock response (OpenAI not configured)");
            const mockResponse = `As a professional in this role, responsible for key duties including strategic planning, team collaboration, and delivering high-quality results. Demonstrated expertise in relevant areas with a track record of success.`;
            
            return res.status(200).json({
                enhancedContent: mockResponse,
                note: "Mock response - configure OpenAI for AI enhancement"
            });
        }

        console.log("🚀 Calling OpenAI API for job description...");
        
        // REAL OpenAI call
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
            messages: [
                { 
                    role: "system", 
                    content: `You are an expert resume writer. Enhance this job description to be professional and ATS-friendly.
                    
                    Requirements:
                    1. Use action verbs and quantifiable results where possible
                    2. Highlight responsibilities and achievements
                    3. Make it 2-3 bullet points or 1-2 concise sentences
                    4. Return ONLY the enhanced text, no explanations
                    
                    Example input: "I was a software developer"
                    Example output: "• Developed and maintained scalable software applications using modern frameworks
                    • Collaborated with cross-functional teams to deliver features on schedule
                    • Improved application performance by 30% through code optimization"`
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
            max_tokens: 200,
            temperature: 0.7,
        });

        console.log("✅ OpenAI response received");
        const enhancedContent = response.choices[0].message.content;
        
        return res.status(200).json({enhancedContent});
        
    } catch (error) {
        console.error("❌ OpenAI Error:", error.message);
        
        // Fallback mock response
        const fallbackResponse = `• Executed key responsibilities and contributed to team objectives
• Applied expertise to deliver measurable results and drive success
• Collaborated with stakeholders to achieve business goals`;
        
        return res.status(200).json({ 
            enhancedContent: fallbackResponse,
            note: "Using fallback due to error: " + error.message
        });
    }
}

//controller for uploading a resume to the database
//POST : /api/ai/upload-resume

// export const uploadResume = async(req,res) =>{
//     try {
       
//         const {resumeText,title} = req.body;
//         const userId = req.userId;

//         if(!resumeText){
//             return res.status(400).json({message:"Missing required fields"})
//         }

//         const systemPrompt = "You are an expert AI Agent to extract data from resume."

//         const userPrompt = `exteact data from this resume:${resumeText}
//         Provide data in the following JSON format with no additional text before or after:
//         {
//         professional_summary : {type:String,default:''},
//     skills : [{type:String}],
//     personal_info : {
//         image : {type:String,default:''},
//         full_name : {type:String,default:''},
//         profession : {type:String,default:''},
//         email : {type:String,default:''},
//         phone : {type:String,default:''},
//         location : {type:String,default:''},
//         linkedin : {type:String,default:''},
//         website : {type:String,default:''},
//     },
//     experience : [{
//         company : {type:String},
//         position : {type:String},
//         start_date : {type:String},
//         end_date : {type:String},
//         description : {type:String},
//         is_current : {type:Boolean},
//     }],
//     project: [{
//         name : {type:String},
//         type : {type:String},
//         description : {type:String},
//     }],
//     education: [{
//         institution : {type:String},
//         degree : {type:String},
//         field : {type:String},
//         graduation_date : {type:String},
//         gpa : {type:String},
//     }],
//         }`

//    const response =  await ai.chat.completions.create({
//              model: process.env.OPENAI_MODEL,
//     messages: [
//         { role: "system", content: systemPrompt},
//         {
//             role: "user",
//             content:userPrompt,
//         },
//     ],
//     response_format : {type:'json_object'}
//         })

//         const extractedData = response.choices[0].message.content;
//         const parsedData = JSON.parse(extractedData)
//         const newResume = await Resume.create({userId,title,...parsedData})
        
//         res.json({resumeId:newResume._id})
//     } catch (error) {
//         return res.status(400).json({message:error.message})
//     }

    
// }  own 

 // Install this: npm install pdf-parse



export const uploadResume = async (req, res) => {
    try {
        const { title, resumeText } = req.body;
        const userId = req.userId;

        if (!resumeText || resumeText.trim() === '') {
            return res.status(400).json({ message: "Please paste resume text" });
        }

        // Call OpenAI to extract structured data
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { 
                    role: "system", 
                    content: "Extract resume data from text and return JSON" 
                },
                { 
                    role: "user", 
                    content: `Extract from: ${resumeText.substring(0, 3000)}` 
                }
            ],
            response_format: { type: 'json_object' }
        });

        const extractedData = JSON.parse(response.choices[0].message.content);
        const newResume = await Resume.create({
            userId, 
            title, 
            ...extractedData
        });
        
        res.json({ resumeId: newResume._id });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(400).json({ message: error.message });
    }
};

// Add this debug test route
// In aiController.js, add this test function
export const testPdfExtraction = async (req, res) => {
    try {
        console.log('🧪 Testing PDF extraction...');
        
        if (!req.file) {
            return res.status(400).json({ message: "No PDF file uploaded" });
        }
        
        console.log('File received:', {
            name: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype
        });
        
        // Try to parse PDF
        const pdfBuffer = req.file.buffer;
        console.log('Buffer length:', pdfBuffer.length);
        
        try {
            const pdfData = await pdfParse(pdfBuffer);
            console.log('✅ PDF Parse successful!');
            console.log('Text extracted:', pdfData.text.length, 'characters');
            console.log('First 200 chars:', pdfData.text.substring(0, 200));
            
            return res.json({
                success: true,
                textLength: pdfData.text.length,
                preview: pdfData.text.substring(0, 500),
                info: pdfData.info
            });
            
        } catch (parseError) {
            console.error('❌ PDF Parse error:', parseError.message);
            return res.status(400).json({
                success: false,
                error: parseError.message,
                message: "PDF parsing failed"
            });
        }
        
    } catch (error) {
        console.error('Test error:', error);
        return res.status(500).json({ error: error.message });
    }
};