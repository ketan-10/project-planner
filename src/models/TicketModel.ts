import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	position: Number,
	description: String,
});

export default model("ticket", ticketSchema);
