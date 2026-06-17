/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Pill, 
  Activity, 
  PlusCircle, 
  AlertOctagon, 
  CheckCircle, 
  Trash2, 
  MapPin, 
  ExternalLink,
  Printer,
  ChevronDown,
  CreditCard,
  Check,
  Lock,
  Loader2
} from 'lucide-react';
import { Patient, Doctor, Appointment, Prescription, MedicalRecordEntry, TestResult } from '../types';

interface PatientDashboardProps {
  patients: Patient[];
  selectedPatientId: string;
  doctors: Doctor[];
  appointments: Appointment[];
  availableSlots: string[];
  onSelectPatient: (patientId: string) => void;
  onBookAppointment: (appointment: Appointment) => void;
  onCancelAppointment: (appointmentId: string) => void;
  onPayAppointment: (appointmentId: string, paymentId: string, amount: number) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  patients,
  selectedPatientId,
  doctors,
  appointments,
  availableSlots,
  onSelectPatient,
  onBookAppointment,
  onCancelAppointment,
  onPayAppointment,
}) => {
  const [activeTab, setActiveTab] = useState<'emk' | 'booking' | 'appointments'>('emk');

  // Booking states
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [successBookingMsg, setSuccessBookingMsg] = useState<Appointment | null>(null);

  // Stripe & Payment States
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payingAppointment, setPayingAppointment] = useState<Appointment | null>(null);
  const [ cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [customerEmail, setCustomerEmail] = useState('semaarykov@gmail.com');
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [testResendLoading, setTestResendLoading] = useState(false);
  const [testResendResult, setTestResendResult] = useState<{ success: boolean; hint?: string; error?: string; envSet?: boolean; fromUsed?: string } | null>(null);

  const [stripeInfo, setStripeInfo] = useState<{ simulated: boolean; clientSecret: string; amount: number; currency: string } | null>(null);
  const [paymentError, setPaymentError] = useState('');

  const [resendConfigStatus, setResendConfigStatus] = useState<{ configured: boolean; fromEmail: string; isDefaultSandbox: boolean } | null>(null);

  useEffect(() => {
    const fetchConfigStatus = async () => {
      try {
        const resp = await fetch('/api/resend/config-status');
        const data = await resp.json();
        if (data && data.resend) {
          setResendConfigStatus(data.resend);
        }
      } catch (e) {
        console.error("Failed to fetch resend config status", e);
      }
    };
    fetchConfigStatus();
  }, [paymentModalOpen]);

  const handleTestResend = async () => {
    if (!customerEmail || !customerEmail.includes('@')) {
      alert('Пожалуйста, введите корректный адрес электронной почты для проверки.');
      return;
    }
    setTestResendLoading(true);
    setTestResendResult(null);
    try {
      const resp = await fetch('/api/resend/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail: customerEmail })
      });
      const data = await resp.json();
      setTestResendResult(data);
    } catch (err: any) {
      setTestResendResult({
        success: false,
        error: err.message || 'Ошибка сети при обращении к серверу диагностики.'
      });
    } finally {
      setTestResendLoading(false);
    }
  };

  // Active Patient retrieval
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  if (!activePatient) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
        <p className="text-slate-500 text-sm">Пациенты не найдены. Пожалуйста, вернитесь на главную страницу и оформите карту гостя.</p>
      </div>
    );
  }

  // Filter appointments specifically scheduled for this patient
  const myAppointments = appointments.filter(
    app => app.patientId === activePatient.id && app.status === 'scheduled'
  );

  // Specialties of doctors available for selection
  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  // Doctors belonging to the selected specialty
  const specialtyDoctors = doctors.filter(d => d.specialty === selectedSpecialty);

  // Generate 7 consecutive valid weekdays starting tomorrow
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 10; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      // Skip sundays (state clinics skip sundays)
      if (nextDate.getDay() !== 0) {
        const yyyy = nextDate.getFullYear();
        const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
        const dd = String(nextDate.getDate()).padStart(2, '0');
        const dayOfWeek = nextDate.toLocaleDateString('ru-RU', { weekday: 'short' });
        dates.push({
          formatted: `${yyyy}-${mm}-${dd}`,
          label: `${dd}.${mm} (${dayOfWeek})`
        });
      }
    }
    return dates;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedDate || !selectedTime) {
      alert('Пожалуйста, выберите специальность, врача, дату и время проведения приема.');
      return;
    }

    const doc = doctors.find(d => d.id === selectedDoctorId);
    if (!doc) return;

    // Check if slot already taken
    const conflictObj = appointments.find(
      app => app.doctorId === selectedDoctorId && app.date === selectedDate && app.time === selectedTime && app.status === 'scheduled'
    );
    if (conflictObj) {
      alert('Данный временной интервал уже занят другим пациентом. Пожалуйста, выберите другое время.');
      return;
    }

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      patientId: activePatient.id,
      patientName: activePatient.fullName,
      patientOms: activePatient.omsNumber,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialty: doc.specialty,
      room: doc.room,
      date: selectedDate,
      time: selectedTime,
      status: 'scheduled',
    };

    onBookAppointment(newAppointment);
    setSuccessBookingMsg(newAppointment);

    // Reset workflow states
    setSelectedDoctorId('');
    setSelectedSpecialty('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const initiateStripePayment = async (app: Appointment) => {
    setPaymentLoading(true);
    setPaymentError('');
    setPayingAppointment(app);
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    setCardCvv('');

    // Pre-fill the customer email from the patient record if defined
    const patientObj = patients.find(p => p.id === app.patientId);
    if (patientObj && patientObj.email) {
      setCustomerEmail(patientObj.email);
    } else {
      setCustomerEmail('semaarykov@gmail.com');
    }
    
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1500,
          currency: 'USD',
          doctorName: app.doctorName,
          patientName: app.patientName,
          appointmentId: app.id
        })
      });

      if (!response.ok) {
        throw new Error('Не удалось подключиться к платежному шлюзу Stripe');
      }

      const data = await response.json();
      setStripeInfo(data);
      setPaymentModalOpen(true);
    } catch (err: any) {
      console.error(err);
      setPaymentError(err.message || 'Ошибка платежной системы');
      alert(`Ошибка Stripe: ${err.message || 'Не удалось связаться с сервером платежей'}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
      setPaymentError('Пожалуйста, заполните все реквизиты карты.');
      return;
    }

    setPaymentLoading(true);
    setPaymentError('');

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      if (!payingAppointment) return;

      const mockPaymentId = stripeInfo?.simulated 
        ? `sim_pay_${Date.now()}_chk`
        : `ch_${Date.now()}_stripe_success`;

      // Call server backend to confirm payment and trigger Resend email service
      const confResponse = await fetch('/api/stripe/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: payingAppointment.id,
          paymentId: mockPaymentId,
          amount: stripeInfo?.amount || 1500,
          patientName: payingAppointment.patientName,
          doctorName: payingAppointment.doctorName,
          doctorSpecialty: payingAppointment.doctorSpecialty,
          date: payingAppointment.date,
          time: payingAppointment.time,
          customerEmail: customerEmail || 'semaarykov@gmail.com'
        })
      });

      const confResult = await confResponse.json();
      
      let emailSentText = '';
      if (confResult.resendDetails?.simulated) {
        emailSentText = `\n\n📬 (Демо) Шаблон письма сгенерирован и выведен в консоль сервера (API-ключ RESEND не задан).`;
      } else if (confResult.resendDetails?.deliveries) {
        const deliveries = confResult.resendDetails.deliveries;
        const successList = deliveries.filter((d: any) => d.success).map((d: any) => d.recipient);
        const failList = deliveries.filter((d: any) => !d.success);
        
        if (successList.length > 0) {
          emailSentText += `\n\n📧 Письмо об оплате успешно отправлено через Resend на адреса: ${successList.join(', ')}`;
        }
        
        if (failList.length > 0) {
          const sandboxFail = failList.find((d: any) => d.isSandboxRestriction);
          if (sandboxFail) {
            emailSentText += `\n\n⚠️ ВНИМАНИЕ (Песочница Resend): Письмо для пациента (${customerEmail}) не ушло, так как вы используете тестовый аккаунт Resend (onboarding@resend.dev). В песочнице можно отправлять только на свой собственный email (semaarykov@gmail.com). Для отправки пациентам нужно подтвердить свой домен (Domain Verification) на сайте Resend, либо добавить их почту в список 'Test Receivers' на панели Resend.`;
          } else {
            emailSentText += `\n\n⚠️ Ошибка отправки на ${failList.map((d: any) => d.recipient).join(', ')}: ${failList[0].error || 'ошибка доставки'}`;
          }
        }
      } else {
        emailSentText = `\n\n📧 Статус отправки писем не определен.`;
      }

      let telegramSentText = '';
      if (confResult.telegramDetails?.simulated) {
        telegramSentText = `\n\n🤖 (Демо) Сообщение для Telegram-бота выведено в консоль сервера (настройте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env для отправки в мессенджер).`;
      } else if (confResult.telegramSent) {
        telegramSentText = `\n\n🤖 Уведомление об оплате успешно отправлено в ваш Telegram-чат!`;
      } else {
        telegramSentText = `\n\n⚠️ Ошибка Telegram бота: ${confResult.telegramDetails?.error || 'неизвестная ошибка'}`;
      }

      onPayAppointment(payingAppointment.id, mockPaymentId, stripeInfo?.amount || 1500);

      if (successBookingMsg && successBookingMsg.id === payingAppointment.id) {
        setSuccessBookingMsg({
          ...successBookingMsg,
          isPaid: true,
          paymentId: mockPaymentId,
          amountPaid: stripeInfo?.amount || 1500
        });
      }

      setPaymentModalOpen(false);
      setPayingAppointment(null);
      setStripeInfo(null);
      alert(`Оплата сеанса успешно зачислена через биллинг Stripe! Услуги курорта подтверждены.${emailSentText}${telegramSentText}`);
    } catch (err: any) {
      console.error(err);
      setPaymentError('Произошла ошибка при завершении транзакции.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const triggerPrint = (id: string) => {
    const printContent = document.getElementById(id);
    if (!printContent) return;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    // Refresh to restore state (standard client-only printing workaround)
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-12 font-sans antialiased" id="patient-dashboard-wrapper">
      
      {/* Quick profile card and patient switcher */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl shrink-0">
            <User className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-sans">{activePatient.fullName}</h2>
              <span className={`px-2.5 py-0.5 text-[9px] uppercase font-bold rounded-full tracking-wider ${activePatient.gender === 'мужской' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-pink-50 text-pink-700 border border-pink-100'}`}>
                {activePatient.gender}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 mt-1.5 font-sans">
              <span><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wide mr-1">ДР:</span> <span className="font-semibold text-slate-800">{new Date(activePatient.birthDate).toLocaleDateString('ru-RU')}</span></span>
              <span><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wide mr-1">Тел:</span> <span className="font-semibold text-slate-800">{activePatient.phone}</span></span>
              <span><span className="font-bold text-slate-400 uppercase text-[9px] tracking-wide mr-1">Договор/ДМС:</span> <span className="font-mono text-slate-900 font-bold">{activePatient.omsNumber}</span></span>
            </div>
          </div>
        </div>

        {/* Quick Patient Switch Action */}
        <div className="flex items-center space-x-2 border-t border-slate-100 md:border-t-0 pt-3 md:pt-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans hidden sm:inline">Выбор карты:</span>
          <div className="relative">
            <select
              value={activePatient.id}
              onChange={(e) => onSelectPatient(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 pr-9 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer transition"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.fullName}</option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Internal Tabs Navigator in Pill-style Bento wrapper */}
      <div className="bg-slate-100/80 border border-slate-200/60 p-1 rounded-2xl flex max-w-full overflow-x-auto whitespace-nowrap scrollbar-none gap-1">
        <button
          onClick={() => { setActiveTab('emk'); setSuccessBookingMsg(null); }}
          className={`py-2 px-4.5 text-xs sm:text-sm font-extrabold rounded-xl transition duration-150 cursor-pointer ${
            activeTab === 'emk'
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="tab-emk"
        >
          Электронная медицинская карта (ЭМК)
        </button>
        <button
          onClick={() => { setActiveTab('booking'); setSuccessBookingMsg(null); }}
          className={`py-2 px-4.5 text-xs sm:text-sm font-extrabold rounded-xl transition duration-150 cursor-pointer ${
            activeTab === 'booking'
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="tab-booking"
        >
          Запись на прием онлайн
        </button>
        <button
          onClick={() => { setActiveTab('appointments'); setSuccessBookingMsg(null); }}
          className={`py-2 px-4.5 text-xs sm:text-sm font-extrabold rounded-xl transition duration-150 relative cursor-pointer ${
            activeTab === 'appointments'
              ? 'bg-white text-slate-950 shadow-sm border border-slate-200/50'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          id="tab-appointments"
        >
          <span>Мои талоны</span>
          {myAppointments.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-extrabold rounded-full">
              {myAppointments.length}
            </span>
          )}
        </button>
      </div>

      {/* Tabs Display block */}
      <div className="min-h-[500px]" id="tab-content-container">
        
        {/* TAB 1: EHR (ЭМК) View */}
        {activeTab === 'emk' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Brief medical status + Prescriptions */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Blood and Allergies Box */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:translate-y-[-1px] transition duration-200">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Клинический статус пациента</h4>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Группа крови</div>
                    <div className="text-sm font-extrabold text-slate-900 mt-1 font-mono">{activePatient.bloodType}</div>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/50">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Договор/ДМС</div>
                    <div className="text-xs font-extrabold text-emerald-800 mt-1 flex items-center space-x-1.5 uppercase tracking-wide">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Активен</span>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Лекарственные аллергии</div>
                  <div className="flex flex-wrap gap-2">
                    {activePatient.allergies.length > 0 ? (
                      activePatient.allergies.map(all => (
                        <span key={all} className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-[10px] font-extrabold flex items-center space-x-1 uppercase tracking-wide">
                          <AlertOctagon className="h-3 w-3 shrink-0 text-red-500 stroke-[2.5]" />
                          <span>{all}</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic font-medium">Аллергии не зарегистрированы</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Prescriptions Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:translate-y-[-1px] transition duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                    <Pill className="h-4 w-4 text-emerald-600 stroke-[2.2]" />
                    <span>Рецептурные листы</span>
                  </h4>
                  <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-bold">
                    {activePatient.prescriptions.length} шт
                  </span>
                </div>

                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {activePatient.prescriptions.length > 0 ? (
                    activePatient.prescriptions.map(pr => (
                      <div key={pr.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-extrabold text-slate-950">{pr.medication}</span>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wide border ${
                            pr.status === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-200 text-slate-500 border-slate-300'
                          }`}>
                            {pr.status === 'active' ? 'Активен' : 'Истек'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-sans leading-tight"><span className="font-bold text-slate-400 uppercase text-[9px] mr-1.5">Дозировка:</span> <span className="font-medium text-slate-900">{pr.dosage}</span></p>
                        <p className="text-xs text-slate-600 font-sans leading-tight"><span className="font-bold text-slate-400 uppercase text-[9px] mr-1.5">Период:</span> <span className="font-medium text-slate-900">{pr.duration}</span></p>
                        <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 border-t border-dashed border-slate-200">
                          <span>Дата: {new Date(pr.dateIssued).toLocaleDateString('ru-RU')}</span>
                          <span>Врач: {pr.doctorName.split(' ')[0]}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs font-medium">Активные рецептурные листы отсутствуют.</div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: EHR History Cards + Test Analyses */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Visit History Cards */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                  <FileText className="h-4 w-4 text-emerald-600 stroke-[2.2]" />
                  <span>История осмотров и анамнез ЭМК</span>
                </h4>

                <div className="space-y-5">
                  {activePatient.records.length > 0 ? (
                    activePatient.records.map((rec, index) => (
                      <div key={rec.id} className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.012)] hover:shadow-md transition duration-200 space-y-4 relative">
                        {/* Record Index Badge */}
                        <span className="absolute top-5 right-6 text-xs font-mono font-extrabold text-slate-300">#{activePatient.records.length - index}</span>
                        
                        {/* Header: Date + Doctor */}
                        <div className="flex items-center space-x-3.5 pb-3.5 border-b border-slate-100">
                          <div className="h-10 w-10 bg-gradient-to-tr from-emerald-50 to-teal-100 text-emerald-800 border border-emerald-200/50 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                            {rec.doctorSpecialty[0]}
                          </div>
                          <div>
                            <span className="inline-block text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5 uppercase tracking-wide">
                              {rec.doctorSpecialty}
                            </span>
                            <div className="text-xs font-semibold text-slate-500 mt-1">
                              Врач: <span className="font-extrabold text-slate-800">{rec.doctorName}</span> • <span className="font-mono text-[10px] text-slate-400">{new Date(rec.date).toLocaleDateString('ru-RU')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Content parts */}
                        <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
                          <div>
                            <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block mb-1">Жалобы пациента:</span>
                            <p className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-600 font-medium">{rec.complaints}</p>
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block mb-1">Диагноз по МКБ-10:</span>
                            <p className="text-slate-900 font-extrabold text-sm">{rec.diagnosis}</p>
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block mb-1">Назначения и рекомендации врачей:</span>
                            <p className="text-slate-600 font-medium leading-relaxed bg-emerald-50/20 p-3 rounded-2xl border border-emerald-150/10 text-slate-700">{rec.recommendations}</p>
                          </div>
                          {rec.testsOrdered && rec.testsOrdered.length > 0 && (
                            <div className="pt-2">
                              <span className="font-extrabold text-slate-400 uppercase text-[9px] tracking-wider block mb-1.5">Рекомендованные исследования:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {rec.testsOrdered.map(test => (
                                  <span key={test} className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-100 rounded-full text-[10px] font-bold">
                                    {test}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-semibold">
                      Медицинская карта пуста. Запишитесь к врачу (вкладка "Запись на прием"), пройдите прием для внесения записей.
                    </div>
                  )}
                </div>
              </div>

              {/* Lab Test Results Panel */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                  <Activity className="h-4 w-4 text-emerald-600 stroke-[2.2]" />
                  <span>Результаты лабораторных исследований</span>
                </h4>

                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.012)]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 uppercase font-sans font-extrabold text-[9px] tracking-wider">
                          <th className="p-4">Дата / Кабинет</th>
                          <th className="p-4">Название исследования</th>
                          <th className="p-4">Результат</th>
                          <th className="p-4">Норма</th>
                          <th className="p-4 text-center">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {activePatient.testResults.length > 0 ? (
                           activePatient.testResults.map(test => (
                            <tr key={test.id} className="hover:bg-slate-50/55 transition duration-150">
                              <td className="p-4">
                                <span className="font-mono text-[11px] block text-slate-900 font-bold">
                                  {new Date(test.date).toLocaleDateString('ru-RU')}
                                </span>
                                <span className="text-[10px] text-slate-400 block max-w-[120px] truncate mt-0.5">{test.laboratory}</span>
                              </td>
                              <td className="p-4 font-bold text-slate-900">{test.testName}</td>
                              <td className="p-4 text-slate-700 font-mono font-bold max-w-[200px] break-words bg-slate-50/20">{test.result}</td>
                              <td className="p-4 text-slate-500 font-mono font-medium">{test.norm}</td>
                              <td className="p-4 text-center">
                                {test.status === 'normal' && (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                    <CheckCircle className="h-3 w-3 shrink-0 text-emerald-600 stroke-[2.5]" />
                                    <span>В норме</span>
                                  </span>
                                )}
                                {test.status === 'abnormal' && (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                    <AlertOctagon className="h-3 w-3 shrink-0 text-red-500 stroke-[2.5]" />
                                    <span>Вне нормы</span>
                                  </span>
                                )}
                                {test.status === 'pending' && (
                                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[9px] font-extrabold uppercase tracking-wide">
                                    <span>Готовится</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-medium">Лабораторные исследования еще не проводились.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: Online Appointments Booking Panel */}
        {activeTab === 'booking' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="space-y-1 text-center max-w-md mx-auto">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">ОНЛАЙН ЗАПИСЬ</span>
              <h3 className="text-lg font-bold text-slate-900 font-sans">Онлайн бронирование восстановительных сеансов</h3>
              <p className="text-xs text-slate-500">
                Выберите медицинский/реабилитационный профиль, специалиста, удобную дату и время для прохождения процедур.
              </p>
            </div>

            {/* If booked successfully -> show ticket view */}
            <AnimatePresence mode="wait">
              {successBookingMsg ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 border border-emerald-200 bg-emerald-50/40 p-6 rounded-2xl relative"
                  id={`ticket-${successBookingMsg.id}`}
                >
                  <div className="text-center space-y-2">
                    <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-slate-900 text-sm font-sans">Сеанс забронирован!</h4>
                    <p className="text-xs text-slate-500">Пожалуйста, сохраните этот электронный талон или распечатайте его.</p>
                  </div>

                  {/* Print Ticket Layout block */}
                  <div className="bg-white border border-dashed border-slate-300 rounded-xl p-5 space-y-4 shadow-sm" id={`print-ticket-box-${successBookingMsg.id}`}>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">ТАЛОН НА РЕАБИЛИТАЦИЮ — ВОРОНЦОВКА ЛЮКС</div>
                        <div className="text-xs font-mono font-bold text-slate-800 mt-0.5">№ {successBookingMsg.id.toUpperCase()}</div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full uppercase">Подтверждено</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Пациент</div>
                        <div className="font-bold text-slate-900">{successBookingMsg.patientName}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">Договор/ДМС: {successBookingMsg.patientOms}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Специалист</div>
                        <div className="font-bold text-slate-900">{successBookingMsg.doctorName}</div>
                        <div className="text-slate-500 text-[11px] font-medium">{successBookingMsg.doctorSpecialty}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Зал / Кабинет</div>
                        <div className="font-bold text-slate-900">{successBookingMsg.room}</div>
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase">Дата и Время</div>
                        <div className="font-bold text-slate-900 font-mono text-[13px] text-emerald-700 flex items-center space-x-1.5 mt-0.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(successBookingMsg.date).toLocaleDateString('ru-RU')} • {successBookingMsg.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-400 border-t border-dashed border-slate-100 text-center">
                      * Рекомендуется прибыть за 10 минут до назначенного начала, при себе иметь карту гостя или копию договора.
                    </div>
                  </div>

                  {/* Stripe Payment CTA inside success screen */}
                  {!successBookingMsg.isPaid ? (
                    <div className="bg-emerald-600/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-0.5 text-left">
                        <div className="text-xs font-black text-slate-950 flex items-center gap-1.5">
                          <CreditCard className="h-4 w-4 text-emerald-700" />
                          <span>Оплата восстановительного сеанса</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Рекомендуется оплатить сеанс <strong className="text-slate-800">1500 KGS</strong> для автоматической валидации.</p>
                      </div>
                      <button
                        onClick={() => initiateStripePayment(successBookingMsg)}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl transition duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider font-sans shrink-0 font-bold"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>Оплатить Stripe</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-250/50 rounded-2xl p-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                      <div className="text-left">
                        <div className="text-xs font-black text-emerald-950">Прием успешно оплачен через шлюз Stripe!</div>
                        <div className="text-[10px] text-slate-400 font-mono">Шифр транзакции: {successBookingMsg.paymentId}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => triggerPrint(`print-ticket-box-${successBookingMsg.id}`)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center space-x-1.5"
                    >
                      <Printer className="h-4 w-4" />
                      <span>Печать талона</span>
                    </button>
                    <button
                      onClick={() => setSuccessBookingMsg(null)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition"
                    >
                      Регистрация новой записи
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  
                  {/* Specialty Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">1. Специальность врача</label>
                    <div className="relative">
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => {
                          setSelectedSpecialty(e.target.value);
                          setSelectedDoctorId('');
                          setSelectedDate('');
                          setSelectedTime('');
                        }}
                        className="w-full appearance-none px-4 py-3 text-xs border border-slate-200 rounded-2xl text-slate-900 font-bold bg-slate-50 hover:bg-slate-100/75 focus:bg-white focus:ring-2 focus:ring-emerald-500/55 focus:outline-none cursor-pointer transition"
                      >
                        <option value="">-- Выберите профиль --</option>
                        {specialties.map(spec => (
                          <option key={spec} value={spec}>{spec}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Doctor Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">2. Лечащий специалист</label>
                    <div className="relative">
                      <select
                        disabled={!selectedSpecialty}
                        value={selectedDoctorId}
                        onChange={(e) => {
                          setSelectedDoctorId(e.target.value);
                          setSelectedDate('');
                          setSelectedTime('');
                        }}
                        className="w-full appearance-none px-4 py-3 text-xs border border-slate-200 rounded-2xl text-slate-900 font-bold bg-slate-50 hover:bg-slate-100/75 focus:bg-white focus:ring-2 focus:ring-emerald-500/55 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer transition"
                      >
                        <option value="">-- Выберите врача --</option>
                        {specialtyDoctors.map(doc => (
                          <option key={doc.id} value={doc.id}>{doc.name} (Кабинет {doc.room.split(' ')[0]})</option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-500 absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  {/* Date & Time Grid Pickers (Clean UI rhythm) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    
                    {/* Date Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">3. Рабочая дата</label>
                      <div className="space-y-2">
                        {selectedDoctorId ? (
                          <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-none">
                            {getAvailableDates().map(dt => (
                              <button
                                type="button"
                                key={dt.formatted}
                                onClick={() => {
                                  setSelectedDate(dt.formatted);
                                  setSelectedTime('');
                                }}
                                className={`px-2 py-3 text-center text-xs font-bold rounded-2xl border transition-all duration-150 cursor-pointer ${
                                  selectedDate === dt.formatted
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                }`}
                              >
                                {dt.label}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 font-medium">
                            Сначала выберите специалиста
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time Selector */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">4. Свободное время</label>
                      <div className="space-y-2">
                        {selectedDate ? (
                          <div className="grid grid-cols-3 gap-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-none">
                            {availableSlots.map(slot => {
                              const isTaken = appointments.some(
                                app => app.doctorId === selectedDoctorId && app.date === selectedDate && app.time === slot && app.status === 'scheduled'
                              );
                              return (
                                <button
                                  disabled={isTaken}
                                  type="button"
                                  key={slot}
                                  onClick={() => setSelectedTime(slot)}
                                  className={`py-2 text-center text-xs font-mono font-bold rounded-xl border transition-all duration-150 cursor-pointer ${
                                    isTaken
                                      ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through'
                                      : selectedTime === slot
                                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50/40'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 font-medium">
                            Выберите рабочую дату
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={!selectedTime}
                    className="w-full mt-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition duration-150 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none shadow-sm flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Оформить талон на процедуру</span>
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 3: Active Patient Tickets & History */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Мои действующие направления и талоны</h3>
              <span className="text-xs font-mono font-extrabold text-slate-500">Всего записей: {myAppointments.length}</span>
            </div>

            {myAppointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myAppointments.map(app => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key={app.id}
                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.012)] hover:shadow-md transition duration-200 flex flex-col justify-between"
                  >
                    <div className="p-5 sm:p-6 space-y-4">
                      <div className="flex justify-between items-start pb-3.5 border-b border-slate-150">
                        <div>
                          <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                            {app.doctorSpecialty}
                          </span>
                          <h4 className="font-extrabold text-slate-950 text-base mt-2">{app.doctorName}</h4>
                        </div>
                        <span className="font-mono text-[10px] font-extrabold text-slate-300 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg">ID: {app.id.split('-')[1]?.substring(0, 5) || app.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-sans text-slate-600">
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Кабинет осмотра</div>
                          <div className="font-extrabold text-slate-800 text-sm mt-0.5">{app.room}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Договор/ДМС</div>
                          <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">{app.patientOms}</div>
                        </div>
                        <div className="col-span-2 bg-gradient-to-tr from-slate-50 to-emerald-50/20 p-3.5 rounded-2xl border border-slate-200/60 flex items-center justify-between">
                          <div>
                            <div className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Время посещения кабинета</div>
                            <div className="font-black text-slate-900 font-sans text-xs mt-0.5">
                              {new Date(app.date).toLocaleDateString('ru-RU')} в <span className="text-emerald-700 font-mono text-sm">{app.time}</span>
                            </div>
                          </div>
                          <MapPin className="h-5 w-5 text-emerald-600 shrink-0 ml-2" />
                        </div>
                      </div>

                      {/* Stripe Payment Integration row */}
                      <div className="border-t border-slate-150 pt-3.5 flex items-center justify-between gap-3 text-xs">
                        {app.isPaid ? (
                          <div className="flex items-center space-x-1.5 text-emerald-850 font-semibold bg-emerald-50 border border-emerald-250/60 rounded-xl px-3 py-2 w-full justify-between">
                            <span className="flex items-center gap-1.5 font-extrabold tracking-tight text-[11px] text-emerald-900">
                              <Check className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                              <span>Оплачено через Stripe</span>
                            </span>
                            <span className="text-[10px] text-emerald-700/80 font-mono font-bold">1500 KGS</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <div className="text-slate-500 font-medium">К оплате сеанса: <span className="font-extrabold text-slate-950 font-sans">1500 KGS</span></div>
                            <button
                              onClick={() => initiateStripePayment(app)}
                              className="text-[11px] font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans"
                            >
                              <CreditCard className="h-3 w-3" />
                              <span>Оплатить Stripe</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 px-5 py-4 border-t border-slate-200/80 flex items-center justify-between gap-4">
                      <button
                        onClick={() => triggerPrint(`print-ticket-box-${app.id}`)}
                        className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-emerald-50/50 border border-emerald-200/60 rounded-xl transition cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>Печать талона</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Вы действительно хотите отменить данную запись к специалисту?')) {
                            onCancelAppointment(app.id);
                          }
                        }}
                        className="text-xs font-extrabold text-red-600 hover:text-red-800 flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-red-50 border border-red-200/60 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Отменить</span>
                      </button>
                    </div>

                    {/* Hidden print payload wrapper explicitly created for iframe print */}
                    <div className="hidden" id={`print-ticket-box-${app.id}`}>
                      <div style={{ padding: '30px', fontFamily: 'system-ui, sans-serif', border: '2px dashed #ccc' }}>
                        <h2 style={{ textAlign: 'center', color: '#047857' }}>ТАЛОН НА РЕАБИЛИТАЦИЮ — ВОРОНЦОВКА ЛЮКС</h2>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
                          <p><strong>Пациент:</strong> {app.patientName}</p>
                          <p><strong>Договор/ДМС:</strong> {app.patientOms}</p>
                          <p><strong>Специалист:</strong> {app.doctorName} ({app.doctorSpecialty})</p>
                          <p><strong>Кабинет / Зал:</strong> {app.room}</p>
                          <p><strong>Дата процедуры:</strong> {new Date(app.date).toLocaleDateString('ru-RU')}</p>
                          <p><strong>Время сеанса:</strong> {app.time}</p>
                        </div>
                        <p style={{ marginTop: '30px', fontSize: '11px', color: '#888', textAlign: 'center' }}>
                          * Реабилитационный центр «Воронцовка Люкс». Пожалуйста, предъявите удостоверение личности и карту гостя на стойке регистрации.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs font-bold leading-relaxed">
                У вас нет активных записей. Записаться к врачу вы можете на вкладке "Запись на прием онлайн".
              </div>
            )}
          </div>
        )}

      </div>

      {/* Stripe Payment Modal popup */}
      <AnimatePresence>
        {paymentModalOpen && payingAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
            >
              {/* Header */}
              <div className="bg-emerald-800 text-white p-6 relative">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentModalOpen(false);
                    setPayingAppointment(null);
                    setStripeInfo(null);
                  }}
                  className="absolute right-4 top-4 text-white/85 hover:text-white transition text-lg bg-emerald-950/40 w-8 h-8 rounded-full flex items-center justify-center font-bold font-sans"
                >
                  ✕
                </button>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-emerald-700/80 rounded-xl">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-black tracking-tight font-sans">Безопасная оплата Stripe</h3>
                    <p className="text-[10px] text-emerald-200/90 tracking-wide font-medium mt-0.5 uppercase tracking-wider font-sans">Лицензированный платежный шлюз</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Visual Glassmorphic Credit Card Representation */}
                <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-950 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden aspect-[1.586/1] flex flex-col justify-between border border-emerald-500/30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)] pointer-events-none" />
                  
                  {/* Top: Chip & Card Brand */}
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-8 bg-gradient-to-tr from-amber-200/80 to-amber-100 rounded-lg border border-amber-300 flex items-center justify-center relative overflow-hidden">
                      <div className="w-full h-px bg-amber-400/50 absolute top-2/4" />
                      <div className="w-px h-full bg-amber-400/50 absolute left-2/4" />
                    </div>
                    {/* Brand Badge */}
                    <span className="text-sm font-black italic tracking-wider bg-white/10 px-3 py-1 rounded-lg border border-white/10 font-sans">Stripe</span>
                  </div>

                  {/* Middle: Number */}
                  <div className="font-mono text-lg sm:text-xl md:text-2xl tracking-widest text-center py-4 bg-black/10 rounded-xl my-2 selection:bg-emerald-800">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  {/* Bottom: Holder & Expiry */}
                  <div className="flex justify-between items-end text-xs uppercase font-medium">
                    <div className="space-y-1 text-left">
                      <div className="text-[8px] text-emerald-250 font-bold tracking-widest font-sans">Держатель карты</div>
                      <div className="font-bold truncate max-w-[170px] text-slate-100 font-sans">{cardHolder || 'CARDHOLDER NAME'}</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-[8px] text-emerald-250 font-bold tracking-widest font-sans">Срок действия</div>
                      <div className="font-mono font-bold text-slate-100">{cardExpiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                {/* Billing Summary Box */}
                <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2 text-xs text-left">
                  <div className="flex justify-between font-bold text-slate-900 font-sans">
                    <span>Услуга:</span>
                    <span className="text-slate-700 font-semibold">{payingAppointment.doctorSpecialty}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 font-sans">
                    <span>Специалист:</span>
                    <span className="text-slate-700 font-semibold">{payingAppointment.doctorName}</span>
                  </div>
                  <div className="h-px bg-slate-150 my-2" />
                  <div className="flex justify-between items-center text-sm font-black text-slate-950 font-sans">
                    <span className="flex items-center gap-1 font-extrabold text-slate-800">
                      <Lock className="h-4 w-4 text-emerald-700" />
                      <span>Итого к оплате Stripe:</span>
                    </span>
                    <span className="font-mono text-emerald-850 text-base font-black">1500 KGS</span>
                  </div>
                  {stripeInfo?.simulated && (
                    <div className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200/50 rounded-xl px-3 py-2 text-center font-bold leading-relaxed mt-2 uppercase tracking-wide font-sans">
                      ⚡ Демо-режим (Stripe API-ключ не задан в .env). Оплата обрабатывается через симулятор Stripe.
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <form onSubmit={handlePayConfirm} className="space-y-4 text-xs font-sans">
                  
                  {/* Email for Resend notification */}
                  <div className="space-y-1 text-left">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">Электронная почта для чека через Resend</label>
                      <button
                        type="button"
                        onClick={handleTestResend}
                        disabled={testResendLoading}
                        className="text-[10px] text-emerald-600 hover:text-emerald-700 font-extrabold focus:outline-none transition underline cursor-pointer disabled:opacity-50"
                      >
                        {testResendLoading ? 'Проверка...' : '🔗 Проверить доставку'}
                      </button>
                    </div>
                    <input
                      required
                      type="email"
                      placeholder="e.g. semaarykov@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150 font-sans"
                    />

                    {/* Test Connection Diagnostics Results UI */}
                    {testResendResult && (
                      <div className={`mt-2 p-3 rounded-xl border text-[11px] leading-relaxed font-sans text-left ${
                        testResendResult.success 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-sm' 
                          : 'bg-red-50 border-red-200 text-red-950 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-1.5 font-extrabold mb-1">
                          <span className={testResendResult.success ? 'text-emerald-600 font-black' : 'text-red-600 font-black'}>
                            {testResendResult.success ? '✅ Тест Resend: Письмо ушло!' : '❌ Тест Resend не удался'}
                          </span>
                        </div>
                        {testResendResult.error && (
                          <p className="font-semibold text-red-700 bg-red-100/50 p-1.5 rounded-lg border border-red-200/40 mb-1.5 break-words font-mono text-[10px]">{testResendResult.error}</p>
                        )}
                        <p className="font-medium text-slate-700">{testResendResult.hint}</p>
                        {testResendResult.success && (
                          <div className="mt-1.5 text-[10px] text-slate-500 font-mono bg-white/60 p-1.5 rounded-lg border border-slate-150">
                            <b>Успешно:</b> {testResendResult.targetEmail} <br/>
                            <b>Отправитель:</b> {testResendResult.fromUsed}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Resend Setup & Sandbox Guidance Helper block */}
                    {resendConfigStatus && (
                      <div className="mt-2 text-left">
                        {!resendConfigStatus.configured ? (
                          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] leading-relaxed text-amber-900 font-sans font-medium">
                            <span className="font-extrabold text-amber-800 flex items-center gap-1 mb-1">
                              <span>⚠️ Демо-режим (Resend не настроен)</span>
                            </span>
                            Вы не задали переменную <strong className="font-bold underline">RESEND_API_KEY</strong> в настройках проекта. Письма будут только имитироваться на стороне сервера во встроенном логе.
                            <div className="mt-2 text-[10px] text-amber-950 font-bold space-y-1 bg-white/50 p-2 rounded-lg border border-amber-150">
                              <p className="mb-1 text-[10.5px]">Инструкция по настройке:</p>
                              <div className="list-decimal pl-3 space-y-0.5">
                                <div>1. Откройте <b>Settings</b> (иконку шестерёнки вверху IDE) в Google AI Studio.</div>
                                <div>2. Перейдите во вкладку <b>Environment Variables</b>.</div>
                                <div>3. Добавьте переменную <code className="bg-amber-100 px-1 border border-amber-200 rounded font-bold font-mono">RESEND_API_KEY</code> со своим API-ключом (вида <code className="bg-amber-100 px-1 rounded font-bold">re_...</code>).</div>
                                <div>4. Нажмите кнопку <b>Restart Dev Server</b> (или перекомпилируйте), чтобы новые переменные применились в контейнере!</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-emerald-50/70 border border-emerald-150 rounded-xl text-[11px] leading-relaxed text-emerald-950 font-sans font-medium">
                            <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                              <span>✅ Интеграция Resend активна!</span>
                            </span>
                            {resendConfigStatus.isDefaultSandbox ? (
                              <div className="mt-1 text-slate-600 font-normal leading-normal text-[10.5px] p-2 bg-white/60 border border-slate-200/50 rounded-lg">
                                <span className="font-bold text-slate-900">Ограничение песочницы Resend (Sandbox):</span><br/>
                                Сейчас используется тестовый отправитель <code className="bg-slate-100 px-1 border border-slate-200 text-slate-800 rounded font-mono">onboarding@resend.dev</code>. В бесплатном тарифе Resend доставляет письма <strong>ИСКЛЮЧИТЕЛЬНО</strong> на тот адрес электронной почты, на который была зарегистрирована ваша учетная запись. 
                                <br/><br/>
                                ❗️ Чтобы письмо пришло, введите вашу почту регистрации (например, <strong className="text-emerald-950 font-black">{customerEmail || "semaarykov@gmail.com"}</strong>). <br/><br/>
                                Чтобы отправлять письма на любые другие сторонние адреса пациентов, вам необходимо зайти в панель Resend на сайте и подтвердить свой личный домен (Domain Verification).
                              </div>
                            ) : (
                              <p className="mt-1 text-slate-600 font-normal text-[10.5px]">
                                Письма отправляются с вашего личного подтвержденного домена (<code className="font-mono">{resendConfigStatus.fromEmail}</code>). Они будут успешно доставляться всем сторонним адресам пациентов!
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cardholder name */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">Держатель карты (Латиницей)</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. SEMETEY ARYKOV"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150 uppercase font-sans"
                    />
                  </div>

                  {/* Card number */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">Номер карты</label>
                    <input
                      required
                      type="text"
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => {
                        const clean = e.target.value.replace(/\D/g, '');
                        const parts = [];
                        for (let i = 0; i < clean.length; i += 4) {
                          parts.push(clean.substring(i, i + 4));
                        }
                        setCardNumber(parts.slice(0, 4).join(' '));
                      }}
                      className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">Срок действия</label>
                      <input
                        required
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/\D/g, '');
                          if (clean.length > 2) {
                            setCardExpiry(`${clean.substring(0, 2)}/${clean.substring(2, 4)}`);
                          } else {
                            setCardExpiry(clean);
                          }
                        }}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-sans">CVV / CVC код</label>
                      <input
                        required
                        type="password"
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150"
                      />
                    </div>
                  </div>

                  {paymentError && (
                    <div className="text-[11px] font-bold text-red-650 bg-red-50 border border-red-200 p-2.5 rounded-xl text-center font-sans">
                      ⚠ {paymentError}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentModalOpen(false);
                        setPayingAppointment(null);
                        setStripeInfo(null);
                      }}
                      className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold block rounded-2xl transition duration-150 text-center cursor-pointer uppercase tracking-wider text-[10px] font-sans"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={paymentLoading}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-sm transition duration-150 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-[10px] disabled:bg-slate-200 disabled:text-slate-400 font-sans"
                    >
                      {paymentLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-white" />
                          <span>Обработка Stripe...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5 text-emerald-100" />
                          <span>Оплатить 1500 KGS</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-2 font-medium font-sans">
                    <span>🛡 Данные шифруются по стандарту PCI-DSS TLS 1.3</span>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
