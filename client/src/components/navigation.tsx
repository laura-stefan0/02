import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, User, Heart, MapPin, Plane } from "lucide-react";
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Plane className="h-8 w-8 text-brand-blue mr-2" />
              <h1 className="text-2xl font-bold text-brand-blue">
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
                  className={`px-3 py-2 rounded-md font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-brand-blue"
                      : "text-gray-600 hover:text-brand-blue"
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
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex items-center mb-8">
                  <Plane className="h-6 w-6 text-brand-blue mr-2" />
                  <span className="text-lg font-bold text-brand-blue">
                    FlightsHacked
                  </span>
                </div>
                <nav className="space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-2 rounded-md font-medium transition-colors ${
                        isActive(link.href)
                          ? "text-brand-blue bg-blue-50"
                          : "text-gray-600 hover:text-brand-blue hover:bg-gray-50"
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