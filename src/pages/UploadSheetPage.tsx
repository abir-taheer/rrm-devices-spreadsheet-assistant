import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SpreadsheetUploadButton from "../comps/sheets/SpreadsheetUploadButton";
import FlexCenter from "../comps/ui/FlexCenter";

export default function UploadSheetPage() {
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const onComplete = () => {
    setSuccess(true);
    setTimeout(navigate, "/", 2000);
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        Upload a new version of the spreadsheet
      </h2>
      <FlexCenter>
        <SpreadsheetUploadButton onComplete={onComplete} />
      </FlexCenter>
      {success && (
        <p style={{ color: "#27ae60", textAlign: "center" }}>
          The new spreadsheet was successfully uploaded.
        </p>
      )}

      <br />
      <br />
      <p style={{ textAlign: "center" }}>Are things not working correctly?</p>
      <FlexCenter>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Reset App State
        </Button>
      </FlexCenter>
    </div>
  );
}
