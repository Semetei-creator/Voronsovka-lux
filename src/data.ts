/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Doctor, Patient, Appointment } from './types';

// @ts-ignore
import avatarKubanych from './assets/images/doctor_kubanych_1781238630583.jpg';
// @ts-ignore
import avatarOlga from './assets/images/doctor_olga_1781238666270.jpg';
// @ts-ignore
import avatarSemetey from './assets/images/doctor_semetey_1781238649086.jpg';
// @ts-ignore
import avatarLixin from './assets/images/doctor_lixin_1781238689473.jpg';
// @ts-ignore
import avatarTatyana from './assets/images/doctor_tatyana_1781238711199.jpg';
// @ts-ignore
import avatarArtem from './assets/images/doctor_artem_1781238731702.jpg';
// @ts-ignore
import avatarDinara from './assets/images/doctor_dinara_1781238587938.jpg';
// @ts-ignore
import avatarAkmoor from './assets/images/doctor_akmoor_1781238607013.jpg';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Токсонбаев Кубаныч Талантович',
    specialty: 'Физиотерапевт (Зав. отделением)',
    room: 'Кабинет №102 (Аппаратная физиотерапия)',
    schedule: 'Пн-Пт: 08:30 - 15:30',
    experience: 22,
    avatar: avatarKubanych,
  },
  {
    id: 'doc-2',
    name: 'Романова Ольга Игоревна',
    specialty: 'Врач ЛФК и кинезиотерапевт',
    room: 'Зал ЛФК (Спортивное крыло)',
    schedule: 'Пн-Пт: 09:00 - 16:00',
    experience: 14,
    avatar: avatarOlga,
  },
  {
    id: 'doc-3',
    name: 'Арыков Семетей Мырзабекович',
    specialty: 'Мануальный терапевт',
    room: 'Кабинет №204 (Массажное крыло)',
    schedule: 'Пн, Ср, Пт: 10:00 - 18:00',
    experience: 16,
    avatar: avatarSemetey,
  },
  {
    id: 'doc-4',
    name: 'Ли Синь (Профессор)',
    specialty: 'Врач-рефлексотерапевт',
    room: 'Кабинет №305 (Восточная медицина)',
    schedule: 'Вт, Чт: 09:30 - 17:00, Сб: 09:00 - 14:00',
    experience: 25,
    avatar: avatarLixin,
  },
  {
    id: 'doc-5',
    name: 'Пономарева Татьяна Сергеевна',
    specialty: 'Лазеротерапевт и УВЧ-специалист',
    room: 'Кабинет №108 (Свето- и электролечение)',
    schedule: 'Пн-Пт: 12:00 - 19:00',
    experience: 9,
    avatar: avatarTatyana,
  },
  {
    id: 'doc-6',
    name: 'Соболев Артем Николаевич',
    specialty: 'Бальнеотерапевт (Водогрязелечение)',
    room: 'Бальнеоцентр (Водогрязелечебница)',
    schedule: 'Пн-Чт: 08:00 - 14:00',
    experience: 12,
    avatar: avatarArtem,
  },
  {
    id: 'doc-7',
    name: 'Матказиева Динара Тураровна',
    specialty: 'Терапевт',
    room: 'Кабинет №104 (Общая терапия)',
    schedule: 'Пн-Пт: 09:00 - 15:00',
    experience: 24,
    avatar: avatarDinara,
  },
  {
    id: 'doc-8',
    name: 'Авазбекова Акмоор Авазбековна',
    specialty: 'Кардиолог высшей категории',
    room: 'Кабинет №205 (Кардиология)',
    schedule: 'Пн-Пт: 10:00 - 16:00',
    experience: 10,
    avatar: avatarAkmoor,
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    fullName: 'Иванов Сергей Васильевич',
    birthDate: '1984-05-12',
    gender: 'мужской',
    phone: '+7 (911) 234-56-78',
    omsNumber: '4628190876124534',
    bloodType: 'A Rh+ (II)',
    allergies: ['Пенициллин', 'Пыльца березы'],
    records: [
      {
        id: 'rec-101',
        date: '2026-06-01',
        doctorName: 'Токсонбаев Кубаныч Талантович',
        doctorSpecialty: 'Физиотерапевт (Зав. отделением)',
        complaints: 'Жалобы на тугоподвижность в левом коленном суставе после эндопротезирования (операция была 6 недель назад). Умеренная отечность к концу дня, ограничение угла сгибания до 85 градусов.',
        diagnosis: 'Реабилитационный период после тотального эндопротезирования левого коленного сустава. Контрактура сустава легкой степени.',
        recommendations: 'Магнитотерапия на область сустава №10, лимфодренажный массаж нижней конечности №10. Щадящий двигательный режим.',
        testsOrdered: ['Электромиография (ЭМГ) мышц бедра', 'Оценка объема движений на аппарате Artromot']
      },
      {
        id: 'rec-102',
        date: '2026-06-05',
        doctorName: 'Романова Ольга Игоревна',
        doctorSpecialty: 'Врач ЛФК и кинезиотерапевт',
        complaints: 'Направлен физиотерапевтом. Мышечная гипотрофия четырехглавой мышцы бедра слева. Страх полной опоры на оперированную ногу.',
        diagnosis: 'Мышечная амиотрофия левого бедра вследствие гиподинамии. Восстановление опорной функции конечности.',
        recommendations: 'Индивидуальные занятия кинезиотерапией в разгрузочных петлях Экзарта №12. Тренировки на механотренажере с биологически обратной связью (БОС). Дозированная ходьба.',
        testsOrdered: ['Компьютерная стабилометрия']
      }
    ],
    prescriptions: [
      {
        id: 'pr-1',
        medication: 'Хондроитин + Глюкозамин (Хондроксид)',
        dosage: 'По 1 капсуле 2 раза в день во время еды',
        duration: '3 месяца',
        dateIssued: '2026-06-01',
        doctorName: 'Токсонбаев Кубаныч Талантович',
        status: 'active'
      },
      {
        id: 'pr-2',
        medication: 'Эластичный реабилитационный наколенник',
        dosage: 'Ношение при осевых физических нагрузках и ЛФК',
        duration: '4 недели',
        dateIssued: '2026-06-01',
        doctorName: 'Токсонбаев Кубаныч Талантович',
        status: 'active'
      }
    ],
    testResults: [
      {
        id: 'test-1',
        date: '2026-06-02',
        testName: 'Электромиография (ЭМГ) мышц бедра',
        result: 'Снижение амплитуды М-ответа m. quadriceps femoris слева на 35% от нормы. Признаков денервации нет.',
        norm: 'Асимметрия мышечной активности не более 10-15%',
        status: 'abnormal',
        laboratory: 'Диагностический бокс №2'
      },
      {
        id: 'test-2',
        date: '2026-06-02',
        testName: 'Оценка объема движений на аппарате Artromot',
        result: 'Пассивное сгибание: 85°, разгибание: 5°. Ограничение обусловлено умеренным отеком околосуставных тканей.',
        norm: 'Сгибание: 135°, разгибание: 0°',
        status: 'abnormal',
        laboratory: 'Диагностический бокс №2'
      }
    ]
  },
  {
    id: 'pat-2',
    fullName: 'Петрова Анна Николаевна',
    birthDate: '1995-12-04',
    gender: 'женский',
    phone: '+7 (921) 987-65-43',
    omsNumber: '1122334455667788',
    bloodType: 'B Rh- (III)',
    allergies: ['Анальгин', 'Клубника'],
    records: [
      {
        id: 'rec-201',
        date: '2026-06-03',
        doctorName: 'Арыков Семетей Мырзабекович',
        doctorSpecialty: 'Мануальный терапевт',
        complaints: 'Жалобы на скованность в пояснице, тупые ноющие боли после длительной статической сидячей работы, иррадиацию в левую ягодичную область.',
        diagnosis: 'Мышечно-тонический синдром поясничной области. Вертеброгенная люмбалгия.',
        recommendations: 'Мягкие мануальные техники, постизометрическая релаксация (ПИР) мышц поясницы №7. Классический массаж спины.',
        testsOrdered: []
      }
    ],
    prescriptions: [
      {
        id: 'pr-3',
        medication: 'Пластырь трансдермальный с НПВП (Версатис)',
        dosage: 'Аппликация на поясничную область на 12 часов в сутки',
        duration: '7 дней',
        dateIssued: '2026-06-03',
        doctorName: 'Арыков Семетей Мырзабекович',
        status: 'active'
      }
    ],
    testResults: [
      {
        id: 'test-4',
        date: '2026-06-03',
        testName: 'Миофункциональный тест спины',
        result: 'Гипертонус длинных мышц спины справа, выраженная триггерная точка в проекции m. piriformis слева.',
        norm: 'Симметричный нормотонус паравертебральных мышц',
        status: 'abnormal',
        laboratory: 'Кабинет мануальной оценки'
      }
    ]
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    patientId: 'pat-1',
    patientName: 'Иванов Сергей Васильевич',
    patientOms: '4628190876124534',
    doctorId: 'doc-2',
    doctorName: 'Романова Ольга Игоревна',
    doctorSpecialty: 'Врач ЛФК и кинезиотерапевт',
    room: 'Зал ЛФК (Спортивное крыло)',
    date: '2026-06-15',
    time: '09:30',
    status: 'scheduled'
  },
  {
    id: 'app-2',
    patientId: 'pat-1',
    patientName: 'Иванов Сергей Васильевич',
    patientOms: '4628190876124534',
    doctorId: 'doc-1',
    doctorName: 'Токсонбаев Кубаныч Талантович',
    doctorSpecialty: 'Физиотерапевт (Зав. отделением)',
    room: 'Кабинет №102 (Аппаратная физиотерапия)',
    date: '2026-06-12',
    time: '11:15',
    status: 'scheduled'
  },
  {
    id: 'app-3',
    patientId: 'pat-2',
    patientName: 'Петрова Анна Николаевна',
    patientOms: '1122334455667788',
    doctorId: 'doc-3',
    doctorName: 'Арыков Семетей Мырзабекович',
    doctorSpecialty: 'Мануальный терапевт',
    room: 'Кабинет №204 (Массажное крыло)',
    date: '2026-06-18',
    time: '14:00',
    status: 'scheduled'
  }
];

export const AVAILABLE_TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:15', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
];
