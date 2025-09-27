import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
  file: File, 
  folder: string = 'uploads',
  customName?: string
): Promise<UploadResult> => {
  try {
    const timestamp = Date.now();
    const fileName = customName || `${timestamp}-${file.name}`;
    const filePath = `${folder}/${fileName}`;
    const storageRef = ref(storage, filePath);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return {
      url: downloadURL,
      path: filePath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('फाइल अपलोड करने में त्रुटि हुई');
  }
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    // Don't throw error for delete operations as file might not exist
  }
};

/**
 * Extract file path from Firebase Storage URL
 */
export const getFilePathFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/);
    return pathMatch ? decodeURIComponent(pathMatch[1]) : null;
  } catch (error) {
    console.error('Error extracting file path from URL:', error);
    return null;
  }
};

/**
 * Validate file type and size
 */
export const validateFile = (
  file: File, 
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSizeMB: number = 5
): { isValid: boolean; error?: string } => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `केवल ${allowedTypes.join(', ')} फाइल टाइप्स की अनुमति है`
    };
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `फाइल का साइज ${maxSizeMB}MB से कम होना चाहिए`
    };
  }

  return { isValid: true };
};

/**
 * Generate optimized file name
 */
export const generateFileName = (originalName: string, prefix?: string): string => {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const sanitizedName = baseName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  
  return prefix 
    ? `${prefix}-${timestamp}-${sanitizedName}.${extension}`
    : `${timestamp}-${sanitizedName}.${extension}`;
};

/**
 * Compress image before upload (basic implementation)
 */
export const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions (max 1920x1080)
      const maxWidth = 1920;
      const maxHeight = 1080;
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};