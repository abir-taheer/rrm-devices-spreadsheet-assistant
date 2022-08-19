import { ReactNode } from "react";

export default function FlexCenter({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>{children}</div>
    </div>
  );
}
