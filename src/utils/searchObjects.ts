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
        const rawFieldValue = item[field] || "";
        const fieldVal = (rawFieldValue as string).toString().toLowerCase();

        if (!tolerence) {
          fieldVal.includes(word);
        }

        return levenshtein(fieldVal, word) <= tolerence;
      })
    )
  );
}
