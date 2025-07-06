import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import Deals from "@/pages/deals";
import LayoverExplorer from "@/pages/layover-explorer";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/deals" component={Deals} />
      <Route path="/layover-explorer" component={LayoverExplorer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <Router />
          </main>
          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-2xl font-bold text-brand-blue mb-4">
                    FlightsHacked
                  </h3>
                  <p className="text-gray-300 mb-6 max-w-md">
                    Your smart flight search companion. Find the best deals, explore new destinations, and make every journey memorable.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Explore</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/" className="hover:text-white transition-colors">Flight Search</a></li>
                    <li><a href="/deals" className="hover:text-white transition-colors">Best Deals</a></li>
                    <li><a href="/layover-explorer" className="hover:text-white transition-colors">Long Layovers</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 FlightsHacked. Made with ❤️ for travelers worldwide.</p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
