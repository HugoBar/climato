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
	  --help,         -h        Display help message (TODO)
	  --force,        -f        Force action without user confirmation (TODO if necessary)
	  --city,         -c        Specify the city. Falls back to config default if not provided
	  --set-default,             Set new default values in the config

	Examples
	  $ climate --city Porto
        Runs the command using Lisbon as the city
    
    $ climate set-default city=Lisboa
        Sets Lisboa as the new default city in the config

    $ climate 
         Uses default city from config (if set)

`,
  {
    importMeta: import.meta,
    flags: {
      help: {
        type: "boolean",
        shortFlag: "h",
      },
      force: {
        type: "boolean",
        shortFlag: "f",
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

  console.log("Welcome to CLIMATO");
  // Resolve city flag
  const cityName: string = cli.flags.city ? cli.flags.city : config.get("city");
  if (cityName) {
    city = await findOnTheMap(cityName);

    if (city) {
      try {
        const { tMax, tMin, precipitaProb } = await getForecast(city);
        forecast = { tMax, tMin, precipitaProb };
      } catch (error) {
        return;
      }
    } else {
      return console.log(messages.error.cityNotFound(city));
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
}

main();
