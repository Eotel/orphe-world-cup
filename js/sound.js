let longWhistleSound;
let shortWhistleSound;
let goalSound;
let kickSound;
let jumpSound;
let bgmSound;
let cloudOrpheOneshot;
let isSoundEnabled = true;
let isBGMPlaying = false;
let cloudOrpheTimeout;
let cloudOrpheInterval;
let isCloudOrphePlaying = false;

const SoundManager = {
  isSoundEnabled: () => isSoundEnabled,

  preload: () => {
    window.soundFormats("mp3", "ogg");
    longWhistleSound = loadSound("assets/sounds/Starting_whistle.mp3");
    shortWhistleSound = loadSound("assets/sounds/short_whistle.mp3");
    goalSound = loadSound("assets/sounds/goal.mp3");
    kickSound = loadSound("assets/sounds/kick.mp3");
    jumpSound = loadSound("assets/sounds/Jump_SE.mp3");
    bgmSound = loadSound("assets/sounds/cloud03_loop_long.mp3");
    cloudOrpheOneshot = loadSound("assets/sounds/Cloud_orphe2_oneshot.mp3");
  },

  playSound: (sound, loop = false, forcePlay = false) => {
    if (isSoundEnabled && sound && (forcePlay || !sound.isPlaying())) {
      if (loop) {
        sound.loop();
      } else {
        sound.play();
      }
    }
  },
  stopSound: (sound) => {
    if (sound?.isPlaying()) {
      sound.stop();
    }
  },

  playLongWhistleSound: () => SoundManager.playSound(longWhistleSound),
  playShortWhistleSound: () =>
    SoundManager.playSound(shortWhistleSound, false, true),
  playGoalSound: () => SoundManager.playSound(goalSound, false, true),
  playKickSound: () => SoundManager.playSound(kickSound),
  playJumpSound: () => SoundManager.playSound(jumpSound),

  playBGM: () => {
    if (!isBGMPlaying) {
      SoundManager.playSound(bgmSound, true);
      isBGMPlaying = true;
    }
  },

  stopBGM: () => {
    SoundManager.stopSound(bgmSound);
    isBGMPlaying = false;
  },

  toggleSound: () => {
    isSoundEnabled = !isSoundEnabled;
    if (!isSoundEnabled) {
      SoundManager.stopBGM();
      SoundManager.stopCloudOrpheOneshot();
    } else if (!isBGMPlaying) {
      SoundManager.playBGM();
      SoundManager.startCloudOrpheOneshot();
    }
    return isSoundEnabled;
  },

  resetBGM: () => {
    SoundManager.stopBGM();
  },

  startCloudOrpheOneshot: () => {
    if (isCloudOrphePlaying) return;

    isCloudOrphePlaying = true;

    const playCloudOrphe = () => {
      if (isSoundEnabled) {
        cloudOrpheOneshot.play();
      }
    };

    const scheduleNextPlay = () => {
      cloudOrpheTimeout = setTimeout(() => {
        playCloudOrphe();
        cloudOrpheInterval = setInterval(playCloudOrphe, 45000);
      }, 10000);
    };

    scheduleNextPlay();
  },

  stopCloudOrpheOneshot: () => {
    clearTimeout(cloudOrpheTimeout);
    clearInterval(cloudOrpheInterval);
    SoundManager.stopSound(cloudOrpheOneshot);
    isCloudOrphePlaying = false;
  },

  pauseCloudOrpheOneshot: () => {
    clearTimeout(cloudOrpheTimeout);
    clearInterval(cloudOrpheInterval);
    SoundManager.stopSound(cloudOrpheOneshot);
  },

  resumeCloudOrpheOneshot: () => {
    if (!isCloudOrphePlaying) return;

    SoundManager.pauseCloudOrpheOneshot();
    cloudOrpheTimeout = setTimeout(() => {
      if (isSoundEnabled) {
        cloudOrpheOneshot.play();
        cloudOrpheInterval = setInterval(() => {
          if (isSoundEnabled) {
            cloudOrpheOneshot.play();
          }
        }, 45000);
      }
    }, 10000);
  },

  onGoalScored: () => {
    SoundManager.pauseCloudOrpheOneshot();
    SoundManager.playShortWhistleSound();
    SoundManager.playGoalSound();
    SoundManager.resumeCloudOrpheOneshot();
  },
};

export default SoundManager;
