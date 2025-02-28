import * as controls from "./controls.js";
import * as router from "./router.js";
import * as model from "./model.js";
import * as viewer from "./viewer.js";
import * as io from "./util/io.js";

(() => {  
  const openedProject = io.getProject('My Project');
  model.loadProjectData(openedProject);

  const projects = io.getProjects();
  controls.updateProjects(model.getName(), projects);
  controls.setSet(model.getCurrentSet());
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);

  router.update();
  viewer.mountCanvas();
})();
