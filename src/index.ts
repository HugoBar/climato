#!/usr/bin/env node

import meow from "meow";

import { getForecast } from "./axios.js";
import { findOnTheMap } from "./helpers.js";
import { WeatherReport } from "./interfaces/weatherReport.js";
import { config } from "./config.js";
import { messages } from "./messages.js";

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
        shortFlag: "ts"
      },
      setDefault: {
        type: "string",
        isMultiple: true,
      },
    },
  }
);

async function main() {
  let report: WeatherReport = {};

  console.log("Welcome to CLIMATO");
  // Parse city flag
  const city: string = cli.flags.city ? cli.flags.city : config.get("city");
  if (!city) {
    return console.log(
      "No city provided. Please use --city or configure a default city."
    );
  }
  report.city = findOnTheMap(city);

  // Build weather report
  if (report.city) {
    try {
      const forecast = await getForecast(report.city);

      report.minTemp = Number(forecast.tMin);
      report.maxTemp = Number(forecast.tMax);
      report.precipitationProb = Number(forecast.precipitaProb);

      console.log(messages.success.forecast(report));
    } catch (error) {}
  } else {
    console.log(messages.error.notFound(city));
  }

  // Resolve temperature scale
  if (
    cli.flags.tempScale &&
    (cli.flags.tempScale === "celsius" || cli.flags.tempScale === "fahrenheit")
  ) {
    report.tempScale = cli.flags.tempScale;
  } else {
    report.tempScale = config.get("tempScale");
  }

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
