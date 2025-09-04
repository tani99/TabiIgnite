export interface UserProfile {
  id: string
  email: string
  name: string
  bio?: string
  phone?: string
  location?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfileFormData {
  name: string
  bio: string
  phone: string
  location: string
}

export interface CreateUserProfileData {
  email: string
  name: string
  bio?: string
  phone?: string
  location?: string
  avatar?: string
}

export interface UpdateUserProfileData {
  name?: string
  bio?: string
  phone?: string
  location?: string
  avatar?: string
  updatedAt: Date
}

export type ProfileValidationErrors = {
  [K in keyof UserProfileFormData]?: string
}

export interface ProfileState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
  isEditing: boolean
}