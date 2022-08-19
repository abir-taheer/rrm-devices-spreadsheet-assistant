import { useEffect, useState } from "react";
import "./App.css";
import { useAtomValue } from "jotai";
import SpreadsheetUploadButton from "./comps/sheets/SpreadsheetUploadButton";
import SheetLastUploadedAtom from "./atoms/SheetLastUploadedAtom";
import LookupInput from "./comps/phone-lookup/PhoneLookupInput";
import RouteDefinitions from "./pages/_routes";
import TabNavigation from "./comps/navigation/TabNavigation";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import FlexCenter from "./comps/ui/FlexCenter";

function App() {
  const lastUploaded = useAtomValue(SheetLastUploadedAtom);
  const naviate = useNavigate();

  useEffect(() => {
    naviate("/upload");
  }, [lastUploaded]);

  return (
    <Container maxWidth="xl">
      <h1 style={{ textAlign: "center" }}>RRM Device Spreadsheet Assistant</h1>

      <p style={{ textAlign: "center" }}>
        The last time that the spreadsheet was uploaded was{" "}
        <span
          style={{
            color: lastUploaded ? "grey" : "red",
            fontWeight: "bold",
          }}
        >
          {lastUploaded
            ? new Intl.DateTimeFormat("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(lastUploaded)
            : "never"}
        </span>
      </p>

      {lastUploaded && lastUploaded?.getDate() !== new Date().getDate() && (
        <p style={{ textAlign: "center", fontWeight: "bold", color: "red" }}>
          The spreadsheet was last uploaded over a day ago. <br />
          You might want to upload it again to make sure the search results are
          accurate
        </p>
      )}

      {!!lastUploaded && (
        <>
          <TabNavigation />
          <FlexCenter>
            <hr style={{ width: 200, margin: 20 }} />
          </FlexCenter>
        </>
      )}

      <RouteDefinitions />
    </Container>
  );
}

export default App;
