// Set initial values for work and break sessions
let set_time = document.getElementById("settime");
set_time.value = "00:25:00"; // Default timer value

let set_break = document.getElementById("setbreak");
set_break.value = "00:25:00"; // Default break value

// Convert time from HH:MM:SS format to milliseconds
const timeToMilliseconds = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600000 + minutes * 60000 + seconds * 1000;
};

// Convert time from HH:MM:SS format to seconds
const timeToSecond = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Convert seconds back to HH:MM:SS format
const secondsToTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

// Initialize variables for timer and cycles
let timeoutId, timerInterval;
let cycles = 4, currentCycle = 0;
let remainingTime,
isPaused = false,
isInBreak = false,
remainingTimeout;

// Get references to DOM elements
let reset = document.getElementsByClassName("refresh")[0];
let go = document.getElementsByClassName("start")[0];
let information = document.getElementsByClassName("message")[0];
let info = document.getElementsByClassName("breakMess")[0];
let pause = document.getElementsByClassName("wait")[0];
let done = document.getElementsByClassName("done")[0];
let again = document.getElementsByClassName("repeat")[0];
let alarmSound = document.getElementById("sound1");
let alarmSound2 = document.getElementById("sound5");
let increment = document.getElementsByClassName("add");
let decrement = document.getElementsByClassName("minus");
let store = document.getElementsByClassName("save")[0];
const logs = []; // ["started","breake","session"];

const logger = (logs, message) => {
  logs.push(message);
  let store = document.getElementsByClassName("save")[0];
  store.innerHTML = "";
  logs.forEach((log) => {
    let div = document.createElement("div");
    div.innerHTML = log;
    store.appendChild(div);
  });
};

/* Function to play the alarm sound */
function playAlarm() {
  alarmSound.play();
  setTimeout(() => alarmSound.pause(), 5000); // Stop after 5 seconds
}

/*Fuction to update countdown for the work session */
function updateCountdown(timeInSeconds) {
  remainingTime = timeInSeconds;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (remainingTime >1) {
      remainingTime--;
      set_time.value = secondsToTime(remainingTime); // Update timer display
    } else {
      clearInterval(timerInterval);
      startBreakCountdown(); // Start the break when time reaches 0
    }
  }, 1000);
}

/* Function to update countdown for the break session */
function startBreakCountdown() {
  //isInBreak = true;
  let breakTimeInSeconds = timeToSecond(set_break.value);
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (breakTimeInSeconds > 1) {
      breakTimeInSeconds--;
      set_break.value = secondsToTime(breakTimeInSeconds); // Update break display
    } else {
      clearInterval(timerInterval);
     // Reset for next cycle
      //isInBreak = false;
      startTimer(); // Start the next cycle
    }
  }, 1000);
}

/* RESET all timer values and clear running timers */
reset.onclick = () => {
  clearInterval(timerInterval);
  clearTimeout(timeoutId);
  alarmSound.pause();

  // Reset the displayed times and messages
  set_time.value = "00:25:00";
  set_break.value = "00:25:00";
  information.innerHTML = "";
  info.innerHTML = "";
  done.innerHTML = "";
  again.innerHTML = "";
  currentCycle = 0;

  isPaused = false;
  isInBreak = false;
  alert("Timer successfully reset");
};

/* PAUSE the timer when the button is clicked */
pause.onclick = () => {
  if (!isPaused) {
    clearInterval(timerInterval); // Stop the countdown
    clearTimeout(timeoutId); // Stop the transition timeout
    isPaused = true;

    remainingTimeout =timeToMilliseconds(set_time.value) - remainingTime * 1000; // Store remaining time
    breakTimeInSeconds=timeToMilliseconds(set_break.value) -breakTimeInSeconds*1000;
  }
};

/* Increment work session time by 5 minutes */
increment[0].onclick = () => {
  let value = timeToMilliseconds(set_time.value) + 5 * 60 * 1000;
  set_time.value = secondsToTime(Math.floor(value / 1000)); // Update the time
};

/* Increment break session time by 5 minutes */
increment[1].onclick = () => {
  let value = timeToMilliseconds(set_break.value) + 5 * 60 * 1000;
  set_break.value = secondsToTime(Math.floor(value / 1000)); // Update break time
};

/* Decrement work session time by 5 minutes */
decrement[0].onclick = () => {
  let value = timeToMilliseconds(set_time.value) - 5 * 60 * 1000;
  set_time.value =
    value > 0 ? secondsToTime(Math.floor(value / 1000)) : "00:00:00";
};

/* Decrement break session time by 5 minutes */
decrement[1].onclick = () => {
  let value = timeToMilliseconds(set_break.value) - 5 * 60 * 1000;
  set_break.value =
    value > 0 ? secondsToTime(Math.floor(value / 1000)) : "00:00:00";
};

/* Start or resume the timer */
go.onclick = () => {
  const startTimer = () => {
    if (currentCycle < cycles) {
      //again.innerHTML = "";
      info.innerHTML = "";
      alarmSound.pause();

      if (isPaused) {
        // Resume the timer from where it was paused
        isPaused = false;
        updateCountdown(remainingTime); // Resume countdown
        timeoutId = setTimeout(() => {
          currentCycle++;
          startBreak();
        }, remainingTimeout); // Resume transition with remaining time
      } else {
        // Start a fresh timer cycle
        const initialTimeInSeconds = timeToSecond(set_time.value);
        updateCountdown(initialTimeInSeconds);
        timeoutId = setTimeout(() => {
          currentCycle++;
          startBreak();
        }, timeToMilliseconds(set_time.value));
      }
      information.innerHTML ="TIMER STARTED!!" + "Round:-" + (currentCycle + 1);
      logger(logs, "round:-"+ (currentCycle + 1));
    } else {
      info.innerHTML = "";
      again.innerHTML ="";
      playAlarm(); // Notify when all cycles are done
      done.innerHTML = "All cycles completed!";
      logger(logs, "All cycles completed!");
    }
  };

  /* Start the break session */
  const startBreak = () => {
    information.innerHTML = "";
    again.innerHTML="";
    info.innerHTML = "Break Time!";
    logger(logs, "Break Time!");
    playAlarm(); // Notify that the break is starting
    timeoutId = setTimeout(() => {
      set_time.value = "00:25:00"; // Reset the work timer
      again.innerHTML = "Break over! Get ready for the next cycle.";
      startTimer(); // Start the next work cycle
    }, timeToMilliseconds(set_break.value));
  };

  startTimer(); // Start the first cycle
};


