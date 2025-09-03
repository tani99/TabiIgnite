import React, { useRef } from "react"
import { Animated, PanGestureHandler, PanGestureHandlerGestureEvent, State } from "react-native-gesture-handler"
import { runOnJS } from "react-native-reanimated"

import { GestureAnimations } from "@/utils/animations"

export interface GestureHandlerProps {
  children: React.ReactNode
  /**
   * Callback fired when swipe gesture is detected
   */
  onSwipe?: (direction: "left" | "right" | "up" | "down") => void
  /**
   * Callback fired when long press is detected
   */
  onLongPress?: () => void
  /**
   * Minimum distance for swipe detection
   */
  swipeThreshold?: number
  /**
   * Enable swipe gesture detection
   */
  enableSwipe?: boolean
  /**
   * Enable long press detection
   */
  enableLongPress?: boolean
  /**
   * Style for the gesture container
   */
  style?: any
}

/**
 * GestureHandler component for swipe and long press interactions
 * Provides smooth gesture feedback animations
 */
export function GestureHandler({
  children,
  onSwipe,
  onLongPress,
  swipeThreshold = 50,
  enableSwipe = true,
  enableLongPress = false,
  style,
}: GestureHandlerProps) {
  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(1)).current

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true }
  )

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent

      // Detect swipe direction
      if (enableSwipe && onSwipe) {
        if (Math.abs(translationX) > Math.abs(translationY)) {
          // Horizontal swipe
          if (Math.abs(translationX) > swipeThreshold) {
            const direction = translationX > 0 ? "right" : "left"
            runOnJS(onSwipe)(direction)
            GestureAnimations.swipe(translateX, translationX > 0 ? 1 : -1).start()
          }
        } else {
          // Vertical swipe
          if (Math.abs(translationY) > swipeThreshold) {
            const direction = translationY > 0 ? "down" : "up"
            runOnJS(onSwipe)(direction)
            GestureAnimations.swipe(translateY, translationY > 0 ? 1 : -1).start()
          }
        }
      }

      // Reset position if no swipe detected
      if (Math.abs(translationX) <= swipeThreshold && Math.abs(translationY) <= swipeThreshold) {
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start()
      }
    }
  }

  const onLongPressDetected = () => {
    if (enableLongPress && onLongPress) {
      GestureAnimations.longPress(scale).start()
      runOnJS(onLongPress)()
    }
  }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
      enabled={enableSwipe}
    >
      <Animated.View
        style={[
          {
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
          },
          style,
        ]}
        onLongPress={enableLongPress ? onLongPressDetected : undefined}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  )
}

/**
 * Pull to refresh component
 */
export interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => void
  refreshing?: boolean
  pullThreshold?: number
}

export function PullToRefresh({
  children,
  onRefresh,
  refreshing = false,
  pullThreshold = 100,
}: PullToRefreshProps) {
  const translateY = useRef(new Animated.Value(0)).current

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  )

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationY: translation } = event.nativeEvent

      if (translation > pullThreshold) {
        runOnJS(onRefresh)()
        GestureAnimations.pullToRefresh(translateY).start()
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      }
    }
  }

  return (
    <PanGestureHandler
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onHandlerStateChange}
    >
      <Animated.View
        style={{
          transform: [{ translateY }],
        }}
      >
        {children}
      </Animated.View>
    </PanGestureHandler>
  )
}
