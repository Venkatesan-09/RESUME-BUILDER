import { User } from 'lucide-react';
import React from 'react'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import MinimalImageTemplate from './templates/MinimalImageTemplate'

const ResumePreview = ({data,template,accentColor,classes=""}) => {

const renderTemplate = ()=>{
    switch (template) {
             case "modern":
            return <ModernTemplate data={data} accentColor={accentColor}/>;
             case "minimal":
            return <MinimalTemplate data={data} accentColor={accentColor}/>;
             case "minimal-image":
            return <MinimalImageTemplate data={data} accentColor={accentColor}/>;
         
    
        default:
            return <ClassicTemplate data={data} accentColor={accentColor}/>;
    }
}

  return (
    <div className='w-full bg-gray-100'>

        <div id='resume-preview' className={"border border-gray-200 print:shadow-none print:border-none" + classes}>
           {renderTemplate() }
        </div>
        <style jsx = 'true'>
            {`
            @page {
              size:letter;
              margin:0;
            }
            @media print{
            html,body {
              width:8.5in;
              height:11in;
              overflow:hidden;
            }
            body * {
              visibility:hidden;
            } 
            #resume-preview, #resume-preview * {
              visibility:visible;
            }
            #resume-preview {
            position:absolute;
            left:0;
            top:0;
            width:100%;
            height:auto;
            margin:0;
            padding:0;
            box-shadow:none ! important;
            border:none ! important;
            }
             }
            `}
        </style>

    </div>
  )
}

export default ResumePreview

// ResumePreview.jsx - Fix the image display
// const ResumePreview = ({ data, template, accentColor }) => {
//   // Get base URL for images
//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
    
//     // If it's already a full URL (http://...)
//     if (imagePath.startsWith('http')) {
//       return imagePath;
//     }
    
//     // If it's a base64 data URL
//     if (imagePath.startsWith('data:')) {
//       return imagePath;
//     }
    
//     // If it's a local path (/uploads/...)
//     // Add your backend URL
//     const backendUrl = 'http://localhost:3000';
//     return `${backendUrl}${imagePath}`;
//   };
  
//   const imageUrl = getImageUrl(data.personal_info?.image);
  
//   return (
//     <div className="resume-preview">
//       {/* Profile Image Section */}
//       {imageUrl ? (
//         <div className="profile-image-section">
//           <img 
//             src={imageUrl}
//             alt="Profile"
//             className="profile-img"
//             onError={(e) => {
//               console.error('❌ Image failed to load:', imageUrl);
//               e.target.style.display = 'none';
//             }}
//           />
//         </div>
//       ) : (
//         <div className="profile-placeholder">
//           <User className="user-icon" />
//           <span>Add Photo</span>
//         </div>
//       )}
//       {/* Rest of your resume */}
//     </div>
//   );
// };

