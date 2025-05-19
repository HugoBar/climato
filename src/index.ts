#!/usr/bin/env node

import meow from "meow";

import { getForecast } from "./axios.js";
import { findOnTheMap } from "./helpers.js";
import { WeatherReport } from "./interfaces/weatherReport.js";
import { config } from "./config.js";

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
      setDefault: {
        type: "string",
        isMultiple: true,
      },
    },
  }
);

async function main() {
  let report: WeatherReport = {};

  console.log("Welcome to CLIMATO\n");
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

      return console.log(report)
    } catch (error) {}
  } else {
    console.log("City was not found.");
    console.log("Only district capitals are supported.");
    console.log(
      "\nSupported district capitals include:  Aveiro, Braga, Guimarães, Coimbra ... "
    );
    console.log("See full list at: ./json/cities.json");
  }

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
