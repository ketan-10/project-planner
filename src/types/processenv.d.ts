declare namespace NodeJS {
	export interface ProcessEnv {
		PORT: number;
		MONGO_URL: string;
		NODE_ENV: string;
		CLIENT_DOMAIN: string;
		REDIS_HOST: string;
		REDIS_PORT: number;
		SESSION_SECRET: string;
	}
}
