import { FC, useEffect, useRef } from "react"
import { Animated, TextStyle, ViewStyle, View, Image, ImageStyle, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { Button } from "@/components/Button"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { Switch } from "@/components/Toggle/Switch"
import { useAuth } from "@/context/AuthContext"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

const avatarPlaceholder = require("@assets/images/welcome-face.png")

export const ProfileScreen: FC<ProfileScreenProps> = () => {
  const navigation = useNavigation()
  const { authEmail, logout } = useAuth()

  // Animation values for modern entrance effects
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  const { themed, theme, setThemeContextOverride } = useAppTheme()

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

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleThemeToggle = (isDark: boolean) => {
    setThemeContextOverride(isDark ? "dark" : "light")
  }

  return (
    <Screen
      preset="fixed"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Header
        title="Profile"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        rightText="Logout"
        onRightPress={handleLogout}
        safeAreaEdges={[]}
      />
      <ScrollView 
        contentContainerStyle={themed($scrollContainer)}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Profile Header */}
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
          <View style={themed($avatarContainer)}>
            <View style={themed($avatarWrapper)}>
              <Image 
                style={themed($avatar)} 
                source={avatarPlaceholder} 
                resizeMode="cover" 
              />
              <View style={themed($avatarBadge)}>
                <Text preset="formLabel" size="xs" style={themed($badgeText)}>
                  ✨
                </Text>
              </View>
            </View>
          </View>

          {/* User Info */}
          <View style={themed($userInfoContainer)}>
            <Text 
              preset="heading" 
              size="xl"
              weight="bold"
              style={themed($userName)} 
              text="Welcome Back!"
            />
            <Text 
              preset="default" 
              size="md"
              style={themed($userEmail)} 
              text={authEmail || "user@example.com"}
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
          {/* Settings Section */}
          <View style={themed($sectionContainer)}>
            <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
              Settings
            </Text>

            {/* Theme Preference */}
            <View style={themed($settingItem)}>
              <View style={themed($settingInfo)}>
                <Text preset="default" size="md" weight="medium" style={themed($settingLabel)}>
                  Dark Mode
                </Text>
                <Text preset="default" size="sm" style={themed($settingDescription)}>
                  {theme.isDark ? "Dark theme enabled" : "Light theme enabled"}
                </Text>
              </View>
              <Switch
                value={theme.isDark}
                onValueChange={handleThemeToggle}
              />
            </View>
          </View>

          {/* Account Section */}
          <View style={themed($sectionContainer)}>
            <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
              Account
            </Text>

            {/* Account Info */}
            <View style={themed($accountCard)}>
              <View style={themed($accountItem)}>
                <Text preset="default" size="sm" weight="medium" style={themed($accountLabel)}>
                  Email Address
                </Text>
                <Text preset="default" size="md" style={themed($accountValue)}>
                  {authEmail || "user@example.com"}
                </Text>
              </View>

              <View style={themed($accountDivider)} />

              <View style={themed($accountItem)}>
                <Text preset="default" size="sm" weight="medium" style={themed($accountLabel)}>
                  Account Status
                </Text>
                <View style={themed($statusContainer)}>
                  <View style={themed($statusIndicator)} />
                  <Text preset="default" size="md" style={themed($statusText)}>
                    Active
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Actions Section */}
          <View style={themed($actionsSection)}>
            <Button
              preset="ghost"
              size="lg"
              onPress={handleLogout}
              style={themed($logoutButton)}
            >
              <Text preset="default" size="md" weight="medium" style={themed($logoutText)}>
                Sign Out
              </Text>
            </Button>
          </View>
        </Animated.View>
      </ScrollView>
    </Screen>
  )
}

// Modern Profile Screen Styles

// Screen Container
const $screenContentContainer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flexGrow: 1,
  backgroundColor: colors.backgroundSecondary,
})

// Scroll Container
const $scrollContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
})

// Header Section
const $headerSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  paddingVertical: spacing.xl,
  marginBottom: spacing.lg,
})

// Avatar Container
const $avatarContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

// Avatar Wrapper
const $avatarWrapper: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
})

// Avatar Image
const $avatar: ThemedStyle<ImageStyle> = ({ colors, spacing }) => ({
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: colors.palette.neutral200,
  borderWidth: 3,
  borderColor: colors.background,
})

// Avatar Badge
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

// Badge Text
const $badgeText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.background,
  fontWeight: "600",
})

// User Info Container
const $userInfoContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
})

// User Name
const $userName: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  textAlign: "center",
  color: colors.text,
  marginBottom: spacing.xs,
})

// User Email
const $userEmail: ThemedStyle<TextStyle> = ({ colors }) => ({
  textAlign: "center",
  color: colors.textDim,
})

// Section Container
const $sectionContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

// Section Title
const $sectionTitle: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.md,
})

// Setting Item
const $settingItem: ThemedStyle<ViewStyle> = ({ spacing, colors, elevation }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: colors.background,
  borderRadius: spacing.sm,
  padding: spacing.md,
  marginBottom: spacing.sm,
  ...elevation.level1,
})

// Setting Info
const $settingInfo: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  marginRight: spacing.md,
})

// Setting Label
const $settingLabel: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.text,
  marginBottom: spacing.xxs,
})

// Setting Description
const $settingDescription: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})

// Account Card
const $accountCard: ThemedStyle<ViewStyle> = ({ spacing, colors, elevation }) => ({
  backgroundColor: colors.background,
  borderRadius: spacing.sm,
  padding: spacing.md,
  ...elevation.level1,
})

// Account Item
const $accountItem: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.sm,
})

// Account Label
const $accountLabel: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.textSubtle,
  marginBottom: spacing.xxs,
})

// Account Value
const $accountValue: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

// Account Divider
const $accountDivider: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  height: 1,
  backgroundColor: colors.borderSubtle,
  marginVertical: spacing.sm,
})

// Status Container
const $statusContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: spacing.xs,
})

// Status Indicator
const $statusIndicator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: colors.palette.success500,
})

// Status Text
const $statusText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

// Actions Section
const $actionsSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xl,
  gap: spacing.md,
})

// Action Button
const $actionButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

// Button Text
const $buttonText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

// Logout Button
const $logoutButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})

// Logout Text
const $logoutText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.error500,
})
