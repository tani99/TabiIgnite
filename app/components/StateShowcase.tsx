import React, { useState } from "react"
import { ScrollView, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button } from "./Button"
import { EmptyState, EmptyStatePresets } from "./EmptyState"
import { ErrorState, ErrorStatePresets } from "./ErrorState"
import { SkeletonLayouts, SkeletonPresets } from "./SkeletonLoader"
import { SuccessState, SuccessStatePresets } from "./SuccessState"
import { Text } from "./Text"

type StateType = "loading" | "empty" | "error" | "success"

/**
 * StateShowcase component to demonstrate all state components
 * Shows loading, empty, error, and success states
 */
export function StateShowcase() {
  const { themed } = useAppTheme()
  const [currentState, setCurrentState] = useState<StateType>("loading")

  const renderCurrentState = () => {
    switch (currentState) {
      case "loading":
        return (
          <View style={themed($stateContainer)}>
            <Text preset="heading" size="lg" weight="semiBold" style={themed($stateTitle)}>
              Loading States
            </Text>
            
            {/* Skeleton Presets */}
            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Skeleton Presets
              </Text>
              <View style={themed($skeletonGrid)}>
                <View style={themed($skeletonItem)}>
                  <Text preset="default" size="xs" style={themed($itemLabel)}>Title</Text>
                  <SkeletonPresets.Title />
                </View>
                <View style={themed($skeletonItem)}>
                  <Text preset="default" size="xs" style={themed($itemLabel)}>Text Line</Text>
                  <SkeletonPresets.TextLine />
                </View>
                <View style={themed($skeletonItem)}>
                  <Text preset="default" size="xs" style={themed($itemLabel)}>Button</Text>
                  <SkeletonPresets.Button />
                </View>
                <View style={themed($skeletonItem)}>
                  <Text preset="default" size="xs" style={themed($itemLabel)}>Avatar</Text>
                  <SkeletonPresets.Avatar />
                </View>
                <View style={themed($skeletonItem)}>
                  <Text preset="default" size="xs" style={themed($itemLabel)}>Card</Text>
                  <SkeletonPresets.Card />
                </View>
                <View style={themed($skeletonItem)}>
                  <Text preset="default" size="xs" style={themed($itemLabel)}>Input</Text>
                  <SkeletonPresets.Input />
                </View>
              </View>
            </View>

            {/* Complex Layouts */}
            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Complex Layouts
              </Text>
              
              <View style={themed($layoutSection)}>
                <Text preset="default" size="sm" weight="medium" style={themed($layoutTitle)}>
                  Profile Screen
                </Text>
                <SkeletonLayouts.ProfileScreen />
              </View>

              <View style={themed($layoutSection)}>
                <Text preset="default" size="sm" weight="medium" style={themed($layoutTitle)}>
                  Article Layout
                </Text>
                <SkeletonLayouts.Article />
              </View>

              <View style={themed($layoutSection)}>
                <Text preset="default" size="sm" weight="medium" style={themed($layoutTitle)}>
                  Chat Messages
                </Text>
                <SkeletonLayouts.ChatMessage />
                <SkeletonLayouts.ChatMessage />
              </View>
            </View>
          </View>
        )

      case "empty":
        return (
          <View style={themed($stateContainer)}>
            <Text preset="heading" size="lg" weight="semiBold" style={themed($stateTitle)}>
              Empty States
            </Text>
            
            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Default Empty State
              </Text>
              <EmptyState
                title="No Content Available"
                description="This area will display content when it becomes available."
                icon="components"
                buttonText="Refresh"
                onButtonPress={() => console.log("Refresh pressed")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Search Results
              </Text>
              <EmptyStatePresets.NoSearchResults
                onButtonPress={() => console.log("Clear search")}
                onSecondaryButtonPress={() => console.log("Browse all")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Offline State
              </Text>
              <EmptyStatePresets.Offline
                onButtonPress={() => console.log("Retry connection")}
              />
            </View>
          </View>
        )

      case "error":
        return (
          <View style={themed($stateContainer)}>
            <Text preset="heading" size="lg" weight="semiBold" style={themed($stateTitle)}>
              Error States
            </Text>
            
            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Network Error
              </Text>
              <ErrorStatePresets.NetworkError
                onRetry={() => console.log("Retry network")}
                onSecondaryAction={() => console.log("Go offline")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Server Error
              </Text>
              <ErrorStatePresets.ServerError
                errorCode="500"
                onRetry={() => console.log("Try again")}
                onSecondaryAction={() => console.log("Report issue")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Authentication Error
              </Text>
              <ErrorStatePresets.AuthError
                onRetry={() => console.log("Sign in")}
                onSecondaryAction={() => console.log("Go back")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Validation Error
              </Text>
              <ErrorStatePresets.ValidationError
                onRetry={() => console.log("Fix input")}
                onSecondaryAction={() => console.log("Reset form")}
              />
            </View>
          </View>
        )

      case "success":
        return (
          <View style={themed($stateContainer)}>
            <Text preset="heading" size="lg" weight="semiBold" style={themed($stateTitle)}>
              Success States
            </Text>
            
            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Generic Success
              </Text>
              <SuccessStatePresets.Success
                onButtonPress={() => console.log("Continue")}
                onSecondaryAction={() => console.log("Done")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Data Saved
              </Text>
              <SuccessStatePresets.Saved
                onButtonPress={() => console.log("Continue editing")}
                onSecondaryAction={() => console.log("Close")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Message Sent
              </Text>
              <SuccessStatePresets.Sent
                onButtonPress={() => console.log("Send another")}
                onSecondaryAction={() => console.log("Back to inbox")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Task Completed
              </Text>
              <SuccessStatePresets.Completed
                onButtonPress={() => console.log("View results")}
                onSecondaryAction={() => console.log("Next task")}
              />
            </View>

            <View style={themed($section)}>
              <Text preset="default" size="md" weight="medium" style={themed($sectionTitle)}>
                Account Verified
              </Text>
              <SuccessStatePresets.Verified
                onButtonPress={() => console.log("Get started")}
                onSecondaryAction={() => console.log("Learn more")}
              />
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <View style={themed($container)}>
      {/* State Selector */}
      <View style={themed($selectorContainer)}>
        <Text preset="heading" size="lg" weight="semiBold" style={themed($title)}>
          App State Showcase
        </Text>
        <Text preset="default" size="sm" style={themed($description)}>
          Engaging feedback for all app states
        </Text>
        
        <View style={themed($buttonRow)}>
          <Button
            text="Loading"
            preset={currentState === "loading" ? "primary" : "secondary"}
            size="sm"
            onPress={() => setCurrentState("loading")}
            style={themed($selectorButton)}
          />
          <Button
            text="Empty"
            preset={currentState === "empty" ? "primary" : "secondary"}
            size="sm"
            onPress={() => setCurrentState("empty")}
            style={themed($selectorButton)}
          />
          <Button
            text="Error"
            preset={currentState === "error" ? "primary" : "secondary"}
            size="sm"
            onPress={() => setCurrentState("error")}
            style={themed($selectorButton)}
          />
          <Button
            text="Success"
            preset={currentState === "success" ? "primary" : "secondary"}
            size="sm"
            onPress={() => setCurrentState("success")}
            style={themed($selectorButton)}
          />
        </View>
      </View>

      {/* Current State Display */}
      <ScrollView 
        style={themed($scrollContainer)}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentState()}
      </ScrollView>
    </View>
  )
}

// Modern State Showcase Styles
const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $selectorContainer: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.lg,
  backgroundColor: colors.backgroundSecondary,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderSubtle,
})

const $title: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xs,
})

const $description: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  color: colors.textDim,
  marginBottom: spacing.lg,
})

const $buttonRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
})

const $selectorButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $scrollContainer: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $stateContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  padding: spacing.md,
})

const $stateTitle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.xl,
})

const $sectionTitle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.md,
  color: colors.text,
})

const $skeletonGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.md,
})

const $skeletonItem: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  flex: 1,
  minWidth: "45%",
  padding: spacing.sm,
  backgroundColor: colors.backgroundSecondary,
  borderRadius: spacing.xs,
})

const $itemLabel: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.xs,
  color: colors.textSubtle,
})

const $layoutSection: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.lg,
  padding: spacing.md,
  backgroundColor: colors.backgroundSecondary,
  borderRadius: spacing.sm,
})

const $layoutTitle: ThemedStyle<ViewStyle> = ({ spacing, colors }) => ({
  marginBottom: spacing.sm,
  color: colors.text,
})
