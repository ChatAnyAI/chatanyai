import * as React from 'react';

import { z } from 'zod';
import {ApiDriveUpload, DriveCreateResponse} from "@/service/api";


interface UseUploadFileProps {
  onUploadComplete?: (file: DriveCreateResponse) => void;
  onUploadError?: (error: unknown) => void;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  ...props
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<DriveCreateResponse>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadThing(file: File) {
    setIsUploading(true);
    setUploadingFile(file);
    try {
      const res = await ApiDriveUpload(file)
      setUploadedFile(res);
      onUploadComplete?.(res);
      return uploadedFile;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      onUploadError?.(error);
      return null
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadFile: uploadThing,
    uploadedFile,
    uploadingFile,
  };
}

// export const { uploadFiles, useUploadThing } =
//   generateReactHelpers<OurFileRouter>();

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });

    return errors.join('\n');
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

// export function showErrorToast(err: unknown) {
//   const errorMessage = getErrorMessage(err);
//
//   return toast.error(errorMessage);
// }
