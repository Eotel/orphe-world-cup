// ************************************************
// Teugg Soccer Physics
// Rip-off of the once popular Soccer Physics game
// Horribly coded by : Kevin Le Teugg, 2020
// File : game_manager.js
// Description : Manager for the various parameters of the game
// ************************************************

import Player from "./player.js";
import {
  ball,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLLISION_CATEGORIES,
  PLAYER_POSITIONS,
  PLAYER_SPRITE_COUNT,
  world,
} from "./sketch.js";

let player1Atk;
let player1Def;
let player2Atk;
let player2Def;

class GameManager {
  constructor() {
    this.player1DefOptions = null;
    this.player1AtkOptions = null;
    this.player2DefOptions = null;
    this.player2AtkOptions = null;
    this.ballOptions = null;
    this.goal1Options = null;
    this.goal2Options = null;
  }

  init() {
    const playerBodySelection = () =>
      Math.floor(Math.random() * PLAYER_SPRITE_COUNT);

    this.player1DefOptions = {
      startPosX: PLAYER_POSITIONS.P1D,
      isPlayer1: true,
      playerBody: playerBodySelection(),
    };

    this.player1AtkOptions = {
      startPosX: PLAYER_POSITIONS.P1A,
      isPlayer1: true,
      playerBody: playerBodySelection(),
    };

    this.player2DefOptions = {
      startPosX: PLAYER_POSITIONS.P2D,
      playerBody: playerBodySelection(),
    };

    this.player2AtkOptions = {
      startPosX: PLAYER_POSITIONS.P2A,
      playerBody: playerBodySelection(),
    };

    this.ballOptions = {
      startPosX: CANVAS_WIDTH / 2,
      startPosY: CANVAS_HEIGHT / 4,
      radius: CANVAS_WIDTH / 51.2,
      friction: 0.01,
      restitution: 0.95,
      density: 0.00005,
      // Default is 0.05
      slop: 0.3,
      collisionFilter: {
        category: COLLISION_CATEGORIES.GENERAL,
        mask: COLLISION_CATEGORIES.GENERAL | COLLISION_CATEGORIES.GROUND,
      },
    };

    this.goal1Options = {
      isGoal1: true,
      collisionFilter: {
        category: COLLISION_CATEGORIES.GENERAL,
        mask: COLLISION_CATEGORIES.GENERAL,
      },
      isStatic: true,
    };

    this.goal2Options = {
      collisionFilter: {
        category: COLLISION_CATEGORIES.GENERAL,
        mask: COLLISION_CATEGORIES.GENERAL,
      },
      isStatic: true,
    };
  }

  resetPlayers() {
    Matter.World.remove(world, player1Def.getPlayerBodiesList());
    Matter.World.remove(world, player1Atk.getPlayerBodiesList());
    Matter.World.remove(world, player2Def.getPlayerBodiesList());
    Matter.World.remove(world, player2Atk.getPlayerBodiesList());

    Matter.World.remove(world, player1Def.getPlayerConstraintsList());
    Matter.World.remove(world, player1Atk.getPlayerConstraintsList());
    Matter.World.remove(world, player2Def.getPlayerConstraintsList());
    Matter.World.remove(world, player2Atk.getPlayerConstraintsList());

    this.createAllPlayers();
  }

  createAllPlayers() {
    player1Def = new Player(this.player1DefOptions);
    player1Atk = new Player(this.player1AtkOptions);
    player2Def = new Player(this.player2DefOptions);
    player2Atk = new Player(this.player2AtkOptions);
  }

  resetBall() {
    // As I changed Players' start position according to "factor 6", I keep it here to make it centered with the same logic.
    // Ball appears randonmly between second half of 3/6 and first hald of 4/6 -> P1def 1/6, P1atk 2/6, P2atk 4/6, and P2def 5/6
    const randBallX = random(
      (CANVAS_WIDTH / 6) * 2.5,
      (CANVAS_WIDTH / 6) * 3.5,
    );
    const randBallY = random(CANVAS_HEIGHT / 2 - 50, CANVAS_HEIGHT / 2 + 50);
    const randBallVelocityX = 0;
    const randBallVelocityY = 0;
    const randBallForceX = random(-0.002, 0.002);
    const randBallForceY = 0;
    const randBallPos = Matter.Vector.create(randBallX, randBallY);
    const randBallVelocity = Matter.Vector.create(
      randBallVelocityX,
      randBallVelocityY,
    );
    const randBallForce = Matter.Vector.create(randBallForceX, randBallForceY);

    // Set ball at random location in the middle + reset its velocity and acceleration
    Matter.Body.setPosition(ball.body, randBallPos);
    Matter.Body.setVelocity(ball.body, randBallVelocity);
    Matter.Body.applyForce(ball.body, ball.body.position, randBallForce);
  }
}

export { GameManager, player1Def, player1Atk, player2Def, player2Atk };
