import { FC, useEffect, useRef } from "react"
import { Animated, Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { useAuth } from "@/context/AuthContext"
import { isRTL } from "@/i18n"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { useHeader } from "@/utils/useHeader"
import { useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

const welcomeLogo = require("@assets/images/logo.png")
const welcomeFace = require("@assets/images/welcome-face.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(_props) {
  const { themed, theme } = useAppTheme()

  const { navigation } = _props
  const { logout } = useAuth()

  // Animation values for modern entrance effects
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const logoAnim = useRef(new Animated.Value(0)).current

  function goToProfile() {
    navigation.navigate("Profile")
  }

  useHeader(
    {
      rightTx: "common:logOut",
      onRightPress: logout,
    },
    [logout],
  )

  // Modern entrance animations
  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000,
        delay: 400,
        useNativeDriver: true,
      }),
    ]

    Animated.stagger(100, animations).start()
  }, [fadeAnim, slideAnim, logoAnim])

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  return (
    <Screen preset="fixed" contentContainerStyle={themed($screenContainer)}>
      {/* Modern Hero Section */}
      <Animated.View 
        style={[
          themed($heroSection),
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Animated Logo */}
        <Animated.View
          style={[
            themed($logoContainer),
            {
              opacity: logoAnim,
              transform: [
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image 
            style={themed($modernLogo)} 
            source={welcomeLogo} 
            resizeMode="contain" 
          />
        </Animated.View>

        {/* Modern Typography Hierarchy */}
        <View style={themed($textContainer)}>
          <Text
            testID="welcome-heading"
            style={themed($heroTitle)}
            tx="welcomeScreen:readyForLaunch"
            preset="heading"
            size="xxl"
            weight="bold"
          />
          <Text 
            tx="welcomeScreen:exciting" 
            preset="subheading"
            style={themed($heroSubtitle)}
          />
          <Text 
            tx="welcomeScreen:postscript" 
            preset="default"
            size="lg"
            style={themed($heroDescription)}
          />
        </View>

        {/* Modern Illustration */}
        <Animated.View
          style={[
            themed($illustrationContainer),
            {
              opacity: logoAnim,
              transform: [
                {
                  scale: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Image
            style={themed($modernIllustration)}
            source={welcomeFace}
            resizeMode="contain"
            tintColor={theme.colors.tint}
          />
        </Animated.View>
      </Animated.View>

      {/* Modern CTA Section */}
      <Animated.View 
        style={[
          themed([$ctaSection, $bottomContainerInsets]),
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 30],
                }),
              },
            ],
          },
        ]}
      >
        <Button
          testID="profile-button"
          preset="primary"
          size="lg"
          text="View Profile"
          onPress={goToProfile}
          style={themed($primaryButton)}
        />
      </Animated.View>
    </Screen>
  )
}

// Modern Welcome Screen Styles

// Screen Container with Gradient Background
const $screenContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
  // Modern gradient background effect (using background color as fallback)
  background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.backgroundSecondary} 100%)`,
})

// Hero Section - Main content area
const $heroSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xxxl,
})

// Logo Container
const $logoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xl,
})

// Modern Logo Styling
const $modernLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 120,
  width: "100%",
  maxWidth: 280,
  marginBottom: spacing.lg,
})

// Text Container for Typography Hierarchy
const $textContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  marginBottom: spacing.xxxl,
  paddingHorizontal: spacing.md,
})

// Hero Title - Large, Bold Display Text
const $heroTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.text,
  marginBottom: spacing.md,
  letterSpacing: -0.02,
})

// Hero Subtitle - Secondary Heading
const $heroSubtitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.textDim,
  marginBottom: spacing.lg,
  lineHeight: 32,
})

// Hero Description - Body Text
const $heroDescription: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.textSubtle,
  lineHeight: 24,
  maxWidth: 320,
})

// Illustration Container
const $illustrationContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "absolute",
  bottom: spacing.xxxl,
  right: -spacing.xl,
  zIndex: -1,
})

// Modern Illustration Styling
const $modernIllustration: ThemedStyle<ImageStyle> = () => ({
  height: 200,
  width: 320,
  opacity: 0.8,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
})

// CTA Section - Call to Action
const $ctaSection: ThemedStyle<ViewStyle> = ({ spacing, colors, elevation }) => ({
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.xl,
  backgroundColor: colors.background,
  borderTopLeftRadius: spacing.lg,
  borderTopRightRadius: spacing.lg,
  alignItems: "center",
  ...elevation.level2,
})

// Primary Button Styling
const $primaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 240,
  marginBottom: spacing.sm,
})

// Secondary Button Styling
const $secondaryButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  minWidth: 200,
  marginTop: spacing.xs,
})
