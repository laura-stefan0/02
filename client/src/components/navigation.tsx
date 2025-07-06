import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Terminal, Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Search", id: "search" },
    { href: "/deals", label: "Deals", id: "deals" },
    { href: "/layover-explorer", label: "Long Layovers", id: "layovers" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="bg-gray-900 shadow-lg border-b border-green-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Terminal className="h-8 w-8 text-green-400 mr-2 group-hover:text-green-300 transition-colors" />
              <h1 className="text-2xl font-bold text-green-400 font-mono group-hover:text-green-300 transition-colors">
                FlightsHacked
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`px-3 py-2 rounded-md font-medium font-mono transition-all hover:bg-green-500/10 border border-transparent hover:border-green-500/30 ${
                    isActive(link.href)
                      ? "text-green-400 bg-green-500/20 border-green-500/50"
                      : "text-gray-300 hover:text-green-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-green-400 hover:text-green-300 hover:bg-green-500/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-gray-900 border-green-500/30">
                <div className="flex items-center mb-8">
                  <Terminal className="h-6 w-6 text-green-400 mr-2" />
                  <span className="text-lg font-bold text-green-400 font-mono">
                    FlightsHacked
                  </span>
                </div>
                <nav className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 rounded-md font-medium font-mono transition-all border border-transparent ${
                        isActive(link.href)
                          ? "text-green-400 bg-green-500/20 border-green-500/50"
                          : "text-gray-300 hover:text-green-400 hover:bg-green-500/10 hover:border-green-500/30"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
