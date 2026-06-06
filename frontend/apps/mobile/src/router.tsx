import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";

import { HomeRoute } from "./routes/HomeRoute";
import { MyTradesRoute } from "./routes/MyTradesRoute";
import { PostDetailRoute } from "./routes/PostDetailRoute";

const homeTabs = new Set(["home", "favorites", "chat", "my"]);
const tradeTabs = new Set(["requests", "sales", "received"]);

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search): { tab?: "home" | "favorites" | "chat" | "my" } => {
    const tab = typeof search.tab === "string" && homeTabs.has(search.tab)
      ? search.tab as "home" | "favorites" | "chat" | "my"
      : undefined;
    return tab ? { tab } : {};
  },
  component: HomeRoute,
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/posts/$postId",
  component: PostDetailRoute,
});

const myTradesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my/trades",
  validateSearch: (search): { tab?: "requests" | "sales" | "received" } => {
    const tab = typeof search.tab === "string" && tradeTabs.has(search.tab)
      ? search.tab as "requests" | "sales" | "received"
      : undefined;
    return tab ? { tab } : {};
  },
  component: MyTradesRoute,
});

const routeTree = rootRoute.addChildren([indexRoute, postDetailRoute, myTradesRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
