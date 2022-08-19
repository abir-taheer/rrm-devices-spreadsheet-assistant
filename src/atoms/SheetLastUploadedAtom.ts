import { atom } from "jotai";

const _internalLastUploadedAtom = atom<Date | null>(
  localStorage.getItem("sheetLastUploaded")
    ? new Date(localStorage.getItem("sheetLastUploaded") || "")
    : null
);

const SheetLastUploadedAtom = atom(
  (get) => get(_internalLastUploadedAtom),
  (get, set, newDate: Date) => {
    set(_internalLastUploadedAtom, newDate);
    localStorage.setItem("sheetLastUploaded", newDate.toISOString());
  }
);

export default SheetLastUploadedAtom;
