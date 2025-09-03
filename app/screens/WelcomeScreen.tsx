import { FC, useCallback, useState } from "react"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Ionicons } from '@expo/vector-icons'

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
  const [open, setOpen] = useState(false)

  const { logout } = useAuth()

  const toggleDrawer = useCallback(() => {
    setOpen(!open)
  }, [open])

  useHeader(
    {
      leftIcon: "menu",
      onLeftPress: toggleDrawer,
      RightActionComponent: (
        <TouchableOpacity
          onPress={() => {
            // Add your profile navigation logic here
          }}
          style={themed($profileIconContainer)}
        >
          <Ionicons name="person-circle" size={32} color={theme.colors.tint} />
        </TouchableOpacity>
      ),
    },
    [toggleDrawer, theme.colors.tint],
  )

  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])
  const $drawerInsets = useSafeAreaInsetsStyle(["top"])

  const renderDrawerContent = () => (
    <View style={themed([$drawer, $drawerInsets])}>
      <View style={themed($listContentContainer)}>
        <TouchableOpacity
          onPress={() => {
            setOpen(false)
            // Add your account navigation logic here
          }}
          style={themed($menuContainer)}
        >
          <Text preset="default" text="Account" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => {
            setOpen(false)
            // Add your option 1 logic here
          }}
          style={themed($menuContainer)}
        >
          <Text preset="default" text="Option 1" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => {
            setOpen(false)
            // Add your option 2 logic here
          }}
          style={themed($menuContainer)}
        >
          <Text preset="default" text="Option 2" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => {
            setOpen(false)
            // Add your option 3 logic here
          }}
          style={themed($menuContainer)}
        >
          <Text preset="default" text="Option 3" />
        </TouchableOpacity>
      </View>

      {/* Logout Button at bottom of drawer */}
      <View style={themed($logoutContainer)}>
        <TouchableOpacity
          onPress={() => {
            setOpen(false)
            logout()
          }}
          style={themed($logoutButton)}
        >
          <Text preset="default" tx="common:logOut" />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      drawerType="back"
      drawerPosition={isRTL ? "right" : "left"}
      renderDrawerContent={renderDrawerContent}
    >
      <Screen preset="fixed" contentContainerStyle={$styles.flex1}>
        <View style={themed($topContainer)}>
          <Text
            testID="welcome-heading"
            style={themed($welcomeHeading)}
            tx="welcomeScreen:readyForLaunch"
            preset="heading"
          />
          <Text tx="welcomeScreen:exciting" preset="subheading" />
          <Image
            style={$welcomeFace}
            source={welcomeFace}
            resizeMode="contain"
            tintColor={theme.colors.palette.neutral900}
          />
        </View>

        <View style={themed([$bottomContainer, $bottomContainerInsets])}>
          <Text tx="welcomeScreen:postscript" size="md" />

          <Button
            testID="next-screen-button"
            preset="reversed"
            tx="welcomeScreen:letsGo"
            onPress={() => {
              // Add your navigation logic here
            }}
          />
        </View>
      </Screen>
    </Drawer>
  )
}

const $topContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexShrink: 1,
  flexGrow: 1,
  flexBasis: "57%",
  justifyContent: "center",
  paddingHorizontal: spacing.lg,
})

const $bottomContainer: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flexShrink: 1,
  flexGrow: 0,
  flexBasis: "43%",
  backgroundColor: colors.palette.neutral100,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
})

const $welcomeLogo: ThemedStyle<ImageStyle> = ({ spacing }) => ({
  height: 88,
  width: "100%",
  marginBottom: spacing.xxl,
})

const $welcomeFace: ImageStyle = {
  height: 169,
  width: 269,
  position: "absolute",
  bottom: -47,
  right: -80,
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

const $welcomeHeading: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $drawer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})



const $listContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
})

const $menuContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xs,
  paddingTop: spacing.lg,
})

const $logoutContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.lg,
  paddingBottom: spacing.lg,
  borderTopWidth: 1,
  borderTopColor: "rgba(0,0,0,0.1)",
  paddingTop: spacing.md,
})

const $logoutButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.sm,
})

const $profileIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  justifyContent: "center",
  alignItems: "center",
})
