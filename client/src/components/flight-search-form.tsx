import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Plane, PlaneLanding, PlaneTakeoff, Settings, Globe, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFlightSearch } from "@/hooks/use-flight-search";
import type { FlightSearchParams } from "@/lib/types";

const formSchema = z.object({
  fromAirport: z.string().min(3, "Please enter departure airport"),
  toAirport: z.string().min(3, "Please enter destination airport"),
  departureDate: z.string().min(1, "Please select departure date"),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(9).default(1),
  filters: z.object({
    priceRange: z.array(z.number()).length(2).optional(),
    departureTime: z.array(z.string()).optional(),
    stops: z.enum(["direct", "1-stop", "2plus-stops"]).optional(),
    airlines: z.array(z.string()).optional(),
    maxDuration: z.number().optional(),
    layoverDuration: z.enum(["short", "long"]).optional(),
  }).optional(),
});

interface FlightSearchFormProps {
  onSearchComplete?: (results: any) => void;
}

export default function FlightSearchForm({ onSearchComplete }: FlightSearchFormProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { searchFlights, isLoading, results, error } = useFlightSearch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAirport: "",
      toAirport: "",
      departureDate: "",
      returnDate: "",
      passengers: 1,
      filters: {
        priceRange: [0, 2000],
        departureTime: [],
        maxDuration: 24,
      },
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const searchParams: FlightSearchParams = {
      fromAirport: values.fromAirport.toUpperCase(),
      toAirport: values.toAirport.toUpperCase(),
      departureDate: values.departureDate,
      returnDate: values.returnDate || undefined,
      passengers: values.passengers,
      filters: values.filters,
    };

    searchFlights(searchParams, {
      onSuccess: (data) => {
        onSearchComplete?.(data);
      },
    });
  };

  const setAnytime = () => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    form.setValue("departureDate", nextMonth.toISOString().split('T')[0]);
  };

  const setAnywhere = () => {
    form.setValue("toAirport", "ANY");
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
                            <div className="relative">
                              <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input 
                                placeholder="Venice (VCE)" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
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
                            <div className="relative">
                              <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input 
                                placeholder="Anywhere" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
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
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input 
                                type="date" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
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
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <Input 
                                type="date" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Search Options */}
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex flex-wrap gap-3 mb-4 lg:mb-0">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={setAnytime}
                        className="text-brand-blue border-brand-blue hover:bg-blue-50"
                      >
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Anytime
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={setAnywhere}
                        className="text-brand-blue border-brand-blue hover:bg-blue-50"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Anywhere
                      </Button>
                    </div>
                    
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
                                    <div className="px-3">
                                      <Slider
                                        min={0}
                                        max={2000}
                                        step={50}
                                        value={field.value || [0, 2000]}
                                        onValueChange={field.onChange}
                                        className="w-full"
                                      />
                                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                                        <span>€{field.value?.[0] || 0}</span>
                                        <span>€{field.value?.[1] || 2000}+</span>
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
                                          <label className="text-sm text-gray-700">{time.label}</label>
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
                                    <RadioGroup 
                                      value={field.value} 
                                      onValueChange={field.onChange}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="direct" id="direct" />
                                        <Label htmlFor="direct">Direct</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="1-stop" id="1-stop" />
                                        <Label htmlFor="1-stop">1 Stop</Label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="2plus-stops" id="2plus-stops" />
                                        <Label htmlFor="2plus-stops">2+ Stops</Label>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            {/* Airlines */}
                            <FormField
                              control={form.control}
                              name="filters.airlines"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Preferred Airlines</FormLabel>
                                  <FormControl>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select airlines" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="lufthansa">Lufthansa</SelectItem>
                                        <SelectItem value="emirates">Emirates</SelectItem>
                                        <SelectItem value="british-airways">British Airways</SelectItem>
                                        <SelectItem value="air-france">Air France</SelectItem>
                                      </SelectContent>
                                    </Select>
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
                                  <FormLabel>Max Flight Duration</FormLabel>
                                  <FormControl>
                                    <div className="px-3">
                                      <Slider
                                        min={1}
                                        max={24}
                                        step={1}
                                        value={[field.value || 24]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        className="w-full"
                                      />
                                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                                        <span>1h</span>
                                        <span>{field.value || 24}h+</span>
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
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          checked={field.value === "short"}
                                          onCheckedChange={(checked) => {
                                            field.onChange(checked ? "short" : undefined);
                                          }}
                                        />
                                        <label className="text-sm text-gray-700">Short Layover (&lt; 2h)</label>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Checkbox
                                          checked={field.value === "long"}
                                          onCheckedChange={(checked) => {
                                            field.onChange(checked ? "long" : undefined);
                                          }}
                                        />
                                        <label className="text-sm text-gray-700">Long Layover (8h+)</label>
                                      </div>
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
