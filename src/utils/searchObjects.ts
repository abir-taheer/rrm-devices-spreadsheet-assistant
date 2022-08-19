import { get as levenshtein } from "fast-levenshtein";

export default function searchObjects<Obj>(
  items: Obj[],
  fieldsToSearch: (keyof Obj)[],
  query: string,
  tolerence: number = 0
) {
  const words = Array.from(
    new Set(query.toLowerCase().split(/\s+/).filter(Boolean))
  );

  return items.filter((item) =>
    words.every((word) =>
      fieldsToSearch.some((field) => {
        if (!tolerence) {
          item[field]?.toString()?.toLowerCase().includes(word);
        }

        const str = item[field]?.toString()?.toLowerCase() || "";

        return levenshtein(str, word) <= tolerence;
      })
    )
  );
}
