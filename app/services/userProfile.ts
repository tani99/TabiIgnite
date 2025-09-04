import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore"

import { db } from "@/config/firebase"
import type {
  UserProfile,
  CreateUserProfileData,
  UpdateUserProfileData,
} from "@/types/user"

const USERS_COLLECTION = "users"

export class UserProfileService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const data = userSnap.data()
        return {
          id: userSnap.id,
          email: data.email,
          name: data.name,
          bio: data.bio,
          phone: data.phone,
          location: data.location,
          avatar: data.avatar,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile
      }
      
      return null
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw new Error("Failed to fetch user profile")
    }
  }

  static async createUserProfile(
    userId: string, 
    profileData: CreateUserProfileData
  ): Promise<UserProfile> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      const now = serverTimestamp()
      
      const newProfile = {
        ...profileData,
        createdAt: now,
        updatedAt: now,
      }
      
      await setDoc(userRef, newProfile)
      
      return {
        id: userId,
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as UserProfile
    } catch (error) {
      console.error("Error creating user profile:", error)
      throw new Error("Failed to create user profile")
    }
  }

  static async updateUserProfile(
    userId: string, 
    updates: Omit<UpdateUserProfileData, 'updatedAt'>
  ): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      }
      
      await updateDoc(userRef, updateData)
    } catch (error) {
      console.error("Error updating user profile:", error)
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        stack: error.stack
      })
      throw new Error(`Failed to update user profile: ${error.message}`)
    }
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const usersRef = collection(db, USERS_COLLECTION)
      const q = query(usersRef, where("email", "==", email))
      const querySnapshot = await getDocs(q)
      
      return !querySnapshot.empty
    } catch (error) {
      console.error("Error checking email existence:", error)
      throw new Error("Failed to check email")
    }
  }

  static async getOrCreateUserProfile(
    userId: string, 
    email: string, 
    defaultName?: string
  ): Promise<UserProfile> {
    try {
      let profile = await this.getUserProfile(userId)
      
      if (!profile) {
        const createData: CreateUserProfileData = {
          email,
          name: defaultName || email.split("@")[0],
        }
        profile = await this.createUserProfile(userId, createData)
      }
      
      return profile
    } catch (error) {
      console.error("Error getting or creating user profile:", error)
      throw new Error("Failed to initialize user profile")
    }
  }
}

export default UserProfileService