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
resumeRouter.get('/', protect, getAllResumes);
resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:id', getPublicResumeById);
resumeRouter.get('/test-imagekit', protect, testImageKit);
resumeRouter.get('/public/:resumeId/check', checkPublicResumeUpdate);
resumeRouter.post('/test-upload', upload.single('image'), testUpload);

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


export default resumeRouter;