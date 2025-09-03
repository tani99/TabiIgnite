import React from "react"
import { ScrollView, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Icon, IconPresets, IconSizes, IconStates, IconTypes, IconUtils, PressableIcon } from "./Icon"
import { Text } from "./Text"

/**
 * IconShowcase component to demonstrate the modern icon system
 * Shows all available icons, sizes, and states
 */
export function IconShowcase() {
  const { themed } = useAppTheme()

  const sizes: IconSizes[] = IconUtils.getAllSizes()
  const states: IconStates[] = ["default", "active", "inactive", "disabled"]
  const sampleIcons: IconTypes[] = ["back", "check", "settings", "heart", "menu"]

  return (
    <ScrollView style={themed($container)} showsVerticalScrollIndicator={false}>
      {/* Size Showcase */}
      <View style={themed($section)}>
        <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
          Icon Sizes
        </Text>
        <Text preset="default" size="sm" style={themed($sectionDescription)}>
          Modern icon sizing system: xs (16px), sm (20px), md (24px), lg (32px), xl (40px)
        </Text>
        
        <View style={themed($showcaseRow)}>
          {sizes.map((size) => (
            <View key={size} style={themed($showcaseItem)}>
              <Icon icon="settings" size={size} />
              <Text preset="default" size="xs" style={themed($itemLabel)}>
                {size} ({IconUtils.getSizeValue(size)}px)
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* State Showcase */}
      <View style={themed($section)}>
        <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
          Icon States
        </Text>
        <Text preset="default" size="sm" style={themed($sectionDescription)}>
          Different states for various UI contexts and interactions
        </Text>
        
        <View style={themed($showcaseRow)}>
          {states.map((state) => (
            <View key={state} style={themed($showcaseItem)}>
              <Icon icon="heart" size="lg" state={state} />
              <Text preset="default" size="xs" style={themed($itemLabel)}>
                {state}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Outline Style Showcase */}
      <View style={themed($section)}>
        <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
          Outline Style
        </Text>
        <Text preset="default" size="sm" style={themed($sectionDescription)}>
          Modern outline styling for enhanced visual hierarchy
        </Text>
        
        <View style={themed($showcaseRow)}>
          <View style={themed($showcaseItem)}>
            <Icon icon="settings" size="lg" outline={false} />
            <Text preset="default" size="xs" style={themed($itemLabel)}>
              Default
            </Text>
          </View>
          <View style={themed($showcaseItem)}>
            <Icon icon="settings" size="lg" outline={true} />
            <Text preset="default" size="xs" style={themed($itemLabel)}>
              Outline
            </Text>
          </View>
        </View>
      </View>

      {/* Pressable Icons */}
      <View style={themed($section)}>
        <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
          Pressable Icons
        </Text>
        <Text preset="default" size="sm" style={themed($sectionDescription)}>
          Interactive icons with proper touch targets (44px minimum)
        </Text>
        
        <View style={themed($showcaseRow)}>
          {sampleIcons.slice(0, 3).map((iconName) => (
            <View key={iconName} style={themed($showcaseItem)}>
              <PressableIcon 
                icon={iconName} 
                size="lg" 
                onPress={() => console.log(`Pressed ${iconName}`)}
                outline={true}
              />
              <Text preset="default" size="xs" style={themed($itemLabel)}>
                {iconName}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Icon Presets */}
      <View style={themed($section)}>
        <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
          Icon Presets
        </Text>
        <Text preset="default" size="sm" style={themed($sectionDescription)}>
          Pre-configured icon sets for common use cases
        </Text>

        {/* Navigation Presets */}
        <View style={themed($presetSection)}>
          <Text preset="default" size="md" weight="medium" style={themed($presetTitle)}>
            Navigation
          </Text>
          <View style={themed($showcaseRow)}>
            {Object.entries(IconPresets.Navigation).map(([key, preset]) => (
              <View key={key} style={themed($showcaseItem)}>
                <Icon {...preset} />
                <Text preset="default" size="xs" style={themed($itemLabel)}>
                  {key}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Presets */}
        <View style={themed($presetSection)}>
          <Text preset="default" size="md" weight="medium" style={themed($presetTitle)}>
            Actions
          </Text>
          <View style={themed($showcaseRow)}>
            {Object.entries(IconPresets.Actions).map(([key, preset]) => (
              <View key={key} style={themed($showcaseItem)}>
                <Icon {...preset} />
                <Text preset="default" size="xs" style={themed($itemLabel)}>
                  {key}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Social Presets */}
        <View style={themed($presetSection)}>
          <Text preset="default" size="md" weight="medium" style={themed($presetTitle)}>
            Social
          </Text>
          <View style={themed($showcaseRow)}>
            {Object.entries(IconPresets.Social).map(([key, preset]) => (
              <View key={key} style={themed($showcaseItem)}>
                <Icon {...preset} />
                <Text preset="default" size="xs" style={themed($itemLabel)}>
                  {key}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* All Available Icons */}
      <View style={themed($section)}>
        <Text preset="heading" size="lg" weight="semiBold" style={themed($sectionTitle)}>
          All Available Icons
        </Text>
        <Text preset="default" size="sm" style={themed($sectionDescription)}>
          Complete icon registry organized by category
        </Text>
        
        <View style={themed($iconGrid)}>
          {IconUtils.getAllIcons().map((iconName) => (
            <View key={iconName} style={themed($gridItem)}>
              <Icon icon={iconName} size="md" />
              <Text preset="default" size="xs" style={themed($gridLabel)}>
                {iconName}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

// Modern Icon Showcase Styles
const $container: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  flex: 1,
  backgroundColor: colors.background,
  padding: spacing.md,
})

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xxl,
})

const $sectionTitle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $sectionDescription: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  color: colors.textDim,
})

const $showcaseRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.md,
  marginBottom: spacing.lg,
})

const $showcaseItem: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  alignItems: "center",
  padding: spacing.md,
  backgroundColor: colors.backgroundSecondary,
  borderRadius: spacing.sm,
  minWidth: 80,
})

const $itemLabel: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xs,
  textAlign: "center",
  color: colors.textSubtle,
})

const $presetSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $presetTitle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.sm,
  color: colors.text,
})

const $iconGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.sm,
})

const $gridItem: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  alignItems: "center",
  padding: spacing.sm,
  backgroundColor: colors.backgroundSecondary,
  borderRadius: spacing.xs,
  minWidth: 60,
  flex: 1,
  maxWidth: "30%",
})

const $gridLabel: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginTop: spacing.xxs,
  textAlign: "center",
  color: colors.textSubtle,
})
