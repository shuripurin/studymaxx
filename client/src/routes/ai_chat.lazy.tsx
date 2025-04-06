import { createLazyFileRoute } from "@tanstack/react-router";
import Chat from "../components/chat";

export const Route = createLazyFileRoute("/ai_chat")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Chat />
    </div>
  );
}
