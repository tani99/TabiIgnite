# Firebase Authentication Implementation Plan for TabiIgnite

## Overview
This plan implements Firebase Authentication in your React Native app, reusing existing components and following the current architecture patterns.

## Phase 1: UI Development (Reusing Existing Components)

### Step 1: Update LoginScreen UI
- **File**: `app/screens/LoginScreen.tsx`
- **Changes**:
  - Remove hardcoded credentials from `useEffect`
  - Add loading state for Firebase operations
  - Add error handling for Firebase auth errors
  - Keep existing TextField, Button, and styling components
  - Add "Sign Up" and "Forgot Password" links below login button

### Step 2: Create SignUpScreen
- **File**: `app/screens/SignUpScreen.tsx`
- **Components to reuse**:
  - `Screen` component for layout
  - `TextField` for email and password inputs
  - `Button` for submit action
  - `Text` for headings and labels
  - Same styling patterns as LoginScreen

### Step 3: Create ForgotPasswordScreen
- **File**: `app/screens/ForgotPasswordScreen.tsx`
- **Components to reuse**:
  - `Screen` component
  - `TextField` for email input
  - `Button` for submit action
  - `Text` for instructions

### Step 4: Update Navigation
- **File**: `app/navigators/AppNavigator.tsx`
- **Changes**:
  - Add SignUp and ForgotPassword routes to `AppStackParamList`
  - Update navigation logic to include new screens
  - Keep existing authentication flow logic

## Phase 2: Backend Integration

### Step 5: Install Firebase Dependencies
```bash
npx expo install @react-native-firebase/app @react-native-firebase/auth
npm install firebase
```

### Step 6: Firebase Configuration
- **File**: `app/config/firebase.ts` (new file)
- **Content**:
  - Firebase config object
  - Initialize Firebase app
  - Export Firebase auth instance

### Step 7: Update AuthContext
- **File**: `app/context/AuthContext.tsx`
- **Changes**:
  - Replace MMKV storage with Firebase auth state
  - Add Firebase auth methods (signIn, signUp, signOut, resetPassword)
  - Update `isAuthenticated` logic to use Firebase user state
  - Add loading states for auth operations
  - Keep existing interface structure for compatibility

### Step 8: Update LoginScreen Logic
- **File**: `app/screens/LoginScreen.tsx`
- **Changes**:
  - Replace mock login with Firebase `signInWithEmailAndPassword`
  - Add proper error handling for Firebase auth errors
  - Show loading state during authentication
  - Navigate to Welcome screen on success

### Step 9: Implement SignUpScreen Logic
- **File**: `app/screens/SignUpScreen.tsx`
- **Implementation**:
  - Use Firebase `createUserWithEmailAndPassword`
  - Add password confirmation field
  - Handle Firebase auth errors
  - Auto-login after successful signup

### Step 10: Implement ForgotPasswordScreen Logic
- **File**: `app/screens/ForgotPasswordScreen.tsx`
- **Implementation**:
  - Use Firebase `sendPasswordResetEmail`
  - Show success/error messages
  - Navigate back to login after success

## Phase 3: Environment Setup

### Step 11: Firebase Project Setup
- Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Email/Password authentication
- Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

### Step 12: Update App Configuration
- **File**: `app.config.ts`
- **Changes**:
  - Add Firebase configuration
  - Update Android and iOS build settings

### Step 13: Update EAS Build Configuration
- **File**: `eas.json`
- **Changes**:
  - Add Firebase configuration for different build profiles

## Phase 4: Testing & Polish

### Step 14: Error Handling
- Implement comprehensive error messages for common Firebase auth errors
- Add retry mechanisms for network failures
- Handle edge cases (invalid email format, weak passwords, etc.)

### Step 15: Loading States
- Add loading indicators for all async operations
- Implement skeleton screens where appropriate
- Show progress for multi-step operations

### Step 16: Testing
- Test authentication flow on both platforms
- Test error scenarios (invalid credentials, network issues)
- Test password reset flow
- Verify proper navigation between screens

## Implementation Order

1. **Start with UI**: Update LoginScreen and create new screens (Steps 1-3)
2. **Navigation**: Update AppNavigator to include new routes (Step 4)
3. **Dependencies**: Install Firebase packages (Step 5)
4. **Configuration**: Set up Firebase config (Step 6)
5. **Context**: Update AuthContext with Firebase logic (Step 7)
6. **Logic**: Implement Firebase auth in all screens (Steps 8-10)
7. **Environment**: Configure Firebase project and app settings (Steps 11-13)
8. **Polish**: Add error handling and loading states (Steps 14-15)
9. **Testing**: Verify everything works correctly (Step 16)

## Benefits of This Approach

- **Reuses existing components**: Leverages your well-designed TextField, Button, and Screen components
- **Maintains current architecture**: Follows existing patterns in AuthContext and navigation
- **Minimal code changes**: Most existing code remains intact
- **Progressive enhancement**: Can implement step by step without breaking existing functionality
- **Consistent UX**: New screens will look and feel like existing ones

## Current Codebase Analysis

The existing app has:
- ✅ Well-structured component library (TextField, Button, Screen, Text)
- ✅ Authentication context with MMKV storage
- ✅ Navigation system with authentication flow
- ✅ Theme system for consistent styling
- ✅ TypeScript setup for type safety

## Next Steps

1. Review this plan and identify any modifications needed
2. Start with Phase 1 (UI Development) to see immediate progress
3. Set up Firebase project while working on UI
4. Progress through phases sequentially for best results

## Notes

- All new screens will follow existing design patterns
- Firebase integration will replace mock authentication without changing user experience
- Existing components ensure consistency across the app
- Plan can be implemented incrementally without breaking current functionality
