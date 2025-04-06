import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "../components/mantine/navbar";

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <hr />
      <Outlet />
    </>
  ),
});
