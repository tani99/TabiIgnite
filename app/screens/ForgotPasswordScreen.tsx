import { FC, useEffect, useRef, useState } from "react"
import { Animated, TextStyle, ViewStyle, View, Image, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { getErrorMessageForDisplay } from "@/utils/firebaseErrorHandler"

interface ForgotPasswordScreenProps extends AppStackScreenProps<"ForgotPassword"> {}

const welcomeLogo = require("@assets/images/logo.png")

export const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = () => {
  const navigation = useNavigation()
  const [authEmail, setAuthEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseError, setFirebaseError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const {
    setAuthEmail: setAuthEmailContext,
    resetPassword: resetPasswordAuth,
    validationError,
  } = useAuth()

  // Animation values for modern entrance effects
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  const { themed } = useAppTheme()

  // Modern entrance animations
  useEffect(() => {
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
  }, [fadeAnim, slideAnim])

  const error = isSubmitted ? validationError || firebaseError : ""

  async function handleResetPassword() {
    setIsSubmitted(true)
    setFirebaseError("")
    setIsSuccess(false)

    if (validationError) return

    try {
      setIsLoading(true)
      if (authEmail) {
        await resetPasswordAuth(authEmail)
      }

      // Clear form and show success on successful password reset
      setIsSubmitted(false)
      setAuthEmail("")
      setIsSuccess(true)

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (error: any) {
      setIsLoading(false)
      // Don't reset isSubmitted on Firebase errors - keep it true to show the error

      // Handle Firebase auth errors using centralized error handler
      setFirebaseError(getErrorMessageForDisplay(error.code))
    }
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      {/* Modern Header Section */}
      <Animated.View
        style={[
          themed($headerSection),
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={themed($logoContainer)}>
          <Image 
            style={themed($logo)} 
            source={welcomeLogo} 
            resizeMode="contain" 
          />
        </View>
        <Text 
          testID="forgot-password-heading" 
          tx="forgotPasswordScreen:forgotPassword" 
          preset="heading" 
          size="xxl"
          weight="bold"
          style={themed($welcomeTitle)} 
        />
        <Text 
          tx="forgotPasswordScreen:enterDetails" 
          preset="subheading" 
          style={themed($welcomeSubtitle)} 
        />
      </Animated.View>

      {/* Modern Reset Password Card */}
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
        <View style={themed($resetContainer)}>
          {/* Security Indicator */}
          <View style={themed($securityIndicator)}>
            <View style={themed($securityBadge)}>
              <Text preset="formLabel" size="xs" style={themed($securityText)}>
                🔑 Password Recovery
              </Text>
            </View>
          </View>

          {/* Success Message */}
          {isSuccess && (
            <View style={themed($successContainer)}>
              <View style={themed($successBadge)}>
                <Text
                  tx="forgotPasswordScreen:successMessage"
                  style={themed($successMessage)}
                  preset="default"
                  size="sm"
                />
              </View>
            </View>
          )}

          {/* Reset Form */}
          <View style={themed($formContainer)}>
            <TextField
              value={authEmail}
              onChangeText={(text) => {
                setAuthEmail(text)
                setAuthEmailContext(text)
                if (firebaseError) {
                  setFirebaseError("")
                }
              }}
              containerStyle={themed($textField)}
              variant="filled"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              keyboardType="email-address"
              labelTx="forgotPasswordScreen:emailFieldLabel"
              placeholderTx="forgotPasswordScreen:emailFieldPlaceholder"
              helper={error}
              status={error ? "error" : undefined}
              onSubmitEditing={handleResetPassword}
              onBlur={() => {
                if (firebaseError) {
                  setFirebaseError("")
                }
              }}
              editable={!isLoading}
            />

            {/* Primary CTA Button */}
            <Button
              testID="reset-password-button"
              tx={
                isLoading
                  ? "forgotPasswordScreen:resettingPassword"
                  : "forgotPasswordScreen:tapToResetPassword"
              }
              style={themed($primaryButton)}
              preset="primary"
              size="lg"
              loading={isLoading}
              onPress={handleResetPassword}
              disabled={isLoading}
            />
          </View>
        </View>
      </Animated.View>

      {/* Modern Navigation Links */}
      <Animated.View
        style={[
          themed($navigationSection),
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={themed($linksContainer)}>
          <Text tx="forgotPasswordScreen:rememberPassword" style={themed($linkText)} />
          <Button
            tx="forgotPasswordScreen:logInLink"
            preset="ghost"
            size="sm"
            onPress={() => navigation.navigate("Login" as never)}
            style={themed($linkButton)}
          />
        </View>
      </Animated.View>
    </Screen>
  )
}

// Modern Forgot Password Screen Styles

// Screen Container
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flexGrow: 1,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
  backgroundColor: colors.backgroundSecondary,
})

// Header Section
const $headerSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.xl,
  paddingHorizontal: spacing.lg,
})

// Logo Container
const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

// Logo Styling
const $logo: ThemedStyle<ImageStyle> = () => ({
  height: 60,
  width: 200,
})

// Welcome Title
const $welcomeTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.text,
  marginBottom: spacing.sm,
})

// Welcome Subtitle
const $welcomeSubtitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.textDim,
  marginBottom: spacing.xl,
})

// Reset Container
const $resetContainer: ThemedStyle<ViewStyle> = ({ spacing, colors, elevation }) => ({
  marginHorizontal: spacing.md,
  marginBottom: spacing.xl,
  backgroundColor: colors.background,
  borderRadius: spacing.md,
  padding: spacing.lg,
  ...elevation.level2,
})

// Security Indicator
const $securityIndicator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.lg,
})

// Security Badge
const $securityBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.info500 + "15", // 15% opacity
  borderRadius: spacing.lg,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  borderWidth: 1,
  borderColor: colors.palette.info500 + "30", // 30% opacity
})

// Security Text
const $securityText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.info500,
  fontWeight: "600",
})

// Success Container
const $successContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.lg,
})

// Success Badge
const $successBadge: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.palette.success500 + "15", // 15% opacity
  borderRadius: spacing.sm,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  borderWidth: 1,
  borderColor: colors.palette.success500 + "30", // 30% opacity
})

// Success Message
const $successMessage: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.success500,
  textAlign: "center",
  fontWeight: "500",
})

// Form Container
const $formContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.lg,
})

// Text Field
const $textField: ThemedStyle<ViewStyle> = () => ({
  // No additional margins, handled by gap in form container
})

// Primary Button
const $primaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})

// Navigation Section
const $navigationSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.lg,
})

// Links Container
const $linksContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: spacing.xs,
})

// Link Text
const $linkText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

// Link Button
const $linkButton: ThemedStyle<ViewStyle> = () => ({
  minHeight: 36,
})
