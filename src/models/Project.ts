import { Schema, model, Document } from "mongoose";
import { IColumn } from "./Column";
import { ITicket } from "./Ticket";

export interface IProject extends Document {
	projectName: string;
	description: string;
	userIds: Array<string>;
	columnIds: Array<string>;
}

export interface AssembledProject {
	project: IProject;
	columns: IColumn[];
	tickets: ITicket[];
}

export const ProjectSchema = new Schema({
	projectName: {
		type: String,
		required: true,
	},
	description: String,
	userIds: Array,
	columnIds: Array,
});

const Project = model<IProject>("project", ProjectSchema);
export default Project;
