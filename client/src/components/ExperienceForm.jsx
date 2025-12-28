import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import api from '../configs/api'
import {toast} from 'react-hot-toast'
import { useSelector } from 'react-redux'

const ExperienceForm = ({data,onChange}) => {

const {token} = useSelector(state => state.auth)
const [generatingIndex,setGeneratingIndex] = useState(-1)



const addExperience = ()=>{
    const newExperience = {
        company:'',
        position:'',
        start_date:'',
        end_date:'',
        description:'',
        is_current:false
    };
    onChange([...data,newExperience])
}

const removeExperience = (index) =>{
    const updated = data.filter((_,i)=> i !== index);
    onChange(updated)
}

const updateExperience = (index,field,value) =>{
    const updated = [...data];
    updated[index] = {...updated[index],[field]:value}
    onChange(updated)
}

// const generateDescription = async (index) =>{
//   setGeneratingIndex(index)
//   const experience = `enhance the jod description ${experience.description} for the position of ${experience.position} at ${experience.company}`

//   try {
//     const {data} = await api.post('api/ai/enhance-job-desc',{userContent:prompt},{headers:{Authorization:token}})
//     updateExperience(index,"description",data.enhancedContent)
//   } catch (error) {
//     toast.error(error.message)
//   }
//   finally{
//     setGeneratingIndex(-1)
//   }
//  }

// const generateDescription = async (index) => {
//   try {
//     setGeneratingIndex(index);
    
//     const currentExperience = data[index];
    
//     // Validate input
//     if (!currentExperience.position?.trim() || !currentExperience.company?.trim()) {
//       toast.error("Please enter job title and company name first");
//       return;
//     }
    
//     // Build a better prompt
//     let prompt = `Enhance this job description for a ${currentExperience.position} role at ${currentExperience.company}`;
    
//     if (currentExperience.description?.trim()) {
//       prompt += `:\n\n${currentExperience.description}`;
//     } else {
//       prompt += `. Include key responsibilities, achievements, and skills required for this position.`;
//     }
    
//     console.log("Sending prompt:", prompt);
    
//     const response = await api.post(
//       '/api/ai/enhance-job-desc',
//       { userContent: prompt },
//       { 
//         headers: { 
//           Authorization: token,
//           'Content-Type': 'application/json'
//         } 
//       }
//     );
    
//     console.log("Response received:", response.data);
    
//     if (response.data.enhancedContent) {
//       updateExperience(index, "description", response.data.enhancedContent);
//       toast.success("Job description enhanced!");
//     } else {
//       toast.error("No enhanced content received");
//     }
    
//   } catch (error) {
//     console.error("Full error:", error.response?.data || error.message);
    
//     // Fallback mock enhancement
//     const fallbackDesc = `As a ${data[index].position} at ${data[index].company}, responsible for key duties and deliverables. Demonstrated expertise in relevant areas and contributed to team success through effective collaboration and technical proficiency.`;
    
//     updateExperience(index, "description", fallbackDesc);
//     toast.success("Enhanced with fallback template");
    
//   } finally {
//     setGeneratingIndex(-1);
//   }
// };

const generateDescription = async (index) => {
  try {
    setGeneratingIndex(index);
    
    const currentExperience = data[index];
    
    // Validate
    if (!currentExperience.position?.trim()) {
      toast.error("Please enter job title first");
      return;
    }
    
    // For now, use local mock - remove this after backend is fixed
    console.log("Using local mock enhancement");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Local enhancement logic
    const mockEnhancements = {
      'software developer': `• Developed and maintained scalable software applications using modern frameworks like React and Node.js
• Collaborated with cross-functional teams to deliver features on schedule
• Improved application performance through code optimization and best practices`,
      
      'web developer': `• Built responsive web applications using HTML, CSS, JavaScript and modern frameworks
• Implemented user-friendly interfaces and optimized for performance across devices
• Worked with backend teams to integrate APIs and ensure seamless functionality`,
      
      'manager': `• Led team of professionals to achieve project objectives and meet deadlines
• Developed strategic plans and coordinated resources for optimal results
• Fostered collaborative environment and mentored team members for growth`,
    };
    
    let enhancedDesc = '';
    const lowerPosition = currentExperience.position.toLowerCase();
    
    // Find matching enhancement
    for (const [key, value] of Object.entries(mockEnhancements)) {
      if (lowerPosition.includes(key)) {
        enhancedDesc = value;
        break;
      }
    }
    
    // Default enhancement
    if (!enhancedDesc) {
      enhancedDesc = `• Executed key responsibilities as ${currentExperience.position} at ${currentExperience.company || 'the organization'}
• Applied expertise to achieve objectives and deliver quality results
• Collaborated effectively with team members and stakeholders`;
    }
    
    updateExperience(index, "description", enhancedDesc);
    toast.success("Job description enhanced!");
    
  } catch (error) {
    console.error("Error:", error);
    toast.error("Failed to enhance description");
  } finally {
    setGeneratingIndex(-1);
  }
};

  return (
    <div className='space-y-6'>
       <div className='flex items-center justify-between'>
           <div>
            <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Experience</h3>
            <p className='text-sm text-gray-500'>Add your job experience</p>
           </div>
           <button onClick={addExperience} className='flex items-center justify-between gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200
           teansition-colors disabled:opacity-50'>
            <Plus className='size-4'/> Add Experience
           </button>
        </div>

       {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
         <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300'/>
         <p>No work experience added yet.</p>
         <p className='text-sm'>Click "Add Experience" to get started.</p>
        </div>
       ):(
        <div className='space-y-4'>
            {data.map((experience,index)=>(
               <div key={index} className='p-4 border border-gray-200 rounded-lg space-y-3'>
                 <div className='flex justify-between items-start'>
                   <h4>Experience #{index + 1}</h4>
                   <button onClick={()=>removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                    <Trash2 className='size-4'/>
                   </button>
                 </div>

                 <div className='grid md:grid-cols-2 gap-3'>

                   <input value={experience.company || ""} 
                    onChange={(e)=>updateExperience(index,"company",e.target.value)} 
                    type="text" placeholder='Company Name'
                   className='px-3 py-2 text-sm rounded-lg'/>

                    <input value={experience.position || ""} 
                    onChange={(e)=>updateExperience(index,"position",e.target.value)} 
                    type="text" placeholder='Job Title'
                   className='px-3 py-2 text-sm rounded-lg'/>

                   <input value={experience.start_date || ""} 
                    onChange={(e)=>updateExperience(index,"start_date",e.target.value)} 
                    type="month"
                   className='px-3 py-2 text-sm rounded-lg cursor-pointer'/>

                    <input value={experience.end_date || ""} 
                    onChange={(e)=>updateExperience(index,"end_date",e.target.value)} 
                    type="month" disabled={experience.is_current}
                   className='px-3 py-2 text-sm rounded-lg disabled:bg-gray-100 cursor-pointer'/>
                 </div>

                 <label className='flex items-center gap-2'>
                    <input type="checkbox" checked={experience.is_current || false}
                     onChange={(e)=>{updateExperience(index,"is_current",e.target.checked ? true:false)}} 
                     className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'/>
                     <span className='text-sm text-gray-700'>Currently working here</span>
                 </label>

                 <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <label className='text-sm font-medium text-gray-700' htmlFor="">Job Description</label>
                        <button onClick={()=>generateDescription(index)} disabled={generatingIndex === index || !experience.position || !experience.company} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700
                        rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                          {generatingIndex === index ?
                           (<Loader2 className='w-3 h-3 animate-apin'/>)
                          :(
                             <Sparkles className='w-3 h-3'/>
                          )}
                          Enhance with AI
                        </button>
                    </div>
                    <textarea rows={4} value={experience.description || ""}
                    onChange={(e)=>updateExperience(index,"description",e.target.value)}
                    className='w-full text-sm px-3 py-2 rounded-lg resize-none'
                    placeholder='Describe your key responsibilities and achievements...'/>
                 </div>

               </div>
            ))}
        </div>
       )}

    </div>
  )
}

export default ExperienceForm