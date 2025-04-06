import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import "./styles/index.css";
import "@mantine/core/styles.css";
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./app/firebase";

const router = createRouter({ routeTree });

const theme = createTheme({
  /** Put your mantine theme override here */
});

const rootElement = document.getElementById("root")!;

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("logged in!");
  } else {
    console.log("No user");
  }
});

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </StrictMode>
  );
}
