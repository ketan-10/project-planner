import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: String,
});

export default model("ticket", ticketSchema);
