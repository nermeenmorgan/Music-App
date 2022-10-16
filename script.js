let nowPlaying = document.querySelector(".now-playing");
let trackArt = document.querySelector(".track-art");
let trackName = document.querySelector(".track-name");
let trackArtist = document.querySelector(".track-artist");

let playPauseBtn = document.querySelector(".play-pause-btn");
let nextBtn = document.querySelector(".next-btn");
let prevBtn = document.querySelector(".prev-btn");
let muteBtn = document.querySelector(".mute-btn")
let seekSlider = document.querySelector(".seek-slider");
let volumeSlider = document.querySelector(".volume-slider");
let currentTime = document.querySelector(".current-time");
let totalTime = document.querySelector(".total-time");
let wave = document.getElementById("wave");
let randomIcon = document.querySelector(".fa-random");
// let audio = document.createElement("audio");
let audio = document.querySelector("audio");
let playerContainer = document.querySelector(".player-container")
let trackIndex = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
  {
    img: "images/a.png",
    name: "Sample",
    artist: "N/A",
    music: "music/audio.mp3",
  },
  {
    img: "images/fallingdown.jpg",
    name: "Falling Down",
    artist: "Wid Cards",
    music: "music/fallingdown.mp3",
  },
  {
    img: "images/faded.png",
    name: "Faded",
    artist: "Alan Walker",
    music: "music/Faded.mp3",
  },
  {
    img: "images/ratherbe.jpg",
    name: "Rather Be",
    artist: "Clean Bandit",
    music: "music/Rather Be.mp3",
  },
];

loadTrack(trackIndex);

function loadTrack(trackIndex) {
  clearInterval(updateTimer);
  reset();

  audio.src = music_list[trackIndex].music;
  audio.load();

  trackArt.style.backgroundImage = "url(" + music_list[trackIndex].img + ")";
  trackName.textContent = music_list[trackIndex].name;
  trackArtist.textContent = music_list[trackIndex].artist;
  // nowPlaying.textContent =
  //   "Playing music " + (trackIndex + 1) + " of " + music_list.length;

  updateTimer = setInterval(setUpdate, 1000);

  audio.addEventListener("ended", nextTrack);
  random_bg_color();
}

function random_bg_color() {
  let hex = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
  ];
  let a;

  function populate(a) {
    for (let i = 0; i < 6; i++) {
      let x = Math.round(Math.random() * 14);
      let y = hex[x];
      a += y;
    }
    return a;
  }
  let Color1 = populate("#");
  let Color2 = populate("#");
  var angle = "to right";

  let gradient =
    "linear-gradient(" + angle + "," + Color1 + ", " + Color2 + ")";
  document.body.style.background = gradient;
}
function reset() {
  currentTime.textContent = "00:00";
  totalTime.textContent = "00:00";
  seekSlider.value = 0;
}

/*Random Track*/
function randomTrack() {
  isRandom ? pauseRandom() : playRandom();
}
function playRandom() {
  isRandom = true;
  randomIcon.classList.add("randomActive");
}
function pauseRandom() {
  isRandom = false;
  randomIcon.classList.remove("randomActive");
}

/*Repeat Track*/
function repeatTrack() {
  let current_index = trackIndex;
  loadTrack(current_index);
  playTrack();
}

//Play/Pause button toggle
playPauseBtn.addEventListener("click", togglePlay)

/*Play/Pause*/
function togglePlay() {
  audio.paused ? audio.play() : audio.pause();
}

//Add paused class on paused and remove on play
audio.addEventListener("play", () => {
  playerContainer.classList.remove("paused")
})

audio.addEventListener("pause", () => {
  playerContainer.classList.add("paused")
})

// function playTrack() {
//   audio.play();
//   isPlaying = true;
//   //trackArt.classList.add("rotate");
//   // wave.classList.add("loader");
//   playPauseBtn.innerHTML = '<button class="fa fa-pause-circle pause"></button>';
// }
// function pauseTrack() {
//   audio.pause();
//   isPlaying = false;
//   //trackArt.classList.remove("rotate");
//   // wave.classList.remove("loader");
//   playPauseBtn.innerHTML = '<button class="fa fa-play-circle play"></button>';
// }

/*Next Track*/
function nextTrack() {
  if (trackIndex < music_list.length - 1 && isRandom === false) {
    trackIndex += 1;
  } else if (trackIndex < music_list.length - 1 && isRandom === true) {
    let random_index = Number.parseInt(Math.random() * music_list.length);
    trackIndex = random_index;
  } else {
    trackIndex = 0;
  }
  loadTrack(trackIndex);
  playTrack();
}

/*Prev Track*/
function prevTrack() {
  if (trackIndex > 0) {
    trackIndex -= 1;
  } else {
    trackIndex = music_list.length - 1;
  }
  loadTrack(trackIndex);
  playTrack();
}

function seekTo() {
  let seekto = audio.duration * (seekSlider.value / 100);
  audio.currentTime = seekto;
}

//Mute toggle
muteBtn.addEventListener("click", toggleMute)

function toggleMute() {
  audio.muted = !audio.muted
}

//Set volume slider to corresponding value
volumeSlider.addEventListener("input", e => {
  audio.volume = e.target.value
  audio.muted = e.target.value === 0 
})


//Change volume button according to actual volume
audio.addEventListener("volumechange", () => {
  volumeSlider.value = audio.volume / 1
  let volumeLevel
  if (audio.muted || audio.volume === 0) {
    volumeSlider.value = 0
    volumeLevel = "muted"
  } else if (audio.volume >= 0.6) {
    volumeLevel = "high"
  } else {
    volumeLevel = "low"
  }
  
  //Volume button will correlate with volume level
  playerContainer.dataset.volumeLevel = volumeLevel
  
  //Inside volume bar will move with volume level
  volumeSlider.style.setProperty("--volume-level", volumeSlider.value)
})

// //Current Time
// audio.addEventListener("timeupdate", () => {
//   currentTime.textContent = formatDuration(audio.currentTime)
//   //Bar will move with audio progress
//   const percent = audio.currentTime / audio.duration
//   timelineContainer.style.setProperty("--progress-position", percent)
// })

// //Duration Counter
// audio.addEventListener("loadeddata", () => {
//   totalTime.textContent = formatDuration(audio.duration)
// })

// //Makes time say :04 instead of :4
// const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
//   minimumIntegerDigits: 2,
// })

// //Created to display duration time in full instead of seconds
// function formatDuration(time) {
//   const seconds = Math.floor(time % 60)
//   const minutes = Math.floor(time / 60) % 60
//   const hours = Math.floor(time / 3600)
//   //If no hours display minutes, if so show with minutes
//   if (hours === 0) {
//     return `${minutes}:${leadingZeroFormatter.format(seconds)}`
//   } else {
//     return `${hours}:${leadingZeroFormatter.format(
//       minutes)}:${leadingZeroFormatter.format(seconds)}`
//   }
// }


function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(audio.duration)) {
    seekPosition = audio.currentTime * (100 / audio.duration);
    seekSlider.value = seekPosition;

    let currentMinutes = Math.floor(audio.currentTime / 60);
    let currentSeconds = Math.floor(
      audio.currentTime - currentMinutes * 60
    );
    let durationMinutes = Math.floor(audio.duration / 60);
    let durationSeconds = Math.floor(
      audio.duration - durationMinutes * 60
    );

    if (currentSeconds < 10) {
      currentSeconds = "0" + currentSeconds;
    }
    if (durationSeconds < 10) {
      durationSeconds = "0" + durationSeconds;
    }
    if (currentMinutes < 10) {
      currentMinutes = "0" + currentMinutes;
    }
    if (durationMinutes < 10) {
      durationMinutes = "0" + durationMinutes;
    }

    currentTime.textContent = currentMinutes + ":" + currentSeconds;
    totalTime.textContent = durationMinutes + ":" + durationSeconds;
  }
}
