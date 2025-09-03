import React from "react"
import { View, ViewStyle } from "react-native"
import { Button } from "./Button"
import { useAppTheme } from "@/theme/context"

interface ThemeSwitcherProps {
  style?: ViewStyle
}

export function ThemeSwitcher({ style }: ThemeSwitcherProps) {
  const { themeContext, setThemeContextOverride } = useAppTheme()

  const switchToLight = () => setThemeContextOverride("light")
  const switchToDark = () => setThemeContextOverride("dark")
  const switchToSystem = () => setThemeContextOverride(undefined)

  return (
    <View style={[{ flexDirection: "row", gap: 8 }, style]}>
      <Button
        text="Light"
        onPress={switchToLight}
        style={{
          backgroundColor: themeContext === "light" ? "#C76542" : "#F4E0D9",
        }}
        textStyle={{
          color: themeContext === "light" ? "white" : "#A54F31",
        }}
      />
      <Button
        text="Dark"
        onPress={switchToDark}
        style={{
          backgroundColor: themeContext === "dark" ? "#C76542" : "#F4E0D9",
        }}
        textStyle={{
          color: themeContext === "dark" ? "white" : "#A54F31",
        }}
      />
      <Button
        text="System"
        onPress={switchToSystem}
        style={{
          backgroundColor: themeContext === undefined ? "#C76542" : "#F4E0D9",
        }}
        textStyle={{
          color: themeContext === undefined ? "white" : "#A54F31",
        }}
      />
    </View>
  )
}
