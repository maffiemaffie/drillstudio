import * as model from "./model.js";

export const callbacks = {
  onPlayerAdded: (playerData) => {
    console.log(Object.fromEntries(playerData.entries()));
  },
  onPlayerEdited: (labels) => {
    console.log(labels);
  },
  onRowsChanged: (rows) => {
    console.log(rows);
  },
  onColumnsChanged: (columns) => {
    console.log(columns);
  },
  onSetChanged: (setNumber) => {
    console.log(setNumber);
    return 0;
  },
  onSetAdded: () => {
    console.log("set added");
    return 0;
  },
  onSetEdited: (setData) => {
    console.log(setData);
  },
  onFieldClicked: (x, y) => {
    console.log(x, y);
  },
  onRightKeyPressed: () => {
    console.log("right key pressed");
  },
  onLeftKeyPressed: () => {
    console.log("left key pressed");
  },
  onUpKeyPressed: () => {
    console.log("up key pressed");
  },
  onDownKeyPressed: () => {
    console.log("down key pressed");
  },
  onShiftRightKeyPressed: () => {
    console.log("shift + right key pressed");
  },
  onShiftLeftKeyPressed: () => {
    console.log("shift + left key pressed");
  },
  onShiftUpKeyPressed: () => {
    console.log("shift + up key pressed");
  },
  onShiftDownKeyPressed: () => {
    console.log("shift + down key pressed");
  },
  onMetaRightKeyPressed: () => {
    console.log("meta + right key pressed");
  },
  onMetaLeftKeyPressed: () => {
    console.log("meta + left key pressed");
  },
  onMetaUpKeyPressed: () => {
    console.log("meta + up key pressed");
  },
  onMetaDownKeyPressed: () => {
    console.log("meta + down key pressed");
  },
  onExportButtonPressed: () => {
    console.log("export button pressed");
  },
  onExportDetailButtonPressed: () => {
    console.log("export detail button pressed");
  },
  onProjectOpened: (project) => {
    console.log(`project ${project} opened`);
  },
  onProjectRenamed: (name) => {
    console.log("project renamed to " + name);
  },
  onProjectCreated: (name) => {
    console.log("new project created: " + name);
  },
  onAnimationStepForward: (progress) => {
    console.log("stepping animation forward");
  },
  onAnimationStart: () => {
    console.log("start animation");
  },
  onAnimationStop: () => {
    console.log("end animation");
  },
  onTempoChanged: (tempo) => {
    console.log("tempo changed to " + tempo);
  },
  onOpenFile: (file) => {
    console.log("open file");
  },
  onSaveFile: () => {
    console.log("save file")
  }
};

export const setSelected = (player, setNumber) => {
  const form = document.querySelector("#edit-player");
  const labelInput = document.querySelector("#edit-player input[name=label]");
  const fieldControls = document.querySelector("#field-controls");

  if (!player) {
    form.setAttribute("disabled", "");
    fieldControls.removeAttribute("disabled", "");
    labelInput.value = "";
    return;
  }

  form.removeAttribute("disabled");
  fieldControls.setAttribute("disabled", "");

  labelInput.value = player.label;

  setPosition(
    player.getLeftToRight(setNumber),
    player.getFrontToBack(setNumber)
  );
};

export const setPosition = (x, y) => {
  const xDisplay = document.querySelector("#left-to-right-display");
  const yDisplay = document.querySelector("#front-to-back-display");

  xDisplay.textContent = x;
  yDisplay.textContent = y;
};

export const setSet = (setNumber) => {
  const setInput = document.querySelector("#set-number");
  const countsInput = document.querySelector("#counts");
  const measureInput = document.querySelector("#measure");
  const tempoInput = document.querySelector("#tempo");
  const set = callbacks.onSetChanged(setNumber);
  setInput.value = set.number;
  countsInput.value = set.counts;
  measureInput.value = set.measure;
  tempoInput.value = set.tempo;
};

export const updateProjects = (opened, projectNames) => {
  updateName(opened);

  const projectSelect = document.querySelector("#project-select");
  projectSelect.innerHTML = "";

  for (const name of projectNames) {
    projectSelect.appendChild(new Option(name, name, false, opened === name));
  }
};

// export const setTempo = (tempo) => {
//   const tempoInput = document.querySelector("#tempo");
//   tempoInput.value = tempo;
// }

const updateName = (name) => {
  const projectName = document.querySelector("#project-name");
  projectName.value = name;
};

const setBoundsRows = (rows) => {
  const yInput = document.querySelector("#edit-player input[name=y]");

  yInput.setAttribute("max", 8 * (rows - 1));
};

const setBoundsColumns = (columns) => {
  const xInput = document.querySelector("#edit-player input[name=x]");

  xInput.setAttribute("max", 8 * columns);
  xInput.setAttribute("min", -8 * columns);
};


(() => {
  const grid = document.querySelector("#field");
  const rowsInput = document.querySelector("#field-rows");
  const columnsInput = document.querySelector("#field-columns");
  const addPlayer = document.querySelector("#add-player");
  const editPlayer = document.querySelector("#edit-player");
  const editPlayerFields = document.querySelectorAll("#edit-player input");
  const previousSetButton = document.querySelector("#previous-set");
  const nextSetButton = document.querySelector("#next-set");
  const newSetButton = document.querySelector("#new-set");
  const setInput = document.querySelector("#set-number");
  const editSetFields = document.querySelectorAll(
    "#set-controls input[type=number]"
  );
  const exportButton = document.querySelector("#export");
  const exportDetailButton = document.querySelector("#export-detail");
  const projectControls = document.querySelector("#project-controls");
  const projectSelect = document.querySelector("#project-select");
  const projectName = document.querySelector("#project-name");
  const newProjectControls = document.querySelector("#new-project-controls");
  const newProjectName = document.querySelector("#new-project-name");
  const newProjectButton = document.querySelector("#new-project-button");
  const animateNextSetButton = document.querySelector("#animate-next-set");
  const openProjectFileButton = document.querySelector("#open-file");
  const saveProjectFileButton = document.querySelector("#save-file");

  setSelected(null, 0);

  rowsInput.addEventListener("change", (e) => {
    callbacks.onRowsChanged(parseInt(e.target.value));
    setBoundsRows(parseInt(e.target.value));
  });
  columnsInput.addEventListener("change", (e) => {
    callbacks.onColumnsChanged(parseInt(e.target.value));
    setBoundsColumns(parseInt(e.target.value));
  });

  addPlayer.addEventListener("submit", (e) => {
    e.preventDefault();
    const labelInput = document.querySelector("#add-player input[name=label]");
    const data = new FormData(e.target);
    const labels = data.get("label").split(/ *, */);
    labelInput.value = "";
    callbacks.onPlayerAdded(labels);
    return false;
  });

  editPlayer.addEventListener("submit", (e) => {
    e.preventDefault();
    return false;
  });
  for (const field of editPlayerFields) {
    field.addEventListener("change", (e) => {
      callbacks.onPlayerEdited(new FormData(e.target.form));
    });
  }

  previousSetButton.addEventListener("click", () => {
    setSet(parseInt(setInput.value) - 1);
  });
  nextSetButton.addEventListener("click", () => {
    setSet(parseInt(setInput.value) + 1);
  });
  setInput.addEventListener("change", (e) => {
    setSet(parseInt(e.target.value));
  });
  newSetButton.addEventListener("click", () => {
    setInput.value = callbacks.onSetAdded();
    setSet(parseInt(setInput.value));
  });
  for (const field of editSetFields) {
    field.addEventListener("change", (e) => {
      callbacks.onSetEdited(new FormData(e.target.form));
    });
  }

  grid.addEventListener("click", (e) => {
    const rect = grid.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;

    callbacks.onFieldClicked(x / width, 1 - y / height);
  });

  document.addEventListener("keydown", (e) => {
    if (!e.shiftKey) {
      switch (e.key) {
        case "ArrowRight":
          callbacks.onRightKeyPressed();
          e.preventDefault();
          break;
        case "ArrowLeft":
          callbacks.onLeftKeyPressed();
          e.preventDefault();
          break;
        case "ArrowUp":
          callbacks.onUpKeyPressed();
          e.preventDefault();
          break;
        case "ArrowDown":
          callbacks.onDownKeyPressed();
          e.preventDefault();
          break;
      }
    }

    if (e.shiftKey) {
      switch (e.key) {
        case "ArrowRight":
          callbacks.onShiftRightKeyPressed();
          e.preventDefault();
          break;
        case "ArrowLeft":
          callbacks.onShiftLeftKeyPressed();
          e.preventDefault();
          break;
        case "ArrowUp":
          callbacks.onShiftUpKeyPressed();
          e.preventDefault();
          break;
        case "ArrowDown":
          callbacks.onShiftDownKeyPressed();
          e.preventDefault();
          break;
      }
    }

    if (e.metaKey) {
      switch (e.key) {
        case "ArrowRight":
          callbacks.onMetaRightKeyPressed();
          e.preventDefault();
          break;
        case "ArrowLeft":
          callbacks.onMetaLeftKeyPressed();
          e.preventDefault();
          break;
        case "ArrowUp":
          callbacks.onMetaUpKeyPressed();
          e.preventDefault();
          break;
        case "ArrowDown":
          callbacks.onMetaDownKeyPressed();
          e.preventDefault();
          break;
      }
    }
  });

  exportButton.addEventListener("click", () => {
    callbacks.onExportButtonPressed();
  });

  exportDetailButton.addEventListener("click", () => {
    callbacks.onExportDetailButtonPressed();
  });

  openProjectFileButton.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      callbacks.onOpenFile(file);
    }
    e.target.value = null;
  });

  saveProjectFileButton.addEventListener("click", () => {
    callbacks.onSaveFile();
  });

  projectControls.addEventListener("submit", (e) => {
    e.preventDefault();
    return false;
  });
  projectSelect.addEventListener("change", (e) => {
    callbacks.onProjectOpened(e.target.value);
  });

  projectName.addEventListener("change", (e) => {
    callbacks.onProjectRenamed(e.target.value);
  });

  newProjectControls.addEventListener("submit", (e) => {
    e.preventDefault();
    return false;
  });

  newProjectButton.addEventListener("click", () => {
    callbacks.onProjectCreated(newProjectName.value);
    callbacks.onProjectOpened(newProjectName.value);
  });

  // tempo.addEventListener("click", (tempo) => {
  //   callbacks.onTempoChanged(tempo);
  // })

  animateNextSetButton.addEventListener("click", () => {
    const counts = parseInt(document.querySelector("#counts").value);
    const tempo = parseInt(document.querySelector("#tempo").value);
    const currentSet = model.getCurrentSet().number;
    const totalSets = model.getAll().sets.length;

    console.log(currentSet, totalSets);
    if (currentSet + 1 >= totalSets) {
      return;
    }

    if (!counts) {
      callbacks.onAnimationStop();
      return;
    }

    const forms = document.querySelectorAll("form");
    for (const form of forms) {
      form.setAttribute("disabled", true);
    }

    callbacks.onAnimationStart();

    const countDuration = 60000 / tempo;
    const duration = countDuration * counts;
    const durationFrames = duration * 0.001 * 30;

    setTimeout(() => {
      callbacks.onAnimationStop();
      for (const form of forms) {
        form.removeAttribute("disabled");
      }
    }, duration);

    let frames = 0;
    const anim = setInterval(() => {
      frames++;
      callbacks.onAnimationStepForward(frames / durationFrames);

      if (frames >= durationFrames) {
        clearInterval(anim);
      }
    }, 1000 / 30);
  });
})();
