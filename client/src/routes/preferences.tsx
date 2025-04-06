import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/preferences")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      preferbes
    </div>
  );
}
