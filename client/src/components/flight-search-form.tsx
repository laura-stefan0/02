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
  fromAirport: z.string().min(3, "Please enter departure airport"),
  toAirport: z.string().min(3, "Please enter destination airport"),
  departureDate: z.string().min(1, "Please select departure date"),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(9).default(1),
  filters: z.object({
    priceRange: z.array(z.number()).length(2).optional(),
    departureTime: z.array(z.string()).optional(),
    stops: z.array(z.string()).optional(),
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
    defaultValues: {
      fromAirport: "",
      toAirport: "",
      departureDate: "",
      returnDate: "",
      passengers: 1,
      filters: {
        priceRange: [0, 2000],
        departureTime: ["morning", "afternoon", "evening"],
        maxDuration: [0, 24],
        stops: ["direct", "1-stop", "2plus-stops"],
        layoverDuration: ["none", "short", "8plus", "24plus", "48plus"],
      },
    },
  });

  const onSubmit = (values: FormData) => {
    const searchParams: FlightSearchParams = {
      fromAirport: values.fromAirport.toUpperCase(),
      toAirport: values.toAirport.toUpperCase(),
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
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Find Your Perfect Flight
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover the best deals on flights worldwide with our smart search technology
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
                            />
                          </FormControl>
                          <FormMessage />
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
                            />
                          </FormControl>
                          <FormMessage />
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
                          <FormMessage />
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
                          <FormMessage />
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
                                      ].map((stop) => (
                                        <div key={stop.value} className="flex items-center space-x-2">
                                          <Checkbox
                                            checked={field.value?.includes(stop.value)}
                                            onCheckedChange={(checked) => {
                                              const currentValue = field.value || [];
                                              if (checked) {
                                                field.onChange([...currentValue, stop.value]);
                                              } else {
                                                field.onChange(currentValue.filter(v => v !== stop.value));
                                              }
                                            }}
                                          />
                                          <Label className="text-sm text-gray-700">{stop.label}</Label>
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
                                        { value: "short", label: "Less than 2 hours" },
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