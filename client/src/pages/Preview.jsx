// import React, { useEffect, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import { dummyResumeData } from '../assets/assets'
// import ResumePreview from '../components/ResumePreview'
// import Loader from '../components/Loader'
// import { ArrowLeftIcon } from 'lucide-react'
// import api from '../configs/api'

// const Preview = () => {

// const {resumeId} = useParams()
// const [isLoading,setIsLoading] = useState(true)

// const [resumeData,setResumeData] = useState(null)

// // Preview.jsx - Remove the polling code
// const loadResume = async ()=>{
//   try {
//     const {data} = await api.get('/api/resumes/public/'+resumeId)
//     setResumeData(data.resume)
//   } catch (error) {
//     console.log(error.message);
//   }
//   finally{
//     setIsLoading(false)
//   }
// }

// useEffect(()=>{
//   loadResume()
// },[]) // Only load once when component mounts



// // In Preview.jsx
// const [lastUpdated, setLastUpdated] = useState(null);

// useEffect(() => {
//   loadResume();
  
//   // Poll for updates every 10 seconds
//   const interval = setInterval(() => {
//     checkForUpdates();
//   }, 10000);
  
//   return () => clearInterval(interval);
// }, []);

// const checkForUpdates = async () => {
//   try {
//     const { data } = await api.get(`/api/resumes/public/${resumeId}/check`);
    
//     if (data.lastUpdated !== lastUpdated) {
//       console.log('New update available, reloading...');
//       loadResume();
//       setLastUpdated(data.lastUpdated);
//     }
//   } catch (error) {
//     console.log('Update check failed:', error.message);
//   }
// };

//   return resumeData ? (
//     <div className='bg-slate-100'>
//         <div className='max-w-3xl mx-auto py-10'>
//           <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_Color}
//           classes='py-4 bg-white'/>
//         </div>
//     </div>
//   ) :(
//      <div>
//       {isLoading ? <Loader/> : (
//         <div className='flex flex-col items-center justify-center h-screen'>
//           <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
//           <a href="/" className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1
//           ring-1 ring-green-400 flex items-center transition-colors'>
//             <ArrowLeftIcon className='mr-2 size-4'/>go to home page
//           </a>
//         </div>
//       )}
//      </div>
//   )
// }

// export default Preview

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeftIcon } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {
  const { resumeId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

const loadResume = async () => {
  try {
    // Use full URL to be sure
    const url = `http://localhost:3000/api/view/${resumeId}`;
    console.log('🔗 Fetching from:', url);
    
    const response = await fetch(url, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('📊 Response:', {
      status: response.status,
      ok: response.ok,
      type: response.type
    });
    
    // Get response as text first to debug
    const text = await response.text();
    console.log('📄 First 100 chars:', text.substring(0, 100));
    
    // Then parse as JSON
    const data = JSON.parse(text);
    console.log('✅ Parsed data:', data);
    
    if (data.resume) {
      setResumeData(data.resume);
    }
    
  } catch (error) {
    console.log('💥 Full error:', error);
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
  // Test the fetch directly
  const testFetch = async () => {
    const testId = '694d53302ca1a68e30894e97';
    const url = `http://localhost:3000/api/view/${testId}`;
    console.log('🧪 Testing fetch to:', url);
    
    try {
      const response = await fetch(url);
      const text = await response.text();
      console.log('🧪 Response:', text.substring(0, 200));
    } catch (err) {
      console.log('🧪 Error:', err);
    }
  };
  
  testFetch();
  loadResume();
}, [resumeId]);

  const PrintStyles = () => (
  <style>
    {`
      @media print {
        @page {
          margin: 0.5in;
        }
        
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        /* Force all backgrounds to print */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Hide unnecessary elements */
        .no-print,
        button,
        nav,
        footer,
        .share-buttons {
          display: none !important;
        }
        
        /* Ensure resume container is full width */
        .resume-container {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        /* Force gradient backgrounds to render as solid colors */
        .bg-gradient-to-r {
          background: linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to)) !important;
          -webkit-print-color-adjust: exact !important;
        }
        
        /* Add this for Tailwind gradient classes */
        [class*="from-"],
        [class*="to-"],
        [class*="via-"] {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `}
  </style>
);

  return resumeData ? (
    <div className='bg-slate-100'>
         <PrintStyles />
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview 
          data={resumeData} 
          template={resumeData.template} 
          accentColor={resumeData.accent_color} // Fixed: lowercase "c"
          classes='py-4 bg-white'
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader/> : (
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
          <a href="/" className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1
          ring-1 ring-green-400 flex items-center transition-colors'>
            <ArrowLeftIcon className='mr-2 size-4'/>go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview