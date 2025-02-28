import { Grid, Player, Set } from "../components/index.js";

const prefix = "drillstudio-";

const updateData = (newData) => {
  localStorage.setItem(prefix + "data", JSON.stringify(newData));
};

const getData = () => {
  const stringData = localStorage.getItem(prefix + "data");
  if (stringData !== null) return JSON.parse(stringData);
  return { projects: {} };
};

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

export const getProjects = () => {
  const data = getData();
  return Object.keys(data.projects);
};

export const updateProject = (project) => {
  const data = getData();
  data.projects[project.name] = project;
  updateData(data);
};

export const createProject = (project) => {
  const data = getData();
  data.projects[project.name] = project;
};
