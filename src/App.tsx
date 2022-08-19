import { useState } from "react";
import "./App.css";
import { useAtomValue } from "jotai";
import SpreadsheetUploadButton from "./comps/SpreadsheetUploadButton";
import SheetLastUploadedAtom from "./atoms/SheetLastUploadedAtom";
import LookupInput from "./comps/LookupInput";

function App() {
  const lastUploaded = useAtomValue(SheetLastUploadedAtom);

  return (
    <div>
      <SpreadsheetUploadButton />
      <p>The sheet was last uploaded {lastUploaded?.toString()}</p>

      <LookupInput />
    </div>
  );
}

export default App;
