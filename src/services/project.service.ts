import ProjectModel from "../models/Project";

export const createProject = (project: object): Promise<any> => {
	return ProjectModel.create(project);
};

export const updateName = async (id: string, newName: string): Promise<any> => {
	return ProjectModel.findByIdAndUpdate(
		id,
		{
			projectName: newName,
		},
		{
			new: true,
		}
	);
};

//TODO depends on columnService
export const deleteProject = async (id: string): Promise<any> => {
	return ProjectModel.findByIdAndDelete(id);
};
