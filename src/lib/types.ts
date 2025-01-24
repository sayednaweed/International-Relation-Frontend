import { Audit, News, SelectUserPermission, User } from "@/database/tables";
import { DateObject } from "react-multi-date-picker";

export interface IMenuItem {
  name: string;
  key: string;
}
export interface UserInformation {
  profile: any;
  imagePreviewUrl: any;
  full_name: string;
  username: string;
  password: string;
  email: string;
  status: boolean;
  grant: boolean;
  job: {
    id: string;
    name: string;
    selected: boolean;
  };
  role: {
    id: string;
    name: string;
    selected: boolean;
  };
  contact: string;
  destination: {
    id: string;
    name: string;
    selected: boolean;
  };
  permission: Map<string, SelectUserPermission>;
  allSelected: boolean;
  created_at: string;
}

export interface UserPassword {
  old_password: string;
  new_password: string;
  confirm_password: string;
}
export interface UserPaginationData {
  data: User[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
// Filter
export interface UserData {
  name: string;
  data: any;
}
export type Order = "desc" | "asc";
export type UserSort =
  | "created_at"
  | "username"
  | "destination"
  | "status"
  | "job";
export type UserSearch = "username" | "contact" | "email";
export interface UserFilter {
  sort: UserSort;
  order: Order;
  search: {
    column: UserSearch;
    value: string;
  };
  date: DateObject[];
}

export interface UserRecordCount {
  activeUserCount: number | null;
  inActiveUserCount: number | null;
  todayCount: number | null;
  userCount: number | null;
}
//
export interface AuditData {
  name: string;
  data: any;
}

export type AuditSort = "id" | "date" | "user" | "user_id" | "action" | "table";
export type AuditSearch = "user" | "user_id" | "table";
export type AuditFilterBy = "none" | "user" | "table" | "user_id";

export interface AuditFilter {
  sort: AuditSort;
  order: Order;
  filterBy: {
    column: AuditFilterBy;
    value: string;
  };
  search: {
    column: AuditSearch;
    value: string;
  };
  date: DateObject[];
}
export interface AuditPaginationData {
  data: Audit[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
// Multiselector
export interface Option {
  name: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}

// Application
export type NgoSort = "id" | "name" | "type" | "contact" | "status";
export type NgoSearch = "id" | "registration_no" | "name" | "type" | "contact";
export interface NgoFilter {
  sort: NgoSort;
  order: Order;
  search: {
    column: NgoSearch;
    value: string;
  };
  date: DateObject[];
}
export interface NgoPaginationData {
  data: NgoInformation[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type NewsSort =
  | "id"
  | "type"
  | "priority"
  | "visible"
  | "visibility_date"
  | "date";
export type NewsSearch = "title";
export interface NewsFilter {
  sort: NewsSort;
  order: Order;
  search: {
    column: NewsSearch;
    value: string;
  };
  date: DateObject[];
}
export interface NewsPaginationData {
  data: News[];
  lastPage: number;
  perPage: number;
  currentPage: number;
  totalItems: number;
}
export type NgoInformation = {
  id: string;
  profile: string;
  name: string;
  abbr: string;
  status_id: number;
  status: string;
  registration_no: string;
  type_id: string;
  type: string;
  email: string;
  contact: string;
  created_at: string;
};
export type IStaff = {
  picture: string;
  name_english: string;
  name_farsi: string;
  name_pashto: string;
  contact: string;
  email: string;
  id: string;
};
export interface IStaffSingle {
  name_english: string;
  name_farsi: string;
  name_pashto: string;
  contact: string;
  email: string;
  id: string;
  picture: File | undefined | string;
  optional_lang: string;
  imageUrl: string;
  editable: boolean;
}
