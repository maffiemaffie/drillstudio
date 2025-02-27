import * as components from "./components/index.js";
import * as drawers from "./drawers/index.js";
import * as controls from "./controls.js";
import { drawSet } from "./viewer.js";
import { exportCSV } from "./util/export.js";
import * as io from "./util/io.js";

(() => {
  let projectData = {
    players: [],
    sets: [ new components.Set(0, 1) ],
    selected: null,
    currentSet: null,
    name: "My Project",
  };
  projectData.currentSet = projectData.sets[0];
  
  const field = document.querySelector("#field");

  const grid = new components.Grid();
  const fieldCanvas = document.createElement("canvas");

  const updateCanvas = () => {
    fieldCanvas.width =
      (grid.columns - 1) * drawers.config.gridSize + drawers.config.margin * 2;
    fieldCanvas.height =
      (grid.rows - 1) * drawers.config.gridSize + drawers.config.margin * 2;
    drawSet(fieldCanvas, projectData.players, projectData.selected, grid, projectData.currentSet);
    io.updateProject(projectData);
  };

  controls.callbacks.onRowsChanged = (rows) => {
    grid.changeRows(rows);
    updateCanvas();
  };

  controls.callbacks.onColumnsChanged = (columns) => {
    grid.changeColumns(columns);
    updateCanvas();
  };

  controls.callbacks.onPlayerAdded = (labels) => {
    for (let i = 0; i < labels.length; i++) {
      const startingDot = {
        x: i * 2,
        y: 0,
      };
      const newPlayer = new components.Player(labels[i], projectData.sets.length, startingDot);
      projectData.players.push(newPlayer);
    }

    projectData.selected = projectData.players[projectData.players.length - 1];
    controls.setSelected(projectData.selected, projectData.currentSet.number);
    updateCanvas();
  };

  controls.callbacks.onPlayerEdited = (playerData) => {
    const label = playerData.get("label");
    projectData.selected.label = label;
    updateCanvas();
  };

  controls.callbacks.onSetChanged = (setNumber) => {
    if (setNumber >= 0 && setNumber < projectData.sets.length) {
      projectData.currentSet = projectData.sets[setNumber];
      controls.setSelected(projectData.selected, projectData.currentSet.number);
      updateCanvas();
    }
    return projectData.currentSet;
  };

  controls.callbacks.onSetAdded = () => {
    const newSet = new components.Set(projectData.sets.length, projectData.sets[projectData.sets.length - 1].measure)
    projectData.sets.push(newSet);
    projectData.currentSet = newSet;
    for (const player of projectData.players) {
      player.addSet(
        player.dots[player.dots.length - 1].x,
        player.dots[player.dots.length - 1].y
      );
    }
    return projectData.currentSet.number;
  };

  controls.callbacks.onSetEdited = (setData) => {
    const measure = setData.get("measure");
    projectData.currentSet.measure = measure;
    const counts = setData.get("counts");
    projectData.currentSet.counts = counts;
  };

  controls.callbacks.onFieldClicked = (x, y) => {
    const marginInSteps = drawers.config.margin / drawers.config.stepSize;
    const gridWidthInSteps = (grid.columns - 1) * 8;
    const gridHeightInSteps = (grid.rows - 1) * 8;
    const width = marginInSteps + gridWidthInSteps + marginInSteps;
    const height = marginInSteps + gridHeightInSteps + marginInSteps;

    const originX = marginInSteps + gridWidthInSteps * 0.5;
    const originY = marginInSteps;

    const gridX = x * width - originX;
    const gridY = y * height - originY;

    let closest = null;
    let closestDistance = BigInt;
    for (const player of projectData.players) {
      const distance = Math.sqrt(
        Math.pow(gridX - player.dots[projectData.currentSet.number].x, 2) + 
        Math.pow(gridY - player.dots[projectData.currentSet.number].y, 2)
      );

      if (distance > drawers.config.playerSize * 2) {
        continue;
      }

      if (distance < closestDistance || !closest) {
        closest = player;
        closestDistance = distance;
      }
    }

    projectData.selected = closest;
    controls.setSelected(projectData.selected, projectData.currentSet.number);
    updateCanvas();
  }

  const changeXandRound = (player, dx) => {
    player.dots[projectData.currentSet.number].x = Math.round(player.dots[projectData.currentSet.number].x + dx);

    const bounds = grid.getBounds();
    player.dots[projectData.currentSet.number].x = Math.max(bounds.left, Math.min(bounds.right, player.dots[projectData.currentSet.number].x));

    updateCanvas();
    controls.setPosition(player.getLeftToRight(projectData.currentSet.number), player.getFrontToBack(projectData.currentSet.number));
  }
  const changeYandRound = (player, dy) => {
    player.dots[projectData.currentSet.number].y = Math.round(player.dots[projectData.currentSet.number].y + dy);

    const bounds = grid.getBounds();
    player.dots[projectData.currentSet.number].y = Math.max(bounds.bottom, Math.min(bounds.top, player.dots[projectData.currentSet.number].y));

    updateCanvas();
    controls.setPosition(player.getLeftToRight(projectData.currentSet.number), player.getFrontToBack(projectData.currentSet.number));
  }
  const changeX = (player, dx) => {
    player.dots[projectData.currentSet.number].x += dx;

    const bounds = grid.getBounds();
    player.dots[projectData.currentSet.number].x = Math.max(bounds.left, Math.min(bounds.right, player.dots[projectData.currentSet.number].x));

    updateCanvas();
    controls.setPosition(player.getLeftToRight(projectData.currentSet.number), player.getFrontToBack(projectData.currentSet.number));
  }
  const changeY = (player, dy) => {
    player.dots[projectData.currentSet.number].y += dy;
    
    const bounds = grid.getBounds();
    player.dots[projectData.currentSet.number].y = Math.max(bounds.bottom, Math.min(bounds.top, player.dots[projectData.currentSet.number].y));

    updateCanvas();
    controls.setPosition(player.getLeftToRight(projectData.currentSet.number), player.getFrontToBack(projectData.currentSet.number));
  }
  controls.callbacks.onRightKeyPressed = () => {
    if (projectData.selected) {
      return changeXandRound(projectData.selected, 1);
    }
    controls.setSet(projectData.currentSet.number + 1);
  };
  controls.callbacks.onLeftKeyPressed = () => {
    if (projectData.selected) {
      return changeXandRound(projectData.selected, -1);
    }
    controls.setSet(projectData.currentSet.number - 1);
  };
  controls.callbacks.onUpKeyPressed = () => {
    if (projectData.selected) {
      changeYandRound(projectData.selected, 1);
    }
  };
  controls.callbacks.onDownKeyPressed = () => {
    if (projectData.selected) {
      changeYandRound(projectData.selected, -1);
    }
  };

  controls.callbacks.onShiftRightKeyPressed = () => {
    if (projectData.selected) {
      changeX(projectData.selected, 0.25);
    }
  };
  controls.callbacks.onShiftLeftKeyPressed = () => {
    if (projectData.selected) {
      changeX(projectData.selected, -0.25);
    }
  };
  controls.callbacks.onShiftUpKeyPressed = () => {
    if (projectData.selected) {
      changeY(projectData.selected, 0.25);
    }
  };
  controls.callbacks.onShiftDownKeyPressed = () => {
    if (projectData.selected) {
      changeY(projectData.selected, -0.25);
    }
  };

  controls.callbacks.onMetaRightKeyPressed = () => {
    if (projectData.selected) {
      changeXandRound(projectData.selected, 7);
    }
  };
  controls.callbacks.onMetaLeftKeyPressed = () => {
    if (projectData.selected) {
      changeXandRound(projectData.selected, -7);
    }
  };
  controls.callbacks.onMetaUpKeyPressed = () => {
    if (projectData.selected) {
      changeYandRound(projectData.selected, 7);
    }
  };
  controls.callbacks.onMetaDownKeyPressed = () => {
    if (projectData.selected) {
      changeYandRound(projectData.selected, -7);
    }
  };

  controls.callbacks.onExportButtonPressed = () => {
    exportCSV(projectData);
  };

  controls.callbacks.onProjectOpened = (project) => {
    io.updateProject(projectData);
    const openedProject = io.getProject(project);
    projectData = openedProject;

    const projects = io.getProjects();
    controls.updateProjects(projectData.name, projects);
  };

  controls.callbacks.onProjectRenamed = (name) => {
    projectData.name = name;
    
    io.updateProject(projectData);
    const projects = io.getProjects();
    controls.updateProjects(projectData.name, projects);
  };

  const openedProject = io.getProject('My Project');
  projectData = openedProject;

  const projects = io.getProjects();
  controls.updateProjects(projectData.name, projects);
  controls.setSet(projectData.currentSet.number);

  updateCanvas();
  field.appendChild(fieldCanvas);
})();
