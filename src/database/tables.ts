export type Role =
  | { role: 3; name: "user" }
  | { role: 2; name: "admin" }
  | { role: 1; name: "super" }
  | { role: 4; name: "debugger" };

export type Permission = {
  name: string;
};
export type UserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  permission: string;
  icon: string;
  priority: number;
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
export type User = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  status: boolean;
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
  createdAt: string;
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
export type Address = {
  id: string;
  country: Country;
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
export type NgoStatus = "block" | "active" | "inactive" | "mou_not_reg";
export type NgoType = {
  id: string;
  name: string;
  created_at: string;
};
export type Ngo = {
  id: string;
  profile: string;
  name: string;
  abbr: string;
  status: NgoStatus;
  registration_no: string;
  date_of_establishment: string;
  expireDate: string;
  type: NgoType;
  moe_registration_no: string;
  place_of_establishment: string;
  email: Email;
  contact: Contact;
  created_at: string;
  address: Address;
};
