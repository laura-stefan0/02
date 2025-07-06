import { useState } from "react";
import { Calendar, ChevronDown, Clock, CalendarDays, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, addDays, addMonths, startOfMonth, endOfMonth } from "date-fns";

type DateSelectionMode = "specific" | "flexible" | "period" | "anytime";

interface DepartureDateSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DepartureDateSelector({ value, onChange, placeholder = "Add date" }: DepartureDateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<DateSelectionMode>("specific");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value ? new Date(value) : undefined);
  const [flexibleMonth, setFlexibleMonth] = useState<Date>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");

  const handleSpecificDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onChange(format(date, "yyyy-MM-dd"));
      setIsOpen(false);
    }
  };

  const handleFlexibleMonthSelect = (month: Date) => {
    setFlexibleMonth(month);
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    onChange(`flexible:${format(startDate, "yyyy-MM-dd")}:${format(endDate, "yyyy-MM-dd")}`);
    setIsOpen(false);
  };

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    const startDate = new Date();
    const endDate = addDays(startDate, parseInt(period));
    onChange(`period:${format(startDate, "yyyy-MM-dd")}:${format(endDate, "yyyy-MM-dd")}`);
    setIsOpen(false);
  };

  const handleAnytimeSelect = () => {
    onChange("anytime");
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder;
    
    if (value === "anytime") return "Anytime";
    
    if (value.startsWith("flexible:")) {
      const [, start] = value.split(":");
      return `Flexible - ${format(new Date(start), "MMM yyyy")}`;
    }
    
    if (value.startsWith("period:")) {
      const days = selectedPeriod;
      return `Next ${days} days`;
    }
    
    return format(new Date(value), "EEE, dd MMM");
  };

  const renderMonthGrid = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const month = addMonths(new Date(), i);
      months.push(month);
    }

    return (
      <div className="grid grid-cols-3 gap-2 p-4">
        {months.map((month) => (
          <Button
            key={month.getTime()}
            variant="outline"
            size="sm"
            onClick={() => handleFlexibleMonthSelect(month)}
            className={cn(
              "h-12 flex flex-col items-center justify-center",
              format(month, "yyyy-MM") === format(flexibleMonth, "yyyy-MM") && "bg-blue-50 border-blue-200"
            )}
          >
            <span className="text-xs font-medium">{format(month, "MMM")}</span>
            <span className="text-xs text-gray-500">{format(month, "yyyy")}</span>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal h-12",
            !value && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            {getDisplayValue()}
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b">
          <RadioGroup 
            value={mode} 
            onValueChange={(value: DateSelectionMode) => setMode(value)}
            className="p-3 space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="specific" />
              <Label htmlFor="specific" className="font-medium">Specific date</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flexible" id="flexible" />
              <Label htmlFor="flexible" className="font-medium">Flexible dates</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="period" id="period" />
              <Label htmlFor="period" className="font-medium">Next period</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="anytime" id="anytime" />
              <Label htmlFor="anytime" className="font-medium">Anytime</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="p-0">
          {mode === "specific" && (
            <div className="p-3">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleSpecificDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
                className="w-full"
              />
            </div>
          )}

          {mode === "flexible" && (
            <div>
              <div className="p-3 border-b">
                <Label className="text-sm font-medium text-gray-700">
                  Choose a month for flexible travel
                </Label>
              </div>
              {renderMonthGrid()}
            </div>
          )}

          {mode === "period" && (
            <div className="p-4 space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                Select time period
              </Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Next 7 days</SelectItem>
                  <SelectItem value="14">Next 2 weeks</SelectItem>
                  <SelectItem value="30">Next 30 days</SelectItem>
                  <SelectItem value="60">Next 2 months</SelectItem>
                  <SelectItem value="90">Next 3 months</SelectItem>
                  <SelectItem value="180">Next 6 months</SelectItem>
                  <SelectItem value="365">Next year</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => handlePeriodSelect(selectedPeriod)}
                className="w-full"
              >
                <Clock className="h-4 w-4 mr-2" />
                Select Next {selectedPeriod} Days
              </Button>
            </div>
          )}

          {mode === "anytime" && (
            <div className="p-4 space-y-4">
              <div className="text-center space-y-2">
                <Infinity className="h-8 w-8 mx-auto text-blue-500" />
                <div>
                  <p className="font-medium">Travel anytime</p>
                  <p className="text-sm text-gray-500">Find the best deals across all dates</p>
                </div>
              </div>
              <Button 
                onClick={handleAnytimeSelect}
                className="w-full"
              >
                <Infinity className="h-4 w-4 mr-2" />
                Select Anytime
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}