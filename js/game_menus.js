// ************************************************
// Teugg Soccer Physics
// Rip-off of the once popular Soccer Physics game
// Horribly coded by : Kevin Le Teugg, 2020
// File : game_menus.js
// Description : Game menus manager
// ************************************************

import { OrpheManager } from "./orphe.js";
import { main } from "./main.js";
import {
  MENU_BUTTON,
  MENU_STATES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  background0,
  gameMenus,
} from "./sketch.js";
import SoundManager from "./sound.js";

class GameMenus {
  constructor() {
    this.menu = MENU_STATES.MAIN_MENU;
    console.log("GameMenus initialized: ", this.menu);
  }
  reset() {
    this.menu = MENU_STATES.MAIN_MENU;
  }
  draw() {
    // MAIN MENU
    if (this.menu === MENU_STATES.MAIN_MENU) {
      image(background0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      rectMode(CENTER);
      fill(0, 255, 40);
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 4,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      fill(0, 100, 255);
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      fill(0, 100, 255);
      rect(
        CANVAS_WIDTH / 2,
        (CANVAS_HEIGHT * 3) / 4,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      textSize(20);
      fill(255);
      textAlign(CENTER, CENTER);
      text("1 PLAYER - LOCAL", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
      text("2 PLAYERS - LOCAL", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      text("2 PLAYERS - ONLINE", CANVAS_WIDTH / 2, (CANVAS_HEIGHT * 3) / 4);
    }

    // 1 PLAYER - LOCAL | CHOOSE SIDE
    if (this.menu === MENU_STATES.P1_LOCAL_CHOOSE_SIDE_MENU) {
      image(background0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      textAlign(CENTER, CENTER);
      textSize(CANVAS_HEIGHT / 24);
      fill(255);
      text("Choose side", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);
      rectMode(CENTER);
      fill(0, 255, 40);
      rect(
        CANVAS_WIDTH / 3,
        CANVAS_HEIGHT / 2,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      fill(0, 100, 255);
      rect(
        (CANVAS_WIDTH * 2) / 3,
        CANVAS_HEIGHT / 2,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      textSize(20);
      fill(255);
      text("LEFT", CANVAS_WIDTH / 3, CANVAS_HEIGHT / 2);
      text("RIGHT", (CANVAS_WIDTH * 2) / 3, CANVAS_HEIGHT / 2);
      // Drawing back to main menu button
      push();
      rectMode(CENTER);
      fill(170, 60, 0);
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - MENU_BUTTON.HEIGHT,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(255);
      text(
        "BACK TO MAIN MENU",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - MENU_BUTTON.HEIGHT,
      );
      pop();
    }

    // 2 PLAYERS - LOCAL
    if (this.menu === MENU_STATES.P2_LOCAL_SELECTED) {
    }

    // 2 PLAYERS - ONLINE
    if (this.menu === MENU_STATES.P2_ONLINE_MENU) {
      image(background0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      textAlign(CENTER, CENTER);
      textSize(30);
      fill(255);
      rectMode(CENTER);
      fill(0, 255, 40);
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 - MENU_BUTTON.HEIGHT / 2,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      fill(0, 100, 255);
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + MENU_BUTTON.HEIGHT / 2,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      textSize(20);
      fill(255);
      text(
        "CREATE NEW GAME",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 - MENU_BUTTON.HEIGHT / 2,
      );
      text(
        "JOIN EXISTING GAME",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + MENU_BUTTON.HEIGHT / 2,
      );

      // Drawing back to main menu button
      push();
      rectMode(CENTER);
      fill(170, 60, 0);
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - MENU_BUTTON.HEIGHT,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(255);
      text(
        "BACK TO MAIN MENU",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - MENU_BUTTON.HEIGHT,
      );
      pop();
    }

    // 1 PLAYER - LOCAL | LEFT
    if (this.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED) {
    }

    // 1 PLAYER - LOCAL | RIGHT
    if (this.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED) {
      /*image(background0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      textAlign(CENTER, CENTER);
      textSize(60);
      fill(200, 220, 30);
      text('UNDER CONSTRUCTION', (CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2));*/
    }

    //
    if (this.menu === MENU_STATES.P2_ONLINE_CREATE_MENU) {
      image(background0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      textAlign(CENTER, CENTER);
      textSize(60);
      fill(200, 220, 30);
      text("CREATE", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      text("UNDER CONSTRUCTION", CANVAS_WIDTH / 2, (CANVAS_HEIGHT * 2) / 3);
      // Drawing back to main menu button
      push();
      rectMode(CENTER);
      fill(170, 60, 0);
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - MENU_BUTTON.HEIGHT,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(255);
      text(
        "BACK TO MAIN MENU",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - MENU_BUTTON.HEIGHT,
      );
      pop();

      const lobbyName = prompt("Enter lobby name");
      // Sending lobby name to server (working) //socket.emit('createLobbyMessage', lobbyName);
    }

    if (this.menu === MENU_STATES.P2_ONLINE_JOIN_MENU) {
      image(background0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      textAlign(CENTER, CENTER);
      textSize(60);
      fill(200, 220, 30);
      text("JOIN", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      text("UNDER CONSTRUCTION", CANVAS_WIDTH / 2, (CANVAS_HEIGHT * 2) / 3);
      // Drawing back to main menu button
      push();
      rectMode(CENTER);
      fill(170, 60, 0);
      rect(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - MENU_BUTTON.HEIGHT,
        MENU_BUTTON.WIDTH,
        MENU_BUTTON.HEIGHT,
      );
      textAlign(CENTER, CENTER);
      textSize(20);
      fill(255);
      text(
        "BACK TO MAIN MENU",
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT - MENU_BUTTON.HEIGHT,
      );
      pop();

      const lobbyCode = prompt("Enter code");
    }
  }

  clickedOn() {
    if (this.menu === MENU_STATES.MAIN_MENU) {
      if (
        mouseX < CANVAS_WIDTH / 2 + MENU_BUTTON.WIDTH / 2 &&
        mouseX > CANVAS_WIDTH / 2 - MENU_BUTTON.WIDTH / 2
      ) {
        if (
          mouseY < CANVAS_HEIGHT / 4 + MENU_BUTTON.HEIGHT / 2 &&
          mouseY > CANVAS_HEIGHT / 4 - MENU_BUTTON.HEIGHT / 2
        ) {
          this.menu = MENU_STATES.P1_LOCAL_CHOOSE_SIDE_MENU;
        }
        if (
          mouseY < CANVAS_HEIGHT / 2 + MENU_BUTTON.HEIGHT / 2 &&
          mouseY > CANVAS_HEIGHT / 2 - MENU_BUTTON.HEIGHT / 2
        ) {
          this.menu = MENU_STATES.P2_LOCAL_SELECTED;
          SoundManager.playBGM();
          SoundManager.playLongWhistleSound();
          SoundManager.startCloudOrpheOneshot();
        }
        if (
          mouseY < (CANVAS_HEIGHT * 3) / 4 + MENU_BUTTON.HEIGHT / 2 &&
          mouseY > (CANVAS_HEIGHT * 3) / 4 - MENU_BUTTON.HEIGHT / 2
        ) {
          this.menu = MENU_STATES.P2_ONLINE_MENU;
        }
        // EASTER EGG, SPECTATOR MODE BETWEEN TWO AIs
        if (mouseY < CANVAS_HEIGHT && mouseY > CANVAS_HEIGHT - 15) {
          this.menu = 1000;
        }
      }
    }
    if (this.menu === MENU_STATES.P1_LOCAL_CHOOSE_SIDE_MENU) {
      // RETURN TO MAIN MENU
      if (
        mouseX < CANVAS_WIDTH / 2 + MENU_BUTTON.WIDTH / 2 &&
        mouseX > CANVAS_WIDTH / 2 - MENU_BUTTON.WIDTH / 2 &&
        mouseY < CANVAS_HEIGHT - MENU_BUTTON.HEIGHT / 2 &&
        mouseY > CANVAS_HEIGHT - (MENU_BUTTON.HEIGHT * 3) / 2
      ) {
        this.menu = MENU_STATES.MAIN_MENU;
      }
      if (
        mouseY < CANVAS_HEIGHT / 2 + MENU_BUTTON.HEIGHT / 2 &&
        mouseY > CANVAS_HEIGHT / 2 - MENU_BUTTON.HEIGHT / 2
      ) {
        if (
          mouseX < CANVAS_WIDTH / 3 + MENU_BUTTON.WIDTH / 2 &&
          mouseX > CANVAS_WIDTH / 3 - MENU_BUTTON.WIDTH / 2
        ) {
          this.menu = MENU_STATES.P1_LOCAL_LEFT_SELECTED;
          SoundManager.playBGM();
          SoundManager.playLongWhistleSound();
          SoundManager.startCloudOrpheOneshot();
        }
        if (
          mouseX < (CANVAS_WIDTH * 2) / 3 + MENU_BUTTON.WIDTH / 2 &&
          mouseX > (CANVAS_WIDTH * 2) / 3 - MENU_BUTTON.WIDTH / 2
        ) {
          this.menu = MENU_STATES.P1_LOCAL_RIGHT_SELECTED;
          SoundManager.playBGM();
          SoundManager.playLongWhistleSound();
          SoundManager.startCloudOrpheOneshot();
        }
      }
    }
    if (this.menu === MENU_STATES.P2_ONLINE_MENU) {
      // RETURN TO MAIN MENU
      if (
        mouseX < CANVAS_WIDTH / 2 + MENU_BUTTON.WIDTH / 2 &&
        mouseX > CANVAS_WIDTH / 2 - MENU_BUTTON.WIDTH / 2 &&
        mouseY < CANVAS_HEIGHT - MENU_BUTTON.HEIGHT / 2 &&
        mouseY > CANVAS_HEIGHT - (MENU_BUTTON.HEIGHT * 3) / 2
      ) {
        this.menu = MENU_STATES.MAIN_MENU;
      }
      if (
        mouseX < CANVAS_WIDTH / 2 + MENU_BUTTON.WIDTH / 2 &&
        mouseX > CANVAS_WIDTH / 2 - MENU_BUTTON.WIDTH / 2
      ) {
        if (
          mouseY < CANVAS_HEIGHT / 2 &&
          mouseY > CANVAS_HEIGHT / 2 - MENU_BUTTON.HEIGHT
        ) {
          this.menu = MENU_STATES.P2_ONLINE_CREATE_MENU;
        }
        if (
          mouseY > CANVAS_HEIGHT / 2 &&
          mouseY < CANVAS_HEIGHT / 2 + MENU_BUTTON.HEIGHT
        ) {
          this.menu = MENU_STATES.P2_ONLINE_JOIN_MENU;
        }
      }
    }
    if (this.menu === MENU_STATES.P2_ONLINE_CREATE_MENU) {
      // RETURN TO MAIN MENU
      if (
        mouseX < CANVAS_WIDTH / 2 + MENU_BUTTON.WIDTH / 2 &&
        mouseX > CANVAS_WIDTH / 2 - MENU_BUTTON.WIDTH / 2 &&
        mouseY < CANVAS_HEIGHT - MENU_BUTTON.HEIGHT / 2 &&
        mouseY > CANVAS_HEIGHT - (MENU_BUTTON.HEIGHT * 3) / 2
      ) {
        this.menu = MENU_STATES.MAIN_MENU;
      }
    }
    if (this.menu === MENU_STATES.P2_ONLINE_JOIN_MENU) {
      // RETURN TO MAIN MENU
      if (
        mouseX < CANVAS_WIDTH / 2 + MENU_BUTTON.WIDTH / 2 &&
        mouseX > CANVAS_WIDTH / 2 - MENU_BUTTON.WIDTH / 2 &&
        mouseY < CANVAS_HEIGHT - MENU_BUTTON.HEIGHT / 2 &&
        mouseY > CANVAS_HEIGHT - (MENU_BUTTON.HEIGHT * 3) / 2
      ) {
        this.menu = MENU_STATES.MAIN_MENU;
      }
    }
  }

  logic() {
    // Drawing main menu
    if (this.menu === MENU_STATES.MAIN_MENU) {
      gameMenus.draw();
    }

    // 1 PLAYER - LOCAL | CHOOSE SIDE
    else if (this.menu === MENU_STATES.P1_LOCAL_CHOOSE_SIDE_MENU) {
      gameMenus.draw();
    }

    // 2 PLAYERS - LOCAL
    else if (this.menu === MENU_STATES.P2_LOCAL_SELECTED) {
      OrpheManager.checkKickAndJump();
      main();
    }

    // 2 PLAYERS - ONLINE
    else if (this.menu === MENU_STATES.P2_ONLINE_MENU) {
      gameMenus.draw();
    }

    // 1 PLAYER - LOCAL |LEFT
    else if (this.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED) {
      OrpheManager.checkKickAndJump();
      main();
    }

    // 1 PLAYER - LOCAL | RIGHT
    else if (this.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED) {
      OrpheManager.checkKickAndJump();
      gameMenus.draw();
      main();
    }

    // P2_ONLINE_CREATE_MENU
    else if (this.menu === 6) {
      gameMenus.draw();
    }

    // P2_ONLINE_JOIN_MENU
    else if (this.menu === 7) {
      gameMenus.draw();
    }

    // EASTER EGG, SPECTATOR MODE BETWEEN TWO AIs
    else if (this.menu === 1000) {
      OrpheManager.checkKickAndJump();
      main();
    }
  }
}

export default GameMenus;
