import { useEffect, useRef } from "react"
import { Animated } from "react-native"
import { PageTransitions } from "./animations"

export interface PageTransitionOptions {
  /**
   * Type of transition animation
   */
  type?: "fade" | "slideRight" | "slideLeft" | "modal"
  /**
   * Duration of the transition in milliseconds
   */
  duration?: number
  /**
   * Whether to auto-start the transition
   */
  autoStart?: boolean
}

/**
 * Hook for managing page transition animations
 */
export function usePageTransition({
  type = "fade",
  duration,
  autoStart = true,
}: PageTransitionOptions = {}) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  useEffect(() => {
    if (autoStart) {
      startTransition()
    }
  }, [autoStart])

  const startTransition = () => {
    switch (type) {
      case "fade":
        return PageTransitions.fade(fadeAnim, 1).start()
      case "slideRight":
        return PageTransitions.slideInRight(slideAnim).start()
      case "slideLeft":
        return PageTransitions.slideOutLeft(slideAnim).start()
      case "modal":
        return PageTransitions.modalSlideUp(slideAnim).start()
      default:
        return PageTransitions.fade(fadeAnim, 1).start()
    }
  }

  const exitTransition = (callback?: () => void) => {
    switch (type) {
      case "fade":
        return PageTransitions.fade(fadeAnim, 0).start(callback)
      case "slideRight":
        return PageTransitions.slideOutLeft(slideAnim).start(callback)
      case "slideLeft":
        return PageTransitions.slideInRight(slideAnim).start(callback)
      case "modal":
        return PageTransitions.modalSlideDown(slideAnim, 1000).start(callback)
      default:
        return PageTransitions.fade(fadeAnim, 0).start(callback)
    }
  }

  const getAnimatedStyle = () => {
    switch (type) {
      case "fade":
        return { opacity: fadeAnim }
      case "slideRight":
      case "slideLeft":
      case "modal":
        return { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }] 
        }
      default:
        return { opacity: fadeAnim }
    }
  }

  return {
    animatedStyle: getAnimatedStyle(),
    startTransition,
    exitTransition,
    fadeAnim,
    slideAnim,
  }
}

/**
 * Hook for entrance animations (used in screens we've already implemented)
 */
export function useEntranceAnimation() {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

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

  return {
    fadeAnim,
    slideAnim,
    animatedStyle: {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    },
    staggeredStyle: (delay: number = 0) => ({
      opacity: fadeAnim,
      transform: [
        {
          translateY: slideAnim.interpolate({
            inputRange: [0, 30],
            outputRange: [0, delay],
          }),
        },
      ],
    }),
  }
}
