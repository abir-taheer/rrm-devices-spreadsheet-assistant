import { atom } from "jotai";
import DevicesAtom, { DeviceItem } from "./DevicesAtom";

const DevicesIndexedByPhoneAtom = atom((get) => {
  console.log("recalculating devicePhoneIndex");

  const devices = get(DevicesAtom) as DeviceItem[];
  const phoneIndex: { [key: string]: DeviceItem } = {};

  devices.forEach((device) => {
    phoneIndex[device.phone] = device;
  });

  return phoneIndex;
});

export default DevicesIndexedByPhoneAtom;
