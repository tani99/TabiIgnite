# Profile Screen Implementation Plan

## Overview
Create a comprehensive profile screen from scratch that allows users to view and edit their profile information with Firebase Firestore integration.

## Current Codebase Analysis

### Existing Infrastructure
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v7 with Native Stack Navigator
- **Authentication**: Firebase Auth already integrated via AuthContext
- **Theming**: Modern theming system with dark/light mode support
- **UI Components**: Custom component library with Button, Text, Screen, Header, etc.
- **State Management**: Context API for authentication state

### Firebase Setup
- Firebase Auth configured in `/app/config/firebase.ts`
- AuthContext provides: `user`, `authEmail`, `isAuthenticated`, `login`, `logout`, etc.
- Missing: Firestore integration for additional user profile data

## New Profile Screen Requirements

### Core Features
1. **Profile Viewing**
   - Display user avatar/profile picture
   - Show user information (name, email, bio, phone, location)
   - Account status and metadata
   - Clean, modern UI design

2. **Profile Editing**
   - Toggle between view and edit modes
   - Editable fields: name, bio, phone, location
   - Form validation and error handling
   - Save/cancel functionality

3. **Avatar Management**
   - Default avatar placeholder
   - Upload/change profile picture capability
   - Image picker integration

4. **Firebase Integration**
   - Firestore for storing additional user data
   - Real-time data synchronization
   - Error handling for network issues

## Technical Implementation Plan

### Phase 1: Firebase Firestore Setup
1. **Update Firebase Configuration**
   - Add Firestore import to `/app/config/firebase.ts`
   - Export Firestore instance

2. **Create User Profile Service**
   - File: `/app/services/userProfile.ts`
   - Functions:
     - `getUserProfile(userId: string)`
     - `updateUserProfile(userId: string, data: UserProfile)`
     - `createUserProfile(userId: string, initialData: UserProfile)`

3. **Define Profile Data Types**
   - File: `/app/types/user.ts`
   - Interface for UserProfile with fields: name, bio, phone, location, avatar, etc.

### Phase 2: Profile Context/State Management
1. **Create ProfileContext**
   - File: `/app/context/ProfileContext.tsx`
   - Manage profile data state
   - Handle loading states
   - Provide profile CRUD operations

2. **Integration with AuthContext**
   - Connect profile data loading with authentication state
   - Auto-fetch profile data on login

### Phase 3: New Profile Screen Component
1. **Create NewProfileScreen**
   - File: `/app/screens/NewProfileScreen.tsx`
   - Replace existing ProfileScreen or create alongside

2. **Component Structure**
   ```
   NewProfileScreen
   ├── ProfileHeader (avatar, basic info)
   ├── ProfileContent
   │   ├── ViewMode (display fields)
   │   └── EditMode (form fields)
   ├── ProfileActions (edit/save/cancel buttons)
   └── Animations (entrance effects, mode transitions)
   ```

3. **UI Design Elements**
   - Modern card-based layout
   - Smooth animations between view/edit modes
   - Consistent with existing app theming
   - Form validation feedback
   - Loading states and error handling

### Phase 4: Form Management & Validation
1. **Form State Management**
   - Local state for form data
   - Validation rules for each field
   - Dirty state tracking

2. **Validation Rules**
   - Name: Required, min/max length
   - Email: Valid email format (readonly)
   - Phone: Optional, valid phone format
   - Bio: Optional, max character limit

### Phase 5: Avatar/Image Management
1. **Image Picker Integration**
   - Add `expo-image-picker` dependency if not present
   - Handle camera and gallery options
   - Image compression and optimization

2. **Firebase Storage Integration**
   - Upload profile pictures to Firebase Storage
   - Generate download URLs
   - Handle upload progress and errors

### Phase 6: Navigation Integration
1. **Update Navigation Types**
   - Add NewProfile route to AppStackParamList
   - Update navigation props types

2. **Navigation Flow**
   - Add navigation to NewProfile from Welcome screen
   - Add "Edit Profile" button in appropriate locations
   - Handle back navigation with unsaved changes

### Phase 7: Error Handling & Loading States
1. **Error Boundaries**
   - Handle network errors gracefully
   - User-friendly error messages
   - Retry mechanisms

2. **Loading States**
   - Skeleton loaders for profile data
   - Submit button loading states
   - Image upload progress indicators

## File Structure

```
app/
├── screens/
│   └── NewProfileScreen.tsx          # Main profile screen component
├── components/
│   ├── ProfileHeader.tsx             # Avatar and basic info display
│   ├── ProfileForm.tsx               # Editable form fields
│   └── AvatarPicker.tsx              # Avatar selection component
├── services/
│   ├── userProfile.ts                # Firestore user profile operations
│   └── imageUpload.ts                # Firebase Storage image operations
├── context/
│   └── ProfileContext.tsx            # Profile state management
├── types/
│   └── user.ts                       # User profile type definitions
├── hooks/
│   ├── useProfile.ts                 # Profile data management hook
│   └── useImagePicker.ts             # Image picker functionality hook
└── utils/
    ├── validation.ts                 # Form validation utilities
    └── imageUtils.ts                 # Image processing utilities
```

## Data Schema

### Firestore Collection: `users`
```typescript
interface UserProfile {
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
```

## Dependencies to Add
- `expo-image-picker` (if not present) - for avatar selection
- Additional Firebase packages if needed

## Testing Strategy
1. **Unit Tests**
   - Profile service functions
   - Validation utilities
   - Component rendering

2. **Integration Tests**
   - Profile data flow
   - Navigation between modes
   - Firebase operations

3. **Manual Testing**
   - Cross-platform compatibility (iOS/Android)
   - Network connectivity scenarios
   - Different screen sizes

## Performance Considerations
1. **Image Optimization**
   - Compress images before upload
   - Lazy loading for profile images
   - Cache management

2. **Data Fetching**
   - Implement proper loading states
   - Cache profile data appropriately
   - Handle offline scenarios

## Security Considerations
1. **Firestore Security Rules**
   - Users can only read/write their own profile
   - Validate data types and required fields

2. **Image Upload Security**
   - File type validation
   - Size limitations
   - Sanitize file names

## Implementation Timeline
1. **Week 1**: Firebase setup and service layer
2. **Week 2**: Profile context and state management
3. **Week 3**: Core profile screen UI and functionality
4. **Week 4**: Avatar management and advanced features
5. **Week 5**: Testing, refinement, and integration

## Success Criteria
- [ ] Users can view their complete profile information
- [ ] Users can edit and save profile changes
- [ ] Profile data persists in Firebase Firestore
- [ ] Avatar upload and display works correctly
- [ ] Form validation provides clear feedback
- [ ] Navigation flows work seamlessly
- [ ] Responsive design across different screen sizes
- [ ] Error states are handled gracefully
- [ ] Performance is smooth with proper loading states