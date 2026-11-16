import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.sentra.assistant",
  appName: "SENTRA",
  webDir: "apps/web/dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https"
  },
  android: {
    allowMixedContent: false
  }
};

export default config;
