import { Schema, model } from "mongoose";

const columnSchema = new Schema({
	columnName: {
		type: String,
		required: true,
	},
	ticketIds: Array,
});

export default model("column", columnSchema);
