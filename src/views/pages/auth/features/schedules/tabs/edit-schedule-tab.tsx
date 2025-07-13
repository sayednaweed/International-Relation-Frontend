import { Dispatch, useEffect, useState } from "react";
import ScheduleTable from "./parts/ScheduleTable";
import { Schedule } from "@/views/pages/auth/features/schedules/add-or-edit-schedule";
import { Separator } from "@/components/ui/separator";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { Project, ScheduleItem, TimeSlot } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { useTranslation } from "react-i18next";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { toast } from "@/components/ui/use-toast";

const timeToDate = (time: string): Date => {
  const [hour, minute] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d;
};

const isInBreak = (
  start: Date,
  end: Date,
  breakStart: string,
  breakEnd: string
) => {
  const bStart = timeToDate(breakStart);
  const bEnd = timeToDate(breakEnd);
  return start < bEnd && end > bStart;
};

const generateSlots = (
  startTime: string,
  endTime: string,
  presentationLengthMinutes: number,
  gapMinutes: number,
  lunchBreak?: { start: string; end: string },
  dinnerBreak?: { start: string; end: string }
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const start = timeToDate(startTime);
  const end = timeToDate(endTime);
  let current = new Date(start);
  let id = 0;

  while (current < end) {
    const presentationStart = new Date(current);
    const presentationEnd = new Date(current);
    presentationEnd.setMinutes(
      presentationEnd.getMinutes() + presentationLengthMinutes
    );

    const gapEnd = new Date(presentationEnd);
    gapEnd.setMinutes(gapEnd.getMinutes() + gapMinutes);

    const inLunch =
      lunchBreak &&
      isInBreak(
        presentationStart,
        presentationEnd,
        lunchBreak.start,
        lunchBreak.end
      );
    const inDinner =
      dinnerBreak &&
      isInBreak(
        presentationStart,
        presentationEnd,
        dinnerBreak.start,
        dinnerBreak.end
      );

    if (!inLunch && !inDinner && presentationEnd <= end) {
      slots.push({
        id: id++,
        presentation_start: presentationStart.toTimeString().slice(0, 5),
        presentation_end: presentationEnd.toTimeString().slice(0, 5),
        gap_end: gapEnd.toTimeString().slice(0, 5),
      });
    }

    current = gapEnd;
  }

  return slots;
};

const formatTime12h = (time24: string): string => {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${ampm}`;
};

export interface EditScheduleTabProps {
  schedule: Schedule;
  setSchedule: Dispatch<any>;
}
const EditScheduleTab = (props: EditScheduleTabProps) => {
  const { schedule, setSchedule } = props;
  const [presentationLength, setPresentationLength] = useState(45);
  const [loading, setLoading] = useState(false);
  const [gapBetween, setGapBetween] = useState(5);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");
  const [timeFormat24h, setTimeFormat24h] = useState(false);
  const { t } = useTranslation();

  // Optional lunch and dinner breaks
  const [lunchStart, setLunchStart] = useState("12:30");
  const [lunchEnd, setLunchEnd] = useState("13:30");
  const [dinnerStart, setDinnerStart] = useState("");
  const [dinnerEnd, setDinnerEnd] = useState("");

  // Presentations before and after lunch count
  const [presentationsBeforeLunch, setPresentationsBeforeLunch] = useState(0);
  const [presentationsAfterLunch, setPresentationsAfterLunch] = useState(0);

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const lunch =
      lunchStart && lunchEnd ? { start: lunchStart, end: lunchEnd } : undefined;
    const dinner =
      dinnerStart && dinnerEnd
        ? { start: dinnerStart, end: dinnerEnd }
        : undefined;

    const slots = generateSlots(
      startTime,
      endTime,
      presentationLength,
      gapBetween,
      lunch,
      dinner
    );

    const totalPresentations = schedule.projects.length;

    // Clamp the before and after lunch numbers so they don't exceed people count or slot counts
    let beforeCount = Math.min(presentationsBeforeLunch, totalPresentations);
    let afterCount = Math.min(
      presentationsAfterLunch,
      totalPresentations - beforeCount
    );

    // If sum less than total presentations, adjust afterCount automatically
    if (beforeCount + afterCount < totalPresentations) {
      afterCount = totalPresentations - beforeCount;
    }

    const lunchStartDate = lunch ? timeToDate(lunch.start) : null;

    // Split slots into before lunch and after lunch
    const slotsBeforeLunch = lunchStartDate
      ? slots.filter(
          (slot) => timeToDate(slot.presentation_start) < lunchStartDate
        )
      : slots;

    const slotsAfterLunch = lunchStartDate
      ? slots.filter(
          (slot) => timeToDate(slot.presentation_start) >= lunchStartDate
        )
      : [];

    // Select slots for before and after lunch presentations, clamp by available slots too
    const selectedBeforeSlots = slotsBeforeLunch.slice(0, beforeCount);
    const selectedAfterSlots = slotsAfterLunch.slice(0, afterCount);

    // Combine and limit by totalPresentations
    const selectedSlots = [...selectedBeforeSlots, ...selectedAfterSlots].slice(
      0,
      totalPresentations
    );

    // Create schedule items with no assigned persons initially
    const items: ScheduleItem[] = selectedSlots.map((slot) => ({
      slot,
      projectId: null,
    }));

    setScheduleItems(items);
  }, [schedule.projects.length]);

  const prepareSchedule = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`schedules/prepare`);
      const fetch = response.data as Project[];
      setSchedule((prev: Schedule) => ({ ...prev, projects: fetch }));
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const assignPersonToSlot = (slotId: number, projectId: number | null) => {
    setScheduleItems((prev) =>
      prev.map((item) =>
        item.slot.id === slotId ? { ...item, projectId } : item
      )
    );
  };

  const formatTime = (time: string) => {
    return timeFormat24h ? time : formatTime12h(time);
  };

  const onReorderSchedule = (newItems: ScheduleItem[]) => {
    setScheduleItems(newItems);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 p-6">
        <label className="flex flex-col">
          <span className="font-semibold">Presentation Length (min)</span>
          <input
            type="number"
            value={presentationLength}
            onChange={(e) => setPresentationLength(Number(e.target.value))}
            className="input input-bordered"
            min={1}
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">Gap Between (min)</span>
          <input
            type="number"
            value={gapBetween}
            onChange={(e) => setGapBetween(Number(e.target.value))}
            className="input input-bordered"
            min={0}
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">Start Time</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="input input-bordered"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">End Time</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="input input-bordered"
          />
        </label>

        {/* Lunch Break */}
        <label className="flex flex-col">
          <span className="font-semibold">Lunch Break Start</span>
          <input
            type="time"
            value={lunchStart}
            onChange={(e) => setLunchStart(e.target.value)}
            className="input input-bordered"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">Lunch Break End</span>
          <input
            type="time"
            value={lunchEnd}
            onChange={(e) => setLunchEnd(e.target.value)}
            className="input input-bordered"
          />
        </label>

        {/* Dinner Break */}
        <label className="flex flex-col">
          <span className="font-semibold">Dinner Break Start</span>
          <input
            type="time"
            value={dinnerStart}
            onChange={(e) => setDinnerStart(e.target.value)}
            className="input input-bordered"
          />
        </label>

        <label className="flex flex-col">
          <span className="font-semibold">Dinner Break End</span>
          <input
            type="time"
            value={dinnerEnd}
            onChange={(e) => setDinnerEnd(e.target.value)}
            className="input input-bordered"
          />
        </label>

        {/* Presentations Before Lunch */}
        <label className="flex flex-col col-span-2">
          <span className="font-semibold">Presentations Before Lunch</span>
          <input
            type="number"
            value={presentationsBeforeLunch}
            onChange={(e) =>
              setPresentationsBeforeLunch(
                Math.min(Number(e.target.value), schedule.projects.length)
              )
            }
            className="input input-bordered"
            min={0}
            max={schedule.projects.length}
          />
          <small className="text-gray-500">
            Number of presentations scheduled before lunch break.
          </small>
        </label>

        {/* Presentations After Lunch */}
        <label className="flex flex-col col-span-2">
          <span className="font-semibold">Presentations After Lunch</span>
          <input
            type="number"
            value={presentationsAfterLunch}
            onChange={(e) =>
              setPresentationsAfterLunch(
                Math.min(Number(e.target.value), schedule.projects.length)
              )
            }
            className="input input-bordered"
            min={0}
            max={schedule.projects.length}
          />
          <small className="text-gray-500">
            Number of presentations scheduled after lunch break.
          </small>
        </label>

        <label className="flex items-center space-x-2 col-span-2">
          <input
            type="checkbox"
            checked={timeFormat24h}
            onChange={() => setTimeFormat24h((prev) => !prev)}
            className="checkbox"
          />
          <span>Use 24-hour time format</span>
        </label>
      </div>

      <PrimaryButton
        disabled={loading}
        onClick={prepareSchedule}
        className={`shadow-lg block mx-auto`}
      >
        <ButtonSpinner loading={loading}>{t("prepare")}</ButtonSpinner>
      </PrimaryButton>
      <Separator className="mt-6" />

      <ScheduleTable
        scheduleItems={scheduleItems}
        projects={schedule.projects}
        formatTime={formatTime}
        onAssign={assignPersonToSlot}
        onReorder={onReorderSchedule}
      />
    </>
  );
};

export default EditScheduleTab;
