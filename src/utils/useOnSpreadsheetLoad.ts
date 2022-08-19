import { useAtom } from "jotai";
import { useCallback } from "react";
import DevicesAtom, { convertRawDevicesTable } from "../atoms/DevicesAtom";
import RosterAtom, { convertRawRosterTable } from "../atoms/RosterAtom";
import SheetLastUploadedAtom from "../atoms/SheetLastUploadedAtom";
import { read as readXlsx, utils as xlsxUtils } from "xlsx";
import getClosestMatch from "./getClosestMatch";

export default function useOnSpreadsheetLoad() {
  const [, setRoster] = useAtom(RosterAtom);
  const [, setDevices] = useAtom(DevicesAtom);
  const [, setLastUploaded] = useAtom(SheetLastUploadedAtom);

  const onSpreadsheetLoad = useCallback(
    (buffer: string | ArrayBuffer | null | undefined) => {
      const isInvalid =
        buffer instanceof ArrayBuffer ? !buffer.byteLength : !buffer;

      if (isInvalid) {
        alert(
          "There was an error getting the information from the spreadsheet. Make sure that it is valid and try again."
        );
        return;
      }

      const workbook = readXlsx(buffer as ArrayBuffer);
      const sheetNames = Object.keys(workbook.Sheets);

      if (!sheetNames.length) {
        alert("There are no sheets in the spreadsheet.");
        return;
      }

      const possibleRosterSheetNames = [
        "Roster",
        "Roster Table",
        "Roster Database",
      ];

      const possibleDevicesSheetNames = [
        "RRM Devices Database",
        "Devices",
        "Devices Table",
        "RRM Devices Table",
      ];

      const rosterSheetName = getClosestMatch(
        workbook.SheetNames,
        possibleRosterSheetNames
      );

      const devicesSheetName = getClosestMatch(
        workbook.SheetNames,
        possibleDevicesSheetNames
      );

      const rawRoster = xlsxUtils.sheet_to_json(
        workbook.Sheets[rosterSheetName]
      ) as unknown as StringObject[];

      const rawDevices = xlsxUtils.sheet_to_json(
        workbook.Sheets[devicesSheetName]
      ) as unknown as StringObject[];

      setRoster(convertRawRosterTable(rawRoster));
      setDevices(convertRawDevicesTable(rawDevices));
      setLastUploaded(new Date());
    },
    [setLastUploaded, setRoster, setDevices]
  );

  return onSpreadsheetLoad;
}
