import { Schema, model } from "mongoose";

const userSchema = new Schema({
	username: {
		unique: true,
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	projectIds: Array,
});

export default model("user", userSchema);
