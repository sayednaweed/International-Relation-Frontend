export const SectionEnum = {
  users: "users",
  dashboard: "dashboard",
  reports: "reports",
  settings: "settings",
  logs: "logs",
  audit: "audit",
  projects: "projects",
  about: "management/about",
  news: "management/news",
  ngo: "ngo",
  donor: "donor",
};
export const LanguageEnum = {
  english: "english",
  farsi: "farsi",
  pashto: "pashto",
};
export const RoleEnum = {
  super: 1,
  admin: 2,
  user: 3,
  debugger: 4,
  ngo: 5,
  donor: 6,
};
export const PermissionEnum = {
  users: {
    name: "users",
    sub: {
      user_information: 1,
      user_password: 2,
      user_permission: 3,
    },
  },
  dashboard: { name: "dashboard", sub: {} },
  reports: { name: "reports", sub: {} },
  settings: {
    name: "settings",
    sub: {
      setting_language: 21,
      setting_job: 22,
      setting_destination: 23,
      setting_checklist: 24,
    },
  },
  logs: { name: "logs", sub: {} },
  audit: { name: "audit", sub: {} },
  projects: { projects: "projects", sub: {} },
  about: {
    name: "management/about",
    sub: {
      director: 71,
      manager: 72,
      office: 73,
      slider: 74,
      technical: 75,
    },
  },
  news: {
    name: "management/news",
    sub: {},
  },
  ngo: {
    name: "ngo",
    sub: {
      ngo_information: 52,
      ngo_director_information: 53,
      ngo_agreement: 54,
      ngo_more_information: 55,
      ngo_status: 56,
      ngo_representative: 57,
    },
  },
  donor: { name: "donor", sub: {} },
};
export const StatusEnum = {
  active: 1,
  blocked: 2,
  unregistered: 3,
  not_logged_in: 4,
  in_progress: 5,
  register_form_submitted: 6,
};
export const StaffEnum = {
  manager: 1,
  director: 2,
  technical_support: 3,
};
export const CountryEnum = {
  afghanistan: 1,
};
export const PriorityEnum = {
  high: 1,
  medium: 2,
  low: 3,
};

export const PERMISSIONS_OPERATION = ["Add", "Edit", "Delete", "View"];

export const DestinationTypeEnum = {
  muqam: "1",
  directorate: "2",
};
export const afgMonthNamesFa = [
  "حمل",
  "ثور",
  "جوزا",
  "سرطان",
  "اسد",
  "سنبله",
  "میزان",
  "عقرب",
  "قوس",
  "جدی",
  "دلو",
  "حوت",
];
export const afgMonthNamesEn = [
  "Hamal",
  "Sawr",
  "Jawza",
  "Saratan",
  "Asad",
  "Sonbola",
  "Mezan",
  "Aqrab",
  "Qaws ",
  "Jadi ",
  "Dalwa",
  "Hoot",
];
// Indexedb keys
export const CALENDAR = {
  Gregorian: "1",
  SOLAR: "2",
  LUNAR: "3",
};
export const CALENDAR_LOCALE = {
  english: "1",
  farsi: "2",
  arabic: "3",
};
export const CALENDAR_FORMAT = {
  format_1: "YYYY-MM-DD hh:mm A",
  format_2: "YYYY-MM-DD",
  format_3: "YYYY/MM/dddd",
};
export const CACHE = {
  USER_TABLE_PAGINATION_COUNT: "USER_TABLE",
  PROJECT_TABLE_PAGINATION_COUNT: "PROJECT_TABLE",
  AUDIT_TABLE_PAGINATION_COUNT: "AUDIT_TABLE",
  NGO_TABLE_PAGINATION_COUNT: "NGO_TABLE",
  NGO_LIST_TABLE_PAGINATION_COUNT: "NGO_LIST_TABLE",
  NEWS_TABLE_PAGINATION_COUNT: "NEWS_TABLE",
  NEWS_PUB_TABLE_PAGINATION_COUNT: "NEWS_PUB_TABLE",
  SYSTEM_CALENDAR: "SYSTEM_CALENDAR",
};
