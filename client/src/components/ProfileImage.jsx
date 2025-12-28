// components/ProfileImage.jsx
import { useState } from 'react';
import { User } from 'lucide-react';

const ProfileImage = ({ imageUrl, alt = "Profile", className = "" }) => {
  const [hasError, setHasError] = useState(false);
  
  const getFullImageUrl = (url) => {
    if (!url) return null;
    
    // Already full URL
    if (url.startsWith('http') || url.startsWith('data:')) {
      return url;
    }
    
    // Local path - prepend backend URL
    return `http://localhost:3000${url}`;
  };
  
  const fullUrl = getFullImageUrl(imageUrl);
  
  if (!fullUrl || hasError) {
    return (
      <div className={`profile-placeholder ${className}`}>
        <User className="w-12 h-12 text-gray-400" />
        <span className="text-gray-500 text-sm">Add Photo</span>
      </div>
    );
  }
  
  return (
    <img
      src={fullUrl}
      alt={alt}
      className={`profile-image ${className}`}
      onError={() => {
        console.log('❌ Image failed to load:', fullUrl);
        setHasError(true);
      }}
      onLoad={() => console.log('✅ Image loaded:', fullUrl)}
    />
  );
};

export default ProfileImage;