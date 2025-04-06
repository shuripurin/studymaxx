import { createLazyFileRoute } from "@tanstack/react-router";
import { LeaderBoard } from "../components/leaderboard";
import { Skeleton } from "@mantine/core";

export const Route = createLazyFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-row gap-5 p-5">
      <div>
        <Skeleton visible={true} height={600} width={400}></Skeleton>
        <div>Benny Quote Here</div>
      </div>
      <div>
        <Skeleton visible={true} height={800} width={800}></Skeleton>
      </div>
      <LeaderBoard />
    </div>
  );
}
