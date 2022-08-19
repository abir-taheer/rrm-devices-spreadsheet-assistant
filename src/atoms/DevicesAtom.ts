import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";
import getClosestMatch from "../utils/getClosestMatch";

export type DeviceItem = {
  row: number;
  // Phone is a calculated field with any non numeric characters removed.
  phone: string;
  formattedPhone: string;

  phoneNumber?: string;
  fullName?: string;
  typeOfDevice?: string;
  unit?: string;
  serviceType?: string;
  comments?: string;
  historicalComments?: string;
};

export function convertRawDevicesTable(table: StringObject[]): DeviceItem[] {
  const columnsSet = new Set<string>();

  table.forEach((row) => {
    Object.keys(row).forEach((key) => {
      columnsSet.add(key.toString());
    });
  });

  const columns = Array.from(columnsSet).filter(Boolean);

  const columnKeyMap = {
    phone: getClosestMatch(columns, [
      "Phone",
      "Phone Number",
      "Mobile Phone",
      "Mobile Phone Number",
    ]),
    fullName: getClosestMatch(columns, "Full Name"),
    typeOfDevice: getClosestMatch(columns, "Type of Device"),
    unit: getClosestMatch(columns, "Unit"),
    serviceType: getClosestMatch(columns, "Service Type"),
    comments: getClosestMatch(columns, "Comments"),
    historicalComments: getClosestMatch(columns, "Historical Comments"),
  };

  return table.map((row, i) => {
    const phoneNumber = (row[columnKeyMap.phone] || "").toString();
    const phone = phoneNumber.replace(/[^0-9]/g, "");
    const formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    return {
      row: i + 2,
      phone,
      formattedPhone,
      phoneNumber,
      fullName: row[columnKeyMap.fullName],
      typeOfDevice: row[columnKeyMap.typeOfDevice],
      unit: row[columnKeyMap.unit],
      serviceType: row[columnKeyMap.serviceType],
      comments: row[columnKeyMap.comments],
      historicalComments: row[columnKeyMap.historicalComments],
    };
  });
}

const DevicesAtom = atomWithStorage<DeviceItem[]>("devices", []);

export default DevicesAtom;
