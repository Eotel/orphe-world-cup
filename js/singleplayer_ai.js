// ************************************************
// Teugg Soccer Physics
// Rip-off of the once popular Soccer Physics game
// Horribly coded by : Kevin Le Teugg, 2020
// File : singleplayer_ai.js
// Description : Contains the AI algorithm(s) for the bot player in single player mode
// ************************************************

import {AI_CONFIG, GAME_COEFFICIENTS, ground} from "./sketch.js";

class SinglePlayerAI {
  constructor({ previousTimingAI, randTimingAI, choosePlayerAI }) {
    this.previousTimingAI = previousTimingAI;
    this.randTimingAI = randTimingAI;
    this.choosePlayerAI = choosePlayerAI;
  }

  tickAI(playerDef, playerAtk) {
    if (frameCount - this.previousTimingAI >= this.randTimingAI) {
      if (this.choosePlayerAI <= 0.1) {
        if (playerDef.isOnGround(ground)) {
          playerDef.cstrLegs.stiffness = 0.00001;
          playerDef.kick(GAME_COEFFICIENTS.KICK_FORCE);
          playerDef.jump();
          playerDef.cstrLegs.stiffness = 0.06;
          //console.log("playerDef jumped");
          //console.log(playerDef.isOnGround(ground));
        }
      }
      if (this.choosePlayerAI > 0.1 && this.choosePlayerAI <= 0.8) {
        if (playerAtk.isOnGround(ground)) {
          playerAtk.cstrLegs.stiffness = 0.00001;
          playerAtk.kick(GAME_COEFFICIENTS.KICK_FORCE);
          playerAtk.jump();
          playerAtk.cstrLegs.stiffness = 0.06;
        }
      } else {
        if (playerAtk.isOnGround(ground) && playerDef.isOnGround(ground)) {
          playerDef.cstrLegs.stiffness = 0.00001;
          playerDef.kick(GAME_COEFFICIENTS.KICK_FORCE);
          playerDef.jump();
          playerDef.cstrLegs.stiffness = 0.06;
          playerAtk.cstrLegs.stiffness = 0.00001;
          playerAtk.kick(GAME_COEFFICIENTS.KICK_FORCE);
          playerAtk.jump();
          playerAtk.cstrLegs.stiffness = 0.06;
        }
      }
      this.randTimingAI = random(
        AI_CONFIG.LOWER_BOUND_TIMING,
        AI_CONFIG.UPPER_BOUND_TIMING,
      );
      this.choosePlayerAI = random(0.0, 1.0);
      this.previousTimingAI = frameCount;
    }
  }

  // LITTLE FUNNY TEST FOR AI (aimed for player 2)
  /*this.AItest = function(playerDef, playerAtk) {
    if (playerAtk.isOnGround(ground)) {
      if (mouseY >= CANVAS_HEIGHT - playerAtk.mainBody.position.x) {
        if (mouseX <= playerAtk.mainBody.position.x - 10) {
          playerAtk.kick();
          playerAtk.jump();
        }
      }
    }
    if (playerDef.isOnGround(ground)) {
      if (mouseY >= CANVAS_HEIGHT - playerDef.mainBody.position.x) {
        if (mouseX <= playerDef.mainBody.position.x - 10) {
          playerDef.kick();
          playerDef.jump();
        }
      }
    }
  }*/
}

export default SinglePlayerAI;
