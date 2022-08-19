import Button from "@mui/material/Button";
import { Component, ReactNode } from "react";
import FlexCenter from "../ui/FlexCenter";

type Props = {
  children: ReactNode;
};

type State = {
  error: null | Error;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo);

    this.setState({
      error,
    });
  }

  render() {
    const error = this.state.error;

    if (error) {
      // You can render any custom fallback UI
      return (
        <>
          <h1 style={{ textAlign: "center" }}>Error:</h1>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div>
              {Object.getOwnPropertyNames(error).map((key) => (
                <details key={key}>
                  <summary>{key}</summary>
                  <div
                    style={{
                      width: 800,
                      maxWidth: "90vw",
                      overflow: "auto",
                      border: "1px solid grey",
                      borderRadius: 10,
                    }}
                  >
                    <pre>
                      {typeof (error as any)[key] !== "object"
                        ? (error as any)[key].toString()
                        : JSON.stringify((error as any)[key], null, 2)}
                    </pre>
                  </div>
                  <br />

                  <FlexCenter>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = "/";
                      }}
                    >
                      Reset App State
                    </Button>
                  </FlexCenter>
                </details>
              ))}
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}
