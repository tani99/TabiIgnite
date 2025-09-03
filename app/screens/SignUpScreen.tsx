import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { Animated, TextInput, TextStyle, View, ViewStyle, Image, ImageStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Button } from "@/components/Button"
import { PressableIcon } from "@/components/Icon"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField, type TextFieldAccessoryProps } from "@/components/TextField"

import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { getErrorMessageForDisplay } from "@/utils/firebaseErrorHandler"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

const welcomeLogo = require("@assets/images/logo.png")

export const SignUpScreen: FC<SignUpScreenProps> = () => {
  const navigation = useNavigation()
  const authPasswordInput = useRef<TextInput>(null)
  const authConfirmPasswordInput = useRef<TextInput>(null)

  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [authConfirmPassword, setAuthConfirmPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isAuthConfirmPasswordHidden, setIsAuthConfirmPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseError, setFirebaseError] = useState("")
  const { setAuthEmail: setAuthEmailContext, signUp, validationError } = useAuth()

  // Animation values for modern entrance effects
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

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

  const confirmPasswordError = useMemo(() => {
    if (!isSubmitted) return ""
    if (!authConfirmPassword) return "Please confirm your password"
    if (authConfirmPassword !== authPassword) return "Passwords do not match"
    return ""
  }, [isSubmitted, authConfirmPassword, authPassword])

  const passwordValidationError = useMemo(() => {
    if (!isSubmitted) return ""
    if (!authPassword) return "Password is required"
    if (authPassword.length < 6) return "Password must be at least 6 characters"
    return ""
  }, [isSubmitted, authPassword])

  const emailError = isSubmitted && (validationError && validationError.includes("email") || firebaseError) ? (validationError && validationError.includes("email") ? validationError : firebaseError) : ""
  const passwordError = isSubmitted && (passwordValidationError || (validationError && !validationError.includes("email"))) ? (passwordValidationError || validationError) : ""

  const error = isSubmitted ? validationError || firebaseError || confirmPasswordError || passwordValidationError : ""

  async function handleSignUp() {
    setIsSubmitted(true)
    setFirebaseError("")

    if (validationError || confirmPasswordError || passwordValidationError) return

    try {
      setIsLoading(true)
      if (authEmail && authPassword) {
        await signUp(authEmail, authPassword)
      }

      // Clear form on successful signup
      setIsSubmitted(false)
      setAuthPassword("")
      setAuthConfirmPassword("")
      setAuthEmail("")
    } catch (error: any) {
      setIsLoading(false)
      // Don't reset isSubmitted on Firebase errors - keep it true to show the error

      // Handle Firebase auth errors using centralized error handler
      setFirebaseError(getErrorMessageForDisplay(error.code))
    }
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  const ConfirmPasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function ConfirmPasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <PressableIcon
            icon={isAuthConfirmPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthConfirmPasswordHidden(!isAuthConfirmPasswordHidden)}
          />
        )
      },
    [isAuthConfirmPasswordHidden, colors.palette.neutral800],
  )

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
          testID="signup-heading" 
          tx="signUpScreen:signUp" 
          preset="heading" 
          size="xxl"
          weight="bold"
          style={themed($welcomeTitle)} 
        />
        <Text 
          tx="signUpScreen:enterDetails" 
          preset="subheading" 
          style={themed($welcomeSubtitle)} 
        />
      </Animated.View>

      {/* Modern Sign Up Card */}
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
        <View style={themed($signUpContainer)}>
          {/* Security Indicator */}
          <View style={themed($securityIndicator)}>
            <View style={themed($securityBadge)}>
              <Text preset="formLabel" size="xs" style={themed($securityText)}>
                🛡️ Secure Registration
              </Text>
            </View>
          </View>



          {/* Sign Up Form */}
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
              labelTx="signUpScreen:emailFieldLabel"
              placeholderTx="signUpScreen:emailFieldPlaceholder"
              helper={emailError}
              status={emailError ? "error" : undefined}
              onSubmitEditing={() => authPasswordInput.current?.focus()}
              onBlur={() => {
                if (firebaseError) {
                  setFirebaseError("")
                }
              }}
              editable={!isLoading}
            />

            <TextField
              ref={authPasswordInput}
              value={authPassword}
              onChangeText={(text) => {
                setAuthPassword(text)
                if (firebaseError) {
                  setFirebaseError("")
                }
              }}
              containerStyle={themed($textField)}
              variant="filled"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              secureTextEntry={isAuthPasswordHidden}
              labelTx="signUpScreen:passwordFieldLabel"
              placeholderTx="signUpScreen:passwordFieldPlaceholder"
              helper={passwordError}
              status={passwordError ? "error" : undefined}
              onSubmitEditing={() => authConfirmPasswordInput.current?.focus()}
              RightAccessory={PasswordRightAccessory}
              editable={!isLoading}
            />

            <TextField
              ref={authConfirmPasswordInput}
              value={authConfirmPassword}
              onChangeText={(text) => {
                setAuthConfirmPassword(text)
                if (firebaseError) {
                  setFirebaseError("")
                }
              }}
              containerStyle={themed($textField)}
              variant="filled"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              secureTextEntry={isAuthConfirmPasswordHidden}
              labelTx="signUpScreen:confirmPasswordFieldLabel"
              placeholderTx="signUpScreen:confirmPasswordFieldPlaceholder"
              helper={confirmPasswordError}
              status={confirmPasswordError ? "error" : undefined}
              onSubmitEditing={handleSignUp}
              RightAccessory={ConfirmPasswordRightAccessory}
              editable={!isLoading}
            />

            {/* Primary CTA Button */}
            <Button
              testID="signup-button"
              tx={isLoading ? "signUpScreen:signingUp" : "signUpScreen:tapToSignUp"}
              style={themed($primaryButton)}
              preset="primary"
              size="lg"
              loading={isLoading}
              onPress={handleSignUp}
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
          <Text tx="signUpScreen:alreadyHaveAccount" style={themed($linkText)} />
          <Button
            tx="signUpScreen:logInLink"
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

// Modern Sign Up Screen Styles

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

// Sign Up Container
const $signUpContainer: ThemedStyle<ViewStyle> = ({ spacing, colors, elevation }) => ({
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
  backgroundColor: colors.palette.success500 + "15", // 15% opacity
  borderRadius: spacing.lg,
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xxs,
  borderWidth: 1,
  borderColor: colors.palette.success500 + "30", // 30% opacity
})

// Security Text
const $securityText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.success500,
  fontWeight: "600",
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
