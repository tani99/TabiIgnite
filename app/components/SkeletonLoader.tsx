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
    <View style={[themed($container), { width, height, borderRadius }, style]}>
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
