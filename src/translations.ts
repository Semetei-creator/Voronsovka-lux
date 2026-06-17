export type Language = 'ru' | 'kg' | 'en';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  ru: {
    // Header
    govBadge: "Госуслуги",
    facilitySub: "Воронцовка Люкс",
    facilityTitle: "Центр реабилитации и физиотерапии",
    navAbout: "О центре",
    navPatient: "Личный кабинет",
    navDoctor: "Кабинет врача",
    statusGuest: "Гостевой доступ",
    statusPatient: "Пациент",
    statusDoctor: "Кабинет врача",
    notSelected: "Не выбран",

    // Notice Box
    noticeTitle: "Информационный сервис Минздрава:",
    noticeText: "Портал реабилитационного центра «Воронцовка Люкс» работает в режиме симулятора базы данных. Созданные учетные записи пациентов, записи на процедуры и заполненные протоколы назначений сохраняются локально в хранилище вашего браузера (localStorage).",

    // Hero Section
    premiumBadge: "Частный медицинский центр • Премиум Реабилитация",
    heroTitlePrefix: "Реабилитационный центр",
    heroTitleAccent: "«Воронцовка Люкс»",
    heroDesc: "Добро пожаловать на цифровой портал частного центра премиум реабилитации и физиотерапии в с. Таш-Дёбё (Чуйская область, Кыргызстан). Новейшее швейцарское физио-оборудование, индивидуальные восстановительные программы и первоклассные специалисты.",
    btnOpenCard: "Открыть медкарту и договор",
    btnViewDoctors: "Врачи и процедуры",

    // Contact Tiles
    bookingDept: "Отдел бронирования",
    bookingPhoneLabel: "Телефон записи и консультаций",
    careService: "Служба заботы",
    receptionLabel: "Круглосуточный ресепшн (24/7)",
    resortZone: "Курортная зона",
    addressLabel: "Адрес реабилитационного центра",
    addressValue: "Кыргызстан, Чуйская область, с. Таш-Дёбё (Воронцовка), ул. Школьная, д. 73",

    // Quick Stats Grid
    statsHoursTitle: "Рабочие часы КРЦ",
    statsHoursDesc: "Прием реабилитологов и физиопроцедуры: Ежедневно с 08:30 до 21:00. Круглосуточный прием на стационарную реабилитацию: 24/7.",
    statsLicenseTitle: "Лицензия Минздрава КР",
    statsLicenseDesc: "Лицензия №021990. Премиум обслуживание по прямым медицинским контрактам, полисам ДМС и международному страхованию.",
    statsDigitalTitle: "Цифровые карты процедур",
    statsDigitalDesc: "Удобные электронные протоколы. Все назначения физио- и бальнеотерапии, оценки объема движений и рекомендации специалистов сохранены в облаке.",

    // Map Section
    mapBadge: "Карта и координаты",
    mapTitle: "Наше расположение в Кыргызстане",
    mapDesc: "Частный реабилитационный центр «Воронцовка Люкс» расположен в экологически чистой предгорной курортной зоне села Таш-Дёбё (ранее Воронцовка), Чуйская область, Кыргызстан.",
    mapMicroclimateTitle: "Уникальный микроклимат",
    mapMicroclimateDesc: "Высота более 1200 м над уровнем моря, фитонциды хвойных массивов и абсолютная защищенность от городского смога Бишкека обеспечивают идеальные условия для реабилитации.",
    mapAccessibilityTitle: "Удобная доступность",
    mapAccessibilityDesc: "Всего 20-25 минут езды от Южной Магистрали Бишкека на юг. Для маломобильных пациентов предусмотрена услуга специализированного медицинского трансфера.",
    mapLandmarksTitle: "Адресные ориентиры",
    mapLandmarksDesc: "с. Таш-Дёбё (Воронцовка), ул. Школьная, д. 73. Удобный съезд, современные подъездные пути.",
    mapNavigatorHintPrefix: "Для навигаторов (Yandex/Google):",
    mapNavigatorHintText: "введите адрес «Таш-Дёбё, Школьная 73». Маршрутное такси №265 от Аламединского рынка идет прямо до ворот центра.",

    // Quick Login Simulation Section
    simulationTitle: "Режим быстрой симуляции (Вход без пароля)",
    simulationDesc: "Выберите одного из тестовых граждан, чтобы мгновенно проверить выписанные рецепты, историю диагнозов и записаться на прием к врачу:",
    dbCacheBadge: "СУБД Локальный Кэш",
    btnEnterAsPatient: "Войти как пациент",

    // Specialists Section
    specTitle: "Наши специалисты и процедуры",
    specFound: "Найдено:",
    specSub: "Запись осуществляется по курсу реабилитации, полису ДМС или напрямую на выбранные премиум процедуры.",
    searchPlaceholder: "Поиск по имени врача или направлению...",
    specFilterAll: "Все",
    docOffice: "Кабинет:",
    docSchedule: "График:",
    docExperienceTitle: "Стаж врача",
    docYears: "лет",
    btnOnlineBook: "Электронная запись",
    noDocsFound: "Врачи с выбранной специальностью или именем не найдены.",

    // Enroll Form Section
    formBadge: "Премиум обслуживание • Контракт",
    formTitle: "Оформить карту и договор",
    formDesc: "Введите личные реквизиты для регистрации в базе данных КРЦ. Новая электронная медицинская карта будет мгновенно привязана к страховому полису ДМС или договору обслуживания.",
    formFullName: "Полное имя (ФИО пациента)",
    formFullNamePlaceholder: "Иванов Александр Иванович",
    formBirthDate: "Дата рождения",
    formGender: "Пол",
    formGenderMale: "Мужской",
    formGenderFemale: "Женский",
    formPhone: "Моб. телефон",
    formBloodType: "Группа крови",
    formOms: "Номер договора или ДМС (16 цифр)",
    formOmsGen: "Генерировать номер договора",
    formAllergies: "Лекарственные аллергии (по желанию)",
    formAllergiesPlaceholder: "Лидокаин, молочный белок...",
    btnSubmitRegister: "Зарегистрировать медкарту центра",
    successMsg: "Медицинская карта успешно зарегистрирована! Номер договора:",
    alertError: "Пожалуйста, заполните ФИО, телефон и 16-значный номер договора или полиса ДМС",

    // Footer
    footerLicense: "Лицензия Минздрава КР • ОсОО «Воронцовка Люкс»",
    footerDesc: "Официальный сайт Центра физиотерапии и медицинской реабилитации «Воронцовка Люкс». Лицензия на осуществление медицинской и реабилитационной деятельности Министерства Здравоохранения Кыргызской Республики. Все права защищены.",
    footerVersion: "Версия портала: v2.1.0 • База данных: КРЦ Локальный стек • Реаб-системы • Дата синхронизации:",

    // Chatbot
    chatBotTitle: "Воронцовка Люкс AI",
    chatBotStatus: "• Онлайн-консультант",
    chatBotWelcome: "Здравствуйте! Я интеллектуальный помощник реабилитационного центра «Воронцовка Люкс». 🌟 Как я могу помочь вам c подбором врача, поиском маршрута или планированием процедур?",
    chatBotInputPlaceholder: "Задайте вопрос о клинике...",
    chatBotQuickStart: "Быстрый старт:",
    chatBotErrorTitle: "Проблема со связью",
    chatBotErrorDesc: "Временная ошибка связи с сервером. Пожалуйста, попробуйте еще раз.",
    chatBotTyping: "Ассистент печатает...",
    chatBotTitleBadge: "AI Помощник",
    chatBotErrorNoAnswer: "Извините, не удалось сформулировать ответ."
  },
  kg: {
    // Header
    govBadge: "МамлКызматтар",
    facilitySub: "Воронцовка Люкс",
    facilityTitle: "Калыбына келтирүү жана физиотерапия борбору",
    navAbout: "Борбор жөнүндө",
    navPatient: "Жеке кабинет",
    navDoctor: "Дарыгердин кабинети",
    statusGuest: "Коноктук болуу",
    statusPatient: "Бейтап",
    statusDoctor: "Дарыгер кабинети",
    notSelected: "Тандалган жок",

    // Notice Box
    noticeTitle: "Саламаттык сактоо министрлигинин маалымат кызматы:",
    noticeText: "«Воронцовка Люкс» реабилитациялык борборунун порталы берилиштер базасынын симулятору режиминде иштейт. Түзүлгөн бейтаптык аккаунттар, процедураларга жазылуулар жана дарыгердин сунуштары браузериңиздин локалдык сактагычында (localStorage) сакталат.",

    // Hero Section
    premiumBadge: "Жеке медициналык борбор • Премиум Калыбына келтирүү",
    heroTitlePrefix: "Калыбына келтирүү борбору",
    heroTitleAccent: "«Воронцовка Люкс»",
    heroDesc: "Таш-Дөбө айылындагы (Чүй облусу, Кыргызстан) премиум класстагы жеке калыбына келтирүү жана физиотерапия борборунун санариптик порталына кош келиңиз. Эң жаңы швейцариялык физио-жабдуулар, жекече калыбына келтирүү программалары жана жогорку деңгээлдеги адистер.",
    btnOpenCard: "Медкартаны жана келишимди ачуу",
    btnViewDoctors: "Дарыгерлер жана процедуралар",

    // Contact Tiles
    bookingDept: "Брондоо бөлүмү",
    bookingPhoneLabel: "Жазылуу жана кеңеш берүү телефону",
    careService: "Кам көрүү кызматы",
    receptionLabel: "Күнү-түнү иштөөчү кабылдама (24/7)",
    resortZone: "Курорттук аймак",
    addressLabel: "Калыбына келтирүү борборунун дареги",
    addressValue: "Кыргызстан, Чүй облусу, Таш-Дөбө айылы (Воронцовка), Школьная көчөсү, 73-үй",

    // Quick Stats Grid
    statsHoursTitle: "КРБнын иштөө убактысы",
    statsHoursDesc: "Реабилитологдорду кабыл алуу жана физиопроцедуралар: Күн сайын 08:30дан 21:00гө чейин. Ооруканага күнү-түнү жаткыруу: 24/7.",
    statsLicenseTitle: "КР Саламаттык сактоо министрлигинин лицензиясы",
    statsLicenseDesc: "Лицензия №021990. Медициналык келишимдер, ЖМК полистери жана эл аралык камсыздандыруу боюнча премиум тейлөө.",
    statsDigitalTitle: "Санариптик процедура карталары",
    statsDigitalDesc: "Ыңгайлуу электрондук протоколдор. Бардык физио- жана бальнеотерапиялык дайындоолор, кыймыл баалоолору булутта сакталат.",

    // Map Section
    mapBadge: "Карта жана координаттар",
    mapTitle: "Кыргызстандагы жайгашкан жерибиз",
    mapDesc: "Жеке калыбына келтирүүчү «Воронцовка Люкс» борбору Кыргызстандын Чүй облусундагы Таш-Дөбө (мурдагы Воронцовка) айылынын тоо этегиндеги экологиялык таза курорттук зонасында жайгашкан.",
    mapMicroclimateTitle: "Уникалдуу микроклимат",
    mapMicroclimateDesc: "Деңиз деңгээлинен 1200 метрден ашык бийиктик, ийне жалбырактуу токойлор жана Бишкек шаарынын түтүнүнөн толук корголушу калыбына келүүгө мыкты шарттарды берет.",
    mapAccessibilityTitle: "Ыңгайлуу жеткиликтүүлүк",
    mapAccessibilityDesc: "Бишкектин Түштүк магистралынан түштүктү карай 20-25 мүнөттүк жол. Атайын коопсуз медициналык транспорт кызматы сунушталат.",
    mapLandmarksTitle: "Даректик багыттар",
    mapLandmarksDesc: "Таш-Дөбө а. (Воронцовка), Школьная көч., 73. Ыңгайлуу жолдор жана унаа токтотуучу жайлар.",
    mapNavigatorHintPrefix: "Навигаторлор үчүн (Yandex/Google):",
    mapNavigatorHintText: "«Таш-Дөбө, Школьная 73» дарегин жазыңыз. Аламүдүн базарынан №265 маршрутка борбордун кире беришине чейин каттайт.",

    // Quick Login Simulation Section
    simulationTitle: "Режим быстрой симуляции (Сыр сөзсүз тез кирүү)",
    simulationDesc: "Рецепттерди, диагноздорду текшерүү жана дарыгерге тез жазылуу үчүн бейтаптардын бирин тандаңыз:",
    dbCacheBadge: "СУБД Локалдык Кэши",
    btnEnterAsPatient: "Бейтап катары кирүү",

    // Specialists Section
    specTitle: "Биздин адистер жана процедуралар",
    specFound: "Табылды:",
    specSub: "Жазылуу калыбына келтирүү курсу, ЖМК камсыздандыруу полиси же тандалган процедуралар боюнча түздөн-түз жүргүзүлөт.",
    searchPlaceholder: "Дарыгердин аты же адистиги боюнча издөө...",
    specFilterAll: "Баары",
    docOffice: "Кабинет:",
    docSchedule: "Иштөө убактысы:",
    docExperienceTitle: "Иш тажрыйбасы",
    docYears: "жыл",
    btnOnlineBook: "Электрондук жазылуу",
    noDocsFound: "Тандалган адистик же ысым боюнча дарыгерлер табылган жок.",

    // Enroll Form Section
    formBadge: "Премиум тейлөө • Келишим",
    formTitle: "Картаны жана келишимди тариздөө",
    formDesc: "КРБ маалымат базасына катталуу үчүн жеке маалыматтарыңызды киргизиңиз. Жаңы санариптик медициналык карта келишимге дароо туташтырылат.",
    formFullName: "Толук аты-жөнү (Бейтаптын Ф.А.А.)",
    formFullNamePlaceholder: "Асанов Асан Асанович",
    formBirthDate: "Туулган жылы",
    formGender: "Жынысы",
    formGenderMale: "Эркек",
    formGenderFemale: "Аял",
    formPhone: "Мобилдик телефон",
    formBloodType: "Кан тобу",
    formOms: "Келишимдин же ЖМКнын номери (16 сан)",
    formOmsGen: "Келишим номерин түзүү",
    formAllergies: "Дары-дармектерге аллергия (кааласаңыз)",
    formAllergiesPlaceholder: "Лидокаин, сүт белогу...",
    btnSubmitRegister: "Борбордун мед-картасын каттоодон өткөрүү",
    successMsg: "Медициналык карта ийгиликтүү катталды! Келишим номери:",
    alertError: "Сураныч, Ф.А.А., телефон жана 16 орундуу келишим номерин толук толтуруңуз",

    // Footer
    footerLicense: "КР Саламаттык сактоо министрлигинин лицензиясы • «Воронцовка Люкс» ЖЧКсы",
    footerDesc: "«Воронцовка Люкс» физиотерапия жана медициналык калыбына келтирүү борборунун расмий сайты. Кыргыз Республикасынын Саламаттык сактоо министрлигинин медициналык жана реабилитациялык иш-аракеттерге берген лицензиясы. Бардык укуктар корголгон.",
    footerVersion: "Порталдын версиясы: v2.1.0 • Берилиштер базасы: КРБ Локалдык стек • Дата:",

    // Chatbot
    chatBotTitle: "Воронцовка Люкс AI",
    chatBotStatus: "• Онлайн-консультант",
    chatBotWelcome: "Саламатсызбы! Мен «Воронцовка Люкс» калыбына келтирүү борборунун акылдуу жардамчысымын. 🌟 Сизге дарыгер тандоодо, багыт издөөдө же процедураларды пландаштырууда кандай жардам бере алам?",
    chatBotInputPlaceholder: "Клиника тууралуу суроо бериңиз...",
    chatBotQuickStart: "Тез баштоо:",
    chatBotErrorTitle: "Байланыш маселеси",
    chatBotErrorDesc: "Сервер менен убактылуу байланыш катасы кетти. Сураныч, дагы бир жолу аракет кылып көрүңүз.",
    chatBotTyping: "Жардамчы жазып жатат...",
    chatBotTitleBadge: "AI Жардамчы",
    chatBotErrorNoAnswer: "Кечириңиз, жооп кураштыруу мүмкүн болгон жок."
  },
  en: {
    // Header
    govBadge: "GovServices",
    facilitySub: "Vorontsovka Lux",
    facilityTitle: "Rehabilitation & Physical Therapy Center",
    navAbout: "About Us",
    navPatient: "Patient Portal",
    navDoctor: "Doctor Portal",
    statusGuest: "Guest Access",
    statusPatient: "Patient",
    statusDoctor: "Physician",
    notSelected: "Not Selected",

    // Notice Box
    noticeTitle: "Ministry of Health Information Service:",
    noticeText: "The digital portal of the 'Vorontsovka Lux' rehabilitation center operates in sandboxed database simulator mode. Newly registered patients, schedules, and clinical notes are preserved locally in your browser's localStorage.",

    // Hero Section
    premiumBadge: "Private Medical Facility • Premium Rehabilitation",
    heroTitlePrefix: "Rehabilitation Center",
    heroTitleAccent: "«Vorontsovka Lux»",
    heroDesc: "Welcome to the digital portal of the premium private rehabilitation and physiotherapy center in Tash-Debe village (Chuy Region, Kyrgyzstan). Equipped with state-of-the-art Swiss physiotherapy technology, personalized recovery schedules, and supreme physicians.",
    btnOpenCard: "Open Medical Card & Contract",
    btnViewDoctors: "Doctors & Treatments",

    // Contact Tiles
    bookingDept: "Booking Department",
    bookingPhoneLabel: "Inquiries & Appointments Direct Line",
    careService: "Care & Support",
    receptionLabel: "24/7 Full-time Receptionist Desk",
    resortZone: "Foothills Resort",
    addressLabel: "Rehabilitation Center Location",
    addressValue: "73 Shkolnaya St, Tash-Debe, Chuy Region, Kyrgyzstan",

    // Quick Stats Grid
    statsHoursTitle: "Working Hours",
    statsHoursDesc: "Rehab therapist consults and operations: Daily from 08:30 to 21:00. Inpatient clinical admission: 24/7.",
    statsLicenseTitle: "Ministry of Health License",
    statsLicenseDesc: "No. 021990. Premium medical maintenance for direct commercial agreements, voluntary insurance policies, and global carriers.",
    statsDigitalTitle: "Digital Treatment Cards",
    statsDigitalDesc: "Seamless digital clinical protocols. All prescribed electrotherapy, hydrotherapy courses and assessments are recorded in the cloud.",

    // Map Section
    mapBadge: "Coordinates & Map",
    mapTitle: "Our Location in Kyrgyzstan",
    mapDesc: "Vorontsovka Lux Private Rehabilitation Center is situated in an ecologically pristine mountain foothills resort zone of Tash-Debe village, Chuy Region, Kyrgyzstan.",
    mapMicroclimateTitle: "Unique Microclimate",
    mapMicroclimateDesc: "Altitude above 1200 meters, pine forest phytoncides, and ultimate isolation from Bishkek's city smog provide golden rehabilitation circumstances.",
    mapAccessibilityTitle: "Convenient Transportation",
    mapAccessibilityDesc: "Just 20-25 minutes southbound drive from Bishkek's Southern Highway. Specialized medical transportation is available for low-mobility guests.",
    mapLandmarksTitle: "Roadmarks & Address",
    mapLandmarksDesc: "73 Shkolnaya St, Tash-Debe village (Vorontsovka). Direct access with newly paved road infrastructure.",
    mapNavigatorHintPrefix: "For Navigators (Yandex/Google):",
    mapNavigatorHintText: "enter address 'Tash-Debe, Shkolnaya 73'. Shuttle minibus #265 from Alamedin market reaches directly to the facility doors.",

    // Quick Login Simulation Section
    simulationTitle: "Instant Emulator Mode (Passwordless Entry)",
    simulationDesc: "Pick one of the simulated patients to instantaneously test diagnostic records, active drug prescriptions, or book specialized sessions:",
    dbCacheBadge: "Local DBMS Cache",
    btnEnterAsPatient: "Login as Patient",

    // Specialists Section
    specTitle: "Our Specialists & Therapies",
    specFound: "Found:",
    specSub: "Booking is carried out based on rehabilitation package paths, commercial insurance, or directly per premium procedure.",
    searchPlaceholder: "Search by physician name or key treatment...",
    specFilterAll: "All",
    docOffice: "Office:",
    docSchedule: "Schedule:",
    docExperienceTitle: "Medical Practice",
    docYears: "years",
    btnOnlineBook: "Book Appointment",
    noDocsFound: "No physio-therapists or rehab doctors found matching your query.",

    // Enroll Form Section
    formBadge: "Premium Service • Direct Agreement",
    formTitle: "Get Medical Card & Agreement",
    formDesc: "Submit personal details to initialize your record in the center's central database. A brand new digital medical card will be bound to your service contract immediately.",
    formFullName: "Full Name (Patient Name)",
    formFullNamePlaceholder: "John Smith",
    formBirthDate: "Date of Birth",
    formGender: "Gender",
    formGenderMale: "Male",
    formGenderFemale: "Female",
    formPhone: "Mobile Phone",
    formBloodType: "Blood Type",
    formOms: "Contract or Voluntary Insurance No. (16 Digits)",
    formOmsGen: "Generate Contract Number",
    formAllergies: "Known Drug Allergies (Optional)",
    formAllergiesPlaceholder: "Lidocaine, Dairy protein, Penicillin...",
    btnSubmitRegister: "Register Medical Record Sheet",
    successMsg: "Health record sheets initialized successfully! ID Number:",
    alertError: "Please fill out your full name, phone number, and a valid 16-digit contract or insurance number",

    // Footer
    footerLicense: "License of Ministry of Health of KR • LLC «Vorontsovka Lux»",
    footerDesc: "Official web portal of the Center for Physiotherapy and Medical Rehabilitation 'Vorontsovka Lux'. Under general license of medical operations of the Ministry of Health of the Kyrgyz Republic. All rights reserved.",
    footerVersion: "System version: v2.1.0 • Engine: Local web state storage • Built with Care • Date:",

    // Chatbot
    chatBotTitle: "Vorontsovka Lux AI",
    chatBotStatus: "• Online Assistant",
    chatBotWelcome: "Hello! I am the intelligent assistant of the 'Vorontsovka Lux' rehabilitation center. 🌟 How can I help you choose a physician, navigate route directions, or plan your premium rehabilitation treatments?",
    chatBotInputPlaceholder: "Ask a question about our center...",
    chatBotQuickStart: "Quick Start:",
    chatBotErrorTitle: "Connection Problem",
    chatBotErrorDesc: "Temporary connection issue with our service. Please try again in a moment.",
    chatBotTyping: "Assistant is typing...",
    chatBotTitleBadge: "AI Assistant",
    chatBotErrorNoAnswer: "Sorry, I couldn't formulate a response."
  }
};
