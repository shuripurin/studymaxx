import { Skeleton } from "@mantine/core";
import { createLazyFileRoute } from "@tanstack/react-router";
import { LeaderBoard } from "../components/leaderboard";
import DashEmbed from "../components/dashEmbed";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-row gap-5 p-5">
      <div>
        <Skeleton visible={true} height={600} width={400}></Skeleton>
        <div>Benny Quote Here</div>
      </div>
      <DashEmbed />
      <LeaderBoard />
    </div>
  );
}
