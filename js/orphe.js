import * as THREE from "three";
import {GAME_COEFFICIENTS, gameMenus, ground, liftBall, MENU_STATES,} from "./sketch.js";
import {player1Atk, player1Def, player2Atk, player2Def} from "./game_manager.js";
import SoundManager from "./sound.js";

export const OrpheManager = {
  acc: [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ],
  acc_prev: [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ],
  pitch: [0, 0],
  impact: [0, 0],
  jump_power: [0, 0],

  scenes: [],
  cameras: [],
  renderers: [],
  cubes: [],

  setupCores: () => {
    for (const core of cores) {
      core.setup(["DEVICE_INFORMATION", "SENSOR_VALUES", "STEP_ANALYSIS"]);
    }
  },

  embedToolkits: function () {
    const container = document.getElementById("orphe-toolkit-holder");
    if (!container) {
      console.error("Orphe toolkit holder not found");
      return;
    }

    for (const core of cores) {
      const index = cores.indexOf(core);
      const toolkitContainer = document.getElementById(
        `orphe-toolkit-${index}`,
      );
      if (!toolkitContainer) {
        console.error(`Orphe toolkit container ${index} not found`);
        continue;
      }

      // Clear existing content
      toolkitContainer.innerHTML = "";

      buildCoreToolkit(
        toolkitContainer,
        `0${index + 1}`,
        core.id,
        "SENSOR_VALUES",
      );

      this.createDataTable(toolkitContainer, index);
    }
  },

  createDataTable: (container, index) => {
    const table = document.createElement("table");
    table.className = "table table-dark table-sm orphe-toolkit-table";
    table.style.tableLayout = "fixed";
    table.innerHTML = `
    <colgroup>
      <col style="width: 30%;">
      <col style="width: 17.5%;">
      <col style="width: 17.5%;">
      <col style="width: 17.5%;">
      <col style="width: 17.5%;">
    </colgroup>
    <thead>
      <tr>
        <th scope="col">Data</th>
        <th scope="col">X</th>
        <th scope="col">Y</th>
        <th scope="col">Z</th>
        <th scope="col">W</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Quaternion</th>
        <td id="quat-x-${index}"></td>
        <td id="quat-y-${index}"></td>
        <td id="quat-z-${index}"></td>
        <td id="quat-w-${index}"></td>
      </tr>
      <tr>
        <th scope="row">Gyroscope</th>
        <td id="gyro-x-${index}"></td>
        <td id="gyro-y-${index}"></td>
        <td id="gyro-z-${index}"></td>
        <td></td>
      </tr>
      <tr>
        <th scope="row">Accelerometer</th>
        <td id="acc-x-${index}"></td>
        <td id="acc-y-${index}"></td>
        <td id="acc-z-${index}"></td>
        <td></td>
      </tr>
    </tbody>
  `;
    container.appendChild(table);

    const canvas = document.createElement("canvas");
    canvas.id = `orphe-3d-${index}`;
    canvas.className = "orphe-3d-canvas";
    canvas.width = 200;
    canvas.height = 200;
    container.appendChild(canvas);

    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(200, 200);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 3;

    OrpheManager.scenes[index] = scene;
    OrpheManager.cameras[index] = camera;
    OrpheManager.renderers[index] = renderer;
    OrpheManager.cubes[index] = cube;

    renderer.render(scene, camera);
  },

  setupEventListeners: () => {
    cores.forEach((core, index) => {
      core.gotQuat = (quat) => {
        document.getElementById(`quat-x-${index}`).textContent =
          quat.x.toFixed(2);
        document.getElementById(`quat-y-${index}`).textContent =
          quat.y.toFixed(2);
        document.getElementById(`quat-z-${index}`).textContent =
          quat.z.toFixed(2);
        document.getElementById(`quat-w-${index}`).textContent =
          quat.w.toFixed(2);
        this.updateVisualization(index, quat);
      };

      core.gotGyro = (gyro) => {
        document.getElementById(`gyro-x-${index}`).textContent =
          gyro.x.toFixed(2);
        document.getElementById(`gyro-y-${index}`).textContent =
          gyro.y.toFixed(2);
        document.getElementById(`gyro-z-${index}`).textContent =
          gyro.z.toFixed(2);
      };

      core.gotAcc = (acc) => {
        document.getElementById(`acc-x-${index}`).textContent =
          acc.x.toFixed(2);
        document.getElementById(`acc-y-${index}`).textContent =
          acc.y.toFixed(2);
        document.getElementById(`acc-z-${index}`).textContent =
          acc.z.toFixed(2);

        OrpheManager.acc_prev[index] = OrpheManager.acc[index];
        OrpheManager.acc[index] = acc;
        OrpheManager.impact[index] =
          100 *
          Math.sqrt(
            (OrpheManager.acc[index].x - OrpheManager.acc_prev[index].x) ** 2 +
              (OrpheManager.acc[index].y - OrpheManager.acc_prev[index].y) ** 2,
          );
        OrpheManager.jump_power[index] =
          100 *
          Math.sqrt(
            (OrpheManager.acc[index].z - OrpheManager.acc_prev[index].z) ** 2,
          );
      };

      core.gotEuler = (euler) => {
        OrpheManager.pitch[index] = euler.pitch;
      };
    });
  },

  checkKickAndJump: () => {
    if (
      gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED ||
      gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED
    ) {
      OrpheManager.checkPlayerActions(0, player1Def, player1Atk);
      OrpheManager.checkPlayerActions(1, player2Def, player2Atk);
    }
  },

  checkPlayerActions: (index, defPlayer, atkPlayer) => {
    const kickAction = (player) => {
      player.cstrLegs.stiffness = 0;
      player.kick(GAME_COEFFICIENTS.KICK_FORCE);
      liftBall(player);
      setTimeout(() => {
        player.cstrLegs.stiffness = GAME_COEFFICIENTS.IDLE_LEG_STIFFNESS;
      }, 200);
    };

    if (OrpheManager.impact[index] > 30) {
      kickAction(defPlayer);
      kickAction(atkPlayer);
      SoundManager.playKickSound();
    }

    if (OrpheManager.jump_power[index] > 30) {
      for (const player of [defPlayer, atkPlayer]) {
        if (player.isOnGround(ground)) {
          player.jump();
          liftBall(player);
        }
      }
    }
  },

  updateVisualization: (index, quat) => {
    const cube = OrpheManager.cubes[index];
    if (!cube) return;

    cube.quaternion.set(quat.x, quat.y, quat.z, quat.w);

    OrpheManager.renderers[index].render(
      OrpheManager.scenes[index],
      OrpheManager.cameras[index],
    );
  },

  initialize() {
    this.setupCores();
    this.embedToolkits();
    this.setupEventListeners();
  },
};

// Initialize Orphe when the window loads
window.addEventListener("load", () => {
  if (typeof cores !== "undefined" && cores.length > 0) {
    OrpheManager.initialize();
  } else {
    console.error(
      "Cores array is not defined or empty. Make sure CoreToolkit is properly loaded.",
    );
  }
});
