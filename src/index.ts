#!/usr/bin/env node

import meow from "meow";

import { getForecast } from "./axios.js";
import { findOnTheMap } from "./helpers.js";
import { City } from "./interfaces/city.js";
import { WeatherReport } from "./interfaces/weatherReport.js";

const cli = meow(
  `
	Usage
	  $ climato <input>

	Options
	  --rainbow, -r  Include a rainbow

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈
`,
  {
    importMeta: import.meta,
    flags: {
      config: {
        type: "boolean",
        shortFlag: "c",
      },
      help: {
        type: "boolean",
        shortFlag: "c",
      },
      force: {
        type: "boolean",
        shortFlag: "f",
      },
      city: {
        type: "string",
      },
    },
  }
);

async function main() {
	let report: WeatherReport = {}

  if (cli.flags.city) {
    report.city = findOnTheMap(cli.flags.city)
  } 

	if (report.city) {
  	const forecast = await getForecast(report.city);
		report.minTemp = Number(forecast.tMin)
		report.maxTemp = Number(forecast.tMax)
		report.precipitationProb = Number(forecast.precipitaProb)
	}

  console.log("Welcome to CLIMATO");
  console.log(report);
}

main();
