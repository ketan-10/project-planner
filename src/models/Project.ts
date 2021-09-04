import { Schema, model } from "mongoose";

const projectSchema = new Schema({
	projectName: {
		type: String,
		required: true,
	},
	description: String,
	userIds: Array,
	columnIds: Array,
});

export default model("project", projectSchema);
