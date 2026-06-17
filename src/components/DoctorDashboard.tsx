/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  UserCheck, 
  Search, 
  Activity, 
  Plus, 
  ClipboardCopy, 
  FileText, 
  FolderHeart, 
  Beaker, 
  Pill, 
  Save, 
  AlertCircle,
  Clock,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { Doctor, Patient, Appointment, MedicalRecordEntry, TestResult, Prescription } from '../types';

interface DoctorDashboardProps {
  doctors: Doctor[];
  selectedDoctorId: string;
  patients: Patient[];
  appointments: Appointment[];
  onSelectDoctor: (doctorId: string) => void;
  onAddMedicalRecord: (patientId: string, record: MedicalRecordEntry) => void;
  onAddPrescription: (patientId: string, prescription: Prescription) => void;
  onAddTestResult: (patientId: string, result: TestResult) => void;
  onCompleteAppointment: (appointmentId: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  doctors,
  selectedDoctorId,
  patients,
  appointments,
  onSelectDoctor,
  onAddMedicalRecord,
  onAddPrescription,
  onAddTestResult,
  onCompleteAppointment,
}) => {
  const currentDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
  
  // States
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  
  // EHR record form states
  const [complaints, setComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [recommendations, setRecommendations] = useState('');
  
  // Checkboxes for ordered tests
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  
  // Prescription sub-form states
  const [addPrescription, setAddPrescription] = useState(false);
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');

  // Active chosen patient info
  const activePatient = patients.find(p => p.id === selectedPatientId);

  // Filter scheduled appointments for the currently simulated Doctor for today
  const doctorAppointments = appointments.filter(
    app => app.doctorId === currentDoctor.id && app.status === 'scheduled'
  );

  const availableTestsList = [
    'Общий анализ крови (ОАК)',
    'Биохимия крови (глюкоза, холестерин)',
    'Общий анализ мочи (ОАМ)',
    'ЭКГ в 12 отведениях',
    'УЗИ органов брюшной полости',
    'Рентгенография грудной клетки',
    'МРТ головного мозга'
  ];

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !diagnosis) {
      alert('Пожалуйста, выберите пациента и введите диагностическое заключение (МКБ-10)');
      return;
    }

    const recordId = `rec-${Date.now()}`;
    const dateToday = new Date().toISOString().split('T')[0];

    // 1. Create Medical Record Entry
    const newRecord: MedicalRecordEntry = {
      id: recordId,
      date: dateToday,
      doctorName: currentDoctor.name,
      doctorSpecialty: currentDoctor.specialty,
      complaints,
      diagnosis,
      recommendations,
      testsOrdered: selectedTests
    };

    onAddMedicalRecord(selectedPatientId, newRecord);

    // 2. If tests were checked, automatically create lab results as 'pending' or simulated values
    selectedTests.forEach(testName => {
      let resultVal = 'Направлен. Ожидает забора биоматериала.';
      let normVal = 'В зависимости от теста';
      if (testName.includes('крови')) {
        normVal = 'Гемоглобин: 120-160 г/л';
      } else if (testName.includes('ЭКГ')) {
        normVal = 'Синусовый ритм';
      }

      const newTest: TestResult = {
        id: `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: dateToday,
        testName,
        result: resultVal,
        norm: normVal,
        status: 'pending',
        laboratory: 'Диагностика «Воронцовка Люкс»'
      };

      onAddTestResult(selectedPatientId, newTest);
    });

    // 3. If prescription was enabled and written, save prescription
    if (addPrescription && medication) {
      const newPrescription: Prescription = {
        id: `pr-${Date.now()}`,
        medication,
        dosage,
        duration,
        dateIssued: dateToday,
        doctorName: currentDoctor.name,
        status: 'active'
      };
      onAddPrescription(selectedPatientId, newPrescription);
    }

    // 4. If this patient has an appointment scheduled with this doctor, complete it
    const activeApp = doctorAppointments.find(app => app.patientId === selectedPatientId);
    if (activeApp) {
      onCompleteAppointment(activeApp.id);
    }

    // Reset Form
    setComplaints('');
    setDiagnosis('');
    setRecommendations('');
    setSelectedTests([]);
    setAddPrescription(false);
    setMedication('');
    setDosage('');
    setDuration('');
    
    alert(`Протокол осмотра пациента успешно сохранен в ЭМК!`);
  };

  const selectPatientForInspection = (patientId: string) => {
    setSelectedPatientId(patientId);
    // Autofill templates based on doctor specialty
    if (currentDoctor.specialty === 'Кардиолог') {
      setComplaints('Жалобы на тяжесть или давящие покалывания в области грудной клетки, периодическая одышка при подъеме на этаж.');
      setDiagnosis('ИБС. Стенокардия напряжения, ФК II.');
      setRecommendations('Прием ацетилсалициловой кислоты 75 мг после ужина. Запись АД утром/вечером.');
    } else if (currentDoctor.specialty === 'Терапевт') {
      setComplaints('Жалобы на першение в горле, сухой кашель, заложенность носа, ломоту в мышцах. Температура 37.8 С.');
      setDiagnosis('ОРВИ, острое течение средней степени тяжести.');
      setRecommendations('Обильное теплое питье до 2 литров в день. Полоскание горла ромашкой. Витаминотерапия (C, D3). Отдых.');
    } else {
      setComplaints('');
      setDiagnosis('');
      setRecommendations('');
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans antialiased" id="doctor-dashboard-wrapper">
      
      {/* Simulation Selector + Profile of clinical doctor */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.15)] flex flex-col md:flex-row md:items-center md:justify-between gap-5 border border-slate-800">
        <div className="flex items-center space-x-4">
          {currentDoctor.avatar ? (
            <img 
              src={currentDoctor.avatar} 
              alt={currentDoctor.name} 
              className="h-14 w-14 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-700/50" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl shrink-0">
              <UserCheck className="h-6 w-6 stroke-[2.2]" />
            </div>
          )}
          <div>
            <div className="text-[9px] font-extrabold text-emerald-400 tracking-widest uppercase font-mono">
              Врач Центра • Симуляция приема
            </div>
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-white mt-1.5">{currentDoctor.name}</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Специальность: <span className="text-emerald-400 font-bold">{currentDoctor.specialty}</span> • Кабинет: <span className="text-slate-200 font-bold">{currentDoctor.room}</span>
            </p>
          </div>
        </div>

        {/* Doctor selector */}
        <div className="flex items-center space-x-2 border-t border-slate-800 md:border-t-0 pt-3 md:pt-0">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">Сменить врача:</span>
          <div className="relative">
            <select
              value={currentDoctor.id}
              onChange={(e) => {
                onSelectDoctor(e.target.value);
                setSelectedPatientId('');
              }}
              className="appearance-none bg-slate-800 border border-slate-700 px-4 py-2 pr-9 rounded-2xl text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition hover:bg-slate-850"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Doctor's scheduled appointments of the day */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.012)]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-150">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                <Clock className="h-4 w-4 text-emerald-600 stroke-[2.2]" />
                <span>Прием пациентов сегодня</span>
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-150/40 px-2.5 py-0.5 rounded-full font-black">
                {doctorAppointments.length}
              </span>
            </div>

            <div className="space-y-3.5">
              {doctorAppointments.length > 0 ? (
                doctorAppointments.map(app => (
                  <div 
                    key={app.id} 
                    className={`p-4 rounded-2xl border transition-all duration-150 ${
                      selectedPatientId === app.patientId 
                        ? 'bg-emerald-50/20 border-emerald-300 shadow-sm' 
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-extrabold text-slate-950">{app.patientName}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">Договор/ДМС: {app.patientOms}</div>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 border border-emerald-100 rounded-lg">
                        {app.time}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-dashed border-slate-200">
                      <button
                        onClick={() => selectPatientForInspection(app.patientId)}
                        className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                      >
                        Принять пациента
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Завершить прием и отправить запись в историю?')) {
                            onCompleteAppointment(app.id);
                          }
                        }}
                        className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-200/50 px-2.5 py-1 rounded-full font-bold transition cursor-pointer"
                      >
                        Завершить
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-medium">Запланированные записи на сегодня отсутствуют.</div>
              )}
            </div>
          </div>

          {/* Quick search access back-to-all patients */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.012)]">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Поиск медицинских карт КРЦ</h3>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="ФИО пациента или номер договора/ДМС..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/55 transition"
              />
            </div>

            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1 scrollbar-none">
              {patients
                .filter(p => p.fullName.toLowerCase().includes(patientSearch.toLowerCase()) || p.omsNumber.includes(patientSearch))
                .map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPatientForInspection(p.id)}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                      selectedPatientId === p.id
                        ? 'bg-emerald-50/25 border-emerald-300 text-slate-950 font-bold'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>{p.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">Договор/ДМС: {p.omsNumber}</div>
                  </button>
                ))
              }
            </div>
          </div>
        </div>

        {/* Right column: Interactive Clinical record form, and EHR history observer */}
        <div className="lg:col-span-8">
          {activePatient ? (
            <div className="space-y-6">
              
              {/* Form container: Добавить осмотр */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-[0_2px_12px_rgba(0,0,0,0.012)]">
                <div className="pb-4 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide">Цифровая медицинская карта КРЦ</span>
                    <h3 className="text-base font-extrabold text-slate-950 font-sans mt-1.5">Осмотр: <span className="text-emerald-700">{activePatient.fullName}</span></h3>
                  </div>
                  <div className="text-[10px] font-mono font-extrabold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-2xl border border-slate-200/60 shadow-sm shrink-0">
                    Договор/ДМС № {activePatient.omsNumber}
                  </div>
                </div>
 
                <form onSubmit={handleCreateRecord} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Анамнез, жалобы пациента на приеме</label>
                    <textarea
                      required
                      rows={3}
                      value={complaints}
                      onChange={(e) => setComplaints(e.target.value)}
                      placeholder="Опишите текущие медицинские жалобы пациента, хронологию симптомов, температуру, давление..."
                      className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/55 focus:bg-white bg-slate-50/50 focus:outline-none text-slate-900 transition"
                    />
                  </div>

                  <div className="space-y-1.55">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Диагноз (МКБ-10)</label>
                      <button
                        type="button"
                        onClick={() => setDiagnosis('ОРВИ, средней тяжести')}
                        className="text-[10px] text-emerald-700 hover:text-emerald-950 font-extrabold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200/50 transition cursor-pointer"
                      >
                        Заполнить ОРВИ шаблон
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="Например: I11.9 Гипертензивная болезнь сердца без застойной сердечной недостаточности"
                      className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/55 focus:bg-white bg-slate-50/50 focus:outline-none text-slate-900 font-extrabold transition placeholder:font-normal"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Лечебные рекомендации, режим, препараты</label>
                    <textarea
                      required
                      rows={2}
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                      placeholder="Диета, ограничение физических нагрузок, постельный режим, процедуры..."
                      className="w-full px-4 py-3 text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/55 focus:bg-white bg-slate-50/50 focus:outline-none text-slate-900 transition"
                    />
                  </div>

                  {/* Multi-check test orderer */}
                  <div className="space-y-3 bg-slate-50 border border-slate-200/60 p-5 rounded-3xl">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center space-x-1.5">
                      <Beaker className="h-4 w-4 text-emerald-600 shrink-0 stroke-[2.2]" />
                      <span>Назначить лабораторные обследования</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1.5">
                      {availableTestsList.map(test => {
                        const isChecked = selectedTests.includes(test);
                        return (
                          <label key={test} className="flex items-start space-x-2.5 text-xs text-slate-700 font-medium cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedTests(selectedTests.filter(t => t !== test));
                                } else {
                                  setSelectedTests([...selectedTests, test]);
                                }
                              }}
                              className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 shrink-0 cursor-pointer"
                            />
                            <span>{test}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* EHR sub-form prescription adder */}
                  <div className="border border-slate-150 rounded-3xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setAddPrescription(!addPrescription)}
                        className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Pill className="h-4 w-4 stroke-[2.2]" />
                        <span>{addPrescription ? '• Закрыть форму рецепта' : '+ Выписать рецепт на лекарства'}</span>
                      </button>
                      <span className="text-[9px] text-slate-400 bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded font-bold uppercase">Рецептурный бланк</span>
                    </div>

                    {addPrescription && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2"
                      >
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-slate-400 uppercase">Препарат</label>
                          <input
                            type="text"
                            placeholder="Название лекарства"
                            value={medication}
                            onChange={(e) => setMedication(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl text-slate-900 bg-slate-50 placeholder:font-normal font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-slate-400 uppercase">Дозировка</label>
                          <input
                            type="text"
                            placeholder="Например: 1 таб утром"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl text-slate-900 bg-slate-50 placeholder:font-normal font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-extrabold text-slate-400 uppercase">Срок приема</label>
                          <input
                            type="text"
                            placeholder="Продолжительность"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl text-slate-900 bg-slate-50 placeholder:font-normal font-bold"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 font-extrabold text-xs text-white rounded-2xl transition duration-150 flex items-center justify-center space-x-2 shadow-sm cursor-pointer uppercase tracking-wider"
                  >
                    <Save className="h-4 w-4" />
                    <span>Внести протокол осмотра в медкарту пациента</span>
                  </button>
                </form>
              </div>

              {/* Patient EHR Observer block for doctors */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Хронология осмотров и записей в ЭМК пациента</h4>
                
                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-none">
                  {activePatient.records.length > 0 ? (
                    activePatient.records.map(rec => (
                      <div key={rec.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3">
                        <div className="flex justify-between items-start pb-2 border-b border-slate-200/60">
                          <div>
                            <span className="text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">{rec.doctorSpecialty}</span>
                            <span className="text-xs font-bold text-slate-900 ml-2">{rec.doctorName}</span>
                          </div>
                          <span className="text-[10px] font-mono font-extrabold text-slate-400">{new Date(rec.date).toLocaleDateString('ru-RU')}</span>
                        </div>
                        <div className="text-xs text-slate-700 space-y-1.5 font-sans leading-relaxed">
                          <p><strong className="text-slate-500 uppercase text-[9px] tracking-wider font-extrabold block mb-0.5">Жалобы:</strong> <span className="font-medium">{rec.complaints}</span></p>
                          <p><strong className="text-slate-500 uppercase text-[9px] tracking-wider font-extrabold block mb-0.5 font-sans">Диагноз (МКБ-10):</strong> <span className="text-slate-950 font-black">{rec.diagnosis}</span></p>
                          <p><strong className="text-slate-500 uppercase text-[9px] tracking-wider font-extrabold block mb-0.5">Рекомендации и терапия:</strong> <span className="font-medium">{rec.recommendations}</span></p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">У пациента нет предыдущих медицинских записей в ЭМК.</div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs flex flex-col items-center justify-center space-y-4 shadow-sm">
              <FolderHeart className="h-10 w-10 text-emerald-600 stroke-[1.8]" />
              <p className="max-w-xs font-semibold leading-relaxed text-slate-500">
                Выберите пациента из сегодняшнего графика приема слева или воспользуйтесь общим поиском по базе карт, чтобы составить протокол осмотра, выписать рецептурный лист или выдать направление.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
