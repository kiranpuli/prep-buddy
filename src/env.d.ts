interface ImportMetaEnv {
	readonly VITE_ADSENSE_SLOT_SIDEBAR?: string;
	readonly VITE_ADSENSE_SLOT_INLINE?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
