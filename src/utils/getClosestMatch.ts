import { get as levenshtein } from "fast-levenshtein";

export default function getClosestMatch(
  haystack: string[],
  needle: string | string[]
) {
  let closestIndex = 0;
  let closestDistance = Infinity;

  const lowercaseHaystack = haystack.map((h) => h.toLowerCase());

  const lowercaseNeedle = Array.isArray(needle)
    ? needle.map((a) => a.toLowerCase())
    : [needle.toLowerCase()];

  lowercaseHaystack.forEach((str, index) => {
    let distance = Math.min(...lowercaseNeedle.map((n) => levenshtein(str, n)));

    if (distance < closestDistance) {
      closestIndex = index;
      closestDistance = distance;
    }
  });

  return haystack[closestIndex];
}
