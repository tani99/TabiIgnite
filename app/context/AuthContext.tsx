import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
} from "firebase/auth"

import { auth } from "@/config/firebase"

export type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  authEmail?: string
  setAuthEmail: (email: string) => void
  login: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  validationError: string
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [authEmail, setAuthEmail] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true)
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setIsLoading(true)
      await signOut(auth)
      setAuthEmail("")
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true)
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "Email is required"
    if (authEmail.length < 6) return "Email must be at least 6 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "Please enter a valid email address"
    return ""
  }, [authEmail])

  const value = {
    isAuthenticated: !!user,
    user,
    authEmail,
    setAuthEmail,
    login,
    signUp,
    logout,
    resetPassword,
    validationError,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
