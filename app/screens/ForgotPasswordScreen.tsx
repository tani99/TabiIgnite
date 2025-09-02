import { FC, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ForgotPasswordScreenProps extends AppStackScreenProps<"ForgotPassword"> {}

export const ForgotPasswordScreen: FC<ForgotPasswordScreenProps> = () => {
  const navigation = useNavigation()
  const [authEmail, setAuthEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [firebaseError, setFirebaseError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const { setAuthEmail: setAuthEmailContext, validationError } = useAuth()

  const { themed } = useAppTheme()

  const error = isSubmitted ? validationError || firebaseError : ""

  function resetPassword() {
    setIsSubmitted(true)
    setFirebaseError("")
    setIsSuccess(false)

    if (validationError) return

    // TODO: Replace with Firebase sendPasswordResetEmail in Phase 2
    setIsLoading(true)

    // Simulate Firebase password reset delay
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(false)
      setAuthEmail("")
      setIsSuccess(true)

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text
        testID="forgot-password-heading"
        tx="forgotPasswordScreen:forgotPassword"
        preset="heading"
        style={themed($forgotPassword)}
      />
      <Text
        tx="forgotPasswordScreen:enterDetails"
        preset="subheading"
        style={themed($enterDetails)}
      />

      {isSuccess && (
        <Text
          tx="forgotPasswordScreen:successMessage"
          style={themed($successMessage)}
          preset="subheading"
        />
      )}

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
        labelTx="forgotPasswordScreen:emailFieldLabel"
        placeholderTx="forgotPasswordScreen:emailFieldPlaceholder"
        helper={error}
        status={error ? "error" : undefined}
        onSubmitEditing={resetPassword}
        editable={!isLoading}
      />

      <Button
        testID="reset-password-button"
        tx={
          isLoading
            ? "forgotPasswordScreen:resettingPassword"
            : "forgotPasswordScreen:tapToResetPassword"
        }
        style={themed($tapButton)}
        preset="reversed"
        onPress={resetPassword}
        disabled={isLoading}
      />

      {/* Back to Login Link */}
      <Text style={themed($linksContainer)}>
        <Text tx="forgotPasswordScreen:rememberPassword" style={themed($text)} />
        <Text
          tx="forgotPasswordScreen:logInLink"
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

const $forgotPassword: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $enterDetails: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $successMessage: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.palette.neutral600,
  marginBottom: spacing.lg,
  textAlign: "center",
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
