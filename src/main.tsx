import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import "./index.css";
import MuiThemeProvider from "./theme/MuiThemeProvider";
import ErrorBoundary from "./comps/error/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MuiThemeProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </MuiThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
