import demoEn from "./demo-en"

const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
    retry: "Retry",
    retryMessage: "Something went wrong. Would you like to try again?",
  },
  welcomeScreen: {
    postscript: "Welcome to TabiIgnite - Your journey starts here!",
    readyForLaunch: "Ready to get started?",
    exciting: "Let's begin your adventure!",
    letsGo: "Get Started",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle: "We're sorry, but something unexpected happened. Please try again or contact support if the problem persists.",
    reset: "Try Again",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "No data available",
      content: "No data found yet. Try refreshing or reloading the app.",
      button: "Refresh",
    },
  },

  errors: {
    invalidEmail: "Please enter a valid email address.",
  },
  loginScreen: {
    logIn: "Sign In",
    enterDetails: "Welcome back! Please sign in to your account to continue.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Enter your password",
    tapToLogIn: "Sign In",
    hint: "Having trouble? Check your email and password, or contact support.",
    signUpLink: "Sign Up",
    separator: " • ",
    forgotPasswordLink: "Forgot Password?",
    loggingIn: "Signing in...",
  },
  signUpScreen: {
    signUp: "Create Account",
    enterDetails: "Join us! Create your account to get started with TabiIgnite.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    confirmPasswordFieldLabel: "Confirm Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Create a strong password",
    confirmPasswordFieldPlaceholder: "Confirm your password",
    tapToSignUp: "Create Account",
    signingUp: "Creating Account...",
    alreadyHaveAccount: "Already have an account? ",
    logInLink: "Sign In",
  },
  forgotPasswordScreen: {
    forgotPassword: "Reset Password",
    enterDetails: "Enter your email address and we'll send you a secure link to reset your password.",
    emailFieldLabel: "Email",
    emailFieldPlaceholder: "Enter your email address",
    tapToResetPassword: "Send Reset Link",
    resettingPassword: "Sending...",
    successMessage: "Password reset link sent! Please check your email and follow the instructions.",
    rememberPassword: "Remember your password? ",
    logInLink: "Sign In",
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
  },
  demoCommunityScreen: {
    title: "Connect with the community",
    tagLine:
      "Plug in to Infinite Red's community of React Native engineers and level up your app development with us!",
    joinUsOnSlackTitle: "Join us on Slack",
    joinUsOnSlack:
      "Wish there was a place to connect with React Native engineers around the world? Join the conversation in the Infinite Red Community Slack! Our growing community is a safe space to ask questions, learn from others, and grow your network.",
    joinSlackLink: "Join the Slack Community",
    makeIgniteEvenBetterTitle: "Make Ignite even better",
    makeIgniteEvenBetter:
      "Have an idea to make Ignite even better? We're happy to hear that! We're always looking for others who want to help us build the best React Native tooling out there. Join us over on GitHub to join us in building the future of Ignite.",
    contributeToIgniteLink: "Contribute to Ignite",
    theLatestInReactNativeTitle: "The latest in React Native",
    theLatestInReactNative: "We're here to keep you current on all React Native has to offer.",
    reactNativeRadioLink: "React Native Radio",
    reactNativeNewsletterLink: "React Native Newsletter",
    reactNativeLiveLink: "React Native Live",
    chainReactConferenceLink: "Chain React Conference",
    hireUsTitle: "Hire Infinite Red for your next project",
    hireUs:
      "Whether it's running a full project or getting teams up to speed with our hands-on training, Infinite Red can help with just about any React Native project.",
    hireUsLink: "Send us a message",
  },
  demoShowroomScreen: {
    jumpStart: "Components to jump start your project!",
    lorem2Sentences:
      "Nulla cupidatat deserunt amet quis aliquip nostrud do adipisicing. Adipisicing excepteur elit laborum Lorem adipisicing do duis.",
    demoHeaderTxExample: "Example",
    demoViaTxProp: "Via `tx` Prop",
    demoViaSpecifiedTxProp: "Via `{{prop}}Tx` Prop",
  },
  demoDebugScreen: {
    howTo: "HOW TO",
    title: "Debug",
    tagLine:
      "This is a comprehensive React Native app template with advanced features. Explore the available tools and components!",
    reactotron: "Send to Reactotron",
    reportBugs: "Report Bugs",
    demoList: "Demo List",
    demoPodcastList: "Demo Podcast List",
    androidReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running, run adb reverse tcp:9090 tcp:9090 from your terminal, and reload the app.",
    iosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    macosReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    webReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
    windowsReactotronHint:
      "If this doesn't work, ensure the Reactotron desktop app is running and reload app.",
  },
  demoPodcastListScreen: {
    title: "React Native Radio episodes",
    onlyFavorites: "Only Show Favorites",
    favoriteButton: "Favorite",
    unfavoriteButton: "Unfavorite",
    accessibility: {
      cardHint:
        "Double tap to listen to the episode. Double tap and hold to {{action}} this episode.",
      switch: "Switch on to only show favorites",
      favoriteAction: "Toggle Favorite",
      favoriteIcon: "Episode not favorited",
      unfavoriteIcon: "Episode favorited",
      publishLabel: "Published {{date}}",
      durationLabel: "Duration: {{hours}} hours {{minutes}} minutes {{seconds}} seconds",
    },
    noFavoritesEmptyState: {
      heading: "This looks a bit empty",
      content:
        "No favorites have been added yet. Tap the heart on an episode to add it to your favorites!",
    },
  },

  ...demoEn,
}

export default en
export type Translations = typeof en
