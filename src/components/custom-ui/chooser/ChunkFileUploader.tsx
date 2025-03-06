import { CloudUpload } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";
import UploadButton from "@rpldy/upload-button";
import ChunkedUploady from "@rpldy/chunked-uploady";
import SimpleProgressBar from "./SimpleProgressBar";
import { cn } from "@/lib/utils";
export interface ChunkFileUploaderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requiredHint?: string;
  parentClassName?: string;
  errorMessage?: string;
  maxSize: number;
  validTypes: string[];
  disabled?: boolean;
  downloadParam?: { path: string; fileName: string };
  onComplete: (record: any) => Promise<void>;
  onStart: (file: File) => Promise<void>;
  url: string;
  uploadParam?: any;
  headers: any;
  icon?: any;
  inputFieldName: string;
}

const ChunkFileUploader = React.forwardRef<
  HTMLInputElement,
  ChunkFileUploaderProps
>((props, _ref: any) => {
  const {
    onComplete,
    onStart,
    url,
    headers,
    uploadParam,
    icon,
    inputFieldName,
    accept,
    className,
  } = props;
  const { t } = useTranslation();
  return (
    <ChunkedUploady
      withCredentials={true}
      method="POST"
      destination={{
        url: url,
        headers: headers,
        params: uploadParam,
      }}
      chunkSize={1400000}
      inputFieldName={inputFieldName}
      accept={accept}
    >
      <>
        <UploadButton
          text=""
          className={cn("flex items-center gap-x-4", className)}
        >
          <label className="flex flex-col items-center justify-center h-full py-3 transition-opacity duration-150 cursor-pointer hover:opacity-80">
            {icon ? (
              icon
            ) : (
              <CloudUpload className="size-[30px] bg-primary text-primary-foreground rounded-full p-[4px]" />
            )}
            <strong className=" ltr:text-lg-ltr rtl:text-lg-rtl font-medium text-primary-text">
              {t("select_a_file")}
            </strong>
          </label>
        </UploadButton>

        <SimpleProgressBar
          onStart={async (file: File) => {
            onStart(file);
          }}
          onFailed={async (failed: boolean) => {
            if (failed) {
            }
          }}
          onComplete={async (response: any) => {
            await onComplete(response);
          }}
          failedMessage={t("failed_to_upld")}
          cancelText={t("cancel")}
        />
      </>
    </ChunkedUploady>
  );
});

export default ChunkFileUploader;
