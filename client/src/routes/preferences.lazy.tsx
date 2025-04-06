import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/preferences')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/preferences"!</div>
}
