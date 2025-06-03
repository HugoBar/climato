import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { City } from "./interfaces/city.js";

export function findOnTheMap(cityName: string): City {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const citiesRaw = readFileSync(join(__dirname, "json/cities.json"), "utf8");
  const cities = JSON.parse(citiesRaw);

  return cities.find((c: City) => c.local === cityName);
}

export function temperatureToString(
  temperature: number,
  tempScale: string
): string {
  if (tempScale === "fahrenheit") {
    const fahrenheit = (temperature * 9) / 5 + 32;
    return `${fahrenheit.toFixed(1)}ºF`;
  }

  return `${temperature.toFixed(1)}ºC`;
}
