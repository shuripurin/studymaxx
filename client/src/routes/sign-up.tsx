import { createFileRoute } from "@tanstack/react-router";
import { SignUp } from "../components/mantine/signup";

export const Route = createFileRoute("/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignUp />
    </div>
  );
}
