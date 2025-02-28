import { Grid, Player, Set } from "../components/index.js";

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
  
  const data = { projects: {} };
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
  const project = data.projects[name];

  const players = [];
  for (const player of project.players) {
    players.push(Player.fromJSON(player));
  }

  let selected = project.selected;
  if (selected !== null)
    selected = players.find(
      (player) => player.label.localeCompare(project.selected.label) === 0
    );

  const sets = [];
  for (let set of project.sets) {
    sets.push(Set.fromJSON(set));
  }

  const currentSet = sets.find(
    (set) => set.number === project.currentSet.number
  );

  const grid = Grid.fromJSON(project.grid);

  return {
    currentSet,
    name: project.name,
    players,
    selected,
    sets,
    grid,
  };
};

/**
 * Retrieves a list of names of all existing projects
 * @returns the names
 */
export const getProjects = () => {
  const data = getData();
  return Object.keys(data.projects);
};

/**
 * Overwrites the data for an existing project in local storage
 * @param {Object} project The project data
 */
export const updateProject = (project) => {
  const data = getData();
  data.projects[project.name] = project;
  updateData(data);
};

/**
 * Saves a new project to local storage
 * @param {Object} project The project data
 */
export const createProject = (project) => {
  const data = getData();
  data.projects[project.name] = project;
};
