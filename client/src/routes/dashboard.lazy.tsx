import { createLazyFileRoute } from "@tanstack/react-router";
import { LeaderBoard } from "../components/leaderboard";

export const Route = createLazyFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-row">
      <div>
        <div>LLM Content</div>
        <div>Benny</div>
      </div>
      <div>Google Calendar/Canva Interface</div>
      <LeaderBoard />
    </div>
  );
}
