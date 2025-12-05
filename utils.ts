import { createDefine } from "fresh";
import { parse } from "@std/toml";
import { format, formatDistanceToNow } from "date-fns";

export interface Config {
  base: Base;
  github: {
    repo: string;
  },
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

// Date formatting utilities
export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateLong(date: string | Date): string {
  return format(new Date(date), "MMMM d, yyyy");
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getYear(): number {
  return new Date().getFullYear();
}
