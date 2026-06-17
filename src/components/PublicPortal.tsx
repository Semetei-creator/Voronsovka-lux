/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Stethoscope, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  FileCheck2,
  CalendarCheck,
  X,
  ZoomIn
} from 'lucide-react';
import { Doctor, Patient } from '../types';
import { Language, TRANSLATIONS } from '../translations';
// @ts-ignore
import greenMountainsImage from '../assets/images/green_mountains_1781158349928.png';

const localizeSpecialty = (spec: string, lang: Language): string => {
  if (lang === 'ru') return spec;
  const map: Record<string, Record<Language, string>> = {
    'Физиотерапевт (Зав. отделением)': {
      ru: 'Физиотерапевт (Зав. отделением)',
      kg: 'Физиотерапевт (Бөлүм башчысы)',
      en: 'Physiotherapist (Head of Dept.)'
    },
    'Врач ЛФК и кинезиотерапевт': {
      ru: 'Врач ЛФК и кинезиотерапевт',
      kg: 'МКГ жана кинезиотерапевт дарыгери',
      en: 'Kinesiotherapy Specialist'
    },
    'Мануальный терапевт / Массажист': {
      ru: 'Мануальный терапевт / Массажист',
      kg: 'Мануалдык терапевт / Массажист',
      en: 'Chiropractor & Massage Specialist'
    },
    'Мануальный терапевт': {
      ru: 'Мануальный терапевт',
      kg: 'Мануалдык терапевт',
      en: 'Manual Therapist / Chiropractor'
    },
    'Врач-рефлексотерапевт': {
      ru: 'Врач-рефлексотерапевт',
      kg: 'Рефлексотерапевт дарыгер',
      en: 'Acupuncture & Reflexotherapist'
    },
    'Лазеротерапевт и УВЧ-специалист': {
      ru: 'Лазеротерапевт и УВЧ-специалист',
      kg: 'Лазеротерапевт жана УВЧ-адиси',
      en: 'Laser & UHF Specialist'
    },
    'Бальнеотерапевт (Водогрязелечение)': {
      ru: 'Бальнеотерапевт (Водогрязелечение)',
      kg: 'Бальнеотерапевт (Суу-ылай менен дарылоо)',
      en: 'Balneotherapist (Mud & Hydrotherapy)'
    },
    'Терапевт': {
      ru: 'Терапевт',
      kg: 'Терапевт дарыгер',
      en: 'Therapist / General Practitioner'
    },
    'Кардиолог высшей категории': {
      ru: 'Кардиолог высшей категории',
      kg: 'Жогорку категориядагы кардиолог',
      en: 'Cardiologist (Highest Category)'
    }
  };
  return map[spec]?.[lang] || spec;
};

const localizeRoom = (room: string, lang: Language): string => {
  if (lang === 'ru') return room;
  const map: Record<string, Record<Language, string>> = {
    'Кабинет №102 (Аппаратная физиотерапия)': {
      ru: 'Кабинет №102 (Аппаратная физиотерапия)',
      kg: '№102 кабинет (Аппараттык физиотерапия)',
      en: 'Office 102 (Hardware Physiotherapy)'
    },
    'Зал ЛФК (Спортивное крыло)': {
      ru: 'Зал ЛФК (Спортивное крыло)',
      kg: 'МКГ залы (Спорттук канат)',
      en: 'Kinesio Hall (Athletic Wing)'
    },
    'Кабинет №204 (Массажное крыло)': {
      ru: 'Кабинет №204 (Массажное крыло)',
      kg: '№204 кабинет (Массаж канаты)',
      en: 'Office 204 (Massage Wing)'
    },
    'Кабинет №305 (Восточная медицина)': {
      ru: 'Кабинет №305 (Восточная медицина)',
      kg: '№305 кабинет (Чыгыш медицинасы)',
      en: 'Office 305 (Eastern Medicine)'
    },
    'Кабинет №108 (Свето- и электролечение)': {
      ru: 'Кабинет №108 (Свето- и электролечение)',
      kg: '№108 кабинет (Жарык жана электр менен дарылоо)',
      en: 'Office 108 (Light- & Electrotherapy)'
    },
    'Бальнеоцентр (Водогрязелечебница)': {
      ru: 'Бальнеоцентр (Водогрязелечебница)',
      kg: 'Бальнеоборбор (Суу-ылай менен дарылоо борбору)',
      en: 'Balneocenter (Mud & Hydro Baths)'
    },
    'Кабинет №104 (Общая терапия)': {
      ru: 'Кабинет №104 (Общая терапия)',
      kg: '№104 кабинет (Жалпы терапия)',
      en: 'Office 104 (General Therapy)'
    },
    'Кабинет №205 (Кардиология)': {
      ru: 'Кабинет №205 (Кардиология)',
      kg: '№205 кабинет (Кардиология)',
      en: 'Office 205 (Cardiology)'
    }
  };
  return map[room]?.[lang] || room;
};

const localizeSchedule = (sched: string, lang: Language): string => {
  if (lang === 'ru') return sched;
  let translated = sched;
  translated = translated.replace(/Пн/g, lang === 'kg' ? 'Дш' : 'Mon');
  translated = translated.replace(/Вт/g, lang === 'kg' ? 'Шш' : 'Tue');
  translated = translated.replace(/Ср/g, lang === 'kg' ? 'Шш' : 'Wed');
  translated = translated.replace(/Чт/g, lang === 'kg' ? 'Бш' : 'Thu');
  translated = translated.replace(/Пт/g, lang === 'kg' ? 'Жм' : 'Fri');
  translated = translated.replace(/Сб/g, lang === 'kg' ? 'Иш' : 'Sat');
  translated = translated.replace(/Вс/g, lang === 'kg' ? 'Жш' : 'Sun');
  return translated;
};

interface PublicPortalProps {
  doctors: Doctor[];
  patients: Patient[];
  onRegisterPatient: (patient: Patient) => void;
  onSelectPatient: (patientId: string) => void;
  onNavigateToRole: (role: 'public' | 'patient' | 'doctor') => void;
  language: Language;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({
  doctors,
  patients,
  onRegisterPatient,
  onSelectPatient,
  onNavigateToRole,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null);
  
  const t = TRANSLATIONS[language] || TRANSLATIONS.ru;
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(t.specFilterAll);
  
  // Update state if language changes to stay in sync
  React.useEffect(() => {
    setSelectedSpecialty(t.specFilterAll);
  }, [language, t.specFilterAll]);

  // Registration Form States
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [gender, setGender] = useState<'мужской' | 'женский'>('мужской');
  const [phone, setPhone] = useState('');
  const [omsNumber, setOmsNumber] = useState('');
  const [bloodType, setBloodType] = useState('O Rh+ (I)');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const specialties = [t.specFilterAll, ...Array.from(new Set(doctors.map(d => localizeSpecialty(d.specialty, language))))];

  const filteredDoctors = doctors.filter(doc => {
    const translatedSpec = localizeSpecialty(doc.specialty, language);
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          translatedSpec.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === t.specFilterAll || translatedSpec === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || omsNumber.length !== 16) {
      alert(t.alertError);
      return;
    }

    const allergies = allergiesInput
      ? allergiesInput.split(',').map(a => a.trim()).filter(Boolean)
      : [];

    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      fullName,
      birthDate,
      gender,
      phone,
      omsNumber,
      bloodType,
      allergies,
      records: [],
      prescriptions: [],
      testResults: []
    };

    onRegisterPatient(newPatient);
    setSuccessMsg(`${t.successMsg} ${omsNumber}`);
    
    // Clear Form
    setFullName('');
    setPhone('');
    setOmsNumber('');
    setAllergiesInput('');

    setTimeout(() => {
      setSuccessMsg('');
      onSelectPatient(newPatient.id);
      onNavigateToRole('patient');
    }, 2500);
  };

  const autofillOms = () => {
    const randomOms = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
    setOmsNumber(randomOms);
  };

  return (
    <div className="space-y-8 pb-16 font-sans antialiased" id="public-portal">
      
      {/* Hero & Contact Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Main Hero Tile - 7 Columns block */}
        <section className="lg:col-span-8 relative overflow-hidden bg-slate-950 text-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-900/60 flex flex-col justify-between min-h-[380px]">
          {/* Scenic Mountain Background with premium dark/emerald color grading */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.98) 35%, rgba(15, 23, 42, 0.65) 70%, rgba(6, 78, 59, 0.45) 100%), url(${greenMountainsImage})` 
            }}
          />
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 tracking-wide uppercase">
              <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>{t.premiumBadge}</span>
            </span>
            <h2 className="text-3xl md:text-5.5xl font-extrabold tracking-tight leading-tight md:leading-[1.1]">
              {t.heroTitlePrefix} <br />
              <span className="text-emerald-400">{t.heroTitleAccent}</span>
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl font-medium">
              {t.heroDesc}
            </p>
          </div>
          
          <div className="relative z-10 flex flex-wrap gap-3.5 pt-6">
            <button
              onClick={() => {
                const el = document.getElementById('enroll-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 font-bold text-xs rounded-2xl transition-all duration-200 transform hover:scale-[1.02] shadow-md flex items-center space-x-2 text-slate-950 cursor-pointer"
            >
              <UserPlus className="h-4 w-4 stroke-[2.2]" />
              <span>{t.btnOpenCard}</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('doctors-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 font-bold text-xs rounded-2xl transition-all duration-200 border border-slate-700/60 flex items-center space-x-2 cursor-pointer"
            >
              <Stethoscope className="h-4 w-4 text-emerald-400" />
              <span>{t.btnViewDoctors}</span>
            </button>
          </div>
        </section>

        {/* Contacts & Address Tiles - 4 Columns block */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-full uppercase tracking-wider">{t.bookingDept}</span>
              <Phone className="h-5 w-5 text-blue-600 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.bookingPhoneLabel}</div>
              <div className="text-lg font-extrabold tracking-tight text-slate-900 mt-0.5 font-sans">+996 (312) 97-33-55</div>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">{t.careService}</span>
              <Phone className="h-5 w-5 text-emerald-600 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{t.receptionLabel}</div>
              <div className="text-lg font-extrabold tracking-tight text-emerald-800 mt-0.5 font-sans">+996 (555) 97-33-55</div>
            </div>
          </div>

          <div className="bg-slate-100 p-5 rounded-3xl border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-extrabold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider">{t.resortZone}</span>
              <MapPin className="h-5 w-5 text-slate-600 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.addressLabel}</div>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5 font-sans leading-tight">{t.addressValue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Stats grid - Beautiful Bento Box Layout */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl flex items-start space-x-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:shadow-md duration-200">
          <div className="p-3 bg-slate-100 text-slate-800 rounded-2xl border border-slate-200">
            <Clock className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm">{t.statsHoursTitle}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: t.statsHoursDesc }}></p>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl flex items-start space-x-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:shadow-md duration-200">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
            <ShieldCheck className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm font-sans">{t.statsLicenseTitle}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">{t.statsLicenseDesc}</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200/80 rounded-3xl flex items-start space-x-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition hover:shadow-md duration-200">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100">
            <FileCheck2 className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm font-sans">{t.statsDigitalTitle}</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">{t.statsDigitalDesc}</p>
          </div>
        </div>
      </section>

      {/* Google Maps Location Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-150">
          <div>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
              {t.mapBadge}
            </span>
            <h3 className="text-xl font-extrabold text-slate-950 font-sans mt-2 flex items-center space-x-2">
              <MapPin className="text-emerald-600 h-5.5 w-5.5 stroke-[2.2]" />
              <span>{t.mapTitle}</span>
            </h3>
          </div>
          <div className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-2xl border border-slate-200/60 shadow-sm self-start md:self-auto flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>42.7232° N, 74.5808° E</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t.mapDesc}
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-xs">
                  <div className="p-1 px-1.5 bg-slate-100 rounded-lg text-slate-700 font-bold font-mono shrink-0 mt-0.5">01</div>
                  <div>
                    <h5 className="font-bold text-slate-900">{t.mapMicroclimateTitle}</h5>
                    <p className="text-slate-500 mt-0.5 font-sans leading-relaxed">{t.mapMicroclimateDesc}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className="p-1 px-1.5 bg-slate-100 rounded-lg text-slate-700 font-bold font-mono shrink-0 mt-0.5">02</div>
                  <div>
                    <h5 className="font-bold text-slate-900">{t.mapAccessibilityTitle}</h5>
                    <p className="text-slate-500 mt-0.5 font-sans leading-relaxed">{t.mapAccessibilityDesc}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs">
                  <div className="p-1 px-1.5 bg-slate-100 rounded-lg text-slate-700 font-bold font-mono shrink-0 mt-0.5">03</div>
                  <div>
                    <h5 className="font-bold text-slate-900">{t.mapLandmarksTitle}</h5>
                    <p className="text-slate-500 mt-0.5 font-sans leading-relaxed">{t.mapLandmarksDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-[11px] text-slate-500 leading-relaxed font-sans">
              <strong>{t.mapNavigatorHintPrefix}</strong> {t.mapNavigatorHintText}
            </div>
          </div>

          <div className="lg:col-span-7 h-[320px] rounded-3xl border border-slate-200 overflow-hidden shadow-inner relative bg-slate-100">
            <iframe
              title="Google Map Vorontsovka Lux"
              src="https://maps.google.com/maps?q=ул.+Школьная+73,+с.+Таш-Добо,+Кыргызстан&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Quick Access simulated profiles (Bento Block Accent) */}
      <section className="bg-slate-950 text-white border border-slate-950 rounded-3xl p-6 sm:p-8 space-y-5 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 h-40 w-40 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t.simulationTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.simulationDesc}
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono self-start sm:self-auto bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 font-semibold uppercase">{t.dbCacheBadge}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {patients.map(p => (
            <button
              key={p.id}
              onClick={() => {
                onSelectPatient(p.id);
                onNavigateToRole('patient');
              }}
              className="flex items-center justify-between p-4 bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl text-left transition duration-250 shadow-sm cursor-pointer group"
            >
              <div>
                <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition">{p.fullName}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1 font-medium">{((t.formOms || "").replace(' (16 цифр)', '').replace(' (16 сан)', '').replace(' (16 Digits)', ''))}: {p.omsNumber}</div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition flex items-center space-x-1">
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>{t.btnEnterAsPatient}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid: Doctors Board + E-Record Registration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Doctors Directory Block */}
        <div className="lg:col-span-7 space-y-6" id="doctors-section">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-sans flex items-center space-x-2">
                <Stethoscope className="text-emerald-600 h-5 w-5 stroke-[2.2]" />
                <span>{t.specTitle}</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md font-bold">{t.specFound} {filteredDoctors.length}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{t.specSub}</p>
          </div>

          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:border-emerald-500 bg-slate-50/50"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full font-bold">
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-3.5 py-1.5 text-xs rounded-xl transition shrink-0 cursor-pointer ${
                    selectedSpecialty === spec
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 border border-slate-200/50'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Listings cards */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar" id="doctors-list">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(doc => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={doc.id}
                  className="bg-white p-5 border border-slate-200 rounded-3xl flex flex-col sm:flex-row sm:items-center sm:justify-between hover:border-slate-300 transition shadow-[0_2px_10px_rgba(0,0,0,0.015)] hover:shadow-sm space-y-4 sm:space-y-0"
                >
                  <div className="flex items-start space-x-3.5">
                    <div 
                      onClick={() => setSelectedDoctorForModal(doc)}
                      className="relative overflow-hidden rounded-2xl shrink-0 h-14 w-14 cursor-pointer group/avatar shadow-sm border border-slate-200"
                    >
                      {doc.avatar ? (
                        <img 
                          src={doc.avatar} 
                          alt={doc.name} 
                          className="h-full w-full object-cover transition-transform duration-300 group-hover/avatar:scale-110" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold text-xs">
                          {doc.name.split(' ')[0][0]}{doc.name.split(' ')[1][0]}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <ZoomIn className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div 
                      onClick={() => setSelectedDoctorForModal(doc)}
                      className="cursor-pointer group/info flex-1"
                    >
                      <div className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 rounded-full px-2.5 py-0.5 inline-block uppercase font-sans tracking-wide">
                        {localizeSpecialty(doc.specialty, language)}
                      </div>
                      <h4 className="font-extrabold text-slate-950 text-sm mt-1.5 group-hover/info:text-emerald-700 transition-colors flex items-center gap-1">
                        <span>{doc.name}</span>
                        <ZoomIn className="h-3 w-3 text-slate-400 opacity-0 group-hover/info:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-sans flex items-center">
                        <span className="font-semibold text-slate-700 mr-2">{t.docOffice}:</span> <span className="font-medium text-slate-800">{localizeRoom(doc.room, language)}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-sans flex items-center">
                        <span className="font-semibold text-slate-700 mr-2">{t.docSchedule}:</span> <span className="font-medium text-slate-800">{localizeSchedule(doc.schedule, language)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.docExperienceTitle}</div>
                      <div className="text-xs font-extrabold text-slate-800 font-sans">{doc.experience} {t.docYears}</div>
                    </div>
                    <button
                      onClick={() => {
                        onNavigateToRole('patient');
                      }}
                      className="mt-2.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition duration-150 shadow-sm cursor-pointer"
                    >
                      {t.btnOnlineBook}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 bg-slate-50 border border-slate-150 rounded-3xl text-slate-500 text-xs">
                {t.noDocsFound}
              </div>
            )}
          </div>
        </div>

        {/* E-Record Form Block */}
        <div className="lg:col-span-5 animate-fade-in" id="enroll-section">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md uppercase font-sans tracking-widest font-sans">
                {t.formBadge}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-sans flex items-center space-x-2">
                <FileCheck2 className="h-5 w-5 text-emerald-600 stroke-[2.2]" />
                <span>{t.formTitle}</span>
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {t.formDesc}
              </p>
            </div>

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs p-4 rounded-2xl flex items-start space-x-2 shadow-sm font-sans font-medium"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">{t.formFullName}</label>
                <input
                  type="text"
                  required
                  placeholder={t.formFullNamePlaceholder}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">{t.formBirthDate}</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">{t.formGender}</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'мужской' | 'женский')}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="мужской">{t.formGenderMale}</option>
                    <option value="женский">{t.formGenderFemale}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">{t.formPhone}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+996 (555) 00-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-900 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">{t.formBloodType}</label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="O Rh+ (I)">O Rh+ (I)</option>
                    <option value="O Rh- (I)">O Rh- (I)</option>
                    <option value="A Rh+ (II)">A Rh+ (II)</option>
                    <option value="A Rh- (II)">A Rh- (II)</option>
                    <option value="B Rh+ (III)">B Rh+ (III)</option>
                    <option value="B Rh- (III)">B Rh- (III)</option>
                    <option value="AB Rh+ (IV)">AB Rh+ (IV)</option>
                    <option value="AB Rh- (IV)">AB Rh- (IV)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">{t.formOms}</label>
                  <button
                    type="button"
                    onClick={autofillOms}
                    className="text-[9px] text-emerald-600 hover:text-emerald-800 underline font-extrabold cursor-pointer"
                  >
                    {t.formOmsGen}
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="4628190876124534"
                  value={omsNumber}
                  onChange={(e) => setOmsNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl text-slate-950 font-mono focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">{t.formAllergies}</label>
                <input
                  type="text"
                  placeholder={t.formAllergiesPlaceholder}
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 text-slate-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition duration-150 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>{t.btnSubmitRegister}</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Modal with Doctor portrait photo and bio details */}
      {selectedDoctorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoctorForModal(null)}
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white rounded-[32px] overflow-hidden max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-100 z-10 p-6 flex flex-col items-center"
          >
            {/* Close button */}
            <button 
              onClick={() => setSelectedDoctorForModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Doctor Photo */}
            <div className="relative w-full aspect-square max-h-[300px] overflow-hidden rounded-2xl border border-slate-200 mt-2">
              {selectedDoctorForModal.avatar ? (
                <img 
                  src={selectedDoctorForModal.avatar} 
                  alt={selectedDoctorForModal.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-extrabold text-3xl">
                  {selectedDoctorForModal.name.split(' ')[0][0]}{selectedDoctorForModal.name.split(' ')[1][0]}
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="w-full text-center mt-5 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 rounded-full px-3 py-1 uppercase tracking-wider font-sans">
                  {localizeSpecialty(selectedDoctorForModal.specialty, language)}
                </span>
                <h3 className="font-extrabold text-slate-950 text-lg sm:text-xl mt-3 font-sans tracking-tight">
                  {selectedDoctorForModal.name}
                </h3>
              </div>

              {/* Detailed Bento Indicators */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/50 text-left text-xs font-medium">
                <div>
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {{ ru: "Кабинет", kg: "Кабинет", en: "Office" }[language]}
                  </div>
                  <div className="text-slate-800 font-bold">
                    {localizeRoom(selectedDoctorForModal.room, language)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {{ ru: "Стаж работы", kg: "Стаж", en: "Experience" }[language]}
                  </div>
                  <div className="text-slate-800 font-bold">
                    {selectedDoctorForModal.experience} {{ ru: "лет", kg: "жыл", en: "years" }[language]}
                  </div>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200/60">
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">
                    {{ ru: "График приёма", kg: "Кабыл алуу графиги", en: "Schedule" }[language]}
                  </div>
                  <div className="text-slate-800 font-bold">
                    {localizeSchedule(selectedDoctorForModal.schedule, language)}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedDoctorForModal(null);
                    onNavigateToRole('patient');
                  }}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition duration-150 shadow-sm cursor-pointer"
                >
                  {t.btnOnlineBook}
                </button>
                <button
                  onClick={() => setSelectedDoctorForModal(null)}
                  className="py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition duration-150 cursor-pointer"
                >
                  {{ ru: "Закрыть", kg: "Жабуу", en: "Close" }[language]}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
