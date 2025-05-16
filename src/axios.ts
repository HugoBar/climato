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
        console.error("unauthorised");
        break;

      case 404:
        console.error("/not-found");
        break;

      case 500:
        console.error("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

export async function getForecast(city: City) {
  const responseBody = <T>(response: AxiosResponse<T>) => response.data;
  const json = <T>(url: string) => axios.get<T>(url).then(responseBody);

  const forecast = await json<ForecastResponse>(`/open-data/forecast/meteorology/cities/daily/${city.ipmaID}.json`);
  return forecast.data[0]
}
