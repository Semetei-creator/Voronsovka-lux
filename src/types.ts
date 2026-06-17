/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  room: string;
  schedule: string; // e.g., "Пн-Пт: 08:00 - 14:00"
  experience: number; // years
  avatar?: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  duration: string;
  dateIssued: string;
  doctorName: string;
  status: 'active' | 'completed';
}

export interface MedicalRecordEntry {
  id: string;
  date: string;
  doctorName: string;
  doctorSpecialty: string;
  complaints: string; // complaints
  diagnosis: string;
  recommendations: string;
  testsOrdered?: string[];
}

export interface TestResult {
  id: string;
  date: string;
  testName: string;
  result: string;
  norm: string;
  status: 'normal' | 'abnormal' | 'pending';
  laboratory: string;
}

export interface Patient {
  id: string; // card number or OMS insurance number
  fullName: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  phone: string;
  omsNumber: string; // 16 digits
  bloodType: string;
  allergies: string[];
  email?: string;
  records: MedicalRecordEntry[];
  prescriptions: Prescription[];
  testResults: TestResult[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientOms: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  room: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  isPaid?: boolean;
  paymentId?: string;
  amountPaid?: number;
}
