import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import theme from "./theme";

type Props = {
  children: ReactNode;
};

export const muiCache = createCache({
  key: "mui",
  prepend: true,
});

export default function MuiThemeProvider({ children }: Props) {
  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
