export interface FirebaseErrorInfo {
  message: string
  userAction: string
  retryable: boolean
  code: string
}

export const getFirebaseErrorMessage = (errorCode: string): FirebaseErrorInfo => {
  switch (errorCode) {
    // Authentication Errors
    case "auth/user-not-found":
      return {
        message: "No account found with this email address",
        userAction: "Please check your email or create a new account",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/wrong-password":
      return {
        message: "Incorrect password",
        userAction: "Please check your password and try again",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/invalid-email":
      return {
        message: "Invalid email address",
        userAction: "Please enter a valid email address",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/weak-password":
      return {
        message: "Password is too weak",
        userAction: "Please use at least 6 characters with a mix of letters, numbers, and symbols",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/email-already-in-use":
      return {
        message: "An account with this email already exists",
        userAction: "Please sign in instead or use a different email address",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/too-many-requests":
      return {
        message: "Too many failed attempts",
        userAction: "Please wait a few minutes before trying again",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/network-request-failed":
      return {
        message: "Network connection error",
        userAction: "Please check your internet connection and try again",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/user-disabled":
      return {
        message: "This account has been disabled",
        userAction: "Please contact our support team for assistance",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/operation-not-allowed":
      return {
        message: "This operation is not allowed",
        userAction: "Please contact our support team for assistance",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/invalid-credential":
      return {
        message: "Invalid credentials",
        userAction: "Please check your email and password and try again",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/account-exists-with-different-credential":
      return {
        message: "Account exists with different sign-in method",
        userAction: "Please try signing in with the original method you used",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/requires-recent-login":
      return {
        message: "Recent login required",
        userAction: "Please sign in again to continue with this action",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/credential-already-in-use":
      return {
        message: "These credentials are already in use",
        userAction: "Please use different credentials or contact support",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/timeout":
      return {
        message: "Request timed out",
        userAction: "Please check your connection and try again",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/quota-exceeded":
      return {
        message: "Service quota exceeded",
        userAction: "Please try again later or contact our support team",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/app-not-authorized":
      return {
        message: "App not authorized",
        userAction: "Please contact our support team for assistance",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/invalid-verification-code":
      return {
        message: "Invalid verification code",
        userAction: "Please check the code and try again",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/invalid-verification-id":
      return {
        message: "Invalid verification ID",
        userAction: "Please request a new verification code",
        retryable: true,
        code: errorCode,
      }
    
    case "auth/missing-verification-code":
      return {
        message: "Verification code is missing",
        userAction: "Please enter the verification code you received",
        retryable: false,
        code: errorCode,
      }
    
    case "auth/missing-verification-id":
      return {
        message: "Verification ID is missing",
        userAction: "Please request a new verification code",
        retryable: true,
        code: errorCode,
      }
    
    // Default case for unknown errors
    default:
      return {
        message: "An unexpected error occurred",
        userAction: "Please try again or contact our support team if the problem persists",
        retryable: true,
        code: errorCode,
      }
  }
}

export const isRetryableError = (errorCode: string): boolean => {
  return getFirebaseErrorMessage(errorCode).retryable
}

export const getErrorMessageForDisplay = (errorCode: string): string => {
  const errorInfo = getFirebaseErrorMessage(errorCode)
  return `${errorInfo.message}. ${errorInfo.userAction}`
}
