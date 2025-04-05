import { createLazyFileRoute } from "@tanstack/react-router";
import { FriendsList } from "../components/friendlist";

export const Route = createLazyFileRoute("/friends")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <FriendsList />
    </div>
  );
}
