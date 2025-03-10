export type ValidationRule =
  | "required"
  | `max:${number}`
  | `min:${number}`
  | ((value: any) => boolean);
export interface ValidateItem {
  name: string;
  rules: ValidationRule[];
}
