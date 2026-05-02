import { FileField } from "@/src/interfaces/field.interface";
import Image from "next/image";
import { FaFileImage, FaTrash } from "react-icons/fa6";

const File = ({ file, fileRef, handleFile, removeFile }: FileField) => {
  return (
    <div className="w-full flex flex-col bg-neutral-200 p-2 rounded-lg items-center t:p-4">
      <div className="w-full flex flex-col gap-2 items-center justify-center  t:max-w-(--breakpoint-m-l)">
        <label
          htmlFor="icon"
          className="w-full flex h-full hover:cursor-pointer hover:brightness-90 transition-all"
        >
          <div
            className="p-2 rounded-md aspect-video w-full border-neutral-400 bg-secondary border-2 flex flex-col 
                            items-center justify-center bg-cover bg-center overflow-hidden"
          >
            {typeof file === "object" ? (
              <Image
                width={500}
                height={500}
                alt="File"
                src={file.url}
                className="w-6/12"
              />
            ) : typeof file === "string" && file !== "" ? (
              <Image
                width={500}
                height={500}
                alt="File"
                src={file}
                className="w-6/12"
              />
            ) : (
              <FaFileImage className="text-2xl opacity-50" />
            )}
          </div>

          <input
            onChange={(e) => handleFile(e)}
            ref={fileRef}
            id="icon"
            name="icon"
            type="file"
            className="fixed w-0 h-0 p-0 m-0"
            accept="image/*"
          />
        </label>

        <div className="w-full flex flex-row gap-4 text-sm items-center">
          {typeof file === "object" && file.file !== null ? (
            <>
              <p className="truncate w-full">{file.file.name}</p>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 rounded-full hover:text-danger transition-all"
              >
                <FaTrash />
              </button>
            </>
          ) : typeof file === "string" && file !== "" ? (
            <>
              <p className="truncate w-full">Uploaded File</p>
              <button
                type="button"
                onClick={removeFile}
                className="p-2 rounded-full hover:text-danger transition-all"
              >
                <FaTrash />
              </button>
            </>
          ) : (
            <p className="italic text-neutral-600">Select a photo...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default File;
