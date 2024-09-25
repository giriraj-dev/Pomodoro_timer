// Set initial values for work and break sessions
let set_time = document.getElementById("settime");
set_time.value = "00:00:05"; // Default timer value

let set_break = document.getElementById("setbreak");
set_break.value = "00:00:10"; // Default break value

// Get references to DOM elements
let reset = document.getElementsByClassName("refresh")[0];
let start = document.getElementsByClassName("start")[0];
let information = document.getElementsByClassName("text")[0];
let info = document.getElementsByClassName("breakMess")[0];
let pause = document.getElementsByClassName("wait")[0];
let done = document.getElementsByClassName("done")[0];
let again = document.getElementsByClassName("repeat")[0];
let alarmSound = document.getElementById("sound1");
let alarmSound2 = document.getElementById("sound5");
let increment = document.getElementsByClassName("add");
let decrement = document.getElementsByClassName("minus");
let store = document.getElementsByClassName("save")[0];
let unpause = document.getElementsByClassName("resumeBtn")[0];
let wait = document.getElementsByClassName("pause")[0];
const logs = []; // ["started","breake","session"];

// Initialize variables for timer and cycles
let timeoutId, timerInterval;
let remainingTime, remainingTimeout;
isPaused = false;
let completedPomodoros = 0; // Track completed Pomodoros
isBreak=false;
// Update display


const stop = () => {
  if (!isPaused) {
    clearInterval(timerInterval); // Stop the countdown
    clearTimeout(timeoutId); // Stop any transition timeout
    isPaused = true;
    wait.innerHTML="Paused";
    info.innerHTML="";
    information.innerHTML="";
    logger(logs, "you paused");
    // remainingTimeout = remainingTime;
  }
};

// Function to resume the timer
const resume = () => {
    if (isPaused) {
    isPaused = false;
    logger(logs, "you resumed");
    updateCountdown(remainingTime); // Continue from the remaining time
  }
};


/* Function to update countdown for the work session */
function updateCountdown(timeInSeconds) {
  remainingTime = timeInSeconds;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (remainingTime > 1) {
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
  let breakTimeInSeconds = timeToSecond(set_break.value);
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (breakTimeInSeconds > 1) {
      breakTimeInSeconds--;
      set_break.value = secondsToTime(breakTimeInSeconds); // Update break display
    } else {
      clearInterval(timerInterval);
      // Reset for next cycle
      startTimer(); // Start the next work session
    }
  }, 1000);
}

/* Start the long break session */
function startLongBreakCountdown() {
  let longBreakTimeInSeconds = timeToSecond(set_break.value); // Longer break duration
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (longBreakTimeInSeconds > 1) {
      longBreakTimeInSeconds--;
      set_break.value = secondsToTime(longBreakTimeInSeconds); // Update long break display
    } else {
      clearInterval(timerInterval);
      // Reset for next cycle after long break
      startTimer(); // Start the next work session
    }
  }, 1000);
}

// Modify the run function
function run() {
  const startTimer = () => {
    info.innerHTML = "";
    information.innerHTML = "TIMER STARTED!! Round:- " + (completedPomodoros + 1);
    logger(logs, "Timer started");
    alarmSound.pause();
    
    if (isPaused) {
      isPaused = false; // Resume the timer from where it was paused
      updateCountdown(remainingTime); // Resume countdown
    } else {
      const initialTimeInSeconds = timeToSecond(set_time.value); // Start a fresh timer cycle
      updateCountdown(initialTimeInSeconds);
    }
    
    timeoutId = setTimeout(() => { // Set timeout for transitioning to break after work session
      startBreak(); // Start break after work session
    }, timeToMilliseconds(set_time.value));
  };

  /* Start the break session */
  const startBreak = () => {
    again.innerHTML = "";
    completedPomodoros++;
    
    if (completedPomodoros % 2 === 0) { // Every 2nd Pomodoro, start a long break
      playAlarm();
      information.innerHTML = "";
      info.innerHTML = "Long Break Time! Enjoy your rest!";
      
      // Set long break time, you can adjust this to any desired long break duration
      set_break.value = "00:15:00"; // Example long break duration: 15 minutes
      
      const longBreakInSeconds = timeToSecond(set_break.value);
      startLongBreakCountdown(); // Start long break countdown
      
      timeoutId = setTimeout(() => {
        again.innerHTML = "Long break over! Get ready for the next work session.";
        startTimer(); // Start the next work cycle
      }, timeToMilliseconds(set_break.value)); // Long break duration (15 minutes)

    } else {
      playAlarm(); // Notify that the regular break is starting
      set_time.value = "00:00:05"; // Reset the work timer for next work session
      info.innerHTML = "Break Time!";
      information.innerHTML = "";

      timeoutId = setTimeout(() => {
        set_break.value = "00:05:00"; // Regular break duration
        startTimer(); // Start the next work cycle
        playAlarm();
      }, timeToMilliseconds(set_break.value)); // Regular break duration (5 minutes)
    }

    logger(
      logs,
      completedPomodoros % 2 === 0 ? "Long Break Time!" : "Break Time!"
    );
  };

  startTimer(); // Start the first cycle
}


/*All ONCLICK EVENTs*/

//Start or resume the timer
start.onclick = () => {
  run();
};

//RESET all timer values and clear running timers
reset.onclick = resetAll;

//PAUSE the timer when the button is clicked
pause.onclick = () => {
  stop();
};

unpause.onclick = () => {
  resume();
};

// Apply increment to session time (set_time)
increment[0].onclick = () => incrementTime(set_time, 5); // Increment session time by 5 minutes
// Apply increment to break time (set_break)
increment[1].onclick = () => incrementTime(set_break, 5); // Increment break time by 5 minutes
// Apply decrement to session time (set_time)
decrement[0].onclick = () => decrementTime(set_time, 5); // Decrement session time by 5 minutes
//Apply decrement to break time (set_break)
decrement[1].onclick = () => decrementTime(set_break, 5); // Decrement break time by 5 minutes
