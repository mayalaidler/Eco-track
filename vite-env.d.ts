interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // add more vars here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}