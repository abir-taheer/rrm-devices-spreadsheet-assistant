import { HashRouter, Route, Routes } from "react-router-dom";
import AnalyzeSpreadsheetPage from "./AnalyzeSpreadsheetPage";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import PhoneLookupPage from "./PhoneLookupPage";
import SearchEverywherePage from "./SearchEverywherePage";
import UploadSheetPage from "./UploadSheetPage";

export default function RouteDefinitions() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<UploadSheetPage />} />
      <Route path="/analyze-spreadsheet" element={<AnalyzeSpreadsheetPage />} />
      <Route path="/phone-lookup" element={<PhoneLookupPage />} />
      <Route path="/search-everywhere" element={<SearchEverywherePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
