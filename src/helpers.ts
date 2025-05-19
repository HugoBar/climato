import { readFileSync } from "fs";

import { City } from "./interfaces/city.js";

export function findOnTheMap(cityName: string): City {
  const citiesRaw = readFileSync("./src/json/cities.json", "utf8");
  const cities = JSON.parse(citiesRaw);

  return cities.find((c: City) => c.local === cityName);
}
