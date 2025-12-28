// configs/uploadcare.js
import { UploadClient } from '@uploadcare/upload-client';

const client = new UploadClient({
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY
});

export default client;