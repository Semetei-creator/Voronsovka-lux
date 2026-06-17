/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, Shield, User, HeartPulse, Building2, Globe } from 'lucide-react';
import { Language, TRANSLATIONS } from '../translations';

interface HeaderProps {
  currentRole: 'public' | 'patient' | 'doctor';
  onChangeRole: (role: 'public' | 'patient' | 'doctor') => void;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
  activePatientName?: string;
  activeDoctorName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onChangeRole,
  language,
  onChangeLanguage,
  activePatientName,
  activeDoctorName,
}) => {
  const t = TRANSLATIONS[language] || TRANSLATIONS.ru;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ru', label: 'РУС', flag: '🇷🇺' },
    { code: 'kg', label: 'КЫР', flag: '🇰🇬' },
    { code: 'en', label: 'ENG', flag: '🇬🇧' },
  ];

  return (
    <header className="border-b border-slate-150 bg-slate-50/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]" id="hospital-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:h-16 py-3 sm:py-0 gap-3 sm:gap-0 items-center">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer self-start sm:self-auto" onClick={() => onChangeRole('public')}>
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-center transition hover:scale-105">
              <HeartPulse className="h-5 w-5 stroke-[2.5]" id="logo-icon" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-500 font-mono font-bold">{t.facilitySub}</span>
              </div>
              <h1 className="text-xs sm:text-sm font-extrabold text-slate-950 tracking-tight font-sans">
                {t.facilityTitle}
              </h1>
            </div>
          </div>

          {/* Navigation Controls & Language Switcher */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            
            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-slate-200/50 p-1 rounded-2xl border border-slate-300/30 font-sans" id="language-switcher">
              <Globe className="h-3.5 w-3.5 text-slate-500 ml-1.5 shrink-0" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onChangeLanguage(lang.code)}
                  className={`px-2.5 py-1 text-[10px] font-extrabold rounded-xl transition duration-150 flex items-center space-x-1 cursor-pointer ${
                    language === lang.code
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/40'
                  }`}
                  title={lang.label}
                >
                  <span>{lang.flag}</span>
                  <span className="hidden xs:inline">{lang.label}</span>
                </button>
              ))}
            </div>

            <nav className="flex space-x-1 bg-slate-200/60 p-1 rounded-2xl border border-slate-300/30" id="role-nav">
              <button
                onClick={() => onChangeRole('public')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                  currentRole === 'public'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                id="btn-role-public"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>{t.navAbout}</span>
              </button>

              <button
                onClick={() => onChangeRole('patient')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                  currentRole === 'patient'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                id="btn-role-patient"
              >
                <User className="h-3.5 w-3.5" />
                <span>{t.navPatient}</span>
              </button>

              <button
                onClick={() => onChangeRole('doctor')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                  currentRole === 'doctor'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                id="btn-role-doctor"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>{t.navDoctor}</span>
              </button>
            </nav>

            {/* Role detail status context */}
            <div className="hidden md:flex items-center text-xs font-sans pl-3 border-l border-slate-200 space-x-2">
              <Shield className="h-4 w-4 text-emerald-600 font-bold" />
              <div>
                {currentRole === 'public' && (
                  <div className="text-slate-500 text-[9px] leading-3 uppercase font-extrabold tracking-wider">{t.statusGuest}</div>
                )}
                {currentRole === 'patient' && (
                  <>
                    <div className="text-slate-400 text-[9px] leading-3 uppercase font-extrabold tracking-wider">{t.statusPatient}</div>
                    <div className="text-slate-900 font-bold max-w-[100px] truncate">{activePatientName}</div>
                  </>
                )}
                {currentRole === 'doctor' && (
                  <>
                    <div className="text-slate-400 text-[9px] leading-3 uppercase font-extrabold tracking-wider">{t.statusDoctor}</div>
                    <div className="text-slate-900 font-bold max-w-[100px] truncate">{activeDoctorName}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
