import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";

import { useAtomValue } from "jotai";
import DevicesIndexedByPhoneAtom from "../atoms/DevicesIndexedByPhoneAtom";
import { DeviceItem } from "../atoms/DevicesAtom";
import useLookupPhoneNumbers from "../utils/useLookupPhoneNumbers";

export default function LookupInput() {
  const [value, setValue] = useState("");
  const devicesByPhone = useAtomValue(DevicesIndexedByPhoneAtom);
  const lookupPhoneNumbers = useLookupPhoneNumbers();
  const [results, setResults] = useState<{
    [key: string]: (DeviceItem | string)[];
  }>({});

  const onLookup = () => {
    const numbers = value.split("\n");

    console.log(lookupPhoneNumbers(numbers));
  };

  return (
    <div>
      <TextField
        multiline
        value={value}
        onChange={(ev) => setValue(ev.target.value.replace(/[^0-9\n]/g, ""))}
        rows={4}
        fullWidth
        label={"Enter numbers"}
      />
      <Button onClick={() => onLookup()}>Lookup</Button>

      <br />

      <div>
        {Object.keys(results).map((unit) => (
          <div key={unit}>
            <h3>{unit}</h3>
            {results[unit].map((device) => (
              <div key={typeof device === "string" ? device : device.phone}>
                {/* Render the device item as a table */}
                {typeof device === "string" ? (
                  <div>{device}</div>
                ) : (
                  <p>
                    {device.phoneNumber} - {device.fullName}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
