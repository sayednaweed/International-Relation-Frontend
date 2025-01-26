import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  ArrowDownToLine,
  ArrowUp,
  Check,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileType } from "./FileChooser";
import React from "react";
import axiosClient from "@/lib/axois-client";

export interface CheckListProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requiredHint?: string;
  name: string;
  parentClassName?: string;
  errorMessage?: string;
  defaultFile: File | FileType;
  maxSize: number;
  validTypes: string[];
  disabled?: boolean;
  downloadParam?: { path: string; fileName: string };
  onchange: (file: File | undefined) => void;
}

const CheckListChooser = React.forwardRef<HTMLInputElement, CheckListProps>(
  (props, ref: any) => {
    const {
      className,
      requiredHint,
      errorMessage,
      required,
      name,
      defaultFile,
      maxSize,
      validTypes,
      disabled,
      downloadParam,
      parentClassName,
      onchange,
      ...rest
    } = props;

    const { t } = useTranslation();
    const [file, setFile] = useState<File | FileType | undefined>(defaultFile);

    const [operating, setOperating] = useState<{
      loading: boolean;
      failed: boolean;
    }>({ loading: false, failed: false });
    const [progress, setProgress] = useState<{
      progress: number;
      size: string;
    }>({
      progress: 0,
      size: "0",
    });
    const chunkSize = 1024 * 1024; // 1 MB per chunk

    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const fileInput = e.target;
      const maxFileSize = maxSize * 1024; // converts to byte

      if (!fileInput.files) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("no_file_was_chosen"),
        });
        resetFile(e);
        return;
      }

      if (!fileInput.files || fileInput.files.length === 0) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("files_list_is_empty"),
        });
        resetFile(e);
        return;
      }

      const file = fileInput.files[0];
      if (file.size >= maxFileSize) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t(`img_size_shou_less`) + ` ${maxSize}MB`,
        });
        resetFile(e);
        return;
      }
      /** Type validation */
      if (!validTypes.includes(file.type)) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("accept_types") + validTypes.join(", "),
        });
        resetFile(e);
        return;
      }
      setFile(file);
      onchange(file);
      uploadFile(file);
      /** Reset file input */
      resetFile(e);
    };
    const resetFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget) {
        e.currentTarget.type = "text";
        e.currentTarget.type = "file"; // Reset to file type
      }
    };
    const uploadFile = async (file: File) => {
      let failed = operating.failed;

      if (file instanceof File && file) {
        setOperating({
          ...operating,
          loading: true,
        });
        const totalChunks = Math.ceil(file.size / chunkSize);
        let start = 0;
        let chunkIndex = 0;

        while (start < file.size) {
          const chunk = file.slice(start, start + chunkSize);
          const formData = new FormData();
          formData.append("file", chunk);
          formData.append("check_list_id", "1");
          formData.append("index", chunkIndex.toString());
          formData.append("total_chunks", totalChunks.toString());

          try {
            const response = await axiosClient.post("file/upload", formData, {
              headers: {
                Accept: "application/json",
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                  const uploaded = progressEvent.loaded; // How much is uploaded so far
                  const total = progressEvent.total; // Total file size
                  setProgress({
                    progress: Math.round((start / file.size) * 100),
                    size: `${Math.round(uploaded / 1024 / 1024)} MB`,
                  });
                }
              },
            });

            if (response.data.status === "success") {
              chunkIndex++;
              start += chunkSize;
            } else {
              alert("Failed to upload chunk");
              break;
            }
          } catch (error) {
            alert("Upload failed");
            failed = true;
          }
        }

        alert("Upload completed!");
      } else {
        return;
      }
      setOperating({
        failed: failed,
        loading: false,
      });
    };
    const download = async () => {
      // 2. Store
      let failed = operating.failed;
      try {
        setOperating({
          ...operating,
          loading: true,
        });
        const response = await axiosClient.get(`media/${downloadParam?.path}`, {
          responseType: "blob", // Important to handle the binary data (PDF)
          onDownloadProgress: (progressEvent) => {
            // Calculate download progress percentage
            const total = progressEvent.total || 0;
            const current = progressEvent.loaded;
            const progress = Math.round((current / total) * 100);
            setProgress({
              progress: progress,
              size: "0mb",
            }); // Update progress state
          },
        });
        if (response.status == 200) {
          // Create a URL for the file blob
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = window.URL.createObjectURL(file);

          const link = document.createElement("a");
          link.href = fileURL;
          link.download = downloadParam
            ? downloadParam.fileName
            : "downloadParam_problem.txt"; // Default download filename
          link.click();

          // Clean up the URL object after download
          window.URL.revokeObjectURL(fileURL);
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: error.response.data.message,
        });
        console.log(error);
        failed = true;
      }
      setOperating({
        failed: failed,
        loading: false,
      });
    };
    const deleteFile = async () => {
      setFile(undefined);
      onchange(undefined);
    };
    return (
      <ul className="gap-x-2 grid w-full grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_1fr_auto_1fr] items-center">
        <li className="font-bold text-[15px]">1.</li>
        <li className="rtl:text-lg-rtl ltr:text-lg-ltr font-semibold">
          {name}
        </li>
        <li className="flex items-center gap-x-2 rtl:text-lg-rtl ltr:text-lg-ltr font-semibold">
          {file ? (
            <Check className="size-[22px] text-green-500 rounded-sm" />
          ) : (
            <X className="size-[24px] text-red-500 rounded-full p-[2px]" />
          )}
          <h1 className="rtl:text-sm-rtl">{file?.name}</h1>
          {file && (
            <Trash2
              onClick={deleteFile}
              className="inline-block cursor-pointer text-red-500 size-[18px]"
            />
          )}
        </li>
        <li className="col-span-full sm:col-span-1">
          {operating.loading ? (
            <div className="relative bg-primary/10 h-[17px] rounded-md">
              <div
                style={{
                  width: `${progress.progress}%`,
                }}
                className="font-medium rounded-md bg-tertiary text-[14px] absolute w-full h-full flex justify-center items-center"
              >
                {progress.progress > 1 && <h1>{progress.progress}%</h1>}
              </div>
            </div>
          ) : (
            <>
              {operating.failed ? (
                <RotateCcw
                  onClick={download}
                  className="inline-block cursor-pointer min-h-[18px] min-w-[18px] size-[18px] text-red-500"
                />
              ) : file?.name ? (
                <ArrowDownToLine
                  onClick={download}
                  className="inline-block cursor-pointer min-h-[18px] min-w-[18px] size-[18px] text-primary/90"
                />
              ) : (
                <Label
                  htmlFor="initail_scan"
                  className={`w-fit rounded-full p-[2px] shadow-lg shadow-primary/30 hover:shadow transition-shadow bg-primary hover:opacity-90 cursor-pointer flex items-center gap-x-3 text-primary-foreground`}
                >
                  <input
                    onChange={onFileChange}
                    disabled={disabled}
                    {...rest}
                    ref={ref}
                    type="file"
                    id="initail_scan"
                    className={cn("hidden cursor-pointer", className)}
                  />

                  <ArrowUp className="size-[22px] text-white rounded-full p-[2px]" />
                </Label>
              )}
            </>
          )}
        </li>
      </ul>
    );
  }
);

export default CheckListChooser;
