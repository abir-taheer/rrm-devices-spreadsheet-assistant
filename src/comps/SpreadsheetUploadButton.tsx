import { useDropzone } from "react-dropzone";
import Button from "@mui/material/Button";
import useOnSpreadsheetLoad from "../utils/useOnSpreadsheetLoad";

const spreadsheetMimeTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "application/vnd.ms-excel.sheet.macroEnabled.12",
  "application/vnd.ms-excel.template.macroEnabled.12",
  "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
  "text/csv",
];

const accept = spreadsheetMimeTypes.reduce(
  (obj, mime) => Object.assign(obj, { [mime]: [] }),
  {}
);

const maxSize = 20 * 1024 * 1024; // 20MB

export default function SpreadsheetUploadButton() {
  const onFileReaderLoad = useOnSpreadsheetLoad();
  const { getRootProps, getInputProps, open } = useDropzone({
    accept,
    maxSize,
    onDrop: (accepted) => {
      if (!accepted.length) {
        alert("No valid files were uploaded.");
        return;
      }

      const [file] = accepted;
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (ev) => onFileReaderLoad(ev.target?.result);
    },
    multiple: false,
  });
  return (
    <>
      <div {...getRootProps()} style={{ display: "none" }}>
        <input {...getInputProps()} />
      </div>
      <Button onClick={() => open()}>Upload</Button>
    </>
  );
}
