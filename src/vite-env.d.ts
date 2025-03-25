/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FACEBOOK_APP_ID: string;
    readonly VITE_FACEBOOK_PAGE_ID: string;
    readonly VITE_FACEBOOK_ACCESS_TOKEN: string;
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly PUBLIC_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }