import { mockPatients } from '../data/mockDb';

export const firebaseConfig = {
  apiKey: "SIMULATED_FIREBASE_API_KEY",
  authDomain: "crisisbridge-app.firebaseapp.com",
  projectId: "crisisbridge-app",
  storageBucket: "crisisbridge-app.appspot.com",
};

export function getPatientFromFirebase(patientId: string): string | null {
  console.log(`[Firebase Service] Fetching document for patient ID: ${patientId}`);
  return mockPatients[patientId] || null;
}
