// ************************************************
// Teugg Soccer Physics
// Rip-off of the once popular Soccer Physics game
// Horribly coded by : Kevin Le Teugg, 2020
// File : game_timer.js
// Description : Game timer class used for keeping track of the elapsed time in game
// ************************************************

import {CANVAS_WIDTH} from "./sketch.js";

class GameTimer {
  constructor(sec, min) {
    // ATTRIBUTES
    this.elapsedTimeSec = sec;
    this.elapsedTimeMin = min;
  }

  timerTick() {
    if (frameCount % 60 === 0) {
      this.elapsedTimeSec = this.elapsedTimeSec + 1;
    }
    if (this.elapsedTimeSec >= 60) {
      this.elapsedTimeMin = this.elapsedTimeMin + 1;
      this.elapsedTimeSec = 0;
    }
  }

  // DRAWING FUNCTION
  show() {
    push();
    textSize(40);
    fill(255);
    stroke(0, 0, 0);
    text(
      `${nf(this.elapsedTimeMin, 2, 0)}:${nf(this.elapsedTimeSec, 2, 0)}`,
      CANVAS_WIDTH / 2,
      30,
    );
    pop();
  }
}

export default GameTimer;
