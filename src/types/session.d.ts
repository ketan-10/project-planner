import { Session, SessionData } from "express-session";

declare module "express-session" {
	export interface SessionData {
		userId: string;
		projectId: string | null;
	}
}
