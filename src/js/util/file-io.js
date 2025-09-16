import * as io from "./io.js";
import * as controls from "../controls.js";
import * as model from "../model.js";

// https://javascript.plainenglish.io/javascript-create-file-c36f8bccb3be
export const saveToFile = (data) => {
  const stringified = JSON.stringify(data);

  const file = new File([stringified], data.name + ".elia", {
    type: "application/json",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(file);

  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export const loadFromFile = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    const project = JSON.parse(reader.result);

    // check if project by name already exists
    const existingProject = io.getProject(project.name);

    if (existingProject) {
      if (!confirm(`A project named "${project.name}" already exists. Would you like to overwrite it? (Click 'cancel' to create a new project)`)) {
        // rename project
        project.name = prompt("Enter a new name for the project:", project.name + " (1)") || (project.name + " (1)");
      }
    }

    model.loadProjectData(project);
    controls.callbacks.onProjectOpened(project.name);
  };
  reader.onerror = () => {
    alert("Failed to read file!\n\n" + reader.error);
  }

  reader.readAsText(file);
}