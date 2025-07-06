
import { useState, useRef, useEffect } from "react";
import { CalendarDays, X, Calendar, Clock, Infinity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, addDays, startOfMonth, endOfMonth, addMonths, isSameMonth } from "date-fns";

type DateSelectionMode = "specific" | "flexible" | "period" | "anytime";

interface DepartureDateSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DepartureDateSelector({ value, onChange, placeholder = "Add departure" }: DepartureDateSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<DateSelectionMode>("specific");
  const [selectedValue, setSelectedValue] = useState("");

  const handleModeChange = (mode: DateSelectionMode) => {
    setSelectedMode(mode);
    
    // Set default values based on mode
    switch (mode) {
      case "specific":
        const today = format(new Date(), "yyyy-MM-dd");
        setSelectedValue("Today");
        onChange(today);
        break;
      case "period":
        const weekendStart = format(addDays(new Date(), (6 - new Date().getDay()) % 7), "yyyy-MM-dd");
        const weekendEnd = format(addDays(new Date(), (7 - new Date().getDay()) % 7), "yyyy-MM-dd");
        setSelectedValue("This Weekend");
        onChange(`period:${weekendStart}:${weekendEnd}`);
        break;
      case "flexible":
        const monthStart = format(startOfMonth(new Date()), "yyyy-MM-dd");
        const monthEnd = format(endOfMonth(new Date()), "yyyy-MM-dd");
        setSelectedValue("This Month");
        onChange(`flexible:${monthStart}:${monthEnd}`);
        break;
      case "anytime":
        setSelectedValue("Anytime");
        onChange("anytime");
        break;
    }
  };

  const getDisplayValue = () => {
    if (selectedValue) return selectedValue;

    if (value) {
      // Handle different value formats
      if (value === "anytime") {
        return "Anytime";
      } else if (value.startsWith("flexible:")) {
        const [, startDate] = value.split(":");
        const date = new Date(startDate);
        return format(date, "MMMM yyyy");
      } else if (value.startsWith("period:")) {
        const [, startDate] = value.split(":");
        const date = new Date(startDate);
        const today = new Date();
        const daysDiff = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 0) return "Today";
        if (daysDiff === 1) return "Tomorrow";
        if (daysDiff >= 5 && daysDiff <= 7) return "This Weekend";
        if (daysDiff >= 7 && daysDiff <= 14) return "Next Week";

        return format(date, "MMM d, yyyy");
      } else {
        // Specific date
        const date = new Date(value);
        return format(date, "MMM d, yyyy");
      }
    }

    return "";
  };

  const handleOptionSelect = (option: { name: string; value: string }) => {
    setSelectedValue(option.name);
    onChange(option.value);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          value={getDisplayValue()}
          placeholder={placeholder}
          readOnly
          className={cn(
            "w-full h-12 pl-10 cursor-pointer",
            !getDisplayValue() && "text-muted-foreground"
          )}
        />
        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      <Tabs value={selectedMode} onValueChange={(value) => handleModeChange(value as DateSelectionMode)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="specific" className="text-xs">Date</TabsTrigger>
          <TabsTrigger value="period" className="text-xs">Period</TabsTrigger>
          <TabsTrigger value="flexible" className="text-xs">Month</TabsTrigger>
          <TabsTrigger value="anytime" className="text-xs">Anytime</TabsTrigger>
        </TabsList>

        <TabsContent value="specific" className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOptionSelect({ 
                name: "Today", 
                value: format(new Date(), "yyyy-MM-dd") 
              })}
              className="justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOptionSelect({ 
                name: "Tomorrow", 
                value: format(addDays(new Date(), 1), "yyyy-MM-dd") 
              })}
              className="justify-start"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Tomorrow
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="period" className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOptionSelect({ 
                name: "This Weekend", 
                value: `period:${format(addDays(new Date(), (6 - new Date().getDay()) % 7), "yyyy-MM-dd")}:${format(addDays(new Date(), (7 - new Date().getDay()) % 7), "yyyy-MM-dd")}`
              })}
              className="justify-start"
            >
              <Clock className="h-4 w-4 mr-2" />
              This Weekend
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOptionSelect({ 
                name: "Next Week", 
                value: `period:${format(addDays(new Date(), 7), "yyyy-MM-dd")}:${format(addDays(new Date(), 14), "yyyy-MM-dd")}`
              })}
              className="justify-start"
            >
              <Clock className="h-4 w-4 mr-2" />
              Next Week
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="flexible" className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOptionSelect({ 
                name: "This Month", 
                value: `flexible:${format(startOfMonth(new Date()), "yyyy-MM-dd")}:${format(endOfMonth(new Date()), "yyyy-MM-dd")}`
              })}
              className="justify-start"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              This Month
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOptionSelect({ 
                name: "Next Month", 
                value: `flexible:${format(startOfMonth(addMonths(new Date(), 1)), "yyyy-MM-dd")}:${format(endOfMonth(addMonths(new Date(), 1)), "yyyy-MM-dd")}`
              })}
              className="justify-start"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Next Month
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="anytime" className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOptionSelect({ name: "Anytime", value: "anytime" })}
            className="justify-start w-full"
          >
            <Infinity className="h-4 w-4 mr-2" />
            Anytime - Find the best deals
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
