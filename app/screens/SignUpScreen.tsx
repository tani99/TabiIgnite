import { ComponentType, FC, useMemo, useRef, useState } from "react"
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

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

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

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const confirmPasswordError = useMemo(() => {
    if (!isSubmitted) return ""
    if (!authConfirmPassword) return "can't be blank"
    if (authConfirmPassword !== authPassword) return "passwords don't match"
    return ""
  }, [isSubmitted, authConfirmPassword, authPassword])

  const error = isSubmitted ? validationError || firebaseError || confirmPasswordError : ""

  async function handleSignUp() {
    setIsSubmitted(true)
    setFirebaseError("")

    if (validationError || confirmPasswordError) return

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
      setIsSubmitted(false)

      // Handle Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        setFirebaseError("An account with this email already exists")
      } else if (error.code === "auth/invalid-email") {
        setFirebaseError("Invalid email address")
      } else if (error.code === "auth/weak-password") {
        setFirebaseError("Password is too weak. Use at least 6 characters")
      } else if (error.code === "auth/network-request-failed") {
        setFirebaseError("Network error. Please check your connection")
      } else {
        setFirebaseError("Sign up failed. Please try again")
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
      <Text
        testID="signup-heading"
        tx="signUpScreen:signUp"
        preset="heading"
        style={themed($signUp)}
      />
      <Text tx="signUpScreen:enterDetails" preset="subheading" style={themed($enterDetails)} />

      <TextField
        value={authEmail}
        onChangeText={(text) => {
          setAuthEmail(text)
          setAuthEmailContext(text)
        }}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="signUpScreen:emailFieldLabel"
        placeholderTx="signUpScreen:emailFieldPlaceholder"
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
        labelTx="signUpScreen:passwordFieldLabel"
        placeholderTx="signUpScreen:passwordFieldPlaceholder"
        onSubmitEditing={() => authConfirmPasswordInput.current?.focus()}
        RightAccessory={PasswordRightAccessory}
        editable={!isLoading}
      />

      <TextField
        ref={authConfirmPasswordInput}
        value={authConfirmPassword}
        onChangeText={setAuthConfirmPassword}
        containerStyle={themed($textField)}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthConfirmPasswordHidden}
        labelTx="signUpScreen:confirmPasswordFieldLabel"
        placeholderTx="signUpScreen:confirmPasswordFieldPlaceholder"
        onSubmitEditing={handleSignUp}
        RightAccessory={ConfirmPasswordRightAccessory}
        editable={!isLoading}
      />

      <Button
        testID="signup-button"
        tx={isLoading ? "signUpScreen:signingUp" : "signUpScreen:tapToSignUp"}
        style={themed($tapButton)}
        preset="reversed"
        onPress={handleSignUp}
        disabled={isLoading}
      />

      {/* Back to Login Link */}
      <Text style={themed($linksContainer)}>
        <Text tx="signUpScreen:alreadyHaveAccount" style={themed($text)} />
        <Text
          tx="signUpScreen:logInLink"
          style={themed($link)}
          onPress={() => {
            navigation.navigate("Login" as never)
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

const $signUp: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
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

const $text: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral600,
})

const $link: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
  textDecorationLine: "underline",
  marginLeft: 4,
})
