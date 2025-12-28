import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, Download, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkle, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview.jsx'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api.js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { debounce } from 'lodash';

//  const navigate = useNavigate(); 
const ResumeBuilder = () => {

    // Get resumeId from URL if using React Router
  const { id } = useParams();
  
  // State declarations - MAKE SURE resumeId IS SET PROPERLY
  const [resumeId, setResumeId] = useState(id || ''); // This might be empty!

   // Create new resume
  // const createNewResume = async () => {
  //   try {
  //     const { data } = await api.post('/api/resumes/create', {
  //       title: 'My Resume',
  //       template: 'classic'
  //     }, {
  //       headers: { Authorization: token }
  //     });
      
  //     setResumeId(data.resume._id);
  //     setResumeData(data.resume);
  //     document.title = data.resume.title;
  //     toast.success('New resume created!');
  //   } catch (error) {
  //     console.error('Error creating resume:', error);
  //     toast.error('Failed to create resume');
  //   }
  // };

   // Modified createNewResume
 const createNewResume = async () => {
  try {
    const { data } = await api.post('/api/resumes/create', {
      title: 'My Resume',
      template: 'classic'
    }, {
      headers: { Authorization: token }
    });
    
    // FIX: Update resumeId state with the new ID
    setResumeId(data.resume._id);
    
    // Update the resume data
    setResumeData(data.resume);
    document.title = data.resume.title;
    
    toast.success('New resume created!');
  } catch (error) {
    console.error('Error creating resume:', error);
    toast.error('Failed to create resume');
  }
};

// Add this near your other useEffects
useEffect(() => {
  if (resumeId && resumeData._id) {
    // Auto-save when accent_color or template changes
    const autoSave = debounce(async () => {
      try {
        console.log('🔄 Auto-saving...');
        await saveResume();
        toast.success('Auto-saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 1000); // 1 second delay

    autoSave();
    
    // Cleanup
    return () => {
      autoSave.cancel();
    };
  }
}, []); // Watch for changes


  // Add this function before the useEffect
const fetchOrCreateResume = async () => {
  try {
    if (!token) {
      console.log('No token available');
      return;
    }
    
    const { data } = await api.get('/api/resumes', {
      headers: { Authorization: token }
    });
    
    if (data.resumes && data.resumes.length > 0) {
      // Load the first resume
      await loadExistingResume(data.resumes[0]._id);
    } else {
      // Create a new one
      await createNewResume();
    }
  } catch (error) {
    console.error('Error in fetchOrCreateResume:', error);
    toast.error('Failed to fetch or create resume');
  }
};

  // Rest of your component...
  
  // Fetch resume data on component mount
  // useEffect(() => {
  //   const fetchResumeData = async () => {
  //     try {
  //       // If you have an existing resume, fetch it
  //       const { data } = await api.get('/api/resumes');
  //       if (data.resumes && data.resumes.length > 0) {
  //         setResumeId(data.resumes[0]._id); // Set the first resume's ID
  //         setResumeData(data.resumes[0]);
  //       } else {
  //         // Create a new resume if none exists
  //         const { data: newResume } = await api.post('/api/resumes/create', {
  //           template: 'template1'
  //         }, {
  //           headers: { Authorization: token }
  //         });
  //         setResumeId(newResume.resume._id);
  //         setResumeData(newResume.resume);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching resume:', error);
  //     }
  //   };
    
  //   fetchResumeData();
  // }, []);      
               //ai
    // Single useEffect to handle resume loading
// Single useEffect to handle resume loading
useEffect(() => {
  const loadResume = async () => {
    try {
      // If we have an ID from URL, load that resume
      if (id) {
        await loadExistingResume(id);
      } 
      // Otherwise, check if user has any resumes
      else if (token) {
        await fetchOrCreateResume(); // This function was missing
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast.error('Failed to load resume');
    }
  };

  if (token) {
    loadResume();
  }
}, []); // Add token as dependency // Add dependencies


  // OR if you're getting resumeId from URL
  useEffect(() => {
    if (id) {
      setResumeId(id);
    }
  }, [id]);

 // const {resumeId} = useParams()
  const {token} = useSelector(state => state.auth)

const [resumeData,setResumeData] = useState({
  _id:'',
  title:'',
  personal_info:{},
  professional_summary:'',
  experience:[],
  education:[],
  project:[],
  skills:[],
  template:'classic',
  accent_color:'#3B82F6',
  public:false
})

// const loadExistingResume = async (resumeIdToLoad) => {
//     try {
//       // Fix the endpoint - you need "/get/" before the ID
//       const { data } = await api.get(`/api/resumes/get/${resumeIdToLoad}`, {
//         headers: { Authorization: token }
//       });
      
//       if (data.resume) {
//         setResumeData(data.resume);
//         setResumeId(resumeIdToLoad);
//         document.title = data.resume.title;
//         console.log('Resume loaded successfully:', data.resume);
//       }
//     } catch (error) {
//       console.error('Error loading resume:', error.response?.data || error.message);
      
//       // If 404, create a new resume
//       if (error.response?.status === 404) {
//         toast.error('Resume not found, creating new one...');
//         await createNewResume();
//       }
//     }
//   };

// In ResumeBuilder.jsx - line 40
// Make sure you're using the correct endpoint

// const loadExistingResume = async () => {
//     try {
//         // CHANGE THIS LINE - Add "/get/" before ${resumeId}
//         const response = await api.get(`/api/resumes/get/${resumeId}`, {
//             headers: { Authorization: token }
//         });
//         console.log("Resume loaded:", response.data);
//         // Rest of your code...
//     } catch (error) {
//         console.error("Error loading resume:", error);
//     }
// };

  // Modified loadExistingResume to accept resumeId parameter
const loadExistingResume = async (resumeIdToLoad) => {
  try {
    console.log('📥 loadExistingResume called with:', resumeIdToLoad);
    
    if (!resumeIdToLoad || resumeIdToLoad === 'undefined') {
      console.error('❌ No resume ID provided to loadExistingResume');
      toast.error('No resume ID provided');
      return;
    }
    
    // ADD THIS - Make the API call
    const { data } = await api.get(`/api/resumes/get/${resumeIdToLoad}`, {
      headers: { Authorization: token }
    });
    
    if (data.resume) {
      setResumeData(data.resume);
      setResumeId(resumeIdToLoad);
      document.title = data.resume.title;
      console.log('✅ Resume loaded successfully:', data.resume);
    }
  } catch (error) {
    console.error('❌ Error loading resume:', error.response?.data || error.message);
    toast.error('Failed to load resume');
  }
};

// If you need to reload the current resume
const reloadCurrentResume = async () => {
  if (resumeId) {
    await loadExistingResume(resumeId);
  }
};

const[ activeSectionIndex,setActiveSectionIndex] = useState(0);
const [removeBackground,setRemoveBackground] = useState(false)

const sections = [
  {id:'personal',name:'Personal Info',icon:User},
  {id:'summary',name:'Summary',icon:FileText},
  {id:'experience',name:'Experience',icon:Briefcase},
  {id:'education',name:'Education',icon:GraduationCap},
  {id:'projects',name:'Projects',icon:FolderIcon},
  {id:'skills',name:'Skills',icon:Sparkles},
]

const activeSection = sections[activeSectionIndex]

useEffect(()=>{
 if (resumeId) {
  loadExistingResume(resumeId);
}
},[])

const changeResumeVisibility = async () => {
  try {
    console.log('🔄 Changing resume visibility...');
    
    // Don't include the image field at all
    const updatedResumeData = {
      ...resumeData,
      public: !resumeData.public
    };
    
    // Remove image from the data to avoid issues
    if (updatedResumeData.personal_info?.image && 
        typeof updatedResumeData.personal_info.image === 'object') {
      delete updatedResumeData.personal_info.image;
    }
    
    const formData = new FormData()
    formData.append('resumeId', resumeId)
    formData.append('resumeData', JSON.stringify(updatedResumeData))
    
    // DON'T append image here for visibility changes!
    
    console.log('📤 Sending update with resumeId:', resumeId);
    
    const { data } = await api.put('/api/resumes/update', formData, {
      headers: { 
        Authorization: token,
        'Content-Type': 'multipart/form-data'
      }
    })
    
    console.log('✅ Visibility changed successfully:', data);
    setResumeData(data.resume)
    toast.success(data.message || 'Visibility updated')
  } catch (error) {
    console.error('❌ Error changing visibility:', error);
    toast.error(error.response?.data?.message || 'Failed to update visibility')
  }
}

// 1. Auto-save on important changes
// useEffect(() => {
//   const saveChanges = debounce(async () => {
//     if (resumeId ) {
//       await saveResume();
//     }
//   }, 2000);
  
//   saveChanges();
  
//   return () => saveChanges.cancel();
// }, [resumeData.accent_color, resumeData.template, resumeData.personal_info]);

const handleShare = () => {
  const frontendUrl = window.location.origin;
  
  // Make sure this matches your frontend route
  const resumeUrl = `${frontendUrl}/view/${resumeId}`;
  
  console.log('🔗 Share URL:', resumeUrl);
  
  if (navigator.share) {
    navigator.share({ url: resumeUrl, text: 'My Resume' });
  } else {
    navigator.clipboard.writeText(resumeUrl);
    toast.success('Link copied to clipboard!');
  }
};

// 2. Update handleShare to always save first
// const handleShare = async () => {
//   try {
//     // Show saving indicator
//     toast.loading('Saving latest changes...');
    
//     // Save current state
//     await saveResume();
    
//     // Create share URL with timestamp
//     const timestamp = Date.now();
//     const frontendUrl = window.location.origin;
//     const shareUrl = `${frontendUrl}/view/${resumeId}?t=${timestamp}`;
    
//     toast.dismiss();
//     toast.success('Latest changes saved and ready to share!');
    
//     // Copy to clipboard
//     await navigator.clipboard.writeText(shareUrl);
    
//     // Optional: Open in new tab
//     // window.open(shareUrl, '_blank');
    
//   } catch (error) {
//     toast.error('Failed to save changes');
//   }
// };


const downloadResume = ()=>{
  window.print();
}

const saveResume = async ()=>{
  try {
    let updatedResumeData = structuredClone(resumeData)

    //remove image from updated resumedata
    if(typeof resumeData.personal_info.image === 'object'){
      delete updatedResumeData.personal_info.image
    }
    const formData = new FormData();
    formData.append('resumeId',resumeId);
    formData.append('resumeData',JSON.stringify(updatedResumeData))
    removeBackground && formData.append('removeBackground','yes')
    typeof resumeData.personal_info.image === 'object' && formData.append('image',resumeData.personal_info.image)

    const {data} = await api.put('/api/resumes/update',formData,{headers:{
      Authorization:token }})

      setResumeData(data.resume)
      toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume:",error)
  }
}
// const saveResume = async () => {
//   try {
//     console.log('💾 Save button clicked');
    
//     if (!resumeId || resumeId.trim() === '') {
//       toast.error('Please select a resume first');
//       return;
//     }

//     // Create updated data
//     let updatedResumeData = structuredClone(resumeData);

//     // Handle image - if it's a File object, it will be uploaded
//     // If it's already a URL string, keep it as is
//     const hasImageFile = updatedResumeData.personal_info?.image instanceof File;
    
//     // Remove image from JSON data (will be sent separately as file)
//     if (hasImageFile) {
//       delete updatedResumeData.personal_info.image;
//     }

//     const formData = new FormData();
//     formData.append('resumeId', resumeId);
//     formData.append('resumeData', JSON.stringify(updatedResumeData));
    
//     if (removeBackground) {
//       formData.append('removeBackground', 'yes');
//     }
    
//     // Add image file if it exists as File object
//     if (hasImageFile) {
//       formData.append('image', resumeData.personal_info.image);
//     }

//     console.log('📤 Sending request with resumeId:', resumeId);
    
//     const { data } = await api.put('/api/resumes/update', formData, {
//       headers: {
//         Authorization: token,
//         'Content-Type': 'multipart/form-data'
//       }
//     });

//     // Update state with response
//     setResumeData(data.resume);
//     toast.success(data.message || 'Saved successfully!');
    
//     return data.message;
    
//   } catch (error) {
//     console.error("❌ Error saving resume:", error.response?.data || error.message);
//     throw error;
//   }
// };
  // Rest of your component...



  return (
    <div>
       
       <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
        <ArrowLeftIcon className='size-4'/>Back to Dashboard
        </Link>
       </div>

       <div className='max-w-7xl mx-auto px-4 pb-8'>
         <div className='grid lg:grid-cols-12 gap-8'>
             {/*left pannel - form */}
             <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
               <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
                  {/*progress bar using activesectionindex */}
                  <hr className='absolute top-0 left-0 right-0 border-2 border-gary-200'/>
                  <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600
                  border-none transition-all duration-2000' 
                  style={{width:`${activeSectionIndex * 100 / (sections.length - 1 )}%`}}/>

                  {/*section navigation */}
                  <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>

                     <div className='flex  items-center gap-2'>
                      <TemplateSelector selectedTemplate={resumeData.template} 
                      onChange={(template)=>setResumeData(prev => ({...prev,template}))}/>
                      <ColorPicker selectedColor={resumeData.accent_color}
                       onChange={(color)=>setResumeData(prev =>({...prev,accent_color:color}))}/>
                     </div>

                     <div className='flex items-center'>
                      {activeSectionIndex !== 0 && (
                        <button onClick={()=> setActiveSectionIndex((prevIndex) =>Math.max(prevIndex - 1,0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-sm
                        font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                          <ChevronLeft className='size-4'/>Previous
                        </button>
                      )}
                       <button onClick={()=> setActiveSectionIndex((prevIndex) =>Math.min(prevIndex + 1,sections.length-1))}
                        className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all
                          ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`}
                       disabled={activeSectionIndex === sections.length-1}>
                        Next <ChevronRight className='size-4'/>
                        </button>
                     </div>
                  </div>

                {/*form content */}
                  <div className='space-y-6'>
                    {activeSection.id === 'personal' && (
                     <PersonalInfoForm data={resumeData.personal_info}
                      onChange={(data)=>setResumeData(prev =>({...prev,personal_info:data}))} removeBackground={removeBackground}
                      setRemoveBackground={setRemoveBackground}/>
                    )}
                    {
                      activeSection.id === 'summary' && (
                        <ProfessionalSummaryForm data={resumeData.professional_summary} 
                        onChange={(data)=>setResumeData(prev => ({...prev,professional_summary:data}))}
                         setResuemData={setResumeData}/>
                      )
                    }
                     
                     {
                      activeSection.id === 'experience' && (
                        <ExperienceForm data={resumeData.experience} 
                        onChange={(data)=>setResumeData(prev => ({...prev,experience:data}))}
                         />
                      )
                    }

                    {
                      activeSection.id === 'education' && (
                        <EducationForm data={resumeData.education} 
                        onChange={(data)=>setResumeData(prev => ({...prev,education:data}))}
                         />
                      )
                    }

                    {
                      activeSection.id === 'projects' && (
                        <ProjectForm data={resumeData.project} 
                        onChange={(data)=>setResumeData(prev => ({...prev,project:data}))}
                         />
                      )
                    }

                    {
                      activeSection.id === 'skills' && (
                        <SkillsForm data={resumeData.skills} 
                        onChange={(data)=>setResumeData(prev => ({...prev,skills:data}))}
                         />
                      )
                    }
                    
                  </div>
                  {/* <button onClick={()=>{toast.promise(saveResume,{loading:'Saving...'})}} className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600
                  ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                    Save Changes
                  </button> */}
<button 
  onClick={() => {
    toast.promise(
      saveResume, 
      {
        loading: 'Saving...',
        success: (message) => message,
        error: (err) => err.response?.data?.message || err.message || 'Failed to save resume'
      }
    );
  }}
  className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'
>
  Save Changes
</button>
               </div>
             </div>

             {/*right pannel - preview */}
             <div className='lg:col-span-7 max-lg:mt-6'>
               <div className='relative w-full'>
                  <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                    {resumeData.public && (
                      <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100
                      to-blue-100 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                        <Share2Icon className='size-4'/>Share
                      </button>
                    )}

                    <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200
                    text-purple-100 to-purple-200 text-purple-600 ring-purple rounded-lg hover:ring transition-colors'>
                      {resumeData.public ? <EyeIcon className='size-4'/> : <EyeOffIcon className='size-4'/>}
                      {resumeData.public ? 'Public' : 'Private'}
                    </button>
                    <button onClick={downloadResume} className='flex items-center gap-2  px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200
                    text-green-600  ring-green-300 rounded-lg hover:ring transition-colors'>
                      <Download className='size-4'/>Download
                    </button>
                  </div>
               </div>

               <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
             </div>
         </div>
       </div>
    </div>
  )
}







export default ResumeBuilder


