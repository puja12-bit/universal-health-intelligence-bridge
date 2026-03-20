// lib/mockDb.ts

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  currentMedications: string[];
  recentVitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number; // Celsius
    oxygenSaturation: number;
  };
}

// 2 Patient Profiles
export const patients: Record<string, PatientProfile> = {
  "PT-1002": {
    id: "PT-1002",
    name: "John Doe",
    age: 58,
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts"],
    medicalHistory: [
      "Type 2 Diabetes (diagnosed 2015)",
      "Hypertension",
      "Coronary Artery Disease - Stent placed in 2020"
    ],
    currentMedications: ["Metformin 500mg", "Lisinopril 10mg", "Atorvastatin 20mg", "Aspirin 40mg"],
    recentVitals: {
      bloodPressure: "150/95",
      heartRate: 92,
      temperature: 37.1,
      oxygenSaturation: 97
    }
  },
  "PT-8841": {
    id: "PT-8841",
    name: "Jane Smith",
    age: 34,
    bloodType: "A-",
    allergies: ["Latex", "Sulfa Drugs"],
    medicalHistory: [
      "Asthma (childhood onset, severe)",
      "Anemia",
      "Endometriosis (surgery 2018)"
    ],
    currentMedications: ["Albuterol Inhaler", "Iron supplements", "Montelukast"],
    recentVitals: {
      bloodPressure: "115/75",
      heartRate: 88,
      temperature: 36.8,
      oxygenSaturation: 95
    }
  }
};

export interface EmergencyCase {
  caseId: string;
  description: string;
  triageLevel: "Critical" | "Urgent" | "Standard";
  status: "Active" | "Resolved";
}

// 2 Emergency Cases
export const activeEmergencies: EmergencyCase[] = [
  {
    caseId: "ER-991A",
    description: "Multi-vehicle collision on I-95. Incoming Level 1 trauma patients expected in 10 mins.",
    triageLevel: "Critical",
    status: "Active"
  },
  {
    caseId: "ER-442B",
    description: "Localized power outage at North Wing affecting ventilators. Backup generators active.",
    triageLevel: "Urgent",
    status: "Active"
  }
];

// Complex Medical History Context Generator
export const getPatientContext = (patientId: string): string | null => {
  const pt = patients[patientId];
  if (!pt) return null;
  return `
[SYSTEM RECORD FETCHED FOR ${pt.id}]
Name: ${pt.name}
Age: ${pt.age} | Blood Type: ${pt.bloodType}
Known Allergies: ${pt.allergies.join(", ")}
Prior Medical History: ${pt.medicalHistory.join("; ")}
Current Medications: ${pt.currentMedications.join(", ")}
Last Recorded Vitals: BP ${pt.recentVitals.bloodPressure}, HR ${pt.recentVitals.heartRate} bpm, Temp ${pt.recentVitals.temperature}C, O2 ${pt.recentVitals.oxygenSaturation}%
  `.trim();
};
