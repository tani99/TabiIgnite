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

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

const welcomeLogo = require("@assets/images/logo.png")

export const LoginScreen: FC<LoginScreenProps> = () => {
  const navigation = useNavigation()
  const authPasswordInput = useRef<TextInput>(null)

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseError, setFirebaseError] = useState("")
  const { authEmail, setAuthEmail, login, validationError } = useAuth()

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

  const emailError = isSubmitted && validationError && validationError.includes("email") ? validationError : ""
  const passwordError = isSubmitted && (firebaseError || (validationError && !validationError.includes("email"))) ? (firebaseError || validationError) : ""

  async function handleLogin() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)
    setFirebaseError("")

    if (validationError) return

    try {
      setIsLoading(true)
      if (authEmail && authPassword) {
        await login(authEmail, authPassword)
      }

      // Clear form on successful login
      setIsSubmitted(false)
      setAuthPassword("")
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
          testID="login-heading" 
          tx="loginScreen:logIn" 
          preset="heading" 
          size="xxl"
          weight="bold"
          style={themed($welcomeTitle)} 
        />
        <Text 
          tx="loginScreen:enterDetails" 
          preset="subheading" 
          style={themed($welcomeSubtitle)} 
        />
      </Animated.View>

      {/* Modern Login Card */}
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
        <View style={themed($loginContainer)}>
          {/* Security Indicator */}
          <View style={themed($securityIndicator)}>
            <View style={themed($securityBadge)}>
              <Text preset="formLabel" size="xs" style={themed($securityText)}>
                🔒 Secure Login
              </Text>
            </View>
          </View>

          {/* Login Hint */}
          {attemptsCount > 2 && (
            <View style={themed($hintContainer)}>
              <Text tx="loginScreen:hint" size="sm" weight="light" style={themed($hint)} />
            </View>
          )}

          {/* Login Form */}
          <View style={themed($formContainer)}>
            <TextField
              value={authEmail}
              onChangeText={(text) => {
                setAuthEmail(text)
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
              labelTx="loginScreen:emailFieldLabel"
              placeholderTx="loginScreen:emailFieldPlaceholder"
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
              labelTx="loginScreen:passwordFieldLabel"
              placeholderTx="loginScreen:passwordFieldPlaceholder"
              helper={passwordError}
              status={passwordError ? "error" : undefined}
              onSubmitEditing={handleLogin}
              RightAccessory={PasswordRightAccessory}
              editable={!isLoading}
            />

            {/* Primary CTA Button */}
            <Button
              testID="login-button"
              tx={isLoading ? "loginScreen:loggingIn" : "loginScreen:tapToLogIn"}
              style={themed($primaryButton)}
              preset="primary"
              size="lg"
              loading={isLoading}
              onPress={handleLogin}
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
          <Button
            tx="loginScreen:signUpLink"
            preset="ghost"
            size="sm"
            onPress={() => navigation.navigate("SignUp" as never)}
            style={themed($linkButton)}
          />
          <View style={themed($linkSeparator)} />
          <Button
            tx="loginScreen:forgotPasswordLink"
            preset="ghost"
            size="sm"
            onPress={() => navigation.navigate("ForgotPassword" as never)}
            style={themed($linkButton)}
          />
        </View>
      </Animated.View>
    </Screen>
  )
}

// Modern Login Screen Styles

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

// Login Container
const $loginContainer: ThemedStyle<ViewStyle> = ({ spacing, colors, elevation }) => ({
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

// Hint Container
const $hintContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
  alignItems: "center",
})

// Hint Text
const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.info500,
  textAlign: "center",
  paddingHorizontal: spacing.md,
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
  gap: spacing.sm,
})

// Link Button
const $linkButton: ThemedStyle<ViewStyle> = () => ({
  minHeight: 36,
})

// Link Separator
const $linkSeparator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 1,
  height: 16,
  backgroundColor: colors.borderSubtle,
})
