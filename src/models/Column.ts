import { Schema, model, Document } from "mongoose";

export interface IColumn extends Document {
	columnName: string;
	ticketIds: Array<string>;
}

export const ColumnSchema = new Schema({
	columnName: {
		type: String,
		required: true,
	},
	ticketIds: Array,
});

const Column = model<IColumn>("column", ColumnSchema);
export default Column;
