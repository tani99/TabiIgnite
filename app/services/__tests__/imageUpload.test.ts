import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { ImageUploadService } from "../imageUpload"

// Mock Firebase Storage
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}))

// Mock Firebase config
jest.mock("@/config/firebase", () => ({
  storage: {},
}))

const mockRef = ref as jest.MockedFunction<typeof ref>
const mockUploadBytes = uploadBytes as jest.MockedFunction<typeof uploadBytes>
const mockGetDownloadURL = getDownloadURL as jest.MockedFunction<typeof getDownloadURL>
const mockDeleteObject = deleteObject as jest.MockedFunction<typeof deleteObject>

// Mock global fetch
global.fetch = jest.fn()

describe("ImageUploadService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console.error
    ;(console.error as jest.Mock).mockRestore()
  })

  describe("uploadProfileImage", () => {
    it("should upload image successfully", async () => {
      const mockBlob = new Blob(["mock image data"])
      const mockSnapshot = { ref: {} }
      const mockDownloadURL = "https://firebase.storage.com/image.jpg"

      // Mock fetch to return blob
      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      } as Response)

      // Mock Firebase Storage calls
      mockRef.mockReturnValue({} as any)
      mockUploadBytes.mockResolvedValue(mockSnapshot as any)
      mockGetDownloadURL.mockResolvedValue(mockDownloadURL)

      const result = await ImageUploadService.uploadProfileImage(
        "user123",
        "file://local/image.jpg"
      )

      expect(result).toEqual({
        downloadURL: mockDownloadURL,
        fileName: expect.stringMatching(/^avatar_user123_\d+\.jpg$/),
      })

      expect(fetch).toHaveBeenCalledWith("file://local/image.jpg")
      expect(mockRef).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringMatching(/^profile-images\/user123\/avatar_user123_\d+\.jpg$/)
      )
      expect(mockUploadBytes).toHaveBeenCalledWith(expect.anything(), mockBlob)
      expect(mockGetDownloadURL).toHaveBeenCalledWith(mockSnapshot.ref)
    })

    it("should use custom filename when provided", async () => {
      const mockBlob = new Blob(["mock image data"])
      const mockSnapshot = { ref: {} }
      const mockDownloadURL = "https://firebase.storage.com/custom.jpg"

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      } as Response)

      mockRef.mockReturnValue({} as any)
      mockUploadBytes.mockResolvedValue(mockSnapshot as any)
      mockGetDownloadURL.mockResolvedValue(mockDownloadURL)

      const result = await ImageUploadService.uploadProfileImage(
        "user123",
        "file://local/image.jpg",
        "custom.jpg"
      )

      expect(result.fileName).toBe("custom.jpg")
      expect(mockRef).toHaveBeenCalledWith(
        expect.anything(),
        "profile-images/user123/custom.jpg"
      )
    })

    it("should handle upload errors", async () => {
      ;(fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
        new Error("Network error")
      )

      await expect(
        ImageUploadService.uploadProfileImage("user123", "file://local/image.jpg")
      ).rejects.toThrow("Failed to upload profile image")
    })

    it("should handle Firebase Storage errors", async () => {
      const mockBlob = new Blob(["mock image data"])

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      } as Response)

      mockRef.mockReturnValue({} as any)
      mockUploadBytes.mockRejectedValue(new Error("Storage error"))

      await expect(
        ImageUploadService.uploadProfileImage("user123", "file://local/image.jpg")
      ).rejects.toThrow("Failed to upload profile image")
    })
  })

  describe("deleteProfileImage", () => {
    it("should delete image successfully", async () => {
      mockRef.mockReturnValue({} as any)
      mockDeleteObject.mockResolvedValue(undefined)

      await expect(
        ImageUploadService.deleteProfileImage("user123", "avatar.jpg")
      ).resolves.toBeUndefined()

      expect(mockRef).toHaveBeenCalledWith(
        expect.anything(),
        "profile-images/user123/avatar.jpg"
      )
      expect(mockDeleteObject).toHaveBeenCalledWith(expect.anything())
    })

    it("should handle delete errors gracefully", async () => {
      mockRef.mockReturnValue({} as any)
      mockDeleteObject.mockRejectedValue(new Error("Storage error"))

      // Should not throw error for delete failures
      await expect(
        ImageUploadService.deleteProfileImage("user123", "avatar.jpg")
      ).resolves.toBeUndefined()
    })
  })

  describe("replaceProfileImage", () => {
    it("should replace image successfully", async () => {
      const mockBlob = new Blob(["mock image data"])
      const mockSnapshot = { ref: {} }
      const mockDownloadURL = "https://firebase.storage.com/new-image.jpg"

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      } as Response)

      mockRef.mockReturnValue({} as any)
      mockUploadBytes.mockResolvedValue(mockSnapshot as any)
      mockGetDownloadURL.mockResolvedValue(mockDownloadURL)
      mockDeleteObject.mockResolvedValue(undefined)

      const result = await ImageUploadService.replaceProfileImage(
        "user123",
        "file://local/new-image.jpg",
        "old-avatar.jpg"
      )

      expect(result).toEqual({
        downloadURL: mockDownloadURL,
        fileName: expect.stringMatching(/^avatar_user123_\d+\.jpg$/),
      })

      // Should delete old image after uploading new one
      expect(mockDeleteObject).toHaveBeenCalled()
    })

    it("should handle replace without old filename", async () => {
      const mockBlob = new Blob(["mock image data"])
      const mockSnapshot = { ref: {} }
      const mockDownloadURL = "https://firebase.storage.com/new-image.jpg"

      ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        blob: () => Promise.resolve(mockBlob),
      } as Response)

      mockRef.mockReturnValue({} as any)
      mockUploadBytes.mockResolvedValue(mockSnapshot as any)
      mockGetDownloadURL.mockResolvedValue(mockDownloadURL)

      const result = await ImageUploadService.replaceProfileImage(
        "user123",
        "file://local/new-image.jpg"
      )

      expect(result).toEqual({
        downloadURL: mockDownloadURL,
        fileName: expect.stringMatching(/^avatar_user123_\d+\.jpg$/),
      })

      // Should not attempt to delete when no old filename provided
      expect(mockDeleteObject).not.toHaveBeenCalled()
    })
  })

  describe("compressImage", () => {
    it("should return original URI (placeholder implementation)", async () => {
      const originalUri = "file://local/image.jpg"
      
      const result = await ImageUploadService.compressImage(originalUri)

      expect(result).toBe(originalUri)
    })

    it("should handle compression errors gracefully", async () => {
      const originalUri = "file://local/image.jpg"
      
      // Even if there were an error, it should return original URI
      const result = await ImageUploadService.compressImage(originalUri)

      expect(result).toBe(originalUri)
    })
  })

  describe("extractFileNameFromURL", () => {
    it("should extract path segment from Firebase Storage URL", () => {
      const url = "https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/profile-images%2Fuser123%2Favatar.jpg?alt=media"
      
      const filename = ImageUploadService.extractFileNameFromURL(url)

      expect(filename).toBe("profile-images/user123/avatar.jpg")
    })

    it("should handle URL decoding", () => {
      const url = "https://firebasestorage.googleapis.com/v0/b/project.appspot.com/o/profile-images%2Fuser123%2Fmy%20avatar.jpg?alt=media"
      
      const filename = ImageUploadService.extractFileNameFromURL(url)

      expect(filename).toBe("profile-images/user123/my avatar.jpg")
    })

    it("should return null for invalid URLs", () => {
      const invalidUrls = [
        "not-a-url",
        "invalid://url"
      ]

      invalidUrls.forEach(url => {
        const filename = ImageUploadService.extractFileNameFromURL(url)
        expect(filename).toBeNull()
      })
    })

    it("should handle empty URL", () => {
      const filename = ImageUploadService.extractFileNameFromURL("")
      expect(filename).toBeNull()
    })

    it("should handle regular URLs", () => {
      const url = "https://example.com/path/to/file.jpg"
      const filename = ImageUploadService.extractFileNameFromURL(url)
      expect(filename).toBe("file.jpg")
    })
  })
})