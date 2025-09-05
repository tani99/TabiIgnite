import React from "react"
import { Alert } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native"
import { ProfileScreen } from "../ProfileScreen"
import { ThemeProvider } from "@/theme/context"
import { AuthContext } from "@/context/AuthContext"
import UserProfileService from "@/services/userProfile"

// Mock native modules
jest.mock("react-native-keyboard-controller", () => ({
  KeyboardAwareScrollView: require("react-native").ScrollView,
}))

jest.mock("react-native-edge-to-edge", () => ({
  SystemBars: require("react-native").View,
}))

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
}

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => mockNavigation,
  useBeforeRemove: jest.fn(),
}))

// Mock services
jest.mock("@/services/userProfile")
const mockUserProfileService = UserProfileService as jest.Mocked<typeof UserProfileService>

// Mock Firebase Auth user
const mockUser = {
  uid: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
}

// Mock auth context
const mockAuthContext = {
  user: mockUser,
  authEmail: "test@example.com",
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  signUp: jest.fn(),
  resetPassword: jest.fn(),
  isLoading: false,
  error: null,
}

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {})

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <NavigationContainer>
      <AuthContext.Provider value={mockAuthContext}>
        {children}
      </AuthContext.Provider>
    </NavigationContainer>
  </ThemeProvider>
)

describe("ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("Loading State", () => {
    it("should show loading skeleton while fetching profile", async () => {
      // Mock service to simulate loading
      mockUserProfileService.getOrCreateUserProfile.mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 1000))
      )

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      // Should show skeleton loader instead of profile content
      expect(screen.queryByText("Edit Profile")).toBeNull()
    })
  })

  describe("Profile Display", () => {
    it("should display user profile information in view mode", async () => {
      const mockProfile = {
        id: "test-user-id",
        email: "test@example.com",
        name: "John Doe",
        bio: "Software Developer",
        phone: "+1234567890",
        location: "San Francisco, CA",
        avatar: "https://example.com/avatar.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserProfileService.getOrCreateUserProfile.mockResolvedValue(mockProfile)

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeTruthy()
        expect(screen.getByText("test@example.com")).toBeTruthy()
        expect(screen.getByText("Software Developer")).toBeTruthy()
        expect(screen.getByText("+1234567890")).toBeTruthy()
        expect(screen.getByText("San Francisco, CA")).toBeTruthy()
        expect(screen.getByText("Edit Profile")).toBeTruthy()
      })
    })
  })

  describe("Edit Mode", () => {
    it("should switch to edit mode when Edit Profile is pressed", async () => {
      const mockProfile = {
        id: "test-user-id",
        email: "test@example.com",
        name: "John Doe",
        bio: "Software Developer",
        phone: "+1234567890",
        location: "San Francisco, CA",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserProfileService.getOrCreateUserProfile.mockResolvedValue(mockProfile)

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText("Edit Profile")).toBeTruthy()
      })

      // Press edit button
      fireEvent.press(screen.getByText("Edit Profile"))

      // Should show form fields and save/cancel buttons
      await waitFor(() => {
        expect(screen.getByDisplayValue("John Doe")).toBeTruthy()
        expect(screen.getByDisplayValue("Software Developer")).toBeTruthy()
        expect(screen.getByDisplayValue("+1234567890")).toBeTruthy()
        expect(screen.getByDisplayValue("San Francisco, CA")).toBeTruthy()
        expect(screen.getByText("Save Profile")).toBeTruthy()
        expect(screen.getByText("Cancel")).toBeTruthy()
      })
    })

    it("should validate form fields and show errors", async () => {
      const mockProfile = {
        id: "test-user-id",
        email: "test@example.com",
        name: "John Doe",
        bio: "",
        phone: "",
        location: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserProfileService.getOrCreateUserProfile.mockResolvedValue(mockProfile)

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        fireEvent.press(screen.getByText("Edit Profile"))
      })

      // Clear the name field (required field)
      const nameInput = screen.getByDisplayValue("John Doe")
      fireEvent.changeText(nameInput, "")

      // Try to save
      fireEvent.press(screen.getByText("Save Profile"))

      await waitFor(() => {
        expect(screen.getByText("Name is required")).toBeTruthy()
      })

      // Should not call update service
      expect(mockUserProfileService.updateUserProfile).not.toHaveBeenCalled()
    })

    it("should save profile changes when form is valid", async () => {
      const mockProfile = {
        id: "test-user-id",
        email: "test@example.com",
        name: "John Doe",
        bio: "Software Developer",
        phone: "+1234567890",
        location: "San Francisco, CA",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserProfileService.getOrCreateUserProfile.mockResolvedValue(mockProfile)
      mockUserProfileService.updateUserProfile.mockResolvedValue(undefined)

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        fireEvent.press(screen.getByText("Edit Profile"))
      })

      // Change the bio
      const bioInput = screen.getByDisplayValue("Software Developer")
      fireEvent.changeText(bioInput, "Senior Software Developer")

      // Save changes
      fireEvent.press(screen.getByText("Save Profile"))

      await waitFor(() => {
        expect(mockUserProfileService.updateUserProfile).toHaveBeenCalledWith(
          "test-user-id",
          {
            name: "John Doe",
            bio: "Senior Software Developer",
            phone: "+1234567890",
            location: "San Francisco, CA",
          }
        )
      })

      // Should return to view mode
      await waitFor(() => {
        expect(screen.getByText("Edit Profile")).toBeTruthy()
        expect(screen.queryByText("Save Profile")).toBeNull()
      })
    })
  })

  describe("Unsaved Changes Warning", () => {
    it("should show alert when canceling with unsaved changes", async () => {
      const mockProfile = {
        id: "test-user-id",
        email: "test@example.com",
        name: "John Doe",
        bio: "Software Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserProfileService.getOrCreateUserProfile.mockResolvedValue(mockProfile)

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        fireEvent.press(screen.getByText("Edit Profile"))
      })

      // Make a change
      const nameInput = screen.getByDisplayValue("John Doe")
      fireEvent.changeText(nameInput, "Jane Doe")

      // Try to cancel
      fireEvent.press(screen.getByText("Cancel"))

      // Should show confirmation alert
      expect(Alert.alert).toHaveBeenCalledWith(
        "Discard changes?",
        "You have unsaved changes. Are you sure you want to discard them?",
        expect.arrayContaining([
          expect.objectContaining({ text: "Keep editing" }),
          expect.objectContaining({ text: "Discard" })
        ])
      )
    })

    it("should cancel directly when no changes were made", async () => {
      const mockProfile = {
        id: "test-user-id",
        email: "test@example.com",
        name: "John Doe",
        bio: "Software Developer",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserProfileService.getOrCreateUserProfile.mockResolvedValue(mockProfile)

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        fireEvent.press(screen.getByText("Edit Profile"))
      })

      // Cancel without making changes
      fireEvent.press(screen.getByText("Cancel"))

      // Should return to view mode without alert
      await waitFor(() => {
        expect(screen.getByText("Edit Profile")).toBeTruthy()
        expect(screen.queryByText("Save Profile")).toBeNull()
      })

      expect(Alert.alert).not.toHaveBeenCalled()
    })
  })

  describe("Error Handling", () => {
    it("should show error screen when profile loading fails", async () => {
      mockUserProfileService.getOrCreateUserProfile.mockRejectedValue(
        new Error("Network error")
      )

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText("Unable to load profile")).toBeTruthy()
        expect(screen.getByText("Try Again")).toBeTruthy()
        expect(screen.getByText("Go Back")).toBeTruthy()
      })
    })

    it("should retry loading profile when Try Again is pressed", async () => {
      mockUserProfileService.getOrCreateUserProfile
        .mockRejectedValueOnce(new Error("Network error"))
        .mockResolvedValueOnce({
          id: "test-user-id",
          email: "test@example.com",
          name: "John Doe",
          createdAt: new Date(),
          updatedAt: new Date(),
        })

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        expect(screen.getByText("Try Again")).toBeTruthy()
      })

      // Press retry button
      fireEvent.press(screen.getByText("Try Again"))

      // Should show loading and then profile
      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeTruthy()
        expect(screen.getByText("Edit Profile")).toBeTruthy()
      })

      expect(mockUserProfileService.getOrCreateUserProfile).toHaveBeenCalledTimes(2)
    })
  })

  describe("Logout Functionality", () => {
    it("should call logout when logout button is pressed", async () => {
      const mockProfile = {
        id: "test-user-id",
        email: "test@example.com",
        name: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockUserProfileService.getOrCreateUserProfile.mockResolvedValue(mockProfile)

      render(
        <TestWrapper>
          <ProfileScreen navigation={mockNavigation as any} route={{} as any} />
        </TestWrapper>
      )

      await waitFor(() => {
        const logoutButton = screen.getByText("Sign Out")
        fireEvent.press(logoutButton)
      })

      expect(mockAuthContext.logout).toHaveBeenCalled()
    })
  })
})