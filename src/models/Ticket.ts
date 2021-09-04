import { Schema, model, Document } from "mongoose";

export interface ITicket extends Document {
	title: string;
	description: string;
}

export const TicketSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: String,
});

const Ticket = model<ITicket>("ticket", TicketSchema);
export default Ticket;
