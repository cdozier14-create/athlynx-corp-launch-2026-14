import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import EarlyAccess from "@/pages/EarlyAccess";
import Portal from "@/pages/Portal";
import Messenger from "@/pages/Messenger";
import DiamondGrind from "@/pages/DiamondGrind";
import Pricing from "@/pages/Pricing";
import AIAgents from "@/pages/AIAgents";
import Music from "@/pages/Music";
import Marketplace from "@/pages/Marketplace";
import Stories from "@/pages/Stories";

function Router() {
  return (
    <Switch>
      <Route path="/" component={EarlyAccess} />
      <Route path="/early-access" component={EarlyAccess} />
      <Route path="/portal" component={Portal} />
      <Route path="/messenger" component={Messenger} />
      <Route path="/diamond-grind" component={DiamondGrind} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/ai" component={AIAgents} />
      <Route path="/ai-agents" component={AIAgents} />
      <Route path="/music" component={Music} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/stories" component={Stories} />
      <Route path="/reels" component={Stories} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
