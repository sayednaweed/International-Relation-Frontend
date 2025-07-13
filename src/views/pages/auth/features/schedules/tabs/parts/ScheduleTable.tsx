import React from "react";

import { Reorder } from "framer-motion";
import { Project, ScheduleItem } from "@/database/tables";

interface Props {
  scheduleItems: ScheduleItem[];
  projects: Project[];
  formatTime: (time: string) => string;
  onAssign: (slotId: number, personId: number | null) => void;
  onReorder: (newItems: ScheduleItem[]) => void;
}

const ScheduleTable: React.FC<Props> = ({
  scheduleItems,
  projects,
  formatTime,
  onAssign,
  onReorder,
}) => {
  const getPersonById = (id: number | null) =>
    projects.find((p) => p.id === id) ?? null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Reorder.Group
        axis="y"
        values={scheduleItems}
        onReorder={onReorder}
        className="space-y-3"
      >
        {scheduleItems.map((item) => {
          const person = getPersonById(item.projectId);

          return (
            <Reorder.Item
              key={item.slot.id}
              value={item}
              className="flex justify-between items-center p-4 bg-gray-50 rounded shadow cursor-move"
            >
              <div>
                <p className="font-semibold">
                  {formatTime(item.slot.presentation_start)} -{" "}
                  {formatTime(item.slot.presentation_end)}
                </p>
                <p className="text-gray-700">
                  {person ? person.name : "No presenter assigned"}
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  className="select select-bordered select-sm"
                  value={item.projectId ?? ""}
                  onChange={(e) =>
                    onAssign(
                      item.slot.id,
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  <option value="">Unassigned</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {person && (
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => onAssign(item.slot.id, null)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </div>
  );
};

export default ScheduleTable;
