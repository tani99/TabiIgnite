// Alternative image storage without Firebase Storage
// Using base64 encoding to store images in Firestore
import * as ImageManipulator from 'expo-image-manipulator'

export interface ImageUploadResult {
  downloadURL: string
  fileName: string
}

export interface ImageUploadProgress {
  progress: number
  isComplete: boolean
}

export class ImageUploadService {
  private static MAX_BASE64_SIZE = 500 * 1024 // 500KB limit for base64 storage after compression

  /**
   * Convert image to base64 and compress it
   */
  private static async imageToBase64(imageUri: string, maxWidth: number = 400): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        // Draw and compress the image
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Convert to base64 with compression
        const base64 = canvas.toDataURL('image/jpeg', 0.8) // 80% quality
        resolve(base64)
      }
      
      img.onerror = reject
      img.src = imageUri
    })
  }

  /**
   * For React Native: Convert image to compressed base64 using expo-image-manipulator
   */
  private static async imageToBase64Native(imageUri: string): Promise<string> {
    try {
      console.log('Starting image compression for:', imageUri)
      
      // First, compress and resize the image using expo-image-manipulator
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: 300,
              height: 300,
            },
          },
        ],
        {
          compress: 0.7, // Start with 70% compression
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true, // Return base64 data
        }
      )
      
      console.log('Image compressed, base64 length:', manipResult.base64?.length || 0)
      
      // If still too large, try with more aggressive compression
      if (manipResult.base64 && manipResult.base64.length > this.MAX_BASE64_SIZE) {
        console.log('Image still too large, applying more compression...')
        
        const moreCompressedResult = await ImageManipulator.manipulateAsync(
          imageUri,
          [
            {
              resize: {
                width: 200,
                height: 200,
              },
            },
          ],
          {
            compress: 0.5, // More aggressive compression
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          }
        )
        
        console.log('More compressed image, base64 length:', moreCompressedResult.base64?.length || 0)
        
        if (moreCompressedResult.base64 && moreCompressedResult.base64.length <= this.MAX_BASE64_SIZE) {
          return `data:image/jpeg;base64,${moreCompressedResult.base64}`
        }
      }
      
      if (manipResult.base64 && manipResult.base64.length <= this.MAX_BASE64_SIZE) {
        return `data:image/jpeg;base64,${manipResult.base64}`
      }
      
      // If still too large, try one more time with very aggressive compression
      console.log('Applying maximum compression...')
      const maxCompressedResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: 150,
              height: 150,
            },
          },
        ],
        {
          compress: 0.3, // Maximum compression
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      )
      
      console.log('Maximum compressed image, base64 length:', maxCompressedResult.base64?.length || 0)
      
      if (maxCompressedResult.base64) {
        return `data:image/jpeg;base64,${maxCompressedResult.base64}`
      }
      
      throw new Error('Unable to compress image to acceptable size')
    } catch (error) {
      console.error('Error converting image to base64:', error)
      throw error
    }
  }

  /**
   * Upload profile image as base64 (no Firebase Storage needed)
   * @param userId - The user's unique ID
   * @param imageUri - Local image URI from image picker
   * @param fileName - Optional custom filename
   * @returns Promise with base64 data and filename
   */
  static async uploadProfileImage(
    userId: string,
    imageUri: string,
    fileName?: string
  ): Promise<ImageUploadResult> {
    try {
      // Generate filename if not provided
      const finalFileName = fileName || `avatar_${userId}_${Date.now()}.jpg`
      
      console.log("Converting image to base64...")
      
      // Convert image to base64 with compression
      const base64Data = await this.imageToBase64Native(imageUri)
      
      console.log("Image converted to base64, size:", base64Data.length)
      
      return {
        downloadURL: base64Data, // Return base64 as "download URL"
        fileName: finalFileName,
      }
    } catch (error) {
      console.error("Error processing profile image:", error)
      throw new Error(`Failed to process profile image: ${(error as any)?.message || 'Unknown error'}`)
    }
  }

  /**
   * Delete profile image (no-op for base64 storage)
   * @param userId - The user's unique ID
   * @param fileName - The filename to delete
   */
  static async deleteProfileImage(userId: string, fileName: string): Promise<void> {
    // No-op for base64 storage - images are stored in Firestore
    console.log("Delete image (base64 storage):", fileName)
  }

  /**
   * Replace an existing profile image with a new one
   * @param userId - The user's unique ID
   * @param newImageUri - New image URI
   * @param oldFileName - Old filename to delete (optional)
   * @returns Promise with new base64 data and filename
   */
  static async replaceProfileImage(
    userId: string,
    newImageUri: string,
    oldFileName?: string
  ): Promise<ImageUploadResult> {
    try {
      // Upload new image (convert to base64)
      const uploadResult = await this.uploadProfileImage(userId, newImageUri)
      
      // Old image cleanup is handled automatically in Firestore when we update the avatar field
      if (oldFileName) {
        console.log("Replacing old image:", oldFileName)
      }
      
      return uploadResult
    } catch (error) {
      console.error("Error replacing profile image:", error)
      throw new Error("Failed to replace profile image")
    }
  }

  /**
   * Compress and resize image (handled in base64 conversion)
   * @param imageUri - Original image URI
   * @param quality - Compression quality (0-1)
   * @param maxWidth - Maximum width in pixels
   * @param maxHeight - Maximum height in pixels
   * @returns Compressed base64 data
   */
  static async compressImage(
    imageUri: string,
    quality: number = 0.8,
    maxWidth: number = 400,
    maxHeight: number = 400
  ): Promise<string> {
    try {
      // Use our base64 conversion which includes compression
      return await this.imageToBase64Native(imageUri)
    } catch (error) {
      console.error("Error compressing image:", error)
      throw error
    }
  }

  /**
   * Extract filename from base64 data URL (for compatibility)
   * @param downloadURL - Base64 data URL
   * @returns Generated filename or null
   */
  static extractFileNameFromURL(downloadURL: string): string | null {
    try {
      // For base64 data, generate a filename based on timestamp
      if (downloadURL.startsWith('data:')) {
        return `avatar_${Date.now()}.jpg`
      }
      return null
    } catch (error) {
      console.error("Error extracting filename:", error)
      return null
    }
  }
}

export default ImageUploadService