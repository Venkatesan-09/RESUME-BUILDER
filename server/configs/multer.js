// // import multer from 'multer'

// // const storage = multer.diskStorage({});

// // const upload = multer({storage})



// // In your backend setup
// // Update multer configuration to memory storage
// import multer from 'multer';

// // Use memory storage instead of disk storage
// const storage = multer.memoryStorage();

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   }
// });

// export default upload

import multer from 'multer';

const storage = multer.memoryStorage(); // Store file in memory

const fileFilter = (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

export default upload;