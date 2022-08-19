import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6c5ce7",
      contrastText: "#fff",
    },
    secondary: {
      main: "#10ac84",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: `'Outfit', sans-serif`,
    fontSize: 16,
    h1: {
      fontSize: "2em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    h2: {
      fontSize: "1.5em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    h3: {
      fontSize: "1.17em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    h4: {
      fontSize: "1.1em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    h5: {
      fontSize: "1em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    h6: {
      fontSize: "1.1em",
      margin: "0.67em 0",
      fontWeight: "bold",
    },
    body1: {
      margin: "0.=em 0",
    },
  },
});

export default theme;
