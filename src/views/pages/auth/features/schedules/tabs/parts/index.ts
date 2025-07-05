export interface Person {
  id: number;
  name: string;
  email: string;
}

export interface TimeSlot {
  id: number;
  presentation_start: string;
  presentation_end: string;
  gap_end: string;
  person?: Person;
}

export interface FixedBreak {
  start: string; // e.g., "12:30"
  end: string; // e.g., "13:30"
}

export interface ScheduleItem {
  slot: TimeSlot;
  personId: number | null;
}
