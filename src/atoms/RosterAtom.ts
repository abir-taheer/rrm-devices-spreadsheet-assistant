import { atomWithStorage } from "jotai/utils";
import getClosestMatch from "../utils/getClosestMatch";

export type RosterItem = {
  row: number;
  workLocation?: string;
  pms?: string;
  lastName?: string;
  firstName?: string;

  // Calculated field
  fullName: string;

  title?: string;
  level?: string;
  employeeType?: string;
  titleEntryDate?: string;
  title2?: string;
  title2EntryDate?: string;
  civilServiceDate?: string;
  cityStartDate?: string;
  dotStartDate?: string;
  salary?: string;
  budgetCode?: string;
  workUnitCode?: string;
  workPhoneNumber?: string;
  workCellPhoneNumber?: string;
  workFaxNumber?: string;
  supervisor?: string;
};

export function convertRawRosterTable(table: StringObject[]): RosterItem[] {
  const columnsSet = new Set<string>();

  table.forEach((row) => {
    Object.keys(row).forEach((key) => {
      columnsSet.add(key.toString());
    });
  });

  const columns = Array.from(columnsSet).filter(Boolean);

  const columnNames = {
    workLocation: getClosestMatch(columns, "Work Location"),
    pms: getClosestMatch(columns, "PMS"),
    lastName: getClosestMatch(columns, "Last Name"),
    firstName: getClosestMatch(columns, "First Name"),
    title: getClosestMatch(columns, "Title"),
    level: getClosestMatch(columns, "Level"),
    employeeType: getClosestMatch(columns, "Employee Type"),
    titleEntryDate: getClosestMatch(columns, "Title Entry Date"),
    title2: getClosestMatch(columns, "Title 2"),
    title2EntryDate: getClosestMatch(columns, "Title 2 Entry Date"),
    civilServiceDate: getClosestMatch(columns, "Civil Service Date"),
    cityStartDate: getClosestMatch(columns, "City Start Date"),
    dotStartDate: getClosestMatch(columns, "DOT Start Date"),
    salary: getClosestMatch(columns, "Salary"),
    budgetCode: getClosestMatch(columns, "Budget Code"),
    workUnitCode: getClosestMatch(columns, "Work Unit Code"),
    workPhoneNumber: getClosestMatch(columns, "Work Phone Number"),
    workCellPhoneNumber: getClosestMatch(columns, "Work Cell Phone Number"),
    workFaxNumber: getClosestMatch(columns, "Work Fax Number"),
    supervisor: getClosestMatch(columns, "Supervisor"),
  };

  // We're getting the closest match instead  of using exact values because the spreadsheet is subject to change
  // This helps ensure the app still works even if the headers change slightly
  return table.map((row, i) => {
    const firstName = row[columnNames.firstName];
    const lastName = row[columnNames.lastName];

    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    return {
      row: i + 2,
      workLocation: row[columnNames.workLocation],
      pms: row[columnNames.pms],
      lastName,
      firstName,
      fullName,
      title: row[columnNames.title],
      level: row[columnNames.level],
      employeeType: row[columnNames.employeeType],
      titleEntryDate: row[columnNames.titleEntryDate],
      title2: row[columnNames.title2],
      title2EntryDate: row[columnNames.title2EntryDate],
      civilServiceDate: row[columnNames.civilServiceDate],
      cityStartDate: row[columnNames.cityStartDate],
      dotStartDate: row[columnNames.dotStartDate],
      salary: row[columnNames.salary],
      budgetCode: row[columnNames.budgetCode],
      workUnitCode: row[columnNames.workUnitCode],
      workPhoneNumber: row[columnNames.workPhoneNumber],
      workCellPhoneNumber: row[columnNames.workCellPhoneNumber],
      workFaxNumber: row[columnNames.workFaxNumber],
      supervisor: row[columnNames.supervisor],
    };
  });
}

const RosterAtom = atomWithStorage<RosterItem[]>("roster", []);

export default RosterAtom;
