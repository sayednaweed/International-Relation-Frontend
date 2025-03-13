import {
  useAbortAll,
  useBatchFinalizeListener,
  useItemProgressListener,
  useItemStartListener,
} from "@rpldy/uploady";
import { useRef } from "react";
import IconButton from "../button/IconButton";
export interface ISimpleProgressBarProps {
  onFailed: (failed: boolean, response: any) => Promise<void>;
  onComplete: (response: any) => Promise<void>;
  onStart: (file: File) => Promise<void>;
  cancelText: string;
  failedText: string;
  validateBeforeUpload: (file: File) => boolean;
}
const SimpleProgressBar = (props: ISimpleProgressBarProps) => {
  const {
    onComplete,
    onStart,
    onFailed,
    cancelText,
    failedText,
    validateBeforeUpload,
  } = props;
  // const [progress, setProgress] = useState(0);
  const failedDiv = useRef<HTMLDivElement | null>(null);
  const progressDiv = useRef<HTMLDivElement | null>(null);
  const cancelDiv = useRef<HTMLButtonElement | null>(null);
  const mainDiv = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<SVGCircleElement | null>(null);
  const abortAll = useAbortAll();

  const initProgress = (progress: number) => {
    mainDiv.current!.style.setProperty("display", "flex");
    cancelDiv.current!.style.setProperty("display", "block");
    failedDiv.current!.style.setProperty("display", "none");
    progressDiv.current!.style.setProperty("display", "flex");
    setProgress(progress);
  };
  const taskFailed = () => {
    failedDiv.current!.style.setProperty("display", "flex");
    progressDiv.current!.style.setProperty("display", "none");
  };
  const completed = () => {
    cancelDiv.current!.style.setProperty("display", "none");
  };
  const setProgress = (progress: number) => {
    progressDiv.current!.innerHTML = `${progress}%`;
    const circumference = 138.2; // Circumference of the circle (2 * PI * radius)
    const offset = circumference - (circumference * progress) / 100;
    circleRef.current!.style.strokeDashoffset = `${offset}`;
  };
  useItemStartListener((item) => {
    const file = item.file as File;

    // Validate before upload starts
    if (!validateBeforeUpload(file)) {
      abortAll();
      // If validation fails, trigger failure UI
      onFailed(true, undefined);
      taskFailed();
      return; // Stop the upload
    }
    onStart(file as File);
    initProgress(0);
  });
  useItemProgressListener((item) => {
    if (item.state != "error") {
      setProgress(Math.round(item.completed));
    }
  });
  useBatchFinalizeListener(async (batch) => {
    const failedFiles = batch.items.filter(
      (item) => item.state == "error" || item.state == "aborted"
    );
    if (failedFiles.length > 0) {
      failedFiles.forEach((file) => {
        const response = file.uploadResponse?.chunkUploadResponse?.response;
        onFailed(true, response);
        taskFailed();
      });
    } else {
      const file = batch.items.map((item) => {
        return item.uploadResponse.results.map((data: any) => data.data);
      });
      completed();
      await onComplete(file);
    }
  });
  const cancel = () => {
    abortAll();
    setProgress(0);
  };
  return (
    <div className="flex flex-col justify-center items-center gap-y-1">
      <div
        ref={mainDiv}
        className="relative hidden mx-[4px] w-fit justify-center h-[50px]"
      >
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
            ref={circleRef}
            cx="25"
            cy="25"
            r="22"
            stroke="#34D399" // Adjust to match your desired color (primary/tertiary)
            strokeWidth="5"
            fill="none"
            strokeDasharray="138.2" // Circumference of the smaller circle (2 * PI * radius)
          />
        </svg>

        {/* Text inside circle */}
        <div
          ref={failedDiv}
          className="text-red-400 hidden rtl:text-sm-rtl text-[12px] font-semibold items-center justify-center w-fit h-full"
        >
          {failedText}
        </div>
        <div
          ref={progressDiv}
          className="text-primary text-[12px] font-semibold flex items-center justify-center w-fit h-full"
        ></div>
      </div>
      <IconButton
        ref={cancelDiv}
        className="hover:bg-red-400/30 hidden mx-auto py-[2px] px-2 rtl:text-lg-rtl ltr:text-md-ltr transition-all border-red-400/40 text-red-400"
        onClick={cancel}
      >
        {cancelText}
      </IconButton>
    </div>
  );
};

export default SimpleProgressBar;

// import {
//   useAbortAll,
//   useBatchFinalizeListener,
//   useItemProgressListener,
//   useItemStartListener,
// } from "@rpldy/uploady";
// import { useState } from "react";
// export interface ISimpleProgressBarProps {
//   onFailed: (failed: boolean, response: any) => Promise<void>;
//   onComplete: (response: any) => Promise<void>;
//   onStart: (file: File) => Promise<void>;
//   cancelText: string;
//   failedText: string;
// }
// const SimpleProgressBar = (props: ISimpleProgressBarProps) => {
//   const { onComplete, onStart, onFailed, cancelText } = props;
//   const [progress, setProgress] = useState(0);
//   const [failed, setFailed] = useState(false);
//   const abortAll = useAbortAll();

//   useItemStartListener((item) => {
//     onStart(item.file as File);
//     setProgress(0);
//   });
//   useItemProgressListener((item) => {
//     if (item.state != "error") setProgress(Math.round(item.completed));
//   });
//   useBatchFinalizeListener(async (batch) => {
//     const failedFiles = batch.items.filter(
//       (item) => item.state == "error" || item.state == "aborted"
//     );
//     if (failedFiles.length > 0) {
//       failedFiles.forEach((file) => {
//         const response = file.uploadResponse?.chunkUploadResponse?.response;
//         onFailed(true, response);
//         setFailed(true);
//       });
//     } else {
//       const file = batch.items.map((item) => {
//         return item.uploadResponse.results.map((data: any) => data.data);
//       });
//       await onComplete(file);
//     }
//   });
//   const cancel = () => {
//     abortAll();
//     setProgress(0);
//   };
//   return (
//     progress > 0 && (
//       <>
//         <div className="relative mx-[4px] mb-[6px] w-fit flex justify-center h-[50px]">
//           {/* Background Circle */}
//           <svg className="absolute transform rotate-90" width="50" height="50">
//             <circle
//               cx="25"
//               cy="25"
//               r="22"
//               stroke="rgba(200, 200, 200, 0.2)"
//               strokeWidth="5"
//               fill="none"
//             />
//           </svg>

//           {/* Progress Circle */}
//           <svg className="absolute transform rotate-90" width="50" height="50">
//             <circle
//               cx="25"
//               cy="25"
//               r="22"
//               stroke="#34D399" // Adjust to match your desired color (primary/tertiary)
//               strokeWidth="5"
//               fill="none"
//               strokeDasharray="138.2" // Circumference of the smaller circle (2 * PI * radius)
//               strokeDashoffset={138.2 - (138.2 * progress) / 100} // Dynamically adjust stroke dashoffset based on progress
//             />
//           </svg>

//           {/* Text inside circle */}
//           <div className="text-primary text-[12px] font-semibold flex items-center justify-center w-fit h-full">
//             {failed ? "failed" : `${progress}%`}
//           </div>
//         </div>
//         {progress != 100 && (
//           <h1
//             onClick={cancel}
//             className="rtl:text-[14px] ltr:text-[12px] font-semibold shadow-lg cursor-pointer hover:shadow bg-red-500 px-1 rounded-md text-white "
//           >
//             {cancelText}
//           </h1>
//         )}
//       </>
//     )
//   );
// };

// export default SimpleProgressBar;

// // Change circle:
// // Container Size: I set the width and height of the outer container to 40px, which is smaller than before.

// // Circle Radius (r): I reduced the radius to 17. This makes the circle smaller.

// // Circumference: The circumference is calculated as 2 * PI * radius, so with r = 17, it becomes approximately 106.8. I updated strokeDasharray to 106.8.

// // Stroke Width: I reduced the strokeWidth to 4 to maintain a visually proportional thickness for the smaller circle.

// // Text Size: I reduced the text size to text-[10px] to better fit the smaller circle.
