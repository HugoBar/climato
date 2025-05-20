import Conf from "conf";

const schema = {
  city: {
    type: "string",
    default: "Lisboa",
  },
  tempScale: {
    type: "string",
    enum: ["celsius", "fahrenheit"],
    default: "celsius"
  }
};

interface ConfigSchema {
  city: string;
}

export const config = new Conf<ConfigSchema>({ projectName: "climato", schema });