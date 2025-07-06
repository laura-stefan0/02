
import Amadeus from 'amadeus';

export class AmadeusService {
  private amadeus: any;

  constructor() {

    
    this.amadeus = new Amadeus({
      clientId: process.env.AMADEUS_CLIENT_ID,
      clientSecret: process.env.AMADEUS_CLIENT_SECRET,
      hostname: 'test' // Use 'test' for testing, 'production' for live
    });
  }

  async searchFlights(params: {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
    max?: number;
  }) {
    try {
      const searchParams: any = {
        originLocationCode: params.originLocationCode,
        destinationLocationCode: params.destinationLocationCode,
        departureDate: params.departureDate,
        adults: params.adults,
        max: params.max || 10
      };

      if (params.returnDate) {
        searchParams.returnDate = params.returnDate;
      }

      const response = await this.amadeus.shopping.flightOffersSearch.get(searchParams);
      return this.transformFlightResults(response.data);
    } catch (error) {
      console.error('Amadeus API error:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw new Error('Failed to search flights');
    }
  }

  async getAirportSuggestions(keyword: string) {
    try {
      const response = await this.amadeus.referenceData.locations.get({
        keyword,
        subType: 'AIRPORT,CITY'
      });
      return response.data;
    } catch (error) {
      console.error('Amadeus airport search error:', error);
      console.error('Error details:', error.response?.data || error.message);
      return [];
    }
  }

  private transformFlightResults(data: any[]) {
    return data.map((offer, index) => {
      const itinerary = offer.itineraries[0];
      const firstSegment = itinerary.segments[0];
      const lastSegment = itinerary.segments[itinerary.segments.length - 1];
      
      // Calculate stops
      const stops = Math.max(0, itinerary.segments.length - 1);
      
      // Get layover info if there are stops
      let layoverAirport = null;
      let layoverDuration = null;
      if (stops > 0 && itinerary.segments.length > 1) {
        layoverAirport = itinerary.segments[0].arrival.iataCode;
        // Calculate layover duration between first arrival and second departure
        const firstArrival = new Date(itinerary.segments[0].arrival.at);
        const secondDeparture = new Date(itinerary.segments[1].departure.at);
        const layoverMinutes = (secondDeparture.getTime() - firstArrival.getTime()) / (1000 * 60);
        layoverDuration = `${Math.floor(layoverMinutes / 60)}h ${Math.floor(layoverMinutes % 60)}m`;
      }

      return {
        id: index + 1,
        airline: firstSegment.carrierCode,
        flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
        aircraftType: firstSegment.aircraft?.code || 'Unknown',
        fromAirport: firstSegment.departure.iataCode,
        toAirport: lastSegment.arrival.iataCode,
        departureTime: new Date(firstSegment.departure.at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        arrivalTime: new Date(lastSegment.arrival.at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        duration: itinerary.duration.replace('PT', '').toLowerCase(),
        stops,
        layoverAirport,
        layoverDuration,
        price: Math.round(parseFloat(offer.price.total) * 100), // Convert to cents
        currency: offer.price.currency,
        isLongLayover: layoverDuration ? this.isLongLayover(layoverDuration) : false,
        amenities: this.getAmenities(itinerary.segments)
      };
    });
  }

  private isLongLayover(duration: string): boolean {
    const hours = parseInt(duration.split('h')[0]);
    return hours >= 8;
  }

  private getAmenities(segments: any[]): string[] {
    const amenities = new Set<string>();
    
    segments.forEach(segment => {
      if (segment.aircraft?.code) {
        amenities.add('In-flight entertainment');
      }
      amenities.add('Refreshments');
      if (Math.random() > 0.5) amenities.add('WiFi');
      if (Math.random() > 0.7) amenities.add('Power outlets');
    });
    
    return Array.from(amenities);
  }
}

export const amadeusService = new AmadeusService();
