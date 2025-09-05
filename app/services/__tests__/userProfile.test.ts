import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp,
  DocumentSnapshot,
  DocumentData 
} from "firebase/firestore"
import UserProfileService from "../userProfile"
import type { UserProfile } from "@/types/user"

// Mock Firebase Firestore
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "mock-timestamp"),
}))

// Mock Firebase config
jest.mock("@/config/firebase", () => ({
  db: {},
}))

const mockDoc = doc as jest.MockedFunction<typeof doc>
const mockGetDoc = getDoc as jest.MockedFunction<typeof getDoc>
const mockSetDoc = setDoc as jest.MockedFunction<typeof setDoc>
const mockUpdateDoc = updateDoc as jest.MockedFunction<typeof updateDoc>

describe("UserProfileService", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console.error
    ;(console.error as jest.Mock).mockRestore()
  })

  describe("getUserProfile", () => {
    it("should return user profile when document exists", async () => {
      const mockProfileData = {
        email: "test@example.com",
        name: "Test User",
        bio: "Test bio",
        phone: "+1234567890",
        location: "Test City",
        avatar: "https://example.com/avatar.jpg",
        createdAt: { toDate: () => new Date("2024-01-01") },
        updatedAt: { toDate: () => new Date("2024-01-02") },
      }

      const mockDocSnapshot = {
        exists: () => true,
        data: () => mockProfileData,
        id: "user123",
      } as unknown as DocumentSnapshot<DocumentData>

      mockDoc.mockReturnValue({} as any)
      mockGetDoc.mockResolvedValue(mockDocSnapshot)

      const result = await UserProfileService.getUserProfile("user123")

      expect(result).toEqual({
        id: "user123",
        email: "test@example.com",
        name: "Test User",
        bio: "Test bio",
        phone: "+1234567890",
        location: "Test City",
        avatar: "https://example.com/avatar.jpg",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      })
    })

    it("should return null when document does not exist", async () => {
      const mockDocSnapshot = {
        exists: () => false,
      } as unknown as DocumentSnapshot<DocumentData>

      mockDoc.mockReturnValue({} as any)
      mockGetDoc.mockResolvedValue(mockDocSnapshot)

      const result = await UserProfileService.getUserProfile("nonexistent")

      expect(result).toBeNull()
    })

    it("should handle errors gracefully", async () => {
      mockDoc.mockReturnValue({} as any)
      mockGetDoc.mockRejectedValue(new Error("Firestore error"))

      await expect(UserProfileService.getUserProfile("user123"))
        .rejects
        .toThrow("Failed to fetch user profile")
    })
  })

  describe("createUserProfile", () => {
    it("should create a new user profile", async () => {
      mockDoc.mockReturnValue({} as any)
      mockSetDoc.mockResolvedValue(undefined)

      const profileData: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> = {
        email: "test@example.com",
        name: "Test User",
        bio: "Test bio",
        phone: "+1234567890",
        location: "Test City",
        avatar: "https://example.com/avatar.jpg",
      }

      await UserProfileService.createUserProfile("user123", profileData)

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          ...profileData,
          createdAt: "mock-timestamp",
          updatedAt: "mock-timestamp",
        })
      )
    })

    it("should handle errors during creation", async () => {
      mockDoc.mockReturnValue({} as any)
      mockSetDoc.mockRejectedValue(new Error("Firestore error"))

      const profileData = {
        email: "test@example.com",
        name: "Test User",
      }

      await expect(UserProfileService.createUserProfile("user123", profileData))
        .rejects
        .toThrow("Failed to create user profile")
    })
  })

  describe("updateUserProfile", () => {
    it("should update user profile with new data", async () => {
      mockDoc.mockReturnValue({} as any)
      mockUpdateDoc.mockResolvedValue(undefined)

      const updateData = {
        name: "Updated Name",
        bio: "Updated bio",
      }

      await UserProfileService.updateUserProfile("user123", updateData)

      expect(mockUpdateDoc).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          ...updateData,
          updatedAt: "mock-timestamp",
        })
      )
    })

    it("should handle errors during update", async () => {
      mockDoc.mockReturnValue({} as any)
      mockUpdateDoc.mockRejectedValue(new Error("Firestore error"))

      await expect(UserProfileService.updateUserProfile("user123", { name: "Test" }))
        .rejects
        .toThrow("Failed to update user profile")
    })
  })

  describe("getOrCreateUserProfile", () => {
    it("should return existing profile if it exists", async () => {
      const existingProfile = {
        id: "user123",
        email: "test@example.com",
        name: "Existing User",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock getUserProfile to return existing profile
      jest.spyOn(UserProfileService, "getUserProfile").mockResolvedValue(existingProfile)

      const result = await UserProfileService.getOrCreateUserProfile(
        "user123",
        "test@example.com"
      )

      expect(result).toEqual(existingProfile)
      expect(UserProfileService.getUserProfile).toHaveBeenCalledWith("user123")
    })

    it("should create new profile if it doesn't exist", async () => {
      const newProfile = {
        id: "user123",
        email: "test@example.com",
        name: "New User",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock getUserProfile to return null first, then the created profile
      const getUserProfileSpy = jest.spyOn(UserProfileService, "getUserProfile")
      getUserProfileSpy.mockResolvedValueOnce(null) // First call - doesn't exist
      getUserProfileSpy.mockResolvedValueOnce(newProfile) // Second call - after creation

      // Mock createUserProfile
      const createUserProfileSpy = jest.spyOn(UserProfileService, "createUserProfile")
      createUserProfileSpy.mockResolvedValue(undefined)

      const result = await UserProfileService.getOrCreateUserProfile(
        "user123",
        "test@example.com",
        "New User"
      )

      expect(createUserProfileSpy).toHaveBeenCalledWith("user123", {
        email: "test@example.com",
        name: "New User",
      })
      expect(result).toEqual(newProfile)
    })

    it("should create profile with email as name if no name provided", async () => {
      const createdProfile = {
        id: "user123",
        email: "test@example.com",
        name: "test@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Mock getUserProfile to return null first, then the created profile
      const getUserProfileSpy = jest.spyOn(UserProfileService, "getUserProfile")
      getUserProfileSpy.mockResolvedValueOnce(null) // First call - doesn't exist
      getUserProfileSpy.mockResolvedValueOnce(createdProfile) // Second call - after creation

      // Mock createUserProfile
      const createUserProfileSpy = jest.spyOn(UserProfileService, "createUserProfile")
      createUserProfileSpy.mockResolvedValue(undefined)

      const result = await UserProfileService.getOrCreateUserProfile("user123", "test@example.com")

      expect(createUserProfileSpy).toHaveBeenCalledWith("user123", {
        email: "test@example.com",
        name: "test@example.com",
      })
      expect(result).toEqual(createdProfile)
    })
  })
})