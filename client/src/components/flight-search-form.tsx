import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Plane, PlaneLanding, PlaneTakeoff, Settings, Globe, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFlightSearch } from "@/hooks/use-flight-search";
import type { FlightSearchParams } from "@/lib/types";
import DepartureDateSelector from "./departure-date-selector";
import DestinationSelector from "./destination-selector";
import DepartureSelector from "./departure-selector";

const formSchema = z.object({
  fromAirport: z.union([
    z.string().min(1, "Please select a departure location"),
    z.array(z.string()).min(1, "Please select at least one departure location")
  ]),
  toAirport: z.union([
    z.string().min(1, "Please select a destination").refine(
      (val) => val === "ANYWHERE" || val.length >= 1, 
      "Please select a destination"
    ),
    z.array(z.string()).min(1, "Please select at least one destination")
  ]),
  departureDate: z.string().min(1, "Please select a departure date"),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(9).default(1),
  filters: z.object({
    priceRange: z.array(z.number()).length(2).optional(),
    departureTime: z.array(z.string()).optional(),
    stops: z.string().optional(),
    maxDuration: z.array(z.number()).length(2).optional(),
    layoverDuration: z.array(z.string()).optional(),
  }).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface FlightSearchFormProps {
  onSearchComplete?: (results: any) => void;
}

export default function FlightSearchForm({ onSearchComplete }: FlightSearchFormProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { searchFlights, isLoading, results, error } = useFlightSearch();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit", // Only validate on submit
    defaultValues: {
      fromAirport: [],
      toAirport: [],
      departureDate: "",
      returnDate: "",
      passengers: 1,
      filters: {
        priceRange: [0, 2000],
        departureTime: ["night", "morning", "afternoon", "evening"],
        maxDuration: [0, 24],
        stops: "direct",
        layoverDuration: ["none", "8plus", "24plus", "48plus"],
      },
    },
  });

  const onSubmit = (values: FormData) => {
    // Handle both string and array values
    const fromAirports = Array.isArray(values.fromAirport) ? values.fromAirport : [values.fromAirport];
    const toAirports = Array.isArray(values.toAirport) ? values.toAirport : [values.toAirport];
    
    // Allow "ANYWHERE" as a valid destination to support "Explore everywhere"
    const isExploreEverywhere = toAirports.includes("ANYWHERE");
    
    const searchParams: FlightSearchParams = {
      fromAirport: fromAirports.map(airport => airport.toUpperCase()),
      toAirport: isExploreEverywhere ? "ANYWHERE" : toAirports.map(airport => airport.toUpperCase()),
      departureDate: values.departureDate,
      returnDate: values.returnDate || undefined,
      passengers: values.passengers,
      filters: {
        priceRange: values.filters?.priceRange as [number, number] | undefined,
        departureTime: values.filters?.departureTime,
        stops: values.filters?.stops,
        maxDuration: values.filters?.maxDuration as [number, number] | undefined,
        layoverDuration: values.filters?.layoverDuration,
      },
    };

    searchFlights(searchParams, {
      onSuccess: (data) => {
        onSearchComplete?.(data);
      },
    });
  };



  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-blue-700" />

      <div className="relative py-6 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Hack your next flight
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Use advanced filters to find smarter routes, better fares, and clever layovers others miss.
            </p>
          </div>

          <Card className="max-w-5xl mx-auto">
            <CardContent className="p-6 lg:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Main Search Fields */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="fromAirport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <FormControl>
                            <DepartureSelector
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Add departure"
                              label="From"
                              multiSelect={true}
                            />
                          </FormControl>
                          {form.formState.errors.fromAirport && form.formState.isSubmitted && (
                            <p className="text-sm text-red-600 mt-1">{form.formState.errors.fromAirport.message}</p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="toAirport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <FormControl>
                            <DestinationSelector
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Add destination"
                              label="To"
                              multiSelect={true}
                            />
                          </FormControl>
                          {form.formState.errors.toAirport && form.formState.isSubmitted && (
                            <p className="text-sm text-red-600 mt-1">{form.formState.errors.toAirport.message}</p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="departureDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure</FormLabel>
                          <FormControl>
                            <DepartureDateSelector
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Add date"
                            />
                          </FormControl>
                          {form.formState.errors.departureDate && form.formState.isSubmitted && (
                            <p className="text-sm text-red-600 mt-1">{form.formState.errors.departureDate.message}</p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="returnDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return (Optional)</FormLabel>
                          <FormControl>
                            <DepartureDateSelector
                              value={field.value || ""}
                              onChange={field.onChange}
                              placeholder="Add return date"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Advanced Filters Toggle */}
                  <div className="flex justify-end">
                    <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                      <CollapsibleTrigger asChild>
                        <Button type="button" variant="ghost" className="text-brand-blue">
                          <Settings className="h-4 w-4 mr-2" />
                          Advanced Filters
                        </Button>
                      </CollapsibleTrigger>
                    </Collapsible>
                  </div>

                  {/* Advanced Filters */}
                  <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                    <CollapsibleContent>
                      <Card className="bg-gray-50">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Price Range */}
                            <FormField
                              control={form.control}
                              name="filters.priceRange"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price Range</FormLabel>
                                  <FormControl>
                                    <div className="space-y-3">
                                      <div className="flex justify-between text-sm text-gray-600">
                                        <span>€{field.value?.[0] || 0}</span>
                                        <span>€{field.value?.[1] || 2000}</span>
                                      </div>
                                      <Slider
                                        value={field.value || [0, 2000]}
                                        onValueChange={field.onChange}
                                        max={2000}
                                        min={0}
                                        step={50}
                                        className="w-full"
                                      />
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>€0</span>
                                        <span>€2000</span>
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {/* Departure Time */}
                            <FormField
                              control={form.control}
                              name="filters.departureTime"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Departure Time</FormLabel>
                                  <FormControl>
                                    <div className="space-y-2">
                                      {[
                                        { value: "night", label: "Night (12AM - 6AM)" },
                                        { value: "morning", label: "Early Morning (6AM - 12PM)" },
                                        { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
                                        { value: "evening", label: "Evening (6PM - 12AM)" },
                                      ].map((time) => (
                                        <div key={time.value} className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={field.value?.includes(time.value)}
                                            onCheckedChange={(checked) => {
                                              const currentValue = field.value || [];
                                              if (checked) {
                                                field.onChange([...currentValue, time.value]);
                                              } else {
                                                field.onChange(currentValue.filter(v => v !== time.value));
                                              }
                                            }}
                                          />
                                          <Label className="text-sm text-gray-700">{time.label}</Label>
                                        </div>
                                      ))}
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {/* Number of Stops */}
                            <FormField
                              control={form.control}
                              name="filters.stops"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stops</FormLabel>
                                  <FormControl>
                                    <div className="space-y-2">
                                      {[
                                        { value: "direct", label: "Direct" },
                                        { value: "1-stop", label: "1 Stop" },
                                        { value: "2plus-stops", label: "2+ Stops" },
                                        { value: "any", label: "Any" },
                                      ].map((stop) => (
                                        <div key={stop.value} className="flex items-center space-x-2">
                                          <input
                                            type="radio"
                                            id={`stops-${stop.value}`}
                                            name="stops"
                                            value={stop.value}
                                            checked={field.value === stop.value}
                                            onChange={() => field.onChange(stop.value)}
                                            className="h-4 w-4 text-brand-blue border-gray-300 focus:ring-brand-blue"
                                          />
                                          <Label htmlFor={`stops-${stop.value}`} className="text-sm text-gray-700 cursor-pointer">{stop.label}</Label>
                                        </div>
                                      ))}
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {/* Flight Duration */}
                            <FormField
                              control={form.control}
                              name="filters.maxDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Flight Duration (hours)</FormLabel>
                                  <FormControl>
                                    <div className="space-y-3">
                                      <div className="flex justify-between text-sm text-gray-600">
                                        <span>{field.value?.[0] || 0}h</span>
                                        <span>{field.value?.[1] || 24}h</span>
                                      </div>
                                      <Slider
                                        value={field.value || [0, 24]}
                                        onValueChange={field.onChange}
                                        max={24}
                                        min={0}
                                        step={1}
                                        className="w-full"
                                      />
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>0h</span>
                                        <span>24h</span>
                                      </div>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {/* Layover Duration */}
                            <FormField
                              control={form.control}
                              name="filters.layoverDuration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Layover Options</FormLabel>
                                  <FormControl>
                                    <div className="space-y-2">
                                      {[
                                        { value: "none", label: "No layover" },
                                        { value: "8plus", label: "8+ hours" },
                                        { value: "24plus", label: "24+ hours" },
                                        { value: "48plus", label: "48+ hours" },
                                      ].map((layover) => (
                                        <div key={layover.value} className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={field.value?.includes(layover.value)}
                                            onCheckedChange={(checked) => {
                                              const currentValue = field.value || [];
                                              if (checked) {
                                                field.onChange([...currentValue, layover.value]);
                                              } else {
                                                field.onChange(currentValue.filter(v => v !== layover.value));
                                              }
                                            }}
                                          />
                                          <Label className="text-sm text-gray-700">{layover.label}</Label>
                                        </div>
                                      ))}
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Search Button */}
                  <div className="text-center">
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold px-12 py-4 text-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Plane className="h-5 w-5 mr-2" />
                          Search Flights
                        </>
                      )}
                    </Button>
                  </div>

                  {error && (
                    <div className="text-center text-red-600">
                      <p>Error: {error.message}</p>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}