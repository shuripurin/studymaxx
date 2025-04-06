import { createLazyFileRoute } from "@tanstack/react-router";
import Chat from "../components/chat";

export const Route = createLazyFileRoute("/ai_help")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Chat />
    </div>
  );
}
