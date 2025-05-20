import { WeatherReport } from "./interfaces/weatherReport.js";
import { temperatureToString } from "./helpers.js";

export const messages = {
  success: {
    forecast: (report: WeatherReport) => 
  `
  Forecast for ${report.city?.local}:

  The maximum temperature is ${temperatureToString(Number(report.maxTemp), report.tempScale)}
  The minimum temperature is ${temperatureToString(Number(report.minTemp), report.tempScale)}
  The percipitation probability is ${report.precipitationProb}%
  `
  },
  error: {
    cityNotFound: (cityName: string) => 
  ` 
  City was not found - ${cityName}
  Only district capitals are supported.

  Supported district capitals include:  Aveiro, Braga, Guimarães, Coimbra ...
  See full list at: ./json/cities.json
  `,
    invalidTempScale: (tempScale: string) => 
  `
  Temperature scale not supported - ${tempScale}
  
  Supported temperature scales are: Celsius and Fahrenheit.
  `
  }
}