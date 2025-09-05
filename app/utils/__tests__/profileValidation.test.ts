import type { UserProfileFormData, ProfileValidationErrors } from "@/types/user"

// Validation function extracted from ProfileScreen for testing
export const validateProfileForm = (formData: UserProfileFormData): { errors: ProfileValidationErrors; isValid: boolean } => {
  const errors: ProfileValidationErrors = {}
  
  if (!formData.name.trim()) {
    errors.name = "Name is required"
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters"
  } else if (formData.name.trim().length > 50) {
    errors.name = "Name must be less than 50 characters"
  }
  
  if (formData.bio && formData.bio.length > 200) {
    errors.bio = "Bio must be less than 200 characters"
  }
  
  if (formData.phone && formData.phone.trim()) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ""))) {
      errors.phone = "Please enter a valid phone number"
    }
  }
  
  if (formData.location && formData.location.length > 100) {
    errors.location = "Location must be less than 100 characters"
  }
  
  return {
    errors,
    isValid: Object.keys(errors).length === 0
  }
}

describe("Profile Form Validation", () => {
  describe("Name validation", () => {
    it("should require name field", () => {
      const formData: UserProfileFormData = {
        name: "",
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(false)
      expect(errors.name).toBe("Name is required")
    })

    it("should require name with only whitespace", () => {
      const formData: UserProfileFormData = {
        name: "   ",
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(false)
      expect(errors.name).toBe("Name is required")
    })

    it("should require minimum 2 characters", () => {
      const formData: UserProfileFormData = {
        name: "A",
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(false)
      expect(errors.name).toBe("Name must be at least 2 characters")
    })

    it("should reject names longer than 50 characters", () => {
      const formData: UserProfileFormData = {
        name: "A".repeat(51),
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(false)
      expect(errors.name).toBe("Name must be less than 50 characters")
    })

    it("should accept valid names", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(true)
      expect(errors.name).toBeUndefined()
    })

    it("should trim whitespace from names", () => {
      const formData: UserProfileFormData = {
        name: "  John Doe  ",
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(true)
      expect(errors.name).toBeUndefined()
    })
  })

  describe("Bio validation", () => {
    it("should allow empty bio", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(true)
      expect(errors.bio).toBeUndefined()
    })

    it("should reject bio longer than 200 characters", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "A".repeat(201),
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(false)
      expect(errors.bio).toBe("Bio must be less than 200 characters")
    })

    it("should accept bio with exactly 200 characters", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "A".repeat(200),
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(true)
      expect(errors.bio).toBeUndefined()
    })
  })

  describe("Phone validation", () => {
    it("should allow empty phone", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(true)
      expect(errors.phone).toBeUndefined()
    })

    it("should accept valid phone numbers", () => {
      const validPhones = [
        "+1234567890",
        "1234567890",
        "+123 456 7890",
        "123-456-7890",
        "(123) 456-7890",
        "+44 20 7946 0958",
      ]

      validPhones.forEach(phone => {
        const formData: UserProfileFormData = {
          name: "John Doe",
          bio: "",
          phone,
          location: "",
        }

        const { errors, isValid } = validateProfileForm(formData)

        expect(isValid).toBe(true)
        expect(errors.phone).toBeUndefined()
      })
    })

    it("should reject invalid phone numbers", () => {
      const invalidPhones = [
        "abc", // letters
        "+", // just plus
        "++123456789", // double plus
        "0123456789", // starts with 0
        "12345678901234567", // too long (17 digits)
      ]

      invalidPhones.forEach(phone => {
        const formData: UserProfileFormData = {
          name: "John Doe",
          bio: "",
          phone,
          location: "",
        }

        const { errors, isValid } = validateProfileForm(formData)

        expect(isValid).toBe(false)
        expect(errors.phone).toBe("Please enter a valid phone number")
      })
    })

    it("should accept valid phone numbers with various lengths", () => {
      const validPhones = [
        "123", // 3 digits (1 + 2) - valid
        "1234567890123456", // 16 digits (1 + 15) - maximum allowed
        "+1234567890", // with plus prefix
      ]

      validPhones.forEach(phone => {
        const formData: UserProfileFormData = {
          name: "John Doe",
          bio: "",
          phone,
          location: "",
        }

        const { errors, isValid } = validateProfileForm(formData)

        expect(isValid).toBe(true)
        expect(errors.phone).toBeUndefined()
      })
    })
  })

  describe("Location validation", () => {
    it("should allow empty location", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "",
        phone: "",
        location: "",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(true)
      expect(errors.location).toBeUndefined()
    })

    it("should reject location longer than 100 characters", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "",
        phone: "",
        location: "A".repeat(101),
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(false)
      expect(errors.location).toBe("Location must be less than 100 characters")
    })

    it("should accept location with exactly 100 characters", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "",
        phone: "",
        location: "A".repeat(100),
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(true)
      expect(errors.location).toBeUndefined()
    })
  })

  describe("Combined validation", () => {
    it("should return multiple errors when multiple fields are invalid", () => {
      const formData: UserProfileFormData = {
        name: "", // required
        bio: "A".repeat(201), // too long
        phone: "invalid", // invalid format
        location: "A".repeat(101), // too long
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(false)
      expect(errors.name).toBe("Name is required")
      expect(errors.bio).toBe("Bio must be less than 200 characters")
      expect(errors.phone).toBe("Please enter a valid phone number")
      expect(errors.location).toBe("Location must be less than 100 characters")
    })

    it("should pass validation with all valid fields", () => {
      const formData: UserProfileFormData = {
        name: "John Doe",
        bio: "Software developer from San Francisco",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
      }

      const { errors, isValid } = validateProfileForm(formData)

      expect(isValid).toBe(true)
      expect(Object.keys(errors)).toHaveLength(0)
    })
  })
})