import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";

import { useAtom } from "jotai";
import PhoneLookupSearchValueAtom from "../../atoms/PhoneLookupSearchValueAtom";

export default function PhoneLookupInput() {
  const [searchVal, setPhoneLookupSearchValue] = useAtom(
    PhoneLookupSearchValueAtom
  );
  const [value, setValue] = useState(searchVal?.join("\n") || "");

  const onLookup = () => {
    const numbers = value
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);
    setPhoneLookupSearchValue(numbers);
  };

  return (
    <div>
      <TextField
        multiline
        value={value}
        onChange={(ev) => setValue(ev.target.value.replace(/[^0-9\n]/g, ""))}
        rows={10}
        fullWidth
        label={"Enter numbers"}
      />
      <Button
        onClick={() => onLookup()}
        variant="contained"
        sx={{ margin: "20px 0" }}
      >
        Lookup
      </Button>
    </div>
  );
}
