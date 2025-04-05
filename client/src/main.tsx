import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { Chip, createTheme, FileInput, MantineProvider } from "@mantine/core";
import "./styles/index.css";
import "@mantine/core/styles.css";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <FileInput
          label="Input label"
          description="Input description"
          placeholder="Input placeholder"
        />
        <Chip defaultChecked>Awesome chip</Chip>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </MantineProvider>
    </StrictMode>
  );
}
