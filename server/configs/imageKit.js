 import ImageKit from '@imagekit/nodejs';

// const imageKit = new ImageKit({
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY // This is the default and can be omitted
// });

// export default imageKit

// configs/imageKit.js - CORRECT WAY
//import ImageKit from "imagekit";

// Initialize with proper configuration
//const imageKit = new ImageKit({
  
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
   
// });

// // Debug: Check available methods
// // Add this to debug
// console.log('🔍 ImageKit Configuration Check:');
// console.log('- Has publicKey?', !!process.env.IMAGEKIT_PUBLIC_KEY);
// console.log('- Has privateKey?', !!process.env.IMAGEKIT_PRIVATE_KEY);

// export default imageKit;

// configs/imageKit.js - CORRECT VERSION


const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

console.log('✅ ImageKit Config Check:');
console.log('- Public Key:', process.env.IMAGEKIT_PUBLIC_KEY ? 'Set' : 'Missing');
console.log('- Private Key:', process.env.IMAGEKIT_PRIVATE_KEY ? 'Set' : 'Missing');
console.log('- URL Endpoint:', process.env.IMAGEKIT_URL_ENDPOINT || 'Missing');

export default imageKit;