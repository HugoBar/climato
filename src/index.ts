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
	  --rainbow, -r  Include a rainbow

	Examples
	  $ foo unicorns --rainbow
	  🌈 unicorns 🌈
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

  // Parse city flag
  const city: string = cli.flags.city ? cli.flags.city : config.get("city");
  report.city = findOnTheMap(city);

  // Build weather report
  if (report.city) {
    const forecast = await getForecast(report.city);
    report.minTemp = Number(forecast.tMin);
    report.maxTemp = Number(forecast.tMax);
    report.precipitationProb = Number(forecast.precipitaProb);
  }

  if (cli.flags.setDefault) {
    cli.flags.setDefault.forEach((f) => {
      const [key, value] = f.split("=");
      if (key && value) {
        config.set(key, value);
        console.log(`Set new default value: ${key} = ${value}`);
      }
    });
  }

  console.log("Welcome to CLIMATO");
  console.log(report);
}

main();
