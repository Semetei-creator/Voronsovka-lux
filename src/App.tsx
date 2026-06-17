/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import greenMountainsImage from './assets/images/green_mountains_1781158349928.png';
import { 
  INITIAL_DOCTORS, 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  AVAILABLE_TIME_SLOTS 
} from './data';
import { Patient, Doctor, Appointment, Prescription, MedicalRecordEntry, TestResult } from './types';
import { Header } from './components/Header';
import { PublicPortal } from './components/PublicPortal';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AIChatBot } from './components/AIChatBot';
import { Language, TRANSLATIONS } from './translations';
import { Stethoscope, ShieldAlert, Heart, Info, Landmark } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<'public' | 'patient' | 'doctor'>('public');
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('vLux_lang');
    return (saved as Language) || 'ru';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('vLux_lang', lang);
  };
  
  // Data States
  const [doctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Selection States
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('doc-1'); // Default to Therapist Andrey Petrovich

  // 1. Hydrate database from localStorage or default static initializers
  useEffect(() => {
    const storedPatients = localStorage.getItem('gkb1_patients');
    const storedAppointments = localStorage.getItem('gkb1_appointments');

    if (storedPatients) {
      const parsed = JSON.parse(storedPatients);
      setPatients(parsed);
      if (parsed.length > 0) {
        setSelectedPatientId(parsed[0].id);
      }
    } else {
      setPatients(INITIAL_PATIENTS);
      localStorage.setItem('gkb1_patients', JSON.stringify(INITIAL_PATIENTS));
      setSelectedPatientId(INITIAL_PATIENTS[0].id);
    }

    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
      localStorage.setItem('gkb1_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
    }
  }, []);

  // Sync state mutation helper to localStorage
  const savePatientsToStorage = (updatedPatients: Patient[]) => {
    setPatients(updatedPatients);
    localStorage.setItem('gkb1_patients', JSON.stringify(updatedPatients));
  };

  const saveAppointmentsToStorage = (updatedApps: Appointment[]) => {
    setAppointments(updatedApps);
    localStorage.setItem('gkb1_appointments', JSON.stringify(updatedApps));
  };

  // Actions Callbacks
  const handleRegisterPatient = (newPatient: Patient) => {
    const updated = [...patients, newPatient];
    savePatientsToStorage(updated);
    setSelectedPatientId(newPatient.id);
  };

  const handleBookAppointment = (newApp: Appointment) => {
    const updated = [...appointments, newApp];
    saveAppointmentsToStorage(updated);
  };

  const handleCancelAppointment = (appId: string) => {
    const updated = appointments.map(app => 
      app.id === appId ? { ...app, status: 'cancelled' as const } : app
    );
    saveAppointmentsToStorage(updated);
  };

  const handlePayAppointment = (appId: string, paymentId: string, amount: number) => {
    const updated = appointments.map(app =>
      app.id === appId ? { ...app, isPaid: true, paymentId, amountPaid: amount } : app
    );
    saveAppointmentsToStorage(updated);
  };

  const handleCompleteAppointment = (appId: string) => {
    const updated = appointments.map(app => 
      app.id === appId ? { ...app, status: 'completed' as const } : app
    );
    saveAppointmentsToStorage(updated);
  };

  const handleAddMedicalRecord = (patientId: string, record: MedicalRecordEntry) => {
    const updated = patients.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          records: [record, ...p.records]
        };
      }
      return p;
    });
    savePatientsToStorage(updated);
  };

  const handleAddPrescription = (patientId: string, prescription: Prescription) => {
    const updated = patients.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          prescriptions: [prescription, ...p.prescriptions]
        };
      }
      return p;
    });
    savePatientsToStorage(updated);
  };

  const handleAddTestResult = (patientId: string, result: TestResult) => {
    const updated = patients.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          testResults: [result, ...p.testResults]
        };
      }
      return p;
    });
    savePatientsToStorage(updated);
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.ru;
  const activePatientName = patients.find(p => p.id === selectedPatientId)?.fullName || t.notSelected;
  const activeDoctorName = doctors.find(d => d.id === selectedDoctorId)?.name || t.notSelected;

  return (
    <div className="min-h-screen relative flex flex-col justify-between font-sans antialiased overflow-x-hidden bg-slate-50" id="app-root">
      {/* Scenic Green Mountain Background Layout */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none select-none bg-cover bg-center bg-no-repeat opacity-[0.08]" 
        style={{ backgroundImage: `url(${greenMountainsImage})` }}
      />
      
      {/* Upper Navigation Header */}
      <Header
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        language={language}
        onChangeLanguage={handleLanguageChange}
        activePatientName={activePatientName}
        activeDoctorName={activeDoctorName}
      />

      {/* Main Content Arena */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* State Notice Banner about local simulated storage */}
        <div className="mb-6 p-5 bg-emerald-50/40 border border-emerald-100 rounded-3xl flex items-start space-x-3.5 text-emerald-950" id="official-notice-banner">
          <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs font-sans leading-relaxed">
            <span className="font-extrabold text-emerald-900">{t.noticeTitle}</span> {t.noticeText}
          </div>
        </div>

        {/* Dynamic Route/Tab Display with motion transition */}
        <div className="relative overflow-hidden" id="tab-renderer">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRole}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {currentRole === 'public' && (
                <PublicPortal
                  doctors={doctors}
                  patients={patients}
                  onRegisterPatient={handleRegisterPatient}
                  onSelectPatient={setSelectedPatientId}
                  onNavigateToRole={setCurrentRole}
                  language={language}
                />
              )}

              {currentRole === 'patient' && (
                <PatientDashboard
                  patients={patients}
                  selectedPatientId={selectedPatientId}
                  doctors={doctors}
                  appointments={appointments}
                  availableSlots={AVAILABLE_TIME_SLOTS}
                  onSelectPatient={setSelectedPatientId}
                  onBookAppointment={handleBookAppointment}
                  onCancelAppointment={handleCancelAppointment}
                  onPayAppointment={handlePayAppointment}
                />
              )}

              {currentRole === 'doctor' && (
                <DoctorDashboard
                  doctors={doctors}
                  selectedDoctorId={selectedDoctorId}
                  patients={patients}
                  appointments={appointments}
                  onSelectDoctor={setSelectedDoctorId}
                  onAddMedicalRecord={handleAddMedicalRecord}
                  onAddPrescription={handleAddPrescription}
                  onAddTestResult={handleAddTestResult}
                  onCompleteAppointment={handleCompleteAppointment}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Premium Footer for Private Facility */}
      <footer className="bg-white border-t border-slate-200 py-10" id="governmental-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <div className="flex justify-center items-center space-x-2 text-slate-400">
            <Landmark className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider font-sans">
              {t.footerLicense}
            </span>
          </div>
          
          <div className="text-[11px] text-slate-500 max-w-3xl mx-auto leading-relaxed font-sans">
            {t.footerDesc}
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            {t.footerVersion} {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU')}
          </div>
        </div>
      </footer>

      {/* Floating Interactive AI Chatbot */}
      <AIChatBot language={language} />

    </div>
  );
}
