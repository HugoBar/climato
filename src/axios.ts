import axios, { AxiosError, AxiosResponse } from "axios";
import { City } from "./interfaces/city.js";
import { ForecastResponse } from "./interfaces/forecast.js";

axios.defaults.baseURL =
  "https://api.ipma.pt";

axios.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
      case 400:
        console.error(data);
        break;

      case 401:
        console.error("401 - Unauthorised");
        break;

      case 404:
        console.error("404 - Not found");
        break;

      case 500:
        console.error("500 - Server error");
        break;
    }
    return Promise.reject(error);
  }
);

export async function getForecast(city: City) {
  const responseBody = <T>(response: AxiosResponse<T>) => response.data;
  const json = <T>(url: string) => axios.get<T>(url).then(responseBody);

  const forecast = await json<ForecastResponse>(`/public-data/forecast/aggregate/${city.ipmaID}.json`);
  return forecast[0]
}
