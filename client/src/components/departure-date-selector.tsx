
import { useState, useRef, useEffect } from "react";
import { CalendarDays, X, Calendar, Clock, Infinity, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, addDays, startOfMonth, endOfMonth, addMonths, isSameMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isBefore } from "date-fns";

type DateSelectionMode = "specific" | "flexible" | "period" | "anytime";

interface DepartureDateSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DepartureDateSelector({ value, onChange, placeholder = "Add departure" }: DepartureDateSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<DateSelectionMode>("specific");
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);

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
    setIsOpen(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    const displayName = isToday(date) ? "Today" : format(date, "MMM d, yyyy");
    setSelectedValue(displayName);
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleMonthToggle = (monthKey: string) => {
    setSelectedMonths(prev => 
      prev.includes(monthKey) 
        ? prev.filter(m => m !== monthKey)
        : [...prev, monthKey]
    );
  };

  const applyMonthSelection = () => {
    if (selectedMonths.length === 0) return;
    
    const monthNames = selectedMonths.map(key => {
      const [year, month] = key.split('-');
      return format(new Date(parseInt(year), parseInt(month)), "MMM yyyy");
    }).join(", ");
    
    setSelectedValue(selectedMonths.length === 1 ? monthNames : `${selectedMonths.length} months selected`);
    onChange(`flexible:months:${selectedMonths.join(',')}`);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    
    // Header
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelectedDay = selectedDate && isSameDay(day, selectedDate);
        const isPastDate = isBefore(day, new Date()) && !isToday(day);
        
        days.push(
          <div
            key={day.toString()}
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center text-sm cursor-pointer transition-colors",
              isCurrentMonth ? "text-gray-900" : "text-gray-300",
              isSelectedDay && "bg-brand-blue text-white",
              isToday(day) && !isSelectedDay && "bg-gray-100 font-semibold",
              isPastDate && "opacity-50 cursor-not-allowed",
              !isPastDate && !isSelectedDay && isCurrentMonth && "hover:bg-gray-100"
            )}
            onClick={() => !isPastDate && handleDateSelect(cloneDay)}
          >
            {format(day, dateFormat)}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="h-9 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="space-y-1">
          {rows}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const currentYear = new Date().getFullYear();
    const months = [];
    
    for (let i = 0; i < 12; i++) {
      const month = new Date(currentYear, i);
      const monthKey = `${currentYear}-${i}`;
      const isSelected = selectedMonths.includes(monthKey);
      const isPast = isBefore(endOfMonth(month), new Date());
      
      months.push(
        <Button
          key={monthKey}
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className={cn(
            "h-16 text-xs",
            isSelected && "bg-brand-blue text-white",
            isPast && "opacity-50"
          )}
          onClick={() => !isPast && handleMonthToggle(monthKey)}
        >
          {format(month, "MMM")}
        </Button>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{currentYear}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={applyMonthSelection}
            disabled={selectedMonths.length === 0}
          >
            Apply ({selectedMonths.length})
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months}
        </div>
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="start">
        <Tabs value={selectedMode} onValueChange={(value) => handleModeChange(value as DateSelectionMode)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 m-2">
            <TabsTrigger value="specific" className="text-xs">Date</TabsTrigger>
            <TabsTrigger value="period" className="text-xs">Period</TabsTrigger>
            <TabsTrigger value="flexible" className="text-xs">Month</TabsTrigger>
            <TabsTrigger value="anytime" className="text-xs">Anytime</TabsTrigger>
          </TabsList>

          <div className="p-4">
            <TabsContent value="specific" className="space-y-4 mt-0">
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
              {renderCalendar()}
            </TabsContent>

            <TabsContent value="period" className="space-y-4 mt-0">
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
                    name: "Next 7 Days", 
                    value: `period:${format(new Date(), "yyyy-MM-dd")}:${format(addDays(new Date(), 7), "yyyy-MM-dd")}`
                  })}
                  className="justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Next 7 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOptionSelect({ 
                    name: "Next 30 Days", 
                    value: `period:${format(new Date(), "yyyy-MM-dd")}:${format(addDays(new Date(), 30), "yyyy-MM-dd")}`
                  })}
                  className="justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Next 30 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOptionSelect({ 
                    name: "Next 90 Days", 
                    value: `period:${format(new Date(), "yyyy-MM-dd")}:${format(addDays(new Date(), 90), "yyyy-MM-dd")}`
                  })}
                  className="justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Next 90 Days
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOptionSelect({ 
                    name: "Next 180 Days", 
                    value: `period:${format(new Date(), "yyyy-MM-dd")}:${format(addDays(new Date(), 180), "yyyy-MM-dd")}`
                  })}
                  className="justify-start"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Next 180 Days
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="flexible" className="space-y-4 mt-0">
              <div className="grid grid-cols-1 gap-2 mb-4">
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
              <hr className="my-3" />
              <div>
                <p className="text-sm font-medium mb-3">Select Multiple Months:</p>
                {renderYearView()}
              </div>
            </TabsContent>

            <TabsContent value="anytime" className="space-y-2 mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOptionSelect({ name: "Anytime", value: "anytime" })}
                className="justify-start w-full"
              >
                <Infinity className="h-4 w-4 mr-2" />
                Anytime - Find the best deals
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Search across all dates to find the lowest prices available.
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
