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
        ).filter((item) => !exact.some((i) => i.row === item.row));

        return { exact, fuzzy };
      });

      const phoneNumberDeviceMatchIndexMap: { [key: string]: number } = {};

      deviceMatches.forEach((match, index) => {
        phoneNumberDeviceMatchIndexMap[match?.phone] = index;
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
          rosterMatches[index].fuzzy.length === 0
      );

      const noConfidenceDeviceAndRosterMatches = deviceMatches.filter(
        (match, index) =>
          rosterMatches[index].exact.length !== 1 ||
          rosterMatches[index].fuzzy.length !== 0
      );

      const workUnits = Array.from(
        new Set(
          confidentDeviceAndRosterMatches
            .map((match) => match?.unit)
            .filter(Boolean)
        )
      ) as string[];

      const confidentDeviceIndexWorkUnitMap: { [key: string]: number[] } = {};
      const confidentDeviceIndexWorkLocationMap: { [key: string]: number[] } =
        {};

      const confidentDeviceIndexSupervisorMap: { [key: string]: number[] } = {};

      confidentDeviceAndRosterMatches.forEach((match, index) => {
        const unit = match.unit || "Unknown Work Unit";

        const matchesIndex = phoneNumberDeviceMatchIndexMap[match.phone];
        if (!confidentDeviceIndexWorkUnitMap[unit]) {
          confidentDeviceIndexWorkUnitMap[unit] = [];
        }

        confidentDeviceIndexWorkUnitMap[unit].push(matchesIndex);

        const rosterItem = rosterMatches[matchesIndex].exact[0];
        const location = rosterItem?.workLocation || "Unknown Work Location";
        if (!confidentDeviceIndexWorkLocationMap[location]) {
          confidentDeviceIndexWorkLocationMap[location] = [];
        }

        confidentDeviceIndexWorkLocationMap[location].push(matchesIndex);
        const supervisor = rosterItem?.supervisor || "Unknown Supervisor";

        if (!confidentDeviceIndexSupervisorMap[supervisor]) {
          confidentDeviceIndexSupervisorMap[supervisor] = [];
        }

        confidentDeviceIndexSupervisorMap[supervisor].push(matchesIndex);
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

      const workLocations = Array.from(
        new Set(
          confidentDeviceAndRosterMatches.map(
            (match) =>
              rosterMatches[phoneNumberDeviceMatchIndexMap[match.phone]]
                .exact[0].workLocation
          )
        )
      );

      const confidentMatchesGroupedByWorkLocation = workLocations.map(
        (workLocation) => {
          return {
            workLocation,
            matches: confidentDeviceIndexWorkLocationMap[
              workLocation || "Unknown Work Location"
            ].map((index) => {
              return {
                device: deviceMatches[index],
                roster: rosterMatches[index],
              };
            }),
          };
        }
      );
      const confidentMatchesGroupedBySupervisor = Object.keys(
        confidentDeviceIndexSupervisorMap
      ).map((supervisor) => {
        return {
          supervisor,
          matches: confidentDeviceIndexSupervisorMap[supervisor].map(
            (index) => {
              return {
                device: deviceMatches[index],
                roster: rosterMatches[index],
              };
            }
          ),
        };
      });

      const noConfidenceMatchesWithGuesses =
        noConfidenceDeviceAndRosterMatches.map((match, index) => ({
          device: match,
          roster: rosterMatches[phoneNumberDeviceMatchIndexMap[match.phone]],
        }));

      noConfidenceMatchesWithGuesses.sort(
        (a, b) =>
          a.device?.unit?.localeCompare(b.device?.unit || "") ||
          b.roster.exact.length - a.roster.exact.length ||
          b.roster.fuzzy.length - a.roster.fuzzy.length
      );

      return {
        numbersWithoutDirectMatches,
        deviceMatchesWithoutExactRosterMatches,
        deviceMatchesWithoutFuzzyRosterMatches,
        noConfidenceDeviceAndRosterMatches,

        confidentMatchesGroupedByWorkUnit,
        confidentMatchesGroupedByWorkLocation,
        confidentMatchesGroupedBySupervisor,
        noConfidenceMatchesWithGuesses,

        rosterMatches,
      };
    },
    [devicesByPhone, rosterIndexedByFullName, roster]
  );

  return lookupPhoneNumbers;
}
