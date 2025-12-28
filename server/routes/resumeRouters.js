import express from 'express';
import protect from '../middlewares/authMiddleware.js'

import upload from '../configs/multer.js'


import { 
  createResume, 
  deleteResume, 
  getPublicResumeById, 
  getResumeById, 
  updateResume,
  getAllResumes,
  testImageKit,
  checkPublicResumeUpdate,
  testUpload 
} from '../controllers/resumeController.js';

import mongoose from 'mongoose';
import path from 'path'; // ⭐⭐ ADD THIS LINE ⭐⭐
import fs from 'fs';
import Resume from '../modles/Resume.js'; // Make sure this path is correct

const resumeRouter = express.Router();

// ========== YOUR EXISTING ROUTES ==========
resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getPublicResumeById);
resumeRouter.get('/', protect, getAllResumes);
resumeRouter.get('/test-imagekit', protect, testImageKit);
resumeRouter.get('/public/:resumeId/check', checkPublicResumeUpdate);
resumeRouter.post('/test-upload', upload.single('image'), testUpload);

// Test route to check if router is working
resumeRouter.get('/test-public', (req, res) => {
  res.status(200).json({ 
    message: "Public resumes router is working!",
    route: "/api/resumes/public/:id"
  });
});

// Public view route (no authentication required)
resumeRouter.get('/view/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Public view request:', id);
    
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid resume ID" 
      });
    }
    
    // Find public resume
    const resume = await Resume.findOne({
      _id: id,
      public: true
    });
    
    if (!resume) {
      return res.status(404).json({ 
        success: false,
        message: "Resume not found or is private"
      });
    }
    
    // Convert to plain object
    const resumeData = resume.toObject();
    
    // Clean up sensitive data
    delete resumeData.userId;
    delete resumeData.__v;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;
    
    console.log('✅ Sending resume:', resumeData.title);
    
    res.json({
      success: true,
      resume: resumeData
    });
    
  } catch (error) {
    console.error('❌ Public view error:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error"
    });
  }
});

// ========== TEST ROUTE (WORKING VERSION) ==========
resumeRouter.post('/test-upload-simple', upload.single('image'), async (req, res) => {
  try {
    const image = req.file;
    
    if (!image) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    
    console.log('🧪 TEST UPLOAD RECEIVED:', {
      originalname: image.originalname,
      mimetype: image.mimetype,
      size: image.size,
      hasBuffer: !!image.buffer
    });
    
    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Save file
    const fileName = `test-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);
    
    fs.writeFileSync(filePath, image.buffer);
    
    res.json({
      success: true,
      message: '✅ Test upload successful!',
      fileName: fileName,
      url: `http://localhost:3000/uploads/${fileName}`,
      fullPath: filePath
    });
    
  } catch (error) {
    console.error('Test upload error:', error);
    res.status(500).json({ 
      error: error.message,
      note: 'Check if path module is imported'
    });
  }
});

// ========== YOUR OTHER ROUTES ==========
// Simple test route
resumeRouter.get('/:resumeId', (req, res) => {
  res.json({ 
    working: true, 
    id: req.params.id,
    data: { professional_Summary: "Test data" }
  });
});

// Add to your resumeRouter.js
resumeRouter.get('/public/test/:resumeId', (req, res) => {
  console.log('Public test route called with ID:', req.params.resumeId);
  res.json({
    success: true,
    message: 'Public endpoint working',
    id: req.params.resumeId
  });
});

// Add to resumeRouters.js
resumeRouter.post('/debug-upload', upload.single('image'), (req, res) => {
  console.log('=== DEBUG UPLOAD ===');
  console.log('1. Request received:', req.method, req.url);
  console.log('2. Has file?', !!req.file);
  console.log('3. File details:', req.file ? {
    fieldname: req.file.fieldname,
    originalname: req.file.originalname,
    encoding: req.file.encoding,
    mimetype: req.file.mimetype,
    size: req.file.size,
    bufferLength: req.file.buffer?.length || 0
  } : 'No file');
  console.log('4. Body fields:', Object.keys(req.body));
  console.log('5. Path module:', typeof path);
  
  res.json({
    status: 'debug',
    fileReceived: !!req.file,
    pathModule: typeof path,
    bodyFields: Object.keys(req.body)
  });
});

// Add this test route to your resumeRouter.js
resumeRouter.get('/test-mongoose', (req, res) => {
  try {
    const testId = new mongoose.Types.ObjectId();
    res.json({
      success: true,
      message: 'Mongoose is working',
      testId: testId.toString(),
      mongooseVersion: mongoose.version
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Mongoose error',
      error: error.message
    });
  }
});

resumeRouter.get('/', protect, async (req, res) => {
  try {
    const userId = req.userId;
    const resumes = await Resume.find({ userId });
    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default resumeRouter;

// import express from 'express';
// import protect from '../middlewares/authMiddleware.js'
// import { createResume, deleteResume, getPublicResumeById, getResumeById, updateResume } from '../controllers/resumeController.js';
// import upload from '../configs/multer.js'

// const resumeRouter = express.Router();

// resumeRouter.post('/create',protect,createResume);
// resumeRouter.put('/update',upload.single('image'),protect,updateResume);
// resumeRouter.delete('/delete/:resumeId',protect,deleteResume);
// resumeRouter.get('/get/:resumeId',protect,getResumeById);  // <-- Your actual route
// resumeRouter.get('/public/:resumeId',getPublicResumeById);
// // In resumeRouter.js, replace your route with:
// resumeRouter.get('/get/:resumeId', protect, (req, res, next) => {
//     console.log("=== Route /get/:resumeId called ===");
//     console.log("resumeId:", req.params.resumeId);
//     console.log("userId from protect:", req.userId);
//     next();
// }, getResumeById);
// // Add this temporary route in resumeRouter.js
// resumeRouter.get('/test-db', async (req, res) => {
//     try {
//         const resumes = await Resume.find({});
//         console.log("All resumes in DB:", resumes);
//         res.json({ 
//             count: resumes.length,
//             resumes: resumes.map(r => ({ id: r._id, userId: r.userId }))
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// resumeRouter.get('/get/:resumeId', (req, res) => {
//     console.log("Test route called with ID:", req.params.resumeId);
//     res.json({
//         success: true,
//         message: "Route is working!",
//         resumeId: req.params.resumeId,
//         timestamp: new Date()
//     });
// });

// REMOVE THIS LINE COMPLETELY:
// resumeRouter.get('/:resumeId', (req, res) => { ... });

//export default resumeRouter;