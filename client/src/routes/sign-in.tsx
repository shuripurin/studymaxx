import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "../components/mantine/signin";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignIn />
    </div>
  );
}
