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
export const StatusEnum = {
  active: 1,
  blocked: 2,
  unregistered: 3,
  not_logged_in: 4,
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
  NEWS_TABLE_PAGINATION_COUNT: "NEWS_TABLE",
  SYSTEM_CALENDAR: "SYSTEM_CALENDAR",
};
