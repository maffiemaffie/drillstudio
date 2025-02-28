import * as controls from "./controls.js";
import * as components from "./components/index.js";
import * as router from "./router.js";
import * as model from "./model.js";
import * as viewer from "./viewer.js";
import * as io from "./util/io.js";

(() => {  
  const projects = io.getProjects();

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

  controls.updateProjects(model.getName(), projects);
  controls.setSet(model.getCurrentSet());
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);

  router.update();
  viewer.mountCanvas();
})();
