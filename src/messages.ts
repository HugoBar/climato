import { WeatherReport } from "./interfaces/weatherReport.js";

export const messages = {
  success: {
    forecast: (report: WeatherReport) => 
  `
  Forecast for ${report.city?.local}:

  The maximum temperature is ${report.maxTemp} ºC
  The minimum temperature is ${report.minTemp} ºC
  The percipitation probability is ${report.precipitationProb}%
  `
  },
  error: {
    notFound: (cityName: string) => 
  ` 
  City was not found - ${cityName}
  Only district capitals are supported.

  Supported district capitals include:  Aveiro, Braga, Guimarães, Coimbra ...
  See full list at: ./json/cities.json
  `
  }
}