#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building static version for Vercel deployment...');

// Create a temporary vite config for static build
const staticViteConfig = `
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress TypeScript warnings during build
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
        if (warning.message.includes('TypeScript')) return;
        warn(warning);
      }
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
`;

// Write the static config
fs.writeFileSync('vite.config.static.js', staticViteConfig);

// Run the build
exec('vite build --config vite.config.static.js', (error, stdout, stderr) => {
  // Clean up
  if (fs.existsSync('vite.config.static.js')) {
    fs.unlinkSync('vite.config.static.js');
  }
  
  if (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
  
  console.log('Static build completed successfully!');
  console.log(stdout);
  
  if (stderr) {
    console.log('Warnings:', stderr);
  }
});