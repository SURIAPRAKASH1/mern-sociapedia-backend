import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";
import replace from "@rollup/plugin-replace";

// https://vitejs.dev/config/
const env = dotenv.config().parsed;

export default defineConfig({
  plugins: [
    react(),
    replace({
      preventAssignment: true,
      values: {
        "import.meta.env": JSON.stringify(env),
      },
    }),
  ],
});
