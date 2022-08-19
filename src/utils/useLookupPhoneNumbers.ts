import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";
import DevicesIndexedByPhoneAtom from "../atoms/DevicesIndexedByPhoneAtom";
import RosterAtom from "../atoms/RosterAtom";
import RosterIndexedByFullNameAtom from "../atoms/RosterIndexedByFullNameAtom";
import searchObjects from "./searchObjects";

export default function useLookupPhoneNumbers() {
  const devicesByPhone = useAtomValue(DevicesIndexedByPhoneAtom);
  const rosterIndexedByFullName = useAtomValue(RosterIndexedByFullNameAtom);
  const [roster] = useAtom(RosterAtom);

  const lookupPhoneNumbers = useCallback(
    (phones: string[]) => {
      // Use the indexes to correlate between the input phone varaible and the matches
      const exactMatches = phones.map((phone) => devicesByPhone[phone]);
      const deviceMatches = exactMatches.filter(Boolean);

      const numbersWithoutDirectMatches = phones.filter(
        (phone, index) => !deviceMatches[index]
      );

      const rosterMatches = deviceMatches.map((match) => {
        if (!match.fullName) {
          return {
            exact: [],
            fuzzy: [],
          };
        }

        const exact = rosterIndexedByFullName[match.fullName] || [];

        const fuzzy = searchObjects(
          roster,
          ["firstName", "lastName"],
          match.fullName,
          1
        );

        return { exact, fuzzy };
      });

      const deviceMatchesWithoutExactRosterMatches = deviceMatches.filter(
        (match, index) => !rosterMatches[index].exact.length
      );

      const deviceMatchesWithoutFuzzyRosterMatches = deviceMatches.filter(
        (match, index) => !rosterMatches[index].fuzzy.length
      );

      const confidentDeviceAndRosterMatches = deviceMatches.filter(
        (match, index) =>
          rosterMatches[index].exact.length === 1 &&
          rosterMatches[index].fuzzy.length === 1
      );

      const phoneNumberDeviceMatchIndexMap: { [key: string]: number } = {};

      deviceMatches.forEach((match, index) => {
        phoneNumberDeviceMatchIndexMap[match?.phone] = index;
      });

      const workUnits = Array.from(
        new Set(
          confidentDeviceAndRosterMatches
            .map((match) => match?.unit)
            .filter(Boolean)
        )
      ) as string[];

      const confidentDeviceIndexWorkUnitMap: { [key: string]: number[] } = {};

      confidentDeviceAndRosterMatches.forEach((match, index) => {
        const unit = match.unit || "Unknown Work Unit";

        if (!confidentDeviceIndexWorkUnitMap[unit]) {
          confidentDeviceIndexWorkUnitMap[unit] = [];
        }

        confidentDeviceIndexWorkUnitMap[unit].push(
          phoneNumberDeviceMatchIndexMap[match.phone]
        );
      });

      const confidentMatchesGroupedByWorkUnit = workUnits.map((workUnit) => {
        return {
          workUnit,
          matches: confidentDeviceIndexWorkUnitMap[workUnit].map((index) => {
            return {
              device: deviceMatches[index],
              roster: rosterMatches[index],
            };
          }),
        };
      });

      return {
        numbersWithoutDirectMatches,
        deviceMatchesWithoutExactRosterMatches,
        deviceMatchesWithoutFuzzyRosterMatches,
        confidentMatchesGroupedByWorkUnit,
        rosterMatches,
      };
    },
    [devicesByPhone, rosterIndexedByFullName, roster]
  );

  return lookupPhoneNumbers;
}
