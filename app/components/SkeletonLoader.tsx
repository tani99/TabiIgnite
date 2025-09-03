import React, { useEffect, useRef } from "react"
import { Animated, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { LoadingAnimations } from "@/utils/animations"

export interface SkeletonLoaderProps {
  /**
   * Width of the skeleton element
   */
  width?: number | string
  /**
   * Height of the skeleton element
   */
  height?: number | string
  /**
   * Border radius for the skeleton element
   */
  borderRadius?: number
  /**
   * Style override for the skeleton container
   */
  style?: ViewStyle
  /**
   * Animation type for the skeleton
   */
  animationType?: "shimmer" | "pulse"
}

/**
 * SkeletonLoader component for loading states
 * Provides smooth, content-aware loading placeholders
 */
export function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
  animationType = "shimmer",
}: SkeletonLoaderProps) {
  const { themed } = useAppTheme()
  const animatedValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animation = animationType === "shimmer" 
      ? LoadingAnimations.shimmer(animatedValue)
      : LoadingAnimations.pulse(animatedValue)
    
    animation.start()

    return () => {
      animation.stop()
    }
  }, [animatedValue, animationType])

  const animatedStyle = animationType === "shimmer" 
    ? {
        opacity: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        }),
      }
    : {
        opacity: animatedValue,
      }

  return (
    <View style={[themed($container), { width: width as any, height: height as any, borderRadius }, style]}>
      <Animated.View style={[themed($shimmer), animatedStyle]} />
    </View>
  )
}

// Skeleton Container
const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.palette.neutral200,
  overflow: "hidden",
})

// Shimmer Effect
const $shimmer: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.palette.neutral300,
})

/**
 * Pre-built skeleton components for common use cases
 */
export const SkeletonPresets = {
  /**
   * Text line skeleton
   */
  TextLine: ({ width = "100%", ...props }: Partial<SkeletonLoaderProps>) => (
    <SkeletonLoader width={width} height={16} borderRadius={2} {...props} />
  ),

  /**
   * Title skeleton
   */
  Title: ({ width = "70%", ...props }: Partial<SkeletonLoaderProps>) => (
    <SkeletonLoader width={width} height={24} borderRadius={4} {...props} />
  ),

  /**
   * Subtitle skeleton
   */
  Subtitle: ({ width = "50%", ...props }: Partial<SkeletonLoaderProps>) => (
    <SkeletonLoader width={width} height={18} borderRadius={3} {...props} />
  ),

  /**
   * Button skeleton
   */
  Button: ({ width = 120, ...props }: Partial<SkeletonLoaderProps>) => (
    <SkeletonLoader width={width} height={44} borderRadius={8} {...props} />
  ),

  /**
   * Avatar skeleton
   */
  Avatar: ({ size = 48, ...props }: Partial<SkeletonLoaderProps> & { size?: number }) => (
    <SkeletonLoader width={size} height={size} borderRadius={size / 2} {...props} />
  ),

  /**
   * Card skeleton
   */
  Card: ({ ...props }: Partial<SkeletonLoaderProps>) => (
    <SkeletonLoader width="100%" height={120} borderRadius={12} {...props} />
  ),

  /**
   * Image skeleton
   */
  Image: ({ width = "100%", height = 200, ...props }: Partial<SkeletonLoaderProps>) => (
    <SkeletonLoader width={width} height={height} borderRadius={8} {...props} />
  ),

  /**
   * List item skeleton
   */
  ListItem: ({ ...props }: Partial<SkeletonLoaderProps>) => (
    <SkeletonLoader width="100%" height={60} borderRadius={6} {...props} />
  ),

  /**
   * Input field skeleton
   */
  Input: ({ ...props }: Partial<SkeletonLoaderProps>) => (
    <SkeletonLoader width="100%" height={48} borderRadius={6} {...props} />
  ),

  /**
   * Icon skeleton
   */
  Icon: ({ size = 24, ...props }: Partial<SkeletonLoaderProps> & { size?: number }) => (
    <SkeletonLoader width={size} height={size} borderRadius={4} {...props} />
  ),
}

/**
 * Skeleton group component for multiple skeleton elements
 */
export interface SkeletonGroupProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function SkeletonGroup({ children, style }: SkeletonGroupProps) {
  const { themed } = useAppTheme()
  
  return (
    <View style={[themed($groupContainer), style]}>
      {children}
    </View>
  )
}

const $groupContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

/**
 * Complex skeleton layouts for common screen patterns
 */
export const SkeletonLayouts = {
  /**
   * Profile screen skeleton
   */
  ProfileScreen: () => (
    <SkeletonGroup>
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <SkeletonPresets.Avatar size={80} />
        <View style={{ marginTop: 16, alignItems: "center" }}>
          <SkeletonPresets.Title width="60%" />
          <SkeletonPresets.Subtitle width="40%" />
        </View>
      </View>
      <SkeletonPresets.Card />
      <SkeletonGroup>
        <SkeletonPresets.ListItem />
        <SkeletonPresets.ListItem />
        <SkeletonPresets.ListItem />
      </SkeletonGroup>
    </SkeletonGroup>
  ),

  /**
   * Article/Post skeleton
   */
  Article: () => (
    <SkeletonGroup>
      <SkeletonPresets.Image height={200} />
      <SkeletonPresets.Title />
      <SkeletonPresets.Subtitle />
      <SkeletonGroup>
        <SkeletonPresets.TextLine />
        <SkeletonPresets.TextLine width="80%" />
        <SkeletonPresets.TextLine width="90%" />
      </SkeletonGroup>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
        <SkeletonPresets.Button width={100} />
        <SkeletonPresets.Icon />
      </View>
    </SkeletonGroup>
  ),

  /**
   * Chat message skeleton
   */
  ChatMessage: () => (
    <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 16 }}>
      <SkeletonPresets.Avatar size={40} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <SkeletonPresets.TextLine width="30%" />
        <SkeletonGroup style={{ marginTop: 4 }}>
          <SkeletonPresets.TextLine width="90%" />
          <SkeletonPresets.TextLine width="60%" />
        </SkeletonGroup>
      </View>
    </View>
  ),

  /**
   * Settings screen skeleton
   */
  SettingsScreen: () => (
    <SkeletonGroup>
      <SkeletonPresets.Title width="50%" />
      <SkeletonGroup>
        {Array.from({ length: 6 }, (_, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <SkeletonPresets.Icon />
              <SkeletonPresets.TextLine width={120} style={{ marginLeft: 12 }} />
            </View>
            <SkeletonPresets.Icon size={16} />
          </View>
        ))}
      </SkeletonGroup>
    </SkeletonGroup>
  ),

  /**
   * Form skeleton
   */
  Form: () => (
    <SkeletonGroup>
      <SkeletonPresets.Title width="40%" />
      <SkeletonPresets.Subtitle width="70%" />
      <SkeletonGroup>
        <SkeletonPresets.Input />
        <SkeletonPresets.Input />
        <SkeletonPresets.Input />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 24 }}>
          <SkeletonPresets.Button width="45%" />
          <SkeletonPresets.Button width="45%" />
        </View>
      </SkeletonGroup>
    </SkeletonGroup>
  ),

  /**
   * Card list skeleton
   */
  CardList: ({ count = 3 }: { count?: number } = {}) => (
    <SkeletonGroup>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={{ marginBottom: 16 }}>
          <SkeletonPresets.Card />
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <SkeletonPresets.Title width="80%" />
            <SkeletonPresets.TextLine width="60%" />
          </View>
        </View>
      ))}
    </SkeletonGroup>
  ),
}
