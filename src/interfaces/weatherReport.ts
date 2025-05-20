import { City } from "./city.js";

type TempScale = "celsius" | "fahrenheit";

export interface WeatherReport {
  city: City;
  minTemp: string;
  maxTemp: string;
  precipitationProb: string;
  tempScale: TempScale;
}
