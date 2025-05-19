import Conf from "conf";

const schema = {
  city: {
    type: "string",
    default: "Lisboa",
  },
};

interface ConfigSchema {
  city: string;
}

export const config = new Conf<ConfigSchema>({ projectName: "climato", schema });