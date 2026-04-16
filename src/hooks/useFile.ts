import React from "react";

export default function useFile<T>(
  parentState: React.Dispatch<React.SetStateAction<T>>,
) {
  const [localFile, setLocalFile] = React.useState<{
    url: string;
    file: File | null;
  }>({
    url: "",
    file: null,
  });

  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (!files || !files.length) return;

    const file = files[0];

    const url = URL.createObjectURL(file);

    setLocalFile({ file, url });
    parentState((prev) => {
      return {
        ...prev,
        [name]: file,
      };
    });
  };

  const removeLocalFile = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
      fileRef.current.files = null;
    }

    setLocalFile({ url: "", file: null });
  };

  return { localFile, fileRef, handleLocalFile, removeLocalFile };
}
