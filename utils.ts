import { createDefine } from "fresh";
import { parse } from "@std/toml";

export interface Config {
  base: Base;
  social: Social[];
}

export interface Base {
  url: string;
}

export interface Social {
  name: string;
  icon: string;
  url: string;
}

// This specifies the type of "ctx.state" which is used to share
// data among middlewares, layouts and routes.
export interface State {
  config: Config;
}

export const define = createDefine<State>();

// Load config synchronously at startup
const configData = Deno.readTextFileSync("config.toml");
export const config: Config = parse(configData) as unknown as Config;

export const SITE_BASE_URL = config.base.url;
