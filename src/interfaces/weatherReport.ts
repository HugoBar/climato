import { City } from "./city.js";

export interface WeatherReport {
	city?: City
  minTemp?: number
  maxTemp?: number
  precipitationProb?: number
} 
