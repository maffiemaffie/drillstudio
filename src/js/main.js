import * as components from "./components/index.js";
import * as controls from "./controls.js";
import * as io from "./util/io.js";
import * as model from "./model.js";
import * as router from "./router.js";
import * as viewer from "./viewer.js";

(() => {  
  model.loadProjectData({
    currentSet: null,
    grid: components.Grid.fromJSON({
      columns: 7,
      rows: 4,
    }),
    name: "My First Project",
    players: [],
    selected: null,
    sets: [components.Set.fromJSON({
      number: 0,
      measure: 1,
      counts: 8,
    })],
  });
  io.updateProject(model.getAll());

  const projects = io.getProjects();
  controls.updateProjects(model.getName(), projects);
  controls.setSet(model.getCurrentSet());
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);

  router.update();
  viewer.mountCanvas();
})();
