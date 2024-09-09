import {Ball} from "./ball.js";
import {setupDebugMenu, setupDebugToggle} from "./debug.js";
import {GameManager, player1Atk, player1Def, player2Atk, player2Def,} from "./game_manager.js";
import GameMenus from "./game_menus.js";
import GameScore from "./game_score.js";
import GameTimer from "./game_timer.js";
import Goal from "./goal.js";
import Ground from "./ground.js";
import SinglePlayerAI from "./singleplayer_ai.js";
import SoundManager from "./sound.js";

const { Engine, World, Bodies, Body, Render } = Matter;

let canvas;

// Matter.js variables
let engine;
let world;
let ground;

// CANVAS //
const ARR_CANVAS_W = [
  2560, 1920, 1600, 1366, 1280, 1024, 960, 854, 640, 426, 320, 256,
];
const ARR_CANVAS_H = [
  1440, 1080, 900, 768, 720, 576, 540, 480, 360, 240, 180, 144,
];
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// // // Let's do some magic first (to keep beautiful 16:9 ratio)
// for (let i = 0; i < ARR_CANVAS_W.length; i++) {
//   // Setting canvas width to the size of the viewport minus the some wierd margins
//   // Setting canvas height to the height of the viewport minus the approximate size of a bookmark bar (not taken into account)
//   if (
//     document.documentElement.clientWidth - 50 >= ARR_CANVAS_W[i] &&
//     document.documentElement.clientHeight - 100 >= ARR_CANVAS_H[i]
//   ) {
//     CANVAS_WIDTH = ARR_CANVAS_W[i];
//     CANVAS_HEIGHT = ARR_CANVAS_H[i];
//     console.log(
//       `Appropriate canvas size found: ${CANVAS_WIDTH}*${CANVAS_HEIGHT}`,
//     );
//     break;
//   }
// }

/* Player constants */
const PLAYER_CONSTANTS = {
  POS_Y: (CANVAS_HEIGHT / 7) * 5,
  MAIN_WIDTH: CANVAS_WIDTH / 28,
  MAIN_HEIGHT: CANVAS_HEIGHT / 7.778,
  LEG_WIDTH: CANVAS_WIDTH / 56,
  LEG_HEIGHT: ((CANVAS_HEIGHT / 7.778) * 2) / 2, // NOTE: /3 -> /2
  FOOT_WIDTH: CANVAS_WIDTH / 56,
  FOOT_HEIGHT: CANVAS_WIDTH / 56 / 3,
  COUNTERWEIGHT_HEIGHT: CANVAS_HEIGHT / 180,
};

const PLAYER_POSITIONS = {
  P1D: CANVAS_WIDTH / 6,
  P1A: (CANVAS_WIDTH / 6) * 2,
  P2A: (CANVAS_WIDTH / 6) * 4,
  P2D: (CANVAS_WIDTH / 6) * 5,
};

// ゴール関連の定数
const GOAL_CONSTANTS = {
  AREA_WIDTH: CANVAS_WIDTH / 9.333,
  AREA_HEIGHT: CANVAS_HEIGHT / 1.75,
  TOPBAR_POS_X: CANVAS_WIDTH / 9.333 / 2,
  TOPBAR_POS_Y: CANVAS_HEIGHT - CANVAS_HEIGHT / 1.75,
  TOPBAR_WIDTH: CANVAS_WIDTH / 9.333,
  TOPBAR_HEIGHT: CANVAS_HEIGHT / 72,
  BOTTOMBAR_POS_X: 0,
  BOTTOMBAR_POS_Y: CANVAS_HEIGHT - CANVAS_HEIGHT / 1.75 / 2,
  BOTTOMBAR_WIDTH: CANVAS_WIDTH / 128,
  BOTTOMBAR_HEIGHT: CANVAS_HEIGHT / 1.75,
};

// メニュー状態
const MENU_STATES = {
  MAIN_MENU: 0,
  P1_LOCAL_CHOOSE_SIDE_MENU: 1,
  P2_LOCAL_SELECTED: 2,
  P2_ONLINE_MENU: 3,
  P1_LOCAL_LEFT_SELECTED: 4,
  P1_LOCAL_RIGHT_SELECTED: 5,
  P2_ONLINE_CREATE_MENU: 6,
  P2_ONLINE_JOIN_MENU: 7,
};
const MENU_BUTTON = {
  WIDTH: CANVAS_WIDTH / 5,
  HEIGHT: CANVAS_HEIGHT / 10,
};

/*
 * Collision categories
 */
const COLLISION_CATEGORIES = {
  /**
   * Used for all parts of player except counterweight, ball and goal
   */
  GENERAL: 0x0001,
  /**
   * Used only for the counterweight of players (and also foot)
   */
  NO_COLLISION: 0x0002,
  /**
   * Used for ground
   */
  GROUND: 0x0004,
};

const GROUND_CONFIG = {
  WIDTH: CANVAS_WIDTH,
  HEIGHT: 100,
  OFFSET: 6,
  X: CANVAS_WIDTH / 2,
  Y: CANVAS_HEIGHT - 50 + 3,
};

// ゲーム係数
const GAME_COEFFICIENTS = {
  /*
   * Coefficient that is applied to the tiltForce vector that is derived from the axes[1] vector of the player
   */
  TILT_FORCE: 0.007 * 4,
  /*
   * Coefficient that is applied to the kickForce vector that is perpendicular to the movable leg of the players
   */
  KICK_FORCE: 0.0018 * 10,
  /*
   * Coefficient that is applied to the jumpForce vector that is derived from the axes[2] vector of the player
   */
  JUMP_FORCE: 0.55 * 4,
  /*
   * Stiffness of the players movable leg when the kick function is no more engaged
   */
  IDLE_LEG_STIFFNESS: 0.1 * 8,
};

// Sprites handles
let background0;
let spriteSoccerBall;
let spritePlayerLeg0;
const PLAYER_SPRITE_COUNT = 5;
const spritePlayerMainBodies = [];

/*
 * AI configuration
 */
const AI_CONFIG = {
  LOWER_BOUND_TIMING: 15,
  UPPER_BOUND_TIMING: 35,
};

let gameManager;
let gameMenus;
let ball;
let goal1;
let goal2;
let gameTimer;
let gameScore;
let singlePlayerAILeft;
let singlePlayerAIRight;

// Assets preload
window.preload = () => {
  const loadSprite = (path) => loadImage(path);
  background0 = loadSprite("assets/0_background.png");
  spriteSoccerBall = loadSprite("assets/sprite_soccer_ball.png");
  spritePlayerLeg0 = loadSprite("assets/sprite_player_leg0.png");
  for (let i = 0; i < PLAYER_SPRITE_COUNT; i++) {
    spritePlayerMainBodies[i] = loadSprite(
      `assets/sprite_player_main_body${i}.png`,
    );
  }

  console.log("Assets loaded");

  SoundManager.preload();
};

// Entry point of code
window.setup = () => {
  // Canvas creation
  canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("sketch-holder");
  frameRate(60);

  engine = Engine.create();
  world = engine.world;

  image(background0, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (
    !background0 ||
    !spriteSoccerBall ||
    !spritePlayerLeg0 ||
    spritePlayerMainBodies.some((img) => !img)
  ) {
    console.error("Some images failed to load. Please check your asset paths.");
  }
  initializeGameObjects();
  world.gravity.y = 1;

  setupDebugToggle();
  setupDebugMenu();
};

const initializeGameObjects = () => {
  gameManager = new GameManager();
  gameManager.init();
  gameMenus = new GameMenus();

  ground = new Ground(
    GROUND_CONFIG.X,
    GROUND_CONFIG.Y,
    GROUND_CONFIG.WIDTH,
    GROUND_CONFIG.HEIGHT,
    0,
  );

  gameManager.createAllPlayers();

  ball = new Ball(gameManager.ballOptions);
  goal1 = new Goal(gameManager.goal1Options);
  goal2 = new Goal(gameManager.goal2Options);

  gameTimer = new GameTimer(0, 0);
  gameScore = new GameScore();

  const aiConfig = () => {
    return {
      previousTimingAI: 0,
      randTimingAI: random(
        AI_CONFIG.LOWER_BOUND_TIMING,
        AI_CONFIG.UPPER_BOUND_TIMING,
      ),
      choosePlayerAI: random(0.0, 1.0),
    };
  };

  singlePlayerAILeft = new SinglePlayerAI(aiConfig());
  singlePlayerAIRight = new SinglePlayerAI(aiConfig());
};

window.draw = () => {
  gameMenus.logic();
};

// EVENT FUNCTIONS
window.mouseClicked = () => {
  gameMenus.clickedOn();
};

window.keyPressed = () => {
  if (keyCode === 32) {
    gameManager.resetBall();
  }

  if (keyCode === ESCAPE) {
    resetMenu();
  }

  const playerActions = {
    65: {
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player1Def,
    },
    68: {
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player1Atk,
    },
    RIGHT_ARROW: {
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player2Def,
    },
    LEFT_ARROW: {
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player2Atk,
    },
  };

  const action = playerActions[keyCode];
  if (action?.condition && action.player.isOnGround(ground)) {
    action.player.jump();
    liftBall(action.player);
    SoundManager.playKickSound();
  }

  // TEST apply force on ball
  if (keyCode === 69) {
    if (
      gameMenus.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED ||
      gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED ||
      gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED
    ) {
      Body.applyForce(
        ball.body,
        ball.body.position,
        Matter.Vector.create(0, -0.005),
      );
      console.log("coucou");
      Body.applyForce(
        ball.body,
        ball.body.position,
        Matter.Vector.create(0, 0),
      );
    }
  }
};

window.keyReleased = () => {
  const legStiffnessReset = {
    65: {
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player1Def,
    },
    68: {
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_LEFT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player1Atk,
    },
    RIGHT_ARROW: {
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player2Def,
    },
    LEFT_ARROW: {
      condition:
        gameMenus.menu === MENU_STATES.P1_LOCAL_RIGHT_SELECTED ||
        gameMenus.menu === MENU_STATES.P2_LOCAL_SELECTED,
      player: player2Atk,
    },
  };

  const action = legStiffnessReset[keyCode];
  if (action?.condition) {
    action.player.cstrLegs.stiffness = GAME_COEFFICIENTS.IDLE_LEG_STIFFNESS;
  }
};

const liftBall = (player) => {
  const collision =
    Matter.SAT.collides(player.legBody, ball.body).collided ||
    Matter.SAT.collides(player.footBody, ball.body).collided;

  if (collision) {
    const force =
      player.isOnGround(ground) && ball.isOnGround(ground) ? -0.007 : -0.005;
    Body.applyForce(
      ball.body,
      ball.body.position,
      Matter.Vector.create(0, force),
    );
  }
};

const resetMenu = () => {
  gameMenus.reset();
  gameManager.resetPlayers();
  gameManager.resetBall();
  gameTimer = new GameTimer(0, 0);
  gameScore = new GameScore();

  SoundManager.resetBGM();
  SoundManager.stopCloudOrpheOneshot();
};

export {
  engine,
  world,
  ground,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  PLAYER_CONSTANTS,
  PLAYER_POSITIONS,
  GOAL_CONSTANTS,
  MENU_STATES,
  MENU_BUTTON,
  COLLISION_CATEGORIES,
  GROUND_CONFIG,
  GAME_COEFFICIENTS,
  AI_CONFIG,
  gameManager,
  gameMenus,
  background0,
  spriteSoccerBall,
  spritePlayerLeg0,
  PLAYER_SPRITE_COUNT,
  spritePlayerMainBodies,
  ball,
  goal1,
  goal2,
  gameTimer,
  gameScore,
  singlePlayerAILeft,
  singlePlayerAIRight,
  resetMenu,
  liftBall,
  initializeGameObjects,
};
