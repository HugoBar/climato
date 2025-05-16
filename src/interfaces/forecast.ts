export interface ForecastEntry {
  precipitaProb: string;
  tMin: string;
  tMax: string;
  predWindDir: string;
  idWeatherType: number;
  classWindSpeed: number;
  longitude: string;
  forecastDate: string;
  latitude: string;
  classPrecInt?: number;
}

export interface ForecastResponse {
  owner: string;
  country: string;
  data: ForecastEntry[];
  globalIdLocal: number;
  dataUpdate: string;
}