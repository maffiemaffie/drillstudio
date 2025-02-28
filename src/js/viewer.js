import * as drawers from "./drawers/index.js";

let field = document.querySelector("#field");
let fieldCanvas = document.createElement("canvas");

export const mountCanvas = () => {
  field.appendChild(fieldCanvas);
}

export const drawSet = (canvas, players, selected, grid, set) => {
  const ctx = canvas.getContext("2d");

  ctx.save();
  drawers.drawGrid(grid, {
    ctx,
    width: canvas.width,
    height: canvas.height,
    config: drawers.config,
  });
  ctx.restore();

  ctx.save();

  drawers.cropCanvas(ctx, drawers.config);
  if (set.number > 0 && drawers.config.showGuides) {
    for (const player of players) {
      if (selected && player.label === selected.label) {
        continue;
      }

      drawers.drawGhost(player, set, {
        ctx,
        width: grid.columns * 8,
        height: grid.rows * 8,
        config: drawers.config,
      });

      drawers.drawArrow(player.dots[set.number - 1], player.dots[set.number], {
        ctx,
        config: drawers.config,
      });
    }

    if (selected) {
      drawers.drawArrow(
        selected.dots[set.number - 1],
        selected.dots[set.number],
        {
          ctx,
          config: drawers.config,
        },
        true
      );

      drawers.drawGhost(
        selected,
        set,
        {
          ctx,
          width: grid.columns * 8,
          height: grid.rows * 8,
          config: drawers.config,
        },
        true
      );
    }
  }

  for (const player of players) {
    if (selected && player.label === selected.label) {
      continue;
    }

    drawers.drawPlayer(player, set, {
      ctx,
      width: grid.columns * 8,
      height: grid.rows * 8,
      config: drawers.config,
    });
  }

  if (selected) {
    drawers.drawPlayer(
      selected,
      set,
      {
        ctx,
        width: grid.columns * 8,
        height: grid.rows * 8,
        config: drawers.config,
      },
      true
    );
    ctx.restore();
  }
};

export const updateCanvas = (projectData) => {
  fieldCanvas.width =
    (projectData.grid.columns - 1) * drawers.config.gridSize +
    drawers.config.margin * 2;
  fieldCanvas.height =
    (projectData.grid.rows - 1) * drawers.config.gridSize +
    drawers.config.margin * 2;
  drawSet(
    fieldCanvas,
    projectData.players,
    projectData.selected,
    projectData.grid,
    projectData.currentSet
  );
};

export const viewSpaceToGridSpace = (x, y, projectData) => {
  const marginInSteps = drawers.config.margin / drawers.config.stepSize;
  const gridWidthInSteps = (projectData.grid.columns - 1) * 8;
  const gridHeightInSteps = (projectData.grid.rows - 1) * 8;
  const width = marginInSteps + gridWidthInSteps + marginInSteps;
  const height = marginInSteps + gridHeightInSteps + marginInSteps;

  const originX = marginInSteps + gridWidthInSteps * 0.5;
  const originY = marginInSteps;

  const gridX = x * width - originX;
  const gridY = y * height - originY;
  
  return { gridX, gridY };
}