import React, { FC, useEffect, useRef, useState } from "react"
import { 
  Animated, 
  TextStyle, 
  ViewStyle, 
  View, 
  Image, 
  ImageStyle, 
  ScrollView,
  TouchableOpacity,
  Alert 
} from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { SkeletonLayouts } from "@/components/SkeletonLoader"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { UserProfile, UserProfileFormData, ProfileValidationErrors } from "@/types/user"
import UserProfileService from "@/services/userProfile"
import ImageUploadService from "@/services/imageUpload"
import * as ImagePicker from "expo-image-picker"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

const avatarPlaceholder = require("@assets/images/welcome-face.png")

export const ProfileScreen: FC<ProfileScreenProps> = () => {
  const navigation = useNavigation()
  const { user, logout } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  
  // Form data for editing
  const [formData, setFormData] = useState<UserProfileFormData>({
    name: "",
    bio: "",
    phone: "",
    location: "",
  })
  const [validationErrors, setValidationErrors] = useState<ProfileValidationErrors>({})
  
  // Avatar management
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  const { themed } = useAppTheme()

  // Helper function to check if form has unsaved changes
  const hasUnsavedChanges = (): boolean => {
    if (!isEditing || !profile) return false
    
    return (
      formData.name !== (profile.name || "") ||
      formData.bio !== (profile.bio || "") ||
      formData.phone !== (profile.phone || "") ||
      formData.location !== (profile.location || "") ||
      selectedImageUri !== null
    )
  }

  // Navigation warning for unsaved changes - temporarily disabled
  // useBeforeRemove(
  //   React.useCallback((e: any) => {
  //     if (!hasUnsavedChanges()) {
  //       // No unsaved changes, allow navigation
  //       return
  //     }

  //     // Prevent default behavior of leaving the screen
  //     e.preventDefault()

  //     // Prompt the user before leaving the screen
  //     Alert.alert(
  //       'Discard changes?',
  //       'You have unsaved changes. Are you sure you want to discard them and leave the screen?',
  //       [
  //         { text: "Don't leave", style: 'cancel', onPress: () => {} },
  //         {
  //           text: 'Discard',
  //           style: 'destructive',
  //           // If the user confirmed, then we dispatch the action we blocked earlier
  //           // This will continue the action that had triggered the removal of the screen
  //           onPress: () => navigation.dispatch(e.data.action),
  //         },
  //       ]
  //     )
  //   }, [hasUnsavedChanges, navigation])
  // )

  useEffect(() => {
    loadProfile()
  }, [user])

  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [isLoading, fadeAnim, slideAnim])

  const loadProfile = async () => {
    if (!user || !user.email) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const userProfile = await UserProfileService.getOrCreateUserProfile(
        user.uid,
        user.email,
        user.displayName || undefined
      )
      
      setProfile(userProfile)
      // Update form data when profile loads
      setFormData({
        name: userProfile.name || "",
        bio: userProfile.bio || "",
        phone: userProfile.phone || "",
        location: userProfile.location || "",
      })
    } catch (err) {
      console.error("Profile load error:", err)
      setError(`Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout()
            } catch (error) {
              console.error("Logout error:", error)
            }
          },
        },
      ]
    )
  }

  const validateForm = (): boolean => {
    const errors: ProfileValidationErrors = {}
    
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    } else if (formData.name.trim().length > 50) {
      errors.name = "Name must be less than 50 characters"
    }
    
    if (formData.bio && formData.bio.length > 200) {
      errors.bio = "Bio must be less than 200 characters"
    }
    
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ""))) {
        errors.phone = "Please enter a valid phone number"
      }
    }
    
    if (formData.location && formData.location.length > 100) {
      errors.location = "Location must be less than 100 characters"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveProfile = async () => {
    if (!user || !profile || !validateForm()) {
      return
    }

    try {
      setIsSaving(true)
      
      let avatarUrl = profile.avatar

      // Upload new avatar if user selected one during edit
      if (selectedImageUri) {
        setIsUploadingImage(true)
        const oldFileName = profile.avatar 
          ? ImageUploadService.extractFileNameFromURL(profile.avatar)
          : null
        const uploadResult = await ImageUploadService.replaceProfileImage(
          user.uid,
          selectedImageUri,
          oldFileName || undefined
        )
        avatarUrl = uploadResult.downloadURL
        setIsUploadingImage(false)
      }

      // Update profile with form data and potentially new avatar
      const updateData: any = {
        name: formData.name.trim(),
        bio: formData.bio.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        location: formData.location.trim() || undefined,
      }
      
      // Only include avatar if it has a value
      if (avatarUrl) {
        updateData.avatar = avatarUrl
      }
      
      await UserProfileService.updateUserProfile(user.uid, updateData)
      
      // Reload profile to get updated data
      await loadProfile()
      setIsEditing(false)
      setValidationErrors({})
      setSelectedImageUri(null)
    } catch (err) {
      console.error("Save profile error:", err)
      Alert.alert("Error", "Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
      setIsUploadingImage(false)
    }
  }

  const handleCancelEdit = () => {
    if (!profile) return
    
    // Check for unsaved changes before canceling
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              // Reset form data to original profile data
              setFormData({
                name: profile.name || "",
                bio: profile.bio || "",
                phone: profile.phone || "",
                location: profile.location || "",
              })
              setValidationErrors({})
              setSelectedImageUri(null)
              setIsEditing(false)
            },
          },
        ]
      )
    } else {
      // No changes, cancel directly
      setIsEditing(false)
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleFormFieldChange = (field: keyof UserProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    
    if (cameraStatus !== "granted" || mediaStatus !== "granted") {
      Alert.alert(
        "Permissions Required",
        "We need camera and photo library permissions to change your profile picture."
      )
      return false
    }
    return true
  }

  const handleAvatarPress = async () => {
    if (isUploadingImage) return
    const hasPermissions = await requestPermissions()
    if (!hasPermissions) return
    Alert.alert(
      "Change Profile Picture", 
      "Choose how you'd like to update your profile picture:",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: () => openCamera() },
        { text: "Choose from Library", onPress: () => openImageLibrary() },
      ]
    )
  }

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })
      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri)
        if (!isEditing) {
          await uploadAvatar(result.assets[0].uri)
        }
      }
    } catch (error) {
      console.error("Error opening camera:", error)
      Alert.alert("Error", "Failed to open camera")
    }
  }

  const openImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })
      if (!result.canceled && result.assets[0]) {
        setSelectedImageUri(result.assets[0].uri)
        if (!isEditing) {
          await uploadAvatar(result.assets[0].uri)
        }
      }
    } catch (error) {
      console.error("Error opening image library:", error)
      Alert.alert("Error", "Failed to open photo library")
    }
  }

  const uploadAvatar = async (imageUri: string) => {
    if (!user) return
    try {
      setIsUploadingImage(true)
      const oldFileName = profile?.avatar 
        ? ImageUploadService.extractFileNameFromURL(profile.avatar)
        : null
      
      const uploadResult = await ImageUploadService.replaceProfileImage(
        user.uid,
        imageUri,
        oldFileName || undefined
      )
      
      await UserProfileService.updateUserProfile(user.uid, {
        avatar: uploadResult.downloadURL,
      })
      
      await loadProfile()
      setSelectedImageUri(null)
    } catch (error) {
      console.error("Avatar upload error:", error)
      Alert.alert("Error", "Failed to upload profile picture. Please try again.")
      setSelectedImageUri(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  if (isLoading) {
    return (
      <Screen preset="fixed" contentContainerStyle={themed($screenContentContainer)}>
        <Header title="Profile" safeAreaEdges={[]} />
        <ScrollView 
          contentContainerStyle={themed($scrollContainer)}
          showsVerticalScrollIndicator={false}
        >
          <SkeletonLayouts.ProfileScreen />
        </ScrollView>
      </Screen>
    )
  }

  if (error || !profile) {
    return (
      <Screen preset="fixed" contentContainerStyle={themed($screenContentContainer)}>
        <Header title="Profile" safeAreaEdges={[]} />
        <View style={themed($errorContainer)}>
          <View style={themed($errorIconContainer)}>
            <Text preset="heading" size="xl" style={themed($errorIcon)}>
              ⚠️
            </Text>
          </View>
          <Text preset="heading" size="lg" weight="semiBold" style={themed($errorTitle)}>
            {error ? "Loading Error" : "Profile Not Found"}
          </Text>
          <Text preset="default" size="md" style={themed($errorText)}>
            {error || "We couldn't load your profile data. Please check your connection and try again."}
          </Text>
          <View style={themed($errorActions)}>
            <Button
              preset="primary"
              size="lg"
              text="Try Again"
              onPress={loadProfile}
              style={themed($retryButton)}
            />
            <Button
              preset="ghost"
              size="lg"
              text="Go Back"
              onPress={() => navigation.goBack()}
              style={themed($goBackButton)}
            />
          </View>
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="fixed" contentContainerStyle={themed($screenContentContainer)} safeAreaEdges={["top", "bottom"]}>
      <Header
        title="Profile"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        rightText="Sign Out"
        onRightPress={handleLogout}
        safeAreaEdges={[]}
      />
      
      <ScrollView 
        contentContainerStyle={themed($scrollContainer)}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          style={[
            themed($headerSection),
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Avatar Section */}
          <TouchableOpacity 
            style={themed($avatarContainer)}
            onPress={handleAvatarPress}
            activeOpacity={0.8}
            disabled={isUploadingImage}
          >
            <View style={themed($avatarWrapper)}>
              <Image 
                style={[
                  themed($avatar),
                  isUploadingImage && themed($avatarUploading)
                ]} 
                source={
                  selectedImageUri 
                    ? { uri: selectedImageUri }
                    : profile.avatar 
                    ? profile.avatar.startsWith('data:') 
                      ? { uri: profile.avatar }
                      : { uri: profile.avatar }
                    : avatarPlaceholder
                }
                resizeMode="cover" 
              />
              
              {/* Loading overlay for image upload */}
              {isUploadingImage && (
                <View style={themed($uploadingOverlay)}>
                  <Text preset="formLabel" size="xs" style={themed($uploadingText)}>
                    Uploading...
                  </Text>
                </View>
              )}
              
              {/* Camera badge */}
              <View style={[
                themed($avatarBadge),
                isUploadingImage && themed($avatarBadgeDisabled)
              ]}>
                <Text preset="formLabel" size="xs" style={themed($badgeText)}>
                  📷
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* User Info */}
          <View style={themed($userInfoContainer)}>
            <Text 
              preset="heading" 
              size="xl"
              weight="bold"
              style={themed($userName)} 
              text={profile.name}
            />
            <Text 
              preset="default" 
              size="md"
              style={themed($userEmail)} 
              text={profile.email}
            />
          </View>
        </Animated.View>

        {/* Profile Content */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Profile Information */}
          <View style={themed($sectionContainer)}>
            <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
              {isEditing ? "Edit Profile" : "Profile Information"}
            </Text>

            {isEditing ? (
              /* Edit Mode - Form Fields */
              <View style={themed($formCard)}>
                <TextField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(text) => handleFormFieldChange("name", text)}
                  status={validationErrors.name ? "error" : undefined}
                  helper={validationErrors.name}
                  containerStyle={themed($formField)}
                />

                <TextField
                  label="Bio"
                  placeholder="Tell us about yourself (optional)"
                  value={formData.bio}
                  onChangeText={(text) => handleFormFieldChange("bio", text)}
                  status={validationErrors.bio ? "error" : undefined}
                  helper={validationErrors.bio}
                  multiline
                  numberOfLines={3}
                  containerStyle={themed($formField)}
                />

                <TextField
                  label="Phone"
                  placeholder="Your phone number (optional)"
                  value={formData.phone}
                  onChangeText={(text) => handleFormFieldChange("phone", text)}
                  status={validationErrors.phone ? "error" : undefined}
                  helper={validationErrors.phone}
                  keyboardType="phone-pad"
                  containerStyle={themed($formField)}
                />

                <TextField
                  label="Location"
                  placeholder="Your location (optional)"
                  value={formData.location}
                  onChangeText={(text) => handleFormFieldChange("location", text)}
                  status={validationErrors.location ? "error" : undefined}
                  helper={validationErrors.location}
                  containerStyle={themed($formField)}
                />

                <View style={themed($infoItem)}>
                  <Text preset="default" size="sm" weight="medium" style={themed($infoLabel)}>
                    Email Address
                  </Text>
                  <Text preset="default" size="md" style={themed($readOnlyValue)}>
                    {profile.email}
                  </Text>
                  <Text preset="default" size="xs" style={themed($helperText)}>
                    Email cannot be changed
                  </Text>
                </View>
              </View>
            ) : (
              /* View Mode - Display Fields */
              <View style={themed($infoCard)}>
                <View style={themed($infoItem)}>
                  <Text preset="default" size="sm" weight="medium" style={themed($infoLabel)}>
                    Full Name
                  </Text>
                  <Text preset="default" size="md" style={themed($infoValue)}>
                    {profile.name}
                  </Text>
                </View>

                {profile.bio && (
                  <>
                    <View style={themed($infoDivider)} />
                    <View style={themed($infoItem)}>
                      <Text preset="default" size="sm" weight="medium" style={themed($infoLabel)}>
                        Bio
                      </Text>
                      <Text preset="default" size="md" style={themed($infoValue)}>
                        {profile.bio}
                      </Text>
                    </View>
                  </>
                )}

                {profile.phone && (
                  <>
                    <View style={themed($infoDivider)} />
                    <View style={themed($infoItem)}>
                      <Text preset="default" size="sm" weight="medium" style={themed($infoLabel)}>
                        Phone
                      </Text>
                      <Text preset="default" size="md" style={themed($infoValue)}>
                        {profile.phone}
                      </Text>
                    </View>
                  </>
                )}

                {profile.location && (
                  <>
                    <View style={themed($infoDivider)} />
                    <View style={themed($infoItem)}>
                      <Text preset="default" size="sm" weight="medium" style={themed($infoLabel)}>
                        Location
                      </Text>
                      <Text preset="default" size="md" style={themed($infoValue)}>
                        {profile.location}
                      </Text>
                    </View>
                  </>
                )}

                <View style={themed($infoDivider)} />
                <View style={themed($infoItem)}>
                  <Text preset="default" size="sm" weight="medium" style={themed($infoLabel)}>
                    Email Address
                  </Text>
                  <Text preset="default" size="md" style={themed($infoValue)}>
                    {profile.email}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={themed($actionsSection)}>
            {isEditing ? (
              /* Edit Mode - Save/Cancel Buttons */
              <>
                <Button
                  preset="primary"
                  size="lg"
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                  style={themed($saveButton)}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                
                <Button
                  preset="secondary"
                  size="lg"
                  onPress={handleCancelEdit}
                  disabled={isSaving}
                  style={themed($cancelButton)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              /* View Mode - Edit Button */
              <Button
                preset="primary"
                size="lg"
                onPress={handleEditProfile}
                style={themed($editButton)}
              >
                Edit Profile
              </Button>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </Screen>
  )
}

// Styles
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexGrow: 1,
  backgroundColor: colors.backgroundSecondary,
})

const $scrollContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
})

// Enhanced Error Handling Styles
const $errorContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.xl,
})

const $errorIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $errorIcon: ThemedStyle<TextStyle> = () => ({
  textAlign: "center",
})

const $errorTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  textAlign: "center",
  marginBottom: spacing.sm,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  textAlign: "center",
  marginBottom: spacing.xl,
  lineHeight: 24,
})

const $errorActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
  width: "100%",
})

const $retryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $goBackButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $headerSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.xl,
  marginBottom: spacing.lg,
})

const $avatarContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $avatarWrapper: ThemedStyle<ViewStyle> = () => ({
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
})

const $avatar: ThemedStyle<ImageStyle> = ({ colors }) => ({
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: colors.palette.neutral200,
  borderWidth: 3,
  borderColor: colors.background,
})

const $avatarBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  position: "absolute",
  bottom: -spacing.xxs,
  right: -spacing.xxs,
  backgroundColor: colors.tint,
  borderRadius: 16,
  width: 32,
  height: 32,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 2,
  borderColor: colors.background,
})

const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  fontWeight: "600",
})

const $userInfoContainer: ThemedStyle<ViewStyle> = () => ({
  alignItems: "center",
})

const $userName: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.text,
  marginBottom: spacing.xs,
})

const $userEmail: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.textDim,
})

const $sectionContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.md,
})

const $infoCard: ThemedStyle<ViewStyle> = ({ spacing, colors, elevation }) => ({
  backgroundColor: colors.background,
  borderRadius: spacing.sm,
  padding: spacing.md,
  ...elevation.level1,
})

const $infoItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
})

const $infoLabel: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textSubtle,
  marginBottom: spacing.xxs,
})

const $infoValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $infoDivider: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.borderSubtle,
  marginVertical: spacing.sm,
})

const $actionsSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
  gap: spacing.md,
})

const $editButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

// Form Styles
const $formCard: ThemedStyle<ViewStyle> = ({ spacing, colors, elevation }) => ({
  backgroundColor: colors.background,
  borderRadius: spacing.sm,
  padding: spacing.md,
  ...elevation.level1,
})

const $formField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $readOnlyValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $helperText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  marginTop: 2,
})

const $saveButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $cancelButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

// Avatar Upload Styles
const $avatarUploading: ThemedStyle<ImageStyle> = () => ({
  opacity: 0.6,
})

const $uploadingOverlay: ThemedStyle<ViewStyle> = ({ colors }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.palette.overlay20,
  borderRadius: 50,
  justifyContent: "center",
  alignItems: "center",
})

const $uploadingText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  fontWeight: "600",
})

const $avatarBadgeDisabled: ThemedStyle<ViewStyle> = () => ({
  opacity: 0.6,
})