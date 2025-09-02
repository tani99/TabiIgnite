import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
// eslint-disable-next-line no-restricted-imports
import { TextInput, TextStyle, ViewStyle } from "react-native"
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

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

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

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  // Remove hardcoded credentials from useEffect
  useEffect(() => {
    // Firebase authentication will be implemented in Phase 2
    // No pre-filling of credentials for security
  }, [])

  const error = isSubmitted ? validationError || firebaseError : ""

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
      setIsSubmitted(false)

      // Handle Firebase auth errors
      if (error.code === "auth/user-not-found") {
        setFirebaseError("No account found with this email address")
      } else if (error.code === "auth/wrong-password") {
        setFirebaseError("Incorrect password")
      } else if (error.code === "auth/invalid-email") {
        setFirebaseError("Invalid email address")
      } else if (error.code === "auth/too-many-requests") {
        setFirebaseError("Too many failed attempts. Please try again later")
      } else if (error.code === "auth/network-request-failed") {
        setFirebaseError("Network error. Please check your connection")
      } else {
        setFirebaseError("Login failed. Please try again")
      }
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
      <Text testID="login-heading" tx="loginScreen:logIn" preset="heading" style={themed($logIn)} />
      <Text tx="loginScreen:enterDetails" preset="subheading" style={themed($enterDetails)} />
      {attemptsCount > 2 && (
        <Text tx="loginScreen:hint" size="sm" weight="light" style={themed($hint)} />
      )}

      <TextField
        value={authEmail}
        onChangeText={setAuthEmail}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen:emailFieldLabel"
        placeholderTx="loginScreen:emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
        editable={!isLoading}
      />

      <TextField
        ref={authPasswordInput}
        value={authPassword}
        onChangeText={setAuthPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen:passwordFieldLabel"
        placeholderTx="loginScreen:passwordFieldPlaceholder"
        onSubmitEditing={handleLogin}
        RightAccessory={PasswordRightAccessory}
        editable={!isLoading}
      />

      <Button
        testID="login-button"
        tx={isLoading ? "loginScreen:loggingIn" : "loginScreen:tapToLogIn"}
        style={themed($tapButton)}
        preset="reversed"
        onPress={handleLogin}
        disabled={isLoading}
      />

      {/* Sign Up and Forgot Password Links */}
      <Text style={themed($linksContainer)}>
        <Text
          tx="loginScreen:signUpLink"
          style={themed($link)}
          onPress={() => {
            navigation.navigate("SignUp" as never)
          }}
        />
        <Text tx="loginScreen:separator" style={themed($separator)} />
        <Text
          tx="loginScreen:forgotPasswordLink"
          style={themed($link)}
          onPress={() => {
            navigation.navigate("ForgotPassword" as never)
          }}
        />
      </Text>
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})

const $linksContainer: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginTop: spacing.lg,
  textAlign: "center",
})

const $link: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
  textDecorationLine: "underline",
})

const $separator: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral600,
  marginHorizontal: spacing.sm,
})
