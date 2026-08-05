import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRouters.js';
import aiRouter from './routes/aiRoutes.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Resume from './modles/Resume.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Add this before all routes to log incoming requests
app.use((req, res, next) => {
  console.log('📨 Incoming request:', req.method, req.url);
  next();
});

// ✅ CRITICAL: Serve static files from 'public' directory
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory:', uploadsDir);
}

// Routes
app.get('/', (req, res) => res.send("Server is live..."));
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

// Public viewing route
app.get('/api/view/:id', async (req, res) => {
  try {
    console.log('🌐 API VIEW ROUTE CALLED with ID:', req.params.id);
    
    const resume = await Resume.findOne({
      _id: req.params.id,
      public: true
    });
    
    if (!resume) {
      console.log('❌ Resume not found or private');
      return res.status(404).json({ 
        success: false,
        message: "Resume not found or private"
      });
    }
    
    console.log('✅ Resume found:', resume.title);
    
    // IMPORTANT: Send JSON response
    res.json({
      success: true,
      resume: resume.toObject()
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error"
    });
  }
});

// Test route - Direct database access
app.get('/test-resume/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ error: 'Not found' });
    }
    
    res.json({
      title: resume.title,
      template: resume.template,
      accent_color: resume.accent_color,
      public: resume.public,
      personal_info: resume.personal_info
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ Uploads directory: ${uploadsDir}`);
  console.log(`✅ Static files served from: /uploads`);
});