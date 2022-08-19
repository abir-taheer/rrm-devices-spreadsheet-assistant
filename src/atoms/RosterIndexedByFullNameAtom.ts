import { atom } from "jotai";
import RosterAtom, { RosterItem } from "./RosterAtom";

const RosterIndexedByFullNameAtom = atom((get) => {
  const roster = get(RosterAtom) as RosterItem[];

  const rosterIndex: { [key: string]: RosterItem[] } = {};

  roster.forEach((row) => {
    if (!rosterIndex[row.fullName]) {
      rosterIndex[row.fullName] = [];
    }

    rosterIndex[row.fullName].push(row);
  });

  return rosterIndex;
});

export default RosterIndexedByFullNameAtom;
