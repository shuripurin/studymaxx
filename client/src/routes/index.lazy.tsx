import { createLazyFileRoute } from "@tanstack/react-router";
import { LeaderBoard } from "../components/leaderboard";
import DashEmbed from "../components/dashEmbed";
import Calendar from "../components/calendar";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-row gap-5 p-5">
      <div>
        <Calendar />
      </div>
      <DashEmbed />
      <LeaderBoard />
    </div>
  );
}
