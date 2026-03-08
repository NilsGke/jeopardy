import { Outlet, createRootRoute } from "@tanstack/react-router";
import "../styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import NewVersionInfo from "@/components/NewVersionInfo";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RootProvider } from "@/providers/RootProvider";

export const Route = createRootRoute({
  component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RootProvider>
          <TooltipProvider>
            <Toaster />
            <NewVersionInfo />
            <div className="p-6 h-screen">
              <Outlet />
            </div>
          </TooltipProvider>
        </RootProvider>
      </QueryClientProvider>
      {/* <TanStackDevtools */}
      {/*   config={{ */}
      {/*     position: "bottom-right", */}
      {/*   }} */}
      {/*   plugins={[ */}
      {/*     { */}
      {/*       name: "TanStack Router", */}
      {/*       render: <TanStackRouterDevtoolsPanel />, */}
      {/*     }, */}
      {/*   ]} */}
      {/* /> */}
    </>
  );
}
