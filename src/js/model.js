import * as components from "./components/index.js";

let projectData;

// ===================================
// ========= Input / Output ==========
// ===================================

/**
 * Loads a pre-saved project into the model
 * @param {Object} data The project data
 */
export const loadProjectData = (data) => {
  projectData = data;
  projectData.currentSet ??= projectData.sets[0];
};

/**
 * Gets all project data
 * @returns the projectData object
 */
export const getAll = () => {
  return projectData;
}

/**
 * Gets the selected player
 * @returns the selected Player
 */
export const getSelected = () => {
  return projectData.selected;
};

/**
 * Gets the current set
 * @returns the current set
 */
export const getCurrentSet = () => {
  return projectData.currentSet;
};

/**
 * Gets the name of the opened project
 * @returns the name
 */
export const getName = () =>{
  return projectData.name;
}

/**
 * Change the name of the opened project
 * @param {string} name The new name
 */
export const renameProject = (name) => {
  projectData.name = name;
}

/**
 * Gets the tempo of the current set
 * @returns the tempo
 */
export const getTempo = () => {
  return projectData.currentSet.tempo;
}

/**
 * Sets the animating tempo of the current set
 * @param {Number} tempo the new tempo
 */
export const setTempo = (tempo) => {
  projectData.currentSet.tempo = tempo;
}

// ===================================
// ========= Move Player =============
// ===================================

/**
 * Moves a player and snaps them to the nearest step interval
 * @param {components.Player} player The player to move
 * @param {Number} dx The amount to move the player before snapping
 */
const changeXandRound = (player, dx) => {
  player.dots[projectData.currentSet.number].x = Math.round(
    player.dots[projectData.currentSet.number].x + dx
  );

  const bounds = projectData.grid.getBounds();
  player.dots[projectData.currentSet.number].x = Math.max(
    bounds.left,
    Math.min(bounds.right, player.dots[projectData.currentSet.number].x)
  );
};

/**
 * Moves a player and snaps them to the nearest step interval
 * @param {components.Player} player The player to move
 * @param {Number} dy The amount to move the player before snapping
 */
const changeYandRound = (player, dy) => {
  player.dots[projectData.currentSet.number].y = Math.round(
    player.dots[projectData.currentSet.number].y + dy
  );

  const bounds = projectData.grid.getBounds();
  player.dots[projectData.currentSet.number].y = Math.max(
    bounds.bottom,
    Math.min(bounds.top, player.dots[projectData.currentSet.number].y)
  );
};

/**
 * Moves a player without snapping
 * @param {components.Player} player The player to move
 * @param {Number} dx The amount to move the player
 */
const changeX = (player, dx) => {
  player.dots[projectData.currentSet.number].x += dx;

  const bounds = projectData.grid.getBounds();
  player.dots[projectData.currentSet.number].x = Math.max(
    bounds.left,
    Math.min(bounds.right, player.dots[projectData.currentSet.number].x)
  );
};

/**
 * Moves a player without snapping
 * @param {components.Player} player The player to move
 * @param {Number} dy The amount to move the player
 */
const changeY = (player, dy) => {
  player.dots[projectData.currentSet.number].y += dy;

  const bounds = projectData.grid.getBounds();
  player.dots[projectData.currentSet.number].y = Math.max(
    bounds.bottom,
    Math.min(bounds.top, player.dots[projectData.currentSet.number].y)
  );
};

/* ************************************************** */
/*                     Exports                        */
/* ************************************************** */

// ===================================
// ========== Grid Controls ==========
// ===================================

/**
 * Changes the number of rows in the grid
 * @param {Number} rows The new number of rows in the grid, including both the front and back
 */
export const changeRows = (rows) => {
  projectData.grid.changeRows(rows);
};

/**
 * Changes the number of columns in the grid
 * @param {Number} columns The new number of columns outside the 50 (45, 40, 35, etc.)
 */
export const changeColumns = (columns) => {
  projectData.grid.changeColumns(columns);
};

// ===================================
// ========= Player Controls =========
// ===================================

/**
 * Adds player(s) to the project
 * @param {string[]} labels Array of labels for each player to be created
 */
export const createPlayers = (labels) => {
  for (let i = 0; i < labels.length; i++) {
    const startingDot = {
      x: i * 2,
      y: 0,
    };
    const newPlayer = new components.Player(
      labels[i],
      projectData.sets.length,
      startingDot
    );
    projectData.players.push(newPlayer);
  }

  projectData.selected = projectData.players[projectData.players.length - 1];
};

/**
 * Changes the selected player's label
 * @param {string} label the new label
 */
export const renameSelectedPlayer = (label) => {
  projectData.selected.label = label;
};

/**
 * Selects the nearest player to a specified coordinate, or none if no sufficiently close player.
 * @param {Number} x X-coordinate in grid space
 * @param {Number} y Y-coordinate in grid space
 */
export const selectPlayer = (x, y) => {
  let closest = null;
  let closestDistance = BigInt;
  for (const player of projectData.players) {
    const distance = Math.sqrt(
      Math.pow(x - player.dots[projectData.currentSet.number].x, 2) +
        Math.pow(y - player.dots[projectData.currentSet.number].y, 2)
    );

    if (distance > 4) {
      continue;
    }

    if (distance < closestDistance || !closest) {
      closest = player;
      closestDistance = distance;
    }
  }

  projectData.selected = closest;
};

// ---- Move Player Right ----  

/**
 * Moves selected player 0.25 step to the right (toward side 2)
 */
export const shiftSelectedPlayerRight = () => {
  if (projectData.selected) changeX(projectData.selected, 0.25);
};

/**
 * Moves selected player 1 step to the right (toward side 2)
 */
export const moveSelectedPlayerRight = () => {
  if (projectData.selected) changeXandRound(projectData.selected, 1);
};

/**
 * Moves selected player 8 steps to the right (toward side 2)
 */
export const jumpSelectedPlayerRight = () => {
  if (projectData.selected) changeXandRound(projectData.selected, 7);
};

// ---- Move Player Left ---- 

/**
 * Moves selected player 0.25 step to the left (toward side 1)
 */
export const shiftSelectedPlayerLeft = () => {
  if (projectData.selected) changeX(projectData.selected, -0.25);
};

/**
 * Moves selected player 1 step to the left (toward side 1)
 */
export const moveSelectedPlayerLeft = () => {
  if (projectData.selected) changeXandRound(projectData.selected, -1);
};

/**
 * Moves selected player 8 steps to the left (toward side 1)
 */
export const jumpSelectedPlayerLeft = () => {
  if (projectData.selected) changeXandRound(projectData.selected, -7);
};

// ---- Move Player Back ----  

/**
 * Moves selected player 0.25 step back (away from audience)
 */
export const shiftSelectedPlayerBack = () => {
  if (projectData.selected) changeY(projectData.selected, 0.25);
};

/**
 * Moves selected player 1 step back (away from audience)
 */
export const moveSelectedPlayerBack = () => {
  if (projectData.selected) changeYandRound(projectData.selected, 1);
};

/**
 * Moves selected player 8 steps back (away from audience)
 */
export const jumpSelectedPlayerBack = () => {
  if (projectData.selected) changeYandRound(projectData.selected, 7);
};

// ---- Move Player Forward ----  

/**
 * Moves selected player 0.25 step forward (toward audience)
 */
export const shiftSelectedPlayerForward = () => {
  if (projectData.selected) changeY(projectData.selected, -0.25);
};

/**
 * Moves selected player 1 step forward (toward audience)
 */
export const moveSelectedPlayerForward = () => {
  if (projectData.selected) changeYandRound(projectData.selected, -1);
};

/**
 * Moves selected player 8 steps forward (toward audience)
 */
export const jumpSelectedPlayerForward = () => {
  if (projectData.selected) changeYandRound(projectData.selected, -7);
};

// ===================================
// ========= Set Controls ============
// ===================================

/**
 * Attempts to change the set to a desired set number. Fails if set is out of bounds
 * @param {Number} setNumber The set number to change to
 */
export const changeSetTo = (setNumber) => {
  if (setNumber >= 0 && setNumber < projectData.sets.length) {
    projectData.currentSet = projectData.sets[setNumber];
  }
};

/**
 * Creates a new set
 */
export const createSet = () => {
  const newSet = new components.Set(
    projectData.sets.length,
    projectData.sets[projectData.sets.length - 1].measure
  );
  projectData.sets.push(newSet);
  projectData.currentSet = newSet;
  for (const player of projectData.players) {
    player.addSet(
      player.dots[player.dots.length - 1].x,
      player.dots[player.dots.length - 1].y
    );
  }
};

/**
 * Updates a set after edited in the inspector
 * @param {FormData} setData FormData containing set data inputs
 */
export const editSet = (measure, counts, tempo) => {
  projectData.currentSet.measure = measure;
  projectData.currentSet.counts = counts;
  projectData.currentSet.tempo = tempo;
};

