import { createDefine } from "fresh";
import { parse } from "@std/toml";
import { format, formatDistanceToNow } from "date-fns";

export interface Config {
  base: Base;
  github: {
    repo: string;
  };
  social: Social[];
}

export interface Base {
  url: string;
  postsDir?: string;
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

// Runtime configuration with caching
let cachedConfig: Config | null = null;
let configMtime: number | null = null;

/**
 * Get configuration from config.toml at runtime.
 * Caches the config and only reloads when the file is modified.
 * This allows dynamic updates without redeployment.
 */
export async function getConfig(): Promise<Config> {
  try {
    const stat = await Deno.stat("config.toml");
    const mtime = stat.mtime?.getTime() ?? 0;

    // Return cached config if file hasn't changed
    if (cachedConfig && configMtime === mtime) {
      return cachedConfig;
    }

    // Read and parse the config file
    const configData = await Deno.readTextFile("config.toml");
    cachedConfig = parse(configData) as unknown as Config;
    configMtime = mtime;

    return cachedConfig;
  } catch (error) {
    // If we have a cached config, return it on error
    if (cachedConfig) {
      console.warn("Failed to reload config, using cached version:", error);
      return cachedConfig;
    }
    throw error;
  }
}

/**
 * Get the site base URL dynamically from config.
 */
export async function getSiteBaseUrl(): Promise<string> {
  const cfg = await getConfig();
  return cfg.base.url;
}

// Legacy static config for backward compatibility
// Will be deprecated in favor of getConfig()
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
