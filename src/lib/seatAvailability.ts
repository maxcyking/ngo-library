import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const TOTAL_LIBRARY_SEATS = 80;

export async function getAvailableSeats(): Promise<number> {
  try {
    // Get all approved library applications
    const q = query(
      collection(db, 'library-applications'),
      where('status', '==', 'accepted')
    );

    const querySnapshot = await getDocs(q);
    const occupiedSeats = querySnapshot.size;

    const availableSeats = TOTAL_LIBRARY_SEATS - occupiedSeats;
    return Math.max(0, availableSeats); // Ensure it doesn't go below 0
  } catch (error) {
    console.error('Error fetching seat availability:', error);
    return TOTAL_LIBRARY_SEATS; // Return full capacity on error
  }
}

export async function areSeatsAvailable(): Promise<boolean> {
  const available = await getAvailableSeats();
  return available > 0;
}