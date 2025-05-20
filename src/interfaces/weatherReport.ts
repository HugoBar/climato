import { City } from "./city.js";

type TempScale = "celsius" | "fahrenheit";

export interface WeatherReport {
  city?: City;
  minTemp?: number;
  maxTemp?: number;
  precipitationProb?: number;
  tempScale?: TempScale;
}
