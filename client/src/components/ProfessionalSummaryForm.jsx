import { Loader2, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import axios from 'axios'

const ProfessionalSummaryForm = ({data,onChange,setResuemData}) => {

const {token} = useSelector(state =>state.auth)
const [isGenerating,setIsGenerating] = useState(false)

// In ProfessionalSummaryForm.jsx - temporary local enhancement
const generateSummary = async () => {
  try {
    setIsGenerating(true);
    
    // Enhanced local mock based on input
    const enhanceLocally = (input) => {
      const lower = input.toLowerCase();
      
      const templates = {
        'web developer': `Experienced Web Developer specializing in modern frontend frameworks (React, Vue.js) and backend technologies (Node.js, Express). Skilled in creating responsive, user-friendly applications with clean code and best practices.`,
        
        'software engineer': `Software Engineer with expertise in full-stack development, system design, and cloud technologies. Proven ability to deliver scalable solutions and optimize performance across diverse tech stacks.`,
        
        'full stack': `Full Stack Developer proficient in both frontend and backend technologies. Experienced in building end-to-end web applications with modern frameworks and deploying to cloud platforms.`,
        
        'java developer': `Java Developer with strong experience in Spring Boot, microservices architecture, and enterprise application development. Skilled in building robust, scalable solutions for complex business requirements.`,
        
        'data scientist': `Data Scientist with expertise in machine learning, statistical analysis, and data visualization. Experienced in extracting insights from large datasets and building predictive models.`,
      };
      
      // Find matching template
      for (const [key, value] of Object.entries(templates)) {
        if (lower.includes(key)) {
          return value;
        }
      }
      
      // Default template
      return `Professional ${input} with comprehensive skills and industry expertise. Committed to delivering high-quality solutions, driving innovation, and achieving measurable results through technical excellence and collaborative problem-solving.`;
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const enhancedContent = enhanceLocally(data);
    
    setResuemData(prev => ({
      ...prev, 
      professional_summary: enhancedContent
    }));
    
    toast.success("Summary enhanced!");
    
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to enhance summary");
  } finally {
    setIsGenerating(false);
  }
};
// const generateSummary = async () => {
//   try {
//     setIsGenerating(true);
    
//     if (!data || data.trim() === '') {
//       toast.error("Please enter a professional summary to enhance");
//       return;
//     }
    
//     const prompt = `enhance my professional summary "${data}"`;
//     console.log("Sending request with prompt:", prompt);
    
//     const response = await api.post('/api/ai/enhance-pro-sum',
//       { userContent: prompt },
//       { headers: { Authorization: token } }
//     );
    
//     console.log("Response received:", response);
//     console.log("Response data:", response.data);
//     console.log("Enhanced content:", response.data.enhancedContent);
    
//     // Make sure the data exists
//     if (response.data && response.data.enhancedContent) {
//       setResuemData(prev => ({
//         ...prev,
//         professional_Summary: response.data.enhancedContent
//       }));
//       toast.success("Summary enhanced successfully!");
//     } else {
//       toast.error("No enhanced content received");
//     }
    
//   } catch (error) {
//     console.error("Full error object:", error);
//     console.error("Error response:", error.response);
//     console.error("Error message:", error.message);
    
//     // Show more specific error
//     if (error.response) {
//       toast.error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
//     } else if (error.request) {
//       toast.error("No response from server. Check your connection.");
//     } else {
//       toast.error(error.message || "Something went wrong");
//     }
//   } finally {
//     setIsGenerating(false);
//   }
// };

  return (
    <div className='space-y-4'>
        <div className='flex items-center justify-between'>
           <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
            <p className='text-sm text-gray-500'>Add summary for your resume here</p>
           </div>
           <button disabled={isGenerating} onClick={generateSummary} className='flex items-center justify-between gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200
           teansition-colors disabled:opacity-50'> {isGenerating ? (<Loader2 className='size-4 animate-spin'/>):(
            <Sparkles className='size-4'/> )}
            {isGenerating ? "Enhancing..." : "AI Enhance"} 
           </button>
        </div>

        <div className='mt-6'>
           <textarea value={data || ""} onChange={(e)=>onChange(e.target.value)} rows={7} className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring
           focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none' 
           placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'/>
           <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>Tip: Keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.</p>
        </div>
    </div>
  )
}

export default ProfessionalSummaryForm