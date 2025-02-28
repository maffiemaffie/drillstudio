import * as controls from "./controls.js";
import * as io from "./util/io.js";
import * as model from "./model.js";
import * as router from "./router.js";
import * as viewer from "./viewer.js";

(() => {  
  model.loadProjectData(io.getOpenProject());

  const projects = io.getProjects();
  controls.updateProjects(model.getName(), projects);
  controls.setSet(model.getCurrentSet());
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);

  router.update();
  viewer.mountCanvas();
})();
