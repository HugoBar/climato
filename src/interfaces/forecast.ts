export interface ForecastEntry {
  tMin: string;
  idFfxVento: number;
  dataUpdate: string;
  tMax: string;
  iUv: string;
  intervaloHora: string;
  idTipoTempo: number;
  ipmaID: number;
  probabilidadePrecipita: string;
  idPeriodo: number;
  dataPrev: string;
  ddVento: string;
}

export type ForecastResponse = ForecastEntry[]
