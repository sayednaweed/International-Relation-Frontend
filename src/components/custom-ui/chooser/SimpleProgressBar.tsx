import { toast } from "@/components/ui/use-toast";
import {
  useAbortAll,
  useBatchFinalizeListener,
  useItemProgressListener,
  useItemStartListener,
} from "@rpldy/uploady";
import { useState } from "react";
export interface ISimpleProgressBarProps {
  onFailed: (failed: boolean) => Promise<void>;
  onComplete: (response: any) => Promise<void>;
  onStart: (file: File) => Promise<void>;
  failedMessage: string;
  cancelText: string;
}
const SimpleProgressBar = (props: ISimpleProgressBarProps) => {
  const { onComplete, onStart, failedMessage, onFailed, cancelText } = props;
  const [progress, setProgres] = useState(0);
  const abortAll = useAbortAll();

  useItemStartListener((item) => {
    onStart(item.file as File);
    setProgres(0);
  });
  useItemProgressListener((item) => {
    if (item.state != "error") setProgres(Math.round(item.completed));
  });
  useBatchFinalizeListener(async (batch) => {
    const failedFiles = batch.items.filter(
      (item) => item.state == "error" || item.state == "aborted"
    );
    if (failedFiles.length > 0) {
      toast({
        toastType: "ERROR",
        description: failedMessage,
      });
      onFailed(true);
    } else {
      const file = batch.items.map((item) => {
        return item.uploadResponse.results.map((data: any) => data.data);
      });
      await onComplete(file);
    }
  });
  const cancel = () => {
    abortAll();
    setProgres(0);
  };
  return (
    progress > 0 && (
      <>
        <div className="relative mx-[4px] mb-[6px] w-[50px] h-[50px]">
          {/* Background Circle */}
          <svg className="absolute transform rotate-90" width="50" height="50">
            <circle
              cx="25"
              cy="25"
              r="22"
              stroke="rgba(200, 200, 200, 0.2)"
              strokeWidth="5"
              fill="none"
            />
          </svg>

          {/* Progress Circle */}
          <svg className="absolute transform rotate-90" width="50" height="50">
            <circle
              cx="25"
              cy="25"
              r="22"
              stroke="#34D399" // Adjust to match your desired color (primary/tertiary)
              strokeWidth="5"
              fill="none"
              strokeDasharray="138.2" // Circumference of the smaller circle (2 * PI * radius)
              strokeDashoffset={138.2 - (138.2 * progress) / 100} // Dynamically adjust stroke dashoffset based on progress
            />
          </svg>

          {/* Text inside circle */}
          <div className="absolute text-primary text-[11px] font-semibold top-0 bottom-0 left-0 flex items-center justify-center w-full h-full">
            {progress}%
          </div>
        </div>
        <h1
          onClick={cancel}
          className="rtl:text-[14px] ltr:text-[12px] font-semibold shadow-lg cursor-pointer hover:shadow bg-red-500 px-1 rounded-md text-white "
        >
          {cancelText}
        </h1>
      </>
    )
  );
};

export default SimpleProgressBar;

// Change circle:
// Container Size: I set the width and height of the outer container to 40px, which is smaller than before.

// Circle Radius (r): I reduced the radius to 17. This makes the circle smaller.

// Circumference: The circumference is calculated as 2 * PI * radius, so with r = 17, it becomes approximately 106.8. I updated strokeDasharray to 106.8.

// Stroke Width: I reduced the strokeWidth to 4 to maintain a visually proportional thickness for the smaller circle.

// Text Size: I reduced the text size to text-[10px] to better fit the smaller circle.
