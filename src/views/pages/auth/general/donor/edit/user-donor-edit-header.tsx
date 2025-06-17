import CachedImage from "@/components/custom-ui/image/CachedImage";
import IconButton from "@/components/custom-ui/button/IconButton";
import { MessageSquareText, Pencil, Trash2 } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { IDonorInformation } from "./user-donor-edit-page";
import { validateFile } from "@/lib/utils";

export interface UserEditHeaderProps {
  id: string | undefined;
  userData: IDonorInformation | undefined;
  failed: boolean;
  setUserData: Dispatch<SetStateAction<IDonorInformation | undefined>>;
  hasEdit?: boolean;
  hasRemove?: boolean;
}

export default function UserDonorEditHeader(props: UserEditHeaderProps) {
  const { id, userData, setUserData, failed, hasEdit, hasRemove } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    const validTypes: string[] = ["image/jpeg", "image/png", "image/jpg"];
    const fileInput = e.target;
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const checkFile = fileInput.files[0] as File;
    const file = validateFile(
      checkFile,
      Math.round(maxFileSize),
      validTypes,
      t
    );
    if (file) {
      if (loading) return;
      setLoading(true);
      // Update profile
      const formData = new FormData();
      if (id !== undefined) formData.append("id", id);
      formData.append("profile", file);
      try {
        const response = await axiosClient.post(
          "ngo/profile/picture-update",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == 200 && userData) {
          // Change logged in user data
          setUserData({
            ...userData,
            donorInformation: {
              ...userData.donorInformation,
              profile: response.data.profile,
            },
          });
          toast({
            toastType: "SUCCESS",
            title: t("success"),
            description: response.data.message,
          });
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: error.response.data.message,
        });
        console.log(error);
      } finally {
        setLoading(false);
      }
      /** Reset file input */
      if (e.currentTarget) {
        e.currentTarget.type = "text";
        e.currentTarget.type = "file"; // Reset to file type
      }
    }
  };
  const deleteProfilePicture = async () => {
    if (userData?.donorInformation?.profile == "") {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("no_img_selected"),
        duration: 3000,
      });
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosClient.delete("delete/profile-picture/");
      if (response.status == 200 && userData) {
        // Change logged in user data
        setUserData({
          ...userData,
          donorInformation: {
            ...userData.donorInformation,
            profile: undefined,
          },
        });
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="self-center text-center">
      <CachedImage
        src={userData?.donorInformation?.profile}
        alt="Avatar"
        shimmerClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
        className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
        routeIdentifier={"profile"}
      />
      {loading && (
        <NastranSpinner
          label={t("in_progress")}
          className="size-[14px] mt-2"
          labelclassname="text-primary/80 rtl:text-sm-rtl ltr:text-sm-ltr"
        />
      )}
      {userData && !failed && (
        <div className="flex self-center justify-center !mt-2 !mb-6 gap-x-4">
          {hasEdit && (
            <IconButton className="hover:bg-primary/20 transition-all text-primary">
              <label
                className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
              >
                <Pencil className={`size-[13px] pointer-events-none`} />
                <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>
                  {t("choose")}
                </h1>
                <input
                  type="file"
                  className={`block w-0 h-0`}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    onFileUploadChange(e);
                  }}
                />
              </label>
            </IconButton>
          )}
          {hasRemove && (
            <IconButton
              className="hover:bg-red-400/30 transition-all border-red-400/40 text-red-400"
              onClick={deleteProfilePicture}
            >
              <Trash2 className="size-[13px] pointer-events-none" />
              <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">{t("delete")}</h1>
            </IconButton>
          )}
        </div>
      )}

      <h1 className="text-primary uppercase font-semibold line-clamp-2 text-wrap rtl:text-2xl-rtl ltr:text-4xl-ltr max-w-64 truncate">
        {userData?.donorInformation?.username}
      </h1>
      <h1 className="leading-6 rtl:text-sm-rtl ltr:text-2xl-ltr max-w-64 truncate">
        {userData?.donorInformation?.email}
      </h1>
      <h1 dir="ltr" className="text-primary rtl:text-md-rtl ltr:text-xl-ltr">
        {userData?.donorInformation?.contact}
      </h1>
      <MessageSquareText className="size-[22px] cursor-pointer text-tertiary mx-auto mt-3" />
    </div>
  );
}
