import {player1Atk, player1Def, player2Atk, player2Def,} from "./game_manager.js";
import {OrpheManager} from "./orphe.js";
import {
  background0,
  ball,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  engine,
  GAME_COEFFICIENTS,
  gameManager,
  gameMenus,
  gameScore,
  gameTimer,
  goal1,
  goal2,
  ground,
  MENU_STATES,
  singlePlayerAILeft,
  singlePlayerAIRight,
} from "./sketch.js";

const { Engine } = Matter;

const main = () => {
  // GAME ENGINE UPDATE
  Engine.update(engine);

  // SOCKET EMIT
  //socket.emit('keys', keyPressed());

  // CANVAS BACKGROUND AND TEXT
  image(background0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  push();
  fill(0);
  textSize(20);
  stroke(0, 0, 0);
  pop();

  // SCORE LOGIC
  gameScore.scoreCheck(ball, goal1, goal2);
  gameScore.show();

  // TIMER
  gameTimer.timerTick();
  gameTimer.show();

  // SHOW GRAPHICS
  for (const obj of [
    ball,
    ground,
    goal1,
    goal2,
    player1Def,
    player1Atk,
    player2Def,
    player2Atk,
  ]) {
    obj.show();
  }

  // IN CASE BALL GETS STUCK ON TOP OF GOAL - DON'T THINK IF IT WILL WORK
  if (
    ball.body.position.y < goal1.h - ball.r &&
    ball.body.velocity.x === 0 &&
    ball.body.velocity.y === 0
  ) {
    gameManager.resetBall();
  }

  if (gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED) {
    singlePlayerAIRight.tickAI(player2Def, player2Atk);
  } else if (gameMenus.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED) {
    singlePlayerAILeft.tickAI(player1Def, player1Atk);
  } else if (gameMenus.menu === 1000) {
    singlePlayerAILeft.tickAI(player1Def, player1Atk);
    singlePlayerAIRight.tickAI(player2Def, player2Atk);
  }

  // KEEP PLAYERS UPRIGHT
  for (const player of [player1Def, player1Atk, player2Def, player2Atk]) {
    if (player.isOnGround(ground)) {
      player.updateAbsoluteAngle();
      player.uprightTilt();
    }
  }

  // GAME CONTROLS
  handleKeyboardControls();

  // ORPHE CONTROLS
  OrpheManager.checkKickAndJump();
};

const handleKeyboardControls = () => {
  const controlMap = {
    65: {
      // 'A' key
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player1Def,
    },
    68: {
      // 'D' key
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player1Atk,
    },
    39: {
      // Right arrow
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player2Def,
    },
    37: {
      // Left arrow
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player2Atk,
    },
  };

  for (const [key, { condition, player }] of Object.entries(controlMap)) {
    if (keyIsDown(Number(key)) && condition) {
      player.cstrLegs.stiffness = 0;
      player.kick(GAME_COEFFICIENTS.KICK_FORCE);
    }
  }
};

export { main };
