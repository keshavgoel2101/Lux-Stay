import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';
 
export default {
  // Config options...
  // Disable SSR for SPA mode - forms and buttons handle client-side
  ssr: false,
  presets: [vercelPreset()],
} satisfies Config;