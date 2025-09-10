import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';

export interface CreateAdminUserData {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

/**
 * Create an admin user in Firebase Auth and Firestore
 * This function should only be used by super admins
 */
export const createAdminUser = async (userData: CreateAdminUserData) => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const user = userCredential.user;
    
    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isActive: userData.isActive,
      createdAt: new Date(),
      createdBy: auth.currentUser?.uid || 'system',
      lastLogin: null,
      permissions: userData.role === 'admin' ? [
        'read_users',
        'write_users',
        'read_books',
        'write_books',
        'read_members',
        'write_members',
        'read_content',
        'write_content',
        'admin_dashboard'
      ] : ['read_books', 'read_content']
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return {
      success: true,
      user: userProfile
    };
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

/**
 * Update user role and active status
 */
export const updateUserRole = async (
  uid: string, 
  role: 'admin' | 'user', 
  isActive: boolean
) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const updateData = {
      role,
      isActive,
      updatedAt: new Date(),
      updatedBy: auth.currentUser?.uid || 'system'
    };
    
    await setDoc(userRef, updateData, { merge: true });
    
    return {
      success: true,
      message: 'User role updated successfully'
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Check if user has admin privileges
 */
export const checkAdminAccess = async (uid: string): Promise<boolean> => {
  try {
    const userProfile = await getUserProfile(uid);
    return userProfile?.role === 'admin' && userProfile?.isActive === true;
  } catch (error) {
    console.error('Error checking admin access:', error);
    return false;
  }
};