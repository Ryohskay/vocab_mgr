import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, ".env") })

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/api": {
		target: `http://${process.env.API_LOCATION}`,
                changeOrigin: true,
            },
        },
    },
});
