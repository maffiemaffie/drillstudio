import * as components from "../components/index.js";

const prefix = "drillstudio-";

/**
 * Overwrites all drill studio data in local storage
 * @param {Object} newData The data to load to local storage
 */
const updateData = (newData) => {
  localStorage.setItem(prefix + "data", JSON.stringify(newData));
};

/**
 * Retrieves all drill studio data in local storage
 * @returns the data
 */
const getData = () => {
  const stringData = localStorage.getItem(prefix + "data");
  if (stringData !== null) return JSON.parse(stringData);

  const data = { projects: [] };
  updateData(data);
  return getData();
};

/**
 * Retrieves an existing project's data
 * @param {string} name The name of the project
 * @returns the project data
 */
export const getProject = (name) => {
  const data = getData();
  const project = data.projects.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );

  if (!project) return;

  const players = [];
  for (const player of project.players) {
    players.push(components.Player.fromJSON(player));
  }

  let selected = project.selected;
  if (selected !== null)
    selected = players.find(
      (player) => player.label === project.selected.label
    );

  const sets = [];
  for (let set of project.sets) {
    sets.push(components.Set.fromJSON(set));
  }

  const currentSet = sets.find(
    (set) => set.number === project.currentSet.number
  );

  const grid = components.Grid.fromJSON(project.grid);

  return {
    currentSet,
    name: project?.name ?? "My First Project",
    tempo: project?.tempo ?? 120,
    players,
    selected,
    sets,
    grid,
  };
};

/**
 * Sets the open project
 * @param {string} name the name of the project
 */
export const setOpenProject = (name) => {
  const data = getData();
  data.openProject = name;
  updateData(data);
};

/**
 * Retrieves the data for the last project opened.
 * If no project open, defaults to the first project in the list.
 * If no existing projects, creates one.
 * @returns the project data
 */
export const getOpenProject = () => {
  let data = getData();
  let project;
  project = getProject(data.openProject);
  if (project) return project;

  project = getProject(data.projects[0]?.name);
  if (project) return project;

  updateProject(makeDefaultProject("My First Project"));

  data = getData();
  data.openProject = "My First Project";
  updateData(data);
  return getProject("My First Project");
};

/**
 * Retrieves a list of names of all existing projects
 * @returns the names
 */
export const getProjects = () => {
  const data = getData();
  return data.projects.map((p) => p.name);
};

/**
 * Overwrites the data for an existing project in local storage
 * @param {Object} project The project data
 * @param {string} [name] The name of the project being updated (defaults to project.name)
 */
export const updateProject = (project, name = undefined) => {
  name ??= project.name;

  if (!project.currentSet) {
    project.currentSet = project.sets[0];
  }

  const data = getData();
  data.projects = data.projects.filter(
    (p) => p.name.toLowerCase() !== name.toLowerCase()
  );

  data.projects.push(project);
  updateData(data);
};

/**
 * Saves a new project to local storage
 * @param {Object} project The project data
 */
export const createProject = (project) => {
  const data = getData();

  if (
    data.projects.find(
      (p) => p.name.toLowerCase() === project.name.toLowerCase()
    )
  )
    return;

  updateProject(project);
};

export const makeDefaultProject = (name) => {
  return {
    currentSet: null,
    grid: components.Grid.fromJSON({
      columns: 7,
      rows: 4,
    }),
    name,
    tempo: 120,
    players: [],
    selected: null,
    sets: [
      components.Set.fromJSON({
        number: 0,
        measure: 1,
        counts: 8,
      }),
    ],
  };
}
