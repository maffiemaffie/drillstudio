import * as model from "./model.js";
import * as controls from "./controls.js";
import * as viewer from "./viewer.js";
import * as io from "./util/io.js";
import * as pdfExport from "./util/export.js";
import * as fileIO from "./util/file-io.js";

export const update = () => {
  const data = model.getAll();
  io.updateProject(data);
  viewer.updateCanvas(data);
};

// ===================================
// ========== Grid Controls ==========
// ===================================

/**
 * Changes the number of rows in the grid
 * @param {Number} rows The new number of rows in the grid, including both the front and back
 */
controls.callbacks.onRowsChanged = (rows) => {
  model.changeRows(rows);
  update();
};

/**
 * Changes the number of columns in the grid
 * @param {Number} columns The new number of columns outside the 50 (45, 40, 35, etc.)
 */
controls.callbacks.onColumnsChanged = (columns) => {
  model.changeColumns(columns);
  update();
};

// ===================================
// ========= Player Controls =========
// ===================================

/**
 * Adds player(s) to the project
 * @param {string[]} labels Array of labels for each player to be added
 */
controls.callbacks.onPlayerAdded = (labels) => {
  model.createPlayers(labels);
  update();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
};

/**
 * Updates a player after edited in the inspector
 * @param {FormData} playerData FormData containing player data inputs
 */
controls.callbacks.onPlayerEdited = (playerData) => {
  const label = playerData.get("label");
  model.renameSelectedPlayer(label);
  update();
};

// ===================================
// ========= Set Controls ============
// ===================================

/**
 * Attempts to change the set to a desired set number. Fails if set is out of bounds
 * @param {Number} setNumber The number of the set to change to
 * @returns the actual set changed to
 */
controls.callbacks.onSetChanged = (setNumber) => {
  model.changeSetTo(setNumber);
  update();
  return model.getCurrentSet();
};

/**
 * Creates a new set
 * @returns the new set
 */
controls.callbacks.onSetAdded = () => {
  model.createSet();
  return model.getCurrentSet().number;
};

/**
 * Updates a set after edited in the inspector
 * @param {FormData} setData FormData containing set data inputs
 */
controls.callbacks.onSetEdited = (setData) => {
  const measure = setData.get("measure");
  const counts = setData.get("counts");
  model.editSet(measure, counts);
};

// ===================================
// ======== Mouse Controls ===========
// ===================================

controls.callbacks.onFieldClicked = (x, y) => {
  const { gridX, gridY } = viewer.viewSpaceToGridSpace(x, y, model.getAll());
  model.selectPlayer(gridX, gridY);

  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

// ===================================
// ======= Keyboard Controls =========
// ===================================

// ---- Single Keys ----

/**
 * Moves a selected player or goes to next set
 */
controls.callbacks.onRightKeyPressed = () => {
  if (model.getSelected()) {
    model.moveSelectedPlayerRight();
    controls.setSelected(model.getSelected(), model.getCurrentSet().number);
    update();
    return;
  }
  controls.setSet(model.getCurrentSet().number + 1);
};

/**
 * Moves a selected player or goes to next set
 */
controls.callbacks.onLeftKeyPressed = () => {
  if (model.getSelected()) {
    model.moveSelectedPlayerLeft();
    controls.setSelected(model.getSelected(), model.getCurrentSet().number);
    update();
    return;
  }
  controls.setSet(model.getCurrentSet().number - 1);
};

/**
 * Moves a selected player
 */
controls.callbacks.onUpKeyPressed = () => {
  model.moveSelectedPlayerBack();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

/**
 * Moves a selected player or goes to next set
 */
controls.callbacks.onDownKeyPressed = () => {
  model.moveSelectedPlayerForward();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

// ---- Shift Keys ----

/**
 * Shifts a selected player
 */
controls.callbacks.onShiftRightKeyPressed = () => {
  model.shiftSelectedPlayerRight();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

/**
 * Shifts a selected player
 */
controls.callbacks.onShiftLeftKeyPressed = () => {
  model.shiftSelectedPlayerLeft();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

/**
 * Shifts a selected player
 */
controls.callbacks.onShiftUpKeyPressed = () => {
  model.shiftSelectedPlayerBack();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

/**
 * Shifts a selected player
 */
controls.callbacks.onShiftDownKeyPressed = () => {
  model.shiftSelectedPlayerForward();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

// ---- Modifier Keys ----

/**
 * Jumps a selected player
 */
controls.callbacks.onMetaRightKeyPressed = () => {
  model.jumpSelectedPlayerRight();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

/**
 * Jumps a selected player
 */
controls.callbacks.onMetaLeftKeyPressed = () => {
  model.jumpSelectedPlayerLeft();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

/**
 * Jumps a selected player
 */
controls.callbacks.onMetaUpKeyPressed = () => {
  model.jumpSelectedPlayerBack();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

/**
 * Jumps a selected player
 */
controls.callbacks.onMetaDownKeyPressed = () => {
  model.jumpSelectedPlayerForward();
  controls.setSelected(model.getSelected(), model.getCurrentSet().number);
  update();
};

// ===================================
// ========= File Controls ===========
// ===================================

/**
 * Export full project to dot sheets
 */
controls.callbacks.onExportButtonPressed = () => {
  pdfExport.exportCSV(model.getAll());
};

/**
 * Export full project to disk
 */
controls.callbacks.onSaveFile = () => {
  fileIO.saveToFile(model.getAll());
}

/**
 * Load project from disk
 */
controls.callbacks.onOpenFile = (file) => {
  fileIO.loadFromFile(file);
};

// ===================================
// ============ Storage ==============
// ===================================

/**
 * Load in a pre-saved project
 * @param {string} name The name of the opened project
 */
controls.callbacks.onProjectOpened = (name) => {
  io.updateProject(model.getAll());

  io.setOpenProject(name);
  model.loadProjectData(io.getOpenProject());

  const projects = io.getProjects();
  controls.updateProjects(model.getName(), projects);

  update();
};

/**
 * Rename the opened project
 * @param {string} name The new name
 */
controls.callbacks.onProjectRenamed = (name) => {
  const oldName = model.getName();
  
  model.renameProject(name);
  io.updateProject(model.getAll(), oldName);
  io.setOpenProject(name);

  const projects = io.getProjects();
  controls.updateProjects(name, projects);
};

controls.callbacks.onProjectCreated = (name) => {
  io.createProject(io.makeDefaultProject(name));
}

// ===================================  
// =========== Animation =============  
// ===================================  

controls.callbacks.onAnimationStepForward = (progress) => {
  viewer.updateAnimation(model.getAll(), progress);
}

controls.callbacks.onAnimationStop = () => {
  controls.setSet(model.getCurrentSet().number + 1);
}