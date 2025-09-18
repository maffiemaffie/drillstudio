import * as drawers from "./drawers/index.js";

let field = document.querySelector("#field");
export const fieldCanvas = document.createElement("canvas");

export const mountCanvas = () => {
  field.appendChild(fieldCanvas);
};

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
  if (drawers.config.showGuidesAll || (drawers.config.showGuidesSelected && selected)) {
    for (const player of players) {
      if (selected && player.label === selected.label) {
        continue;
      }

      // only selected enabled and player is not selected
      if (!drawers.config.showGuidesAll && selected.label !== player.label) {
        continue;
      }

      drawers.drawGhost(player, set, {
        ctx,
        width: grid.columns * 8,
        height: grid.rows * 8,
        config: drawers.config,
      });

      if (player.dots[set.number - 1])
        drawers.drawLastArrow(player.dots[set.number - 1], player.dots[set.number], {
          ctx,
          config: drawers.config,
        });

      if (player.dots[set.number + 1])
        drawers.drawNextArrow(player.dots[set.number], player.dots[set.number + 1], {
          ctx,
          config: drawers.config,
        });
    }

    if (selected) {
      if (selected.dots[set.number - 1])
        drawers.drawLastArrow(
          selected.dots[set.number - 1],
          selected.dots[set.number],
          {
            ctx,
            config: drawers.config,
          },
          true
        );

      if (selected.dots[set.number + 1])
        drawers.drawNextArrow(
          selected.dots[set.number],
          selected.dots[set.number + 1],
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

export const drawBetweenSets = (canvas, players, grid, startSet, endSet, progress) => {
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

  for (const player of players) {
    drawers.drawPlayerBetweenSets(player, startSet, endSet, progress, {
      ctx,
      width: grid.columns * 8,
      height: grid.rows * 8,
      config: drawers.config,
    });
  }
};

export const updateCanvas = (canvas, projectData) => {
  canvas.width =
    (projectData.grid.columns - 1) * drawers.config.gridSize +
    drawers.config.margin * 2;
  canvas.height =
    (projectData.grid.rows - 1) * drawers.config.gridSize +
    drawers.config.margin * 2;
  drawSet(
    canvas,
    projectData.players,
    projectData.selected,
    projectData.grid,
    projectData.currentSet
  );
};

export const updateAnimation = (projectData, progress) => {
  fieldCanvas.width =
    (projectData.grid.columns - 1) * drawers.config.gridSize +
    drawers.config.margin * 2;
  fieldCanvas.height =
    (projectData.grid.rows - 1) * drawers.config.gridSize +
    drawers.config.margin * 2;
  drawBetweenSets(
    fieldCanvas,
    projectData.players,
    projectData.grid,
    projectData.currentSet,
    projectData.sets[projectData.currentSet.number + 1],
    progress
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
};
