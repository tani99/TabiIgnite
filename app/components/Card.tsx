import { ComponentType, Fragment, ReactElement } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle, ThemedStyleArray } from "@/theme/types"

import { Text, TextProps } from "./Text"

type Presets = "default" | "elevated" | "outlined" | "filled" | "reversed"

type Sizes = "sm" | "md" | "lg"

interface CardProps extends TouchableOpacityProps {
  /**
   * One of the different types of card presets.
   */
  preset?: Presets
  /**
   * Size variant for the card.
   */
  size?: Sizes
  /**
   * How the content should be aligned vertically. This is especially (but not exclusively) useful
   * when the card is a fixed height but the content is dynamic.
   *
   * `top` (default) - aligns all content to the top.
   * `center` - aligns all content to the center.
   * `space-between` - spreads out the content evenly.
   * `force-footer-bottom` - aligns all content to the top, but forces the footer to the bottom.
   */
  verticalAlignment?: "top" | "center" | "space-between" | "force-footer-bottom"
  /**
   * Cover image component for the top of the card.
   */
  CoverComponent?: ReactElement
  /**
   * Avatar component for user cards.
   */
  AvatarComponent?: ReactElement
  /**
   * Custom component added to the left of the card body.
   */
  LeftComponent?: ReactElement
  /**
   * Custom component added to the right of the card body.
   */
  RightComponent?: ReactElement
  /**
   * The heading text to display if not using `headingTx`.
   */
  heading?: TextProps["text"]
  /**
   * Heading text which is looked up via i18n.
   */
  headingTx?: TextProps["tx"]
  /**
   * Optional heading options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  headingTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for heading text.
   */
  headingStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the heading Text component.
   */
  HeadingTextProps?: TextProps
  /**
   * Custom heading component.
   * Overrides all other `heading*` props.
   */
  HeadingComponent?: ReactElement
  /**
   * The content text to display if not using `contentTx`.
   */
  content?: TextProps["text"]
  /**
   * Content text which is looked up via i18n.
   */
  contentTx?: TextProps["tx"]
  /**
   * Optional content options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  contentTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for content text.
   */
  contentStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the content Text component.
   */
  ContentTextProps?: TextProps
  /**
   * Custom content component.
   * Overrides all other `content*` props.
   */
  ContentComponent?: ReactElement
  /**
   * The footer text to display if not using `footerTx`.
   */
  footer?: TextProps["text"]
  /**
   * Footer text which is looked up via i18n.
   */
  footerTx?: TextProps["tx"]
  /**
   * Optional footer options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  footerTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for footer text.
   */
  footerStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the footer Text component.
   */
  FooterTextProps?: TextProps
  /**
   * Custom footer component.
   * Overrides all other `footer*` props.
   */
  FooterComponent?: ReactElement
}

/**
 * Cards are useful for displaying related information in a contained way.
 * If a ListItem displays content horizontally, a Card can be used to display content vertically.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Card/}
 * @param {CardProps} props - The props for the `Card` component.
 * @returns {JSX.Element} The rendered `Card` component.
 */
export function Card(props: CardProps) {
  const {
    content,
    contentTx,
    contentTxOptions,
    footer,
    footerTx,
    footerTxOptions,
    heading,
    headingTx,
    headingTxOptions,
    ContentComponent,
    HeadingComponent,
    FooterComponent,
    CoverComponent,
    AvatarComponent,
    LeftComponent,
    RightComponent,
    verticalAlignment = "top",
    style: $containerStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    footerStyle: $footerStyleOverride,
    ContentTextProps,
    HeadingTextProps,
    FooterTextProps,
    ...WrapperProps
  } = props

  const {
    themed,
    theme: { spacing },
  } = useAppTheme()

  const preset: Presets = props.preset ?? "default"
  const size: Sizes = props.size ?? "md"
  const isPressable = !!WrapperProps.onPress
  const isHeadingPresent = !!(HeadingComponent || heading || headingTx)
  const isContentPresent = !!(ContentComponent || content || contentTx)
  const isFooterPresent = !!(FooterComponent || footer || footerTx)

  const Wrapper = (isPressable ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >
  const HeaderContentWrapper = verticalAlignment === "force-footer-bottom" ? View : Fragment

  const $containerStyle: StyleProp<ViewStyle> = [
    themed($containerPresets[preset]),
    themed($sizePresets[size]),
    $containerStyleOverride,
  ]
  const $headingStyle = [
    themed($headingPresets[preset]),
    (isFooterPresent || isContentPresent) && { marginBottom: spacing.xxxs },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ]
  const $contentStyle = [
    themed($contentPresets[preset]),
    isHeadingPresent && { marginTop: spacing.xxxs },
    isFooterPresent && { marginBottom: spacing.xxxs },
    $contentStyleOverride,
    ContentTextProps?.style,
  ]
  const $footerStyle = [
    themed($footerPresets[preset]),
    (isHeadingPresent || isContentPresent) && { marginTop: spacing.xxxs },
    $footerStyleOverride,
    FooterTextProps?.style,
  ]
  const $alignmentWrapperStyle = [
    $alignmentWrapper,
    { justifyContent: $alignmentWrapperFlexOptions[verticalAlignment] },
    LeftComponent && { marginStart: spacing.md },
    RightComponent && { marginEnd: spacing.md },
  ]
  
  const $contentWrapperStyle: ViewStyle = {
    flex: 1,
    alignSelf: "stretch",
  }

  return (
    <Wrapper
      style={$containerStyle}
      activeOpacity={0.9}
      accessibilityRole={isPressable ? "button" : undefined}
      {...WrapperProps}
    >
      {CoverComponent && <View style={themed($coverStyle)}>{CoverComponent}</View>}
      
      <View style={$alignmentWrapperStyle}>
        {AvatarComponent && <View style={themed($avatarStyle)}>{AvatarComponent}</View>}
        
        {LeftComponent}

        <View style={$contentWrapperStyle}>
          <HeaderContentWrapper>
            {HeadingComponent ||
              (isHeadingPresent && (
                <Text
                  preset="heading"
                  weight="bold"
                  text={heading}
                  tx={headingTx}
                  txOptions={headingTxOptions}
                  {...HeadingTextProps}
                  style={$headingStyle}
                />
              ))}

            {ContentComponent ||
              (isContentPresent && (
                <Text
                  preset="default"
                  weight="normal"
                  text={content}
                  tx={contentTx}
                  txOptions={contentTxOptions}
                  {...ContentTextProps}
                  style={$contentStyle}
                />
              ))}
          </HeaderContentWrapper>

          {FooterComponent ||
            (isFooterPresent && (
              <Text
                preset="default"
                weight="normal"
                size="xs"
                text={footer}
                tx={footerTx}
                txOptions={footerTxOptions}
                {...FooterTextProps}
                style={$footerStyle}
              />
            ))}
        </View>

        {RightComponent}
      </View>
    </Wrapper>
  )
}

// Modern Card Base Styles
const $containerBase: ThemedStyle<ViewStyle> = ({ spacing, elevation }) => ({
  overflow: "hidden",
  ...elevation.level1, // Modern subtle shadow
})

const $alignmentWrapper: ViewStyle = {
  flex: 1,
  alignSelf: "stretch",
}

const $alignmentWrapperFlexOptions = {
  "top": "flex-start",
  "center": "center",
  "space-between": "space-between",
  "force-footer-bottom": "space-between",
} as const

// Size Presets - Modern scaling with better spacing
const $sizePresets: Record<Sizes, ThemedStyle<ViewStyle>> = {
  sm: ({ spacing }) => ({
    borderRadius: spacing.sm, // 12px rounded corners
    padding: spacing.sm,      // 12px padding
    minHeight: 80,
  }),
  md: ({ spacing }) => ({
    borderRadius: spacing.md, // 16px rounded corners
    padding: spacing.md,      // 16px padding
    minHeight: 96,
  }),
  lg: ({ spacing }) => ({
    borderRadius: spacing.md, // 16px rounded corners
    padding: spacing.lg,      // 24px padding
    minHeight: 120,
  }),
}

// Modern Card Presets
const $containerPresets: Record<Presets, ThemedStyleArray<ViewStyle>> = {
  // Default: Clean background with subtle shadow
  default: [
    $containerBase,
    ({ colors, elevation }) => ({
      backgroundColor: colors.background,
      ...elevation.level1,
    }),
  ],
  
  // Elevated: Prominent shadow for important cards
  elevated: [
    $containerBase,
    ({ colors, elevation }) => ({
      backgroundColor: colors.background,
      ...elevation.level2,
    }),
  ],
  
  // Outlined: Modern border with no shadow
  outlined: [
    $containerBase,
    ({ colors, elevation }) => ({
      backgroundColor: colors.background,
      borderWidth: 1.5,
      borderColor: colors.borderSubtle,
      ...elevation.none,
    }),
  ],
  
  // Filled: Subtle background tint
  filled: [
    $containerBase,
    ({ colors, elevation }) => ({
      backgroundColor: colors.backgroundSecondary,
      ...elevation.level1,
    }),
  ],
  
  // Legacy reversed for backward compatibility
  reversed: [
    $containerBase,
    ({ colors, elevation }) => ({
      backgroundColor: colors.text,
      ...elevation.level1,
    }),
  ],
}

// Cover image style
const $coverStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  width: "100%",
  marginBottom: spacing.sm,
  borderTopLeftRadius: spacing.md,
  borderTopRightRadius: spacing.md,
  overflow: "hidden",
})

// Avatar style for user cards
const $avatarStyle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
  alignItems: "center",
})

// Modern Text Presets with better hierarchy
const $headingPresets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  default: [({ colors }) => ({ color: colors.text })],
  elevated: [({ colors }) => ({ color: colors.text })],
  outlined: [({ colors }) => ({ color: colors.text })],
  filled: [({ colors }) => ({ color: colors.text })],
  reversed: [({ colors }) => ({ color: colors.background })],
}

const $contentPresets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  default: [({ colors }) => ({ color: colors.textDim })],
  elevated: [({ colors }) => ({ color: colors.textDim })],
  outlined: [({ colors }) => ({ color: colors.textDim })],
  filled: [({ colors }) => ({ color: colors.textDim })],
  reversed: [({ colors }) => ({ color: colors.palette.neutral300 })],
}

const $footerPresets: Record<Presets, ThemedStyleArray<TextStyle>> = {
  default: [({ colors }) => ({ color: colors.textSubtle })],
  elevated: [({ colors }) => ({ color: colors.textSubtle })],
  outlined: [({ colors }) => ({ color: colors.textSubtle })],
  filled: [({ colors }) => ({ color: colors.textSubtle })],
  reversed: [({ colors }) => ({ color: colors.palette.neutral400 })],
}
