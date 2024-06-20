import { setupStore } from "@/store";
import uvUI from "@climblee/uv-ui";
import VConsole from "vconsole";
import settings from "@/settings";
if (settings.debugger) {
  new VConsole();
}

export default {
  install(app) {
    // 状态管理(store)
    setupStore(app);
    app.use(uvUI);
  },
};
