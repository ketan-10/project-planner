import { Schema, model, Document } from "mongoose";

export interface IColumn extends Document {
	columnName: string;
	ticketIds: Array<string>;
	projectId: string;
}

export const ColumnSchema = new Schema({
	columnName: {
		type: String,
		required: true,
	},
	ticketIds: Array,
	projectId: {
		type: String,
		required: true,
	},
});

const Column = model<IColumn>("column", ColumnSchema);
export default Column;
