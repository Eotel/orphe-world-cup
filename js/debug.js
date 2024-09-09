import SoundManager from "./sound.js";
import {gameMenus, ground, MENU_STATES} from "./sketch.js";

import {createElement, createToggle} from "./utils.js";
import {player1Atk, player1Def, player2Atk, player2Def} from "./game_manager";

const setupDebugToggle = () => {
  const toggleButton = document.getElementById("toggle-debug");
  const debugContainer = document.getElementById("debug-container");

  if (!toggleButton || !debugContainer) {
    console.error("Debug toggle button or debug container not found");
    return;
  }

  toggleButton.addEventListener("click", function () {
    if (
      debugContainer.style.display === "none" ||
      debugContainer.style.display === ""
    ) {
      debugContainer.style.display = "block";
      this.textContent = "Hide Debug View";
    } else {
      debugContainer.style.display = "none";
      this.textContent = "Show Debug View";
    }
  });
};

const setupDebugMenu = () => {
  const debugContainer = document.getElementById("debug-container");
  if (!debugContainer) return;

  // Create a row for the debug menu
  const debugRow = createElement("div", "", { className: "row" });

  // Settings menu (including sound toggle)
  const settingsMenu = createElement("div", "", {
    className: "col-md-6 mt-3",
    id: "debug-settings-menu",
  });

  const settingsWrapper = createElement("div", "", {
    className: "bg-dark text-white p-3 rounded",
  });

  const soundToggle = createToggle(
    "Sound",
    SoundManager.isSoundEnabled(),
    function () {
      this.checked = SoundManager.toggleSound();
    },
  );

  settingsWrapper.appendChild(soundToggle);
  settingsMenu.appendChild(settingsWrapper);

  // Player state table
  const playerStateTable = createPlayerStateTable();

  // Add both columns to the row
  debugRow.appendChild(settingsMenu);
  debugRow.appendChild(playerStateTable);

  // Add the row to the debug container
  debugContainer.appendChild(debugRow);

  // プレイヤーの状態を定期的に更新
  setInterval(updatePlayerStateTable, 100);
};

const createPlayerStateTable = () => {
  const tableContainer = createElement("div", "", {
    className: "col-md-6 mt-3",
  });
  const tableWrapper = createElement("div", "", {
    className: "bg-dark text-white p-3 rounded",
  });
  const table = createElement("table", "", {
    className: "table table-dark table-sm orphe-toolkit-table",
  });
  const thead = createElement("thead");
  const tbody = createElement("tbody");

  thead.innerHTML = `
    <tr>
      <th>Player</th>
      <th>Position X</th>
      <th>Position Y</th>
      <th>Angle</th>
      <th>On Ground</th>
    </tr>
  `;

  const players = [
    { name: "Player 1 Def", id: "player-1-def" },
    { name: "Player 1 Atk", id: "player-1-atk" },
    { name: "Player 2 Def", id: "player-2-def" },
    { name: "Player 2 Atk", id: "player-2-atk" },
  ];

  for (const { name, id } of players) {
    const row = createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td id="${id}-x">-</td>
      <td id="${id}-y">-</td>
      <td id="${id}-angle">-</td>
      <td id="${id}-on-ground">-</td>
    `;
    tbody.appendChild(row);
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  tableWrapper.appendChild(table);
  tableContainer.appendChild(tableWrapper);
  return tableContainer;
};

const updatePlayerStateTable = () => {
  if (
    gameMenus.menu !== MENU_STATES.P1_LOCAL_LEFT_SELECTED &&
    gameMenus.menu !== MENU_STATES.P1_LOCAL_RIGHT_SELECTED &&
    gameMenus.menu !== MENU_STATES.P2_LOCAL_SELECTED &&
    gameMenus.menu !== 1000
  )
    return;

  const players = [
    { name: "player-1-def", player: player1Def },
    { name: "player-1-atk", player: player1Atk },
    { name: "player-2-def", player: player2Def },
    { name: "player-2-atk", player: player2Atk },
  ];

  for (const { name, player } of players) {
    updatePlayerElement(`${name}-x`, player.mainBody.position.x.toFixed(2));
    updatePlayerElement(`${name}-y`, player.mainBody.position.y.toFixed(2));
    updatePlayerElement(`${name}-angle`, player.mainBody.angle.toFixed(2));
    updatePlayerElement(
      `${name}-on-ground`,
      player.isOnGround(ground) ? "Yes" : "No",
    );
  }
};

const updatePlayerElement = (id, value) => {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
};

export { setupDebugToggle, setupDebugMenu };
