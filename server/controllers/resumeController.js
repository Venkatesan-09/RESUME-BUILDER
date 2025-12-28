
//controller for creating a new resume
 
 import imageKit from "../configs/imageKit.js";
import Resume from "../modles/Resume.js";
import fs from 'fs';
import mongoose from 'mongoose';
import cloudinary from '../configs/Cloudinary.js';
import uploadcare from '../configs/uploadCare.js';
// Add this import at the top of your file


// POST:/api/resumes/create
export const createResume = async (req,res) =>{

  console.log('🔄 ImageKit import check:', {
    imageKitExists: !!imageKit,
    uploadMethod: imageKit ? typeof imageKit.upload : 'no imageKit',
    imageKitType: imageKit?.constructor?.name
});
    try {
        const userId = req.userId;
        const {title} = req.body;

        //create new resume
        const newResume = await Resume.create({userId,title})
        //return success memssage
        return res.status(201).json({message:'Resume created successfully',resume:newResume})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}

//controller for delecting resume
// DELETE: /api/resumes/delete
export const deleteResume = async (req,res) =>{
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId,_id:resumeId})

        //return success message
        return res.status(201).json({message:'Resume Deleted successfully'})
    } catch (error) {
        return res.status(400).json({message:error.message})
    }
}


//get user resume by id
// GET: /api/resume/get
// In resumeController.js, temporarily update getResumeById:
export const getResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const userId = req.userId; // Might be undefined for public
    
    console.log('📥 Getting resume:', resumeId, 'User:', userId);
    
    // Find resume - allow public access
    const resume = await Resume.findOne({
      _id: resumeId,
      $or: [
        { userId: userId }, // User owns it
        { public: true }    // OR it's public
      ]
    });
    
    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: "Resume not found or you don't have access" 
      });
    }
    
    res.status(200).json({ 
      success: true,
      resume 
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// resumesController.js
// In resumeController.js
// export const getResumeById = async (req, res) => {
//     try {
//         console.log("getResumeById called with ID:", req.params.resumeId);
        
//         const resume = await Resume.findOne({ 
//             _id: req.params.resumeId 
//         });
        
//         console.log("Found resume:", resume);
        
//         if (!resume) {
//             return res.status(404).json({ message: "Resume not found" });
//         }
        
//         res.status(200).json(resume);
//     } catch (error) {
//         console.error("Error in getResumeById:", error);
//         res.status(500).json({ message: error.message });
//     }
// };


//get resume by id public
//GET"/api/resumes/public
// In your backend (resumeController.js)
// In resumeController.js - update your existing getResume function
// Controller to get public resume
export const getPublicResumeById = async (req, res) => {
  try {
    console.log('🔍 Fetching public resume:', req.params.id);
    
    const resume = await Resume.findOne({
      _id: req.params.id,
      public: true  // Only return if public
    }).select('-__v'); // Exclude version key
    
    if (!resume) {
      console.log('❌ Resume not found or private:', req.params.id);
      return res.status(404).json({ 
        message: "Resume not found or private",
        id: req.params.id
      });
    }
    
    console.log('✅ Public resume found:', resume.title);
    
    res.status(200).json({
      resume,
      success: true
    });
    
  } catch (error) {
    console.error('❌ Error fetching public resume:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};
//controller for updating resume
// PUT"/api/resumes/update

// export const updateResume = async (req,res) =>{
//     try {
//         const userId = req.userId;
//         const {resumeId,resumeData,removeBackground} = req.body
//         const image = req.file;

//         let resumeDataCopy;
//         if(typeof resumeData === 'string'){
//             resumeDataCopy = await JSON.parse(resumeData)
//         }
//         else{
//             resumeDataCopy = structuredClone(resumeData)
//         }


//         if(image){

//             const imageBufferData = fs.createReadStream(image.path)
//             const response = await imageKit.files.upload({
//                 file: imageBufferData,
//                 fileName: 'resume.png',
//                 folder:'user-resumes',
//                 transformation :{
//               pre: 'w-300,h-300,fo-face,z-0.75'+ (removeBackground ? ',e-bgremove':'')
//                }
//            });

//            resumeDataCopy.personal_info.image = response.url;
//         }

        

//  const resume =  await Resume.findByIdAndUpdate({userId,_id:resumeId},resumeDataCopy,{new:true})

//         return res.status(200).json({message:"saved successfully",resume})
//     } catch (error) {
//      return res.status(400).json({message:error.message})   
//     }
// }



// In resumeController.js - Fix the syntax
// resumeController.js - COMPLETE updateResume function
// resumeController.js - REPLACE YOUR updateResume FUNCTION WITH THIS

export const updateResume = async (req, res) => {
  try {
    console.log('🚨🚨🚨 UPDATE RESUME CALLED 🚨🚨🚨');
    
    // 1. Log everything
    console.log('📦 Request body keys:', Object.keys(req.body));
    console.log('📦 Has resumeId?', !!req.body.resumeId);
    console.log('📦 Has resumeData?', !!req.body.resumeData);
    console.log('📦 Has removeBackground?', !!req.body.removeBackground);
    console.log('📦 Has file?', !!req.file);
    
    if (req.file) {
      console.log('📸 File details:', {
        originalname: req.file.originalname,
        size: req.file.size,
        bufferLength: req.file.buffer?.length || 0,
        mimetype: req.file.mimetype
      });
    }
    
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    // 2. Parse resumeData
    let updatedResumeData;
    if (typeof resumeData === 'string') {
      updatedResumeData = JSON.parse(resumeData);
    } else {
      updatedResumeData = resumeData || {};
    }
    
    console.log('📝 Parsed resumeData personal_info:', updatedResumeData.personal_info);

    // 3. Handle image upload
    if (image && image.buffer) {
      console.log('🖼️ Processing image upload...');
      
      // Create filename
      const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.png`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      const filePath = path.join(uploadsDir, fileName);
      
      // Save file
      fs.writeFileSync(filePath, image.buffer);
      console.log('✅ Image saved to:', filePath);
      
      // Set FULL URL for image
      const imageUrl = `http://localhost:3000/uploads/${fileName}`;
      
      if (!updatedResumeData.personal_info) {
        updatedResumeData.personal_info = {};
      }
      
      updatedResumeData.personal_info.image = imageUrl;
      console.log('🖼️ Set image URL to:', imageUrl);
    }

    // 4. Update database
    console.log('💾 Updating database with image URL:', updatedResumeData.personal_info?.image);
    
    const resume = await Resume.findOneAndUpdate(
      { 
        userId: new mongoose.Types.ObjectId(userId), 
        _id: new mongoose.Types.ObjectId(resumeId) 
      },
      { $set: updatedResumeData },
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    console.log('✅ FINAL resume to return:', {
      hasPersonalInfo: !!resume.personal_info,
      hasImage: !!resume.personal_info?.image,
      imageUrl: resume.personal_info?.image
    });
    
    return res.status(200).json({ 
      message: "Saved successfully", 
      resume 
    });
    
  } catch (error) {
    console.error('❌ ERROR:', error);
    return res.status(500).json({ 
      message: "Server error",
      error: error.message 
    });
  }
};
    // ... rest of your existing code continues here
    // const userId = req.userId;
    // const { resumeId, resumeData, removeBackground } = req.body;
    // ... etc.
    // ... rest of your code

// Add this to your resumeController.js
export const getAllResumes = async (req, res) => {
    try {
        const userId = req.userId;
        const resumes = await Resume.find({ userId })
            .select('-__v -createdAt -updatedAt') // Exclude unnecessary fields
            .sort({ updatedAt: -1 }); // Sort by most recent
        
        res.status(200).json({ resumes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

    // Add this in your updateResume function

};
// Add a test route to check ImageKit methods
export const testImageKit = async (req, res) => {
  try {
    console.log('🔍 Testing ImageKit methods...');
    
    const methods = {
      'imageKit': Object.keys(imageKit),
      'imageKit.files': Object.keys(imageKit.files || {}),
      'imageKit.files.bulk': Object.keys(imageKit.files?.bulk || {}),
      'imageKit.files.versions': Object.keys(imageKit.files?.versions || {}),
      'imageKit.files.metadata': Object.keys(imageKit.files?.metadata || {})
    };
    
    console.log('📋 Available methods:', methods);
    
    // Try to list files to see if connection works
    const fileList = await imageKit.files?.listFiles?.({});
    console.log('📁 File list test:', fileList);
    
    res.json({ 
      success: true, 
      methods,
      fileList: fileList || 'Cannot list files'
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    res.status(500).json({ error: error.message });
  }
};
console.log('🔍 Full ImageKit object inspection:');
console.log('- Type:', typeof imageKit);
console.log('- Constructor:', imageKit.constructor.name);
console.log('- Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(imageKit)));
console.log('- Keys:', Object.keys(imageKit));
console.log('🔍 ImageKit instance inspection:');
console.log('- Direct properties:', Object.keys(imageKit));
console.log('- Files object:', imageKit.files);
console.log('- Files methods:', Object.keys(imageKit.files || {}));
console.log('🔍 Deep inspection of imageKit.files:');
for (let key in imageKit.files) {
  const item = imageKit.files[key];
  console.log(`- ${key}:`, typeof item);
  if (item && typeof item === 'object') {
    console.log(`  Sub-methods:`, Object.keys(item));
  }
}

// Add this function to check for updates
export const checkPublicResumeUpdate = async (req, res) => {
  try {
    const { resumeId } = req.params;
    
    console.log('🔍 Checking updates for resume:', resumeId);
    
    const resume = await Resume.findOne({
      public: true,
      _id: new mongoose.Types.ObjectId(resumeId)
    }).select('updatedAt'); // Only get the updatedAt field
    
    if (!resume) {
      return res.status(404).json({ 
        message: "Resume not found or is private" 
      });
    }
    
    return res.status(200).json({ 
      lastUpdated: resume.updatedAt,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error checking updates:', error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Add to resumeController.js
export const testUpload = async (req, res) => {
  try {
    const image = req.file;
    
    if (image && image.buffer) {
      // Save test image
      fs.writeFileSync('public/uploads/test.png', image.buffer);
      
      res.json({
        success: true,
        message: 'Upload works!',
        fileSize: image.size,
        hasBuffer: !!image.buffer
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'No image received'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  
};