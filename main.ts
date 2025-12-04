import { App, staticFiles } from "fresh";
import { config, type State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());

app.use(async (ctx) => {
  ctx.state.config = config;
  return await ctx.next();
});

// Include file-system based routes here
app.fsRoutes();
