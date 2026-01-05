import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import EarlyAccess from "@/pages/EarlyAccess";

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={EarlyAccess} />
        <Route path="/early-access" component={EarlyAccess} />
        <Route>
          <EarlyAccess />
        </Route>
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
