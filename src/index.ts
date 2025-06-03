#!/usr/bin/env node

import meow from "meow";

import { getForecast } from "./axios.js";
import { findOnTheMap } from "./helpers.js";
import { WeatherReport } from "./interfaces/weatherReport.js";
import { config } from "./config.js";
import { messages } from "./messages.js";
import { City } from "./interfaces/city.js";

const cli = meow(
  `
	Usage
	  $ climato <input>

	Options
	  --help,         -h        Display help message
	  --city,         -c        Specify the city. Falls back to config default if not provided
   --tempScale,    -ts       Specify the temperature scale. Falls back to config default if not provided
	  --set-default,            Set new default values in the config

	Examples
	  $ climato --city Porto
        Runs using Porto as the city
    
    $ climato --tempScale fahrenheit
	      Runs displaying the temperature in Fahrenheit (ºF) 
    
    $ climato set-default city=Lisboa
        Sets Lisboa as the new default city in the config

    $ climato 
         Uses default city from config (if set)

`,
  {
    importMeta: import.meta,
    flags: {
      help: {
        type: "boolean",
        shortFlag: "h",
      },
      city: {
        type: "string",
        shortFlag: "c",
      },
      tempScale: {
        type: "string",
        shortFlag: "ts",
      },
      setDefault: {
        type: "string",
        isMultiple: true,
      },
    },
  }
);

type TempScale = "celsius" | "fahrenheit";

async function main() {
  let city: City;
  let forecast: { tMax: string; tMin: string; precipitaProb: string };
  let tempScale: TempScale;

  console.log(`
   ____  _     ___ __  __    _  _____ ___  
  / ___|| |   |_ _|  \\/  |  / \\|_   _/ _ \\ 
  | |   | |    | || |\\/| | / _ \\ | || | | |
  | |___| |___ | || |  | |/ ___ \\| || |_| |
  \\____||_____|___|_|  |_/_/   \\_\\_| \\___/ 
`);

  // Assign default values if present
  if (cli.flags.setDefault) {
    cli.flags.setDefault.forEach((f) => {
      const [key, value] = f.split("=");
      if (key && value) {
        config.set(key, value);
        console.log(`Set new default value: ${key} = ${value}`);
      }
    });
  }

  // Resolve city flag
  const cityName: string = cli.flags.city ? cli.flags.city : config.get("city");
  if (cityName) {
    city = await findOnTheMap(cityName);

    if (city) {
      try {
        const { tMax, tMin, probabilidadePrecipita } = await getForecast(city);
        forecast = { tMax, tMin, precipitaProb: probabilidadePrecipita };
      } catch (error) {
        return;
      }
    } else {
      return console.log(messages.error.cityNotFound(cityName));
    }
  } else {
    return console.log(
      "No city provided. Please use --city or configure a default city."
    );
  }

  // Resolve temperature scale
  if (
    cli.flags.tempScale &&
    (cli.flags.tempScale === "celsius" || cli.flags.tempScale === "fahrenheit")
  ) {
    tempScale = cli.flags.tempScale as TempScale;
  } else if (
    cli.flags.tempScale &&
    !(cli.flags.tempScale === "celsius" || cli.flags.tempScale === "fahrenheit")
  ) {
    return console.log(messages.error.invalidTempScale(cli.flags.tempScale));
  } else {
    tempScale = config.get("tempScale") as TempScale;
  }

  // Build weater report
  const report: WeatherReport = {
    city,
    minTemp: forecast.tMin,
    maxTemp: forecast.tMax,
    precipitationProb: forecast.precipitaProb,
    tempScale,
  };
  console.log(messages.success.forecast(report));
}

main();
