import HMR from "@roxi/routify/hmr";
import App from "./app.svelte";
import "./css/global.css";
import "svelte-ripple-action/ripple.css";
import { loadUtils } from "./utils/utilsLoader.js";

loadUtils();
const app = HMR(App, { target: document.body }, "app");

export default app;