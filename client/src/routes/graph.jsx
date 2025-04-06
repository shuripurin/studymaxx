import { createFileRoute } from "@tanstack/react-router";
import { LayoutFlowWithProvider } from "../components/reactFlow/layoutFlow";

export const Route = createFileRoute("/graph")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LayoutFlowWithProvider />
    </div>
  );
}
