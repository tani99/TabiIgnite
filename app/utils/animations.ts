import { Animated, Easing } from "react-native"

/**
 * Animation System for TabiIgnite
 * Provides consistent, smooth animations throughout the app
 */

// Animation Timing Constants
export const ANIMATION_TIMING = {
  // Micro-interactions (fast, immediate feedback)
  micro: 150,
  
  // Standard interactions (button presses, toggles)
  fast: 250,
  
  // UI transitions (screen changes, modal appearances)
  standard: 300,
  
  // Complex transitions (page slides, complex layouts)
  slow: 500,
  
  // Loading and skeleton animations
  loading: 1000,
} as const

// Easing Functions for Different Animation Types
export const ANIMATION_EASING = {
  // Standard ease for most interactions
  standard: Easing.out(Easing.quad),
  
  // Sharp ease for micro-interactions
  sharp: Easing.out(Easing.cubic),
  
  // Gentle ease for loading states
  gentle: Easing.inOut(Easing.sine),
  
  // Bounce for success states
  bounce: Easing.bounce,
  
  // Linear for continuous animations
  linear: Easing.linear,
} as const

// Common Animation Values
export const ANIMATION_VALUES = {
  // Scale transforms
  scale: {
    pressed: 0.95,
    hover: 1.02,
    normal: 1,
  },
  
  // Opacity states
  opacity: {
    hidden: 0,
    disabled: 0.5,
    visible: 1,
  },
  
  // Translation distances
  translate: {
    micro: 2,
    small: 8,
    medium: 16,
    large: 24,
    screen: 50,
  },
} as const

/**
 * Micro-interaction Animations
 */
export class MicroAnimations {
  /**
   * Button press animation with scale feedback
   */
  static buttonPress(animatedValue: Animated.Value) {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: ANIMATION_VALUES.scale.pressed,
        duration: ANIMATION_TIMING.micro,
        easing: ANIMATION_EASING.sharp,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: ANIMATION_VALUES.scale.normal,
        duration: ANIMATION_TIMING.micro,
        easing: ANIMATION_EASING.standard,
        useNativeDriver: true,
      }),
    ])
  }

  /**
   * Input focus animation with subtle scale
   */
  static inputFocus(animatedValue: Animated.Value) {
    return Animated.timing(animatedValue, {
      toValue: ANIMATION_VALUES.scale.hover,
      duration: ANIMATION_TIMING.fast,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }

  /**
   * Input blur animation returning to normal
   */
  static inputBlur(animatedValue: Animated.Value) {
    return Animated.timing(animatedValue, {
      toValue: ANIMATION_VALUES.scale.normal,
      duration: ANIMATION_TIMING.fast,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }

  /**
   * Toggle switch animation
   */
  static toggle(animatedValue: Animated.Value, toValue: number) {
    return Animated.timing(animatedValue, {
      toValue,
      duration: ANIMATION_TIMING.fast,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }

  /**
   * Ripple effect animation
   */
  static ripple(animatedValue: Animated.Value) {
    return Animated.timing(animatedValue, {
      toValue: 1,
      duration: ANIMATION_TIMING.standard,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }
}

/**
 * Page Transition Animations
 */
export class PageTransitions {
  /**
   * Slide in from right (iOS style)
   */
  static slideInRight(animatedValue: Animated.Value) {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration: ANIMATION_TIMING.standard,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }

  /**
   * Slide out to left
   */
  static slideOutLeft(animatedValue: Animated.Value) {
    return Animated.timing(animatedValue, {
      toValue: -ANIMATION_VALUES.translate.screen,
      duration: ANIMATION_TIMING.standard,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }

  /**
   * Fade transition
   */
  static fade(animatedValue: Animated.Value, toValue: number = 1) {
    return Animated.timing(animatedValue, {
      toValue,
      duration: ANIMATION_TIMING.standard,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }

  /**
   * Modal slide up
   */
  static modalSlideUp(animatedValue: Animated.Value) {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration: ANIMATION_TIMING.standard,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }

  /**
   * Modal slide down
   */
  static modalSlideDown(animatedValue: Animated.Value, screenHeight: number) {
    return Animated.timing(animatedValue, {
      toValue: screenHeight,
      duration: ANIMATION_TIMING.standard,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: true,
    })
  }
}

/**
 * Loading State Animations
 */
export class LoadingAnimations {
  /**
   * Skeleton shimmer animation
   */
  static shimmer(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: ANIMATION_TIMING.loading,
          easing: ANIMATION_EASING.linear,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: ANIMATION_TIMING.loading,
          easing: ANIMATION_EASING.linear,
          useNativeDriver: true,
        }),
      ]),
    )
  }

  /**
   * Pulse animation for loading states
   */
  static pulse(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.7,
          duration: ANIMATION_TIMING.loading / 2,
          easing: ANIMATION_EASING.gentle,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: ANIMATION_TIMING.loading / 2,
          easing: ANIMATION_EASING.gentle,
          useNativeDriver: true,
        }),
      ]),
    )
  }

  /**
   * Spinner rotation animation
   */
  static spinner(animatedValue: Animated.Value) {
    return Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: ANIMATION_TIMING.loading,
        easing: ANIMATION_EASING.linear,
        useNativeDriver: true,
      }),
    )
  }

  /**
   * Progress bar animation
   */
  static progressBar(animatedValue: Animated.Value, progress: number) {
    return Animated.timing(animatedValue, {
      toValue: progress,
      duration: ANIMATION_TIMING.standard,
      easing: ANIMATION_EASING.standard,
      useNativeDriver: false, // Width animations need UI thread
    })
  }
}

/**
 * Gesture Feedback Animations
 */
export class GestureAnimations {
  /**
   * Swipe gesture feedback
   */
  static swipe(animatedValue: Animated.Value, direction: number) {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: direction * ANIMATION_VALUES.translate.medium,
        duration: ANIMATION_TIMING.fast,
        easing: ANIMATION_EASING.sharp,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValue, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ])
  }

  /**
   * Pull to refresh animation
   */
  static pullToRefresh(animatedValue: Animated.Value) {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: ANIMATION_VALUES.translate.large,
        duration: ANIMATION_TIMING.fast,
        easing: ANIMATION_EASING.standard,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValue, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ])
  }

  /**
   * Long press feedback
   */
  static longPress(animatedValue: Animated.Value) {
    return Animated.timing(animatedValue, {
      toValue: ANIMATION_VALUES.scale.pressed,
      duration: ANIMATION_TIMING.slow,
      easing: ANIMATION_EASING.gentle,
      useNativeDriver: true,
    })
  }
}

/**
 * Success and Error State Animations
 */
export class FeedbackAnimations {
  /**
   * Success checkmark animation
   */
  static success(animatedValue: Animated.Value) {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.2,
        duration: ANIMATION_TIMING.fast,
        easing: ANIMATION_EASING.sharp,
        useNativeDriver: true,
      }),
      Animated.spring(animatedValue, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
    ])
  }

  /**
   * Error shake animation
   */
  static error(animatedValue: Animated.Value) {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: ANIMATION_VALUES.translate.small,
        duration: ANIMATION_TIMING.micro,
        easing: ANIMATION_EASING.sharp,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -ANIMATION_VALUES.translate.small,
        duration: ANIMATION_TIMING.micro,
        easing: ANIMATION_EASING.sharp,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: ANIMATION_VALUES.translate.small,
        duration: ANIMATION_TIMING.micro,
        easing: ANIMATION_EASING.sharp,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: ANIMATION_TIMING.micro,
        easing: ANIMATION_EASING.sharp,
        useNativeDriver: true,
      }),
    ])
  }
}

/**
 * Utility Functions for Animation Management
 */
export class AnimationUtils {
  /**
   * Create a staggered animation sequence
   */
  static stagger(animations: Animated.CompositeAnimation[], delay: number = 100) {
    return Animated.stagger(delay, animations)
  }

  /**
   * Create a parallel animation group
   */
  static parallel(animations: Animated.CompositeAnimation[]) {
    return Animated.parallel(animations)
  }

  /**
   * Create entrance animations for lists
   */
  static listEntrance(animatedValues: Animated.Value[], delay: number = 50) {
    const animations = animatedValues.map((value) =>
      Animated.timing(value, {
        toValue: 1,
        duration: ANIMATION_TIMING.standard,
        easing: ANIMATION_EASING.standard,
        useNativeDriver: true,
      }),
    )
    return AnimationUtils.stagger(animations, delay)
  }

  /**
   * Reset animated value to initial state
   */
  static reset(animatedValue: Animated.Value, initialValue: number = 0) {
    animatedValue.setValue(initialValue)
  }
}
