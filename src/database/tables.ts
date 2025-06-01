import { FileType } from "@/lib/types";
import { Option } from "@/lib/types";

export type Role =
  | { role: 3; name: "user" }
  | { role: 2; name: "admin" }
  | { role: 1; name: "super" }
  | { role: 4; name: "debugger" }
  | { role: 5; name: "ngo" }
  | { role: 6; name: "donor" };

export type StatusType =
  | { active: 1 }
  | { blocked: 2 }
  | { unregistered: 3 }
  | { not_logged_in: 4 }
  | { in_progress: 5 }
  | { register_form_submited: 6 };

export type Permission = {
  name: string;
};
export interface SubPermission {
  id: number;
  name: string;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
}
export type UserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  visible: boolean;
  permission: string;
  icon: string;
  priority: number;
  sub: Map<number, SubPermission>;
};
export type SelectUserPermission = UserPermission & {
  allSelected: boolean;
};
export type Contact = {
  id: string;
  value: string;
  created_at: string;
};
export type Email = {
  id: string;
  value: string;
  created_at: string;
};
export type Status = {
  id: number;
  name: string;
  created_at: string;
};
export type User = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  status: Status;
  grant: boolean;
  profile: any;
  role: Role;
  contact: string;
  job: string;
  destination: string;
  permissions: Map<string, UserPermission>;
  created_at: string;
};

export type Notifications = {
  id: string;
  message: string;
  type: string;
  read_status: number;
  created_at: string;
};
export type Job = {
  id: string;
  name: string;
  created_at: string;
};
export type Gender = {
  id: string;
  name: string;
};
export type NidType = {
  id: string;
  name: string;
};
// APPLICATION

export type DestinationType = {
  id: string;
  name: string;
  created_at: string;
};
export type Destination = {
  id: string;
  name: string;
  color: string;
  type: DestinationType;
  created_at: string;
};

export type Country = {
  id: string;
  name: string;
};
export type District = {
  id: string;
  name: string;
};
export type Province = {
  id: string;
  name: string;
};
export type Address = {
  id: string;
  country: Country;
  province: Province;
  district: District;
  area: string;
};

export type Audit = {
  id: string;
  user_id: string;
  user: string;
  action: string;
  table: string;
  table_id: string;
  old_values: any;
  new_values: any;
  url: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
};

///////////////////////////////App
export type NgoStatus = {
  id: string;
  ngo_id: string;
  status_type_id: number;
  is_active: number;
  name: string;
  userable_type: string;
  comment: string;
  created_at: string;
};
export type NgoType = {
  id: string;
  name: string;
  created_at: string;
};
export type Donor = {
  id: string;
  profile: string;
  name: string;
  username: string;
  status: string;
  email: string;
  contact: string;
  is_editable: boolean;
  role: Role;
  permissions: Map<string, UserPermission>;
  created_at: string;
};

export type News = {
  id: string;
  title: string;
  contents: string;
  image: string;
  news_type: string;
  news_type_id: number;
  priority: string;
  priority_id: number;
  user: string;
  visible: boolean;
  visibility_date: string;
  date: string;
  created_at: string;
};

export type About = {
  id: string;
  name: string;
  contact: string;
  profile: any;
};

export type Ngo = {
  id: string;
  profile: string | undefined;
  name: string;
  username: string;
  status_id: number;
  agreement_id: number;
  email: Email;
  contact: Contact;
  is_editable: boolean;
  role: Role;
  permissions: Map<string, UserPermission>;
  created_at: string;
};

export type CheckList = {
  id: string;
  type: string;
  type_id: number;
  name: string;
  acceptable_extensions: string;
  active: number;
  file_size: number;
  acceptable_mimes: string;
  accept: string;
  description: string;
  saved_by: string;
  created_at: string;
};

export type Staff = {
  picture: string;
  name: string;
  contact: string;
  email: string;
  id: string;
};
export type Agreement = {
  id: string;
  start_date: string;
  end_date: string;
};
export interface AgreementDocument extends FileType {
  document_id: string;
  checklist_id: string;
  checklist_name: string;
  acceptable_extensions: string;
  acceptable_mimes: string;
  description: string;
}
export interface Representor {
  id: string;
  is_active: number;
  created_at: string;
  full_name: string;
  saved_by: string;
  userable_id: string;
  userable_type: string;
  agreement_id: string;
  agreement_no: string;
  start_date: string | null;
  end_date: string | null;
}
export interface Slider {
  id: string;
  name: string;
  path: string;
  is_active: string;
  saved_by: string;
  size: string;
}
export interface Approval {
  id: string;
  request_comment: string;
  request_date: string;
  respond_comment: string;
  respond_date: string;
  approval_type_id: string;
  approval_type: string;
  requester_id: string;
  requester: string;
  responder_id: string;
  responder_name: string;
  notifier_type_id: number;
  notifier_type: string;
  document_count: string;
}

export interface ActivityModel {
  id: string;
  profile: string;
  username: string;
  userable_type: string;
  action: string;
  ip_address: string;
  device: string;
  browser: string;
  date: string;
}

export interface CenterBudget {
  id: string;
  province: { id: string; name: string } | undefined | Option;
  district: { id: string; name: string }[] | Option[];
  village: { id: string; name: string }[];
  health_centers: { id: string; name: string }[];
  budget: string;
  direct_benefi: number;
  in_direct_benefi: number;
  address: string;
  health_employees: string[];
  finance_and_admin: string[];
}

// donor
export type DonorStatus = {
  id: string;
  donor_id: string;
  status_id: number;
  is_active: number;
  name: string;
  username: string;
  comment: string;
  created_at: string;
};
