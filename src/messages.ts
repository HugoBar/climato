import { WeatherReport } from "./interfaces/weatherReport.js";
import { temperatureToString } from "./helpers.js";
import chalk from 'chalk';

export const messages = {
  success: {
    forecast: (report: WeatherReport) => 
  `
                  ${report.city?.local.toLocaleUpperCase()}

  The maximum temperature is ${chalk.white.bgRed(temperatureToString(Number(report.maxTemp), report.tempScale))}
  The minimum temperature is ${chalk.white.bgBlue(temperatureToString(Number(report.minTemp), report.tempScale))}
  The percipitation probability is ${report.precipitationProb}%
  `,
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