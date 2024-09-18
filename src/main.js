// Set initial values for work and break sessions
let set_time = document.getElementById("settime");
set_time.value = "00:00:05"; // Default timer value

let set_break = document.getElementById("setbreak");
set_break.value = "00:00:10"; // Default break value

// Get references to DOM elements
let reset = document.getElementsByClassName("refresh")[0];
let start = document.getElementsByClassName("start")[0];
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
let unpause = document.getElementsByClassName("resumeBtn")[0];
const logs = []; // ["started","breake","session"];


// Initialize variables for timer and cycles
let timeoutId, timerInterval;
let remainingTime,remainingTimeout;
isPaused = false;
let completedPomodoros = 0; // Track completed Pomodoros


/*Fuction to update countdown for the work session */
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

const stop=() => {
  if (!isPaused) {
    clearInterval(timerInterval); // Stop the countdown
    clearTimeout(timeoutId); // Stop any transition timeout
    isPaused = true;
    logger(logs, "you paused");
    remainingTimeout = remainingTime;
  }
}

// Function to resume the timer
const resume = () => {
  if (isPaused) {
    isPaused = false;
    logger(logs, "you resumed");
    updateCountdown(remainingTimeout); // Continue from the remaining time
  }
};


// Modify the run function
function run() {
  const startTimer = () => {
    info.innerHTML = "";
    alarmSound.pause();

    if (isPaused) {
      // Resume the timer from where it was paused
      isPaused = false;
      updateCountdown(remainingTime); // Resume countdown
    } else {
      // Start a fresh timer cycle
      const initialTimeInSeconds = timeToSecond(set_time.value);
      updateCountdown(initialTimeInSeconds);
    }

    // Set timeout for transitioning to break after work session
    timeoutId = setTimeout(() => {
      completedPomodoros++; // Increment completed Pomodoros
      startBreak(); // Start break after work session
    }, timeToMilliseconds(set_time.value));

    information.innerHTML = "TIMER STARTED!!";
    logger(logs, "Timer started");
  };

  /* Start the break session */
  const startBreak = () => {
    information.innerHTML = "";
    again.innerHTML = "";

    if (completedPomodoros % 4 == 0) {
      // Longer break after every four Pomodoros
      alarmSound.play();
      info.innerHTML = "Long Break Time! Enjoy your rest!";
      set_time.value = "00:00:05";
      set_break.value = "00:00:10";
      timeoutId = setTimeout(() => {
      again.innerHTML ="Long break over! Get ready for the next work session.";
      startTimer(); // Start the next work cycle
      }, timeToMilliseconds("00:01:00")); // Set long break duration (15 minutes)
    } else {
      playAlarm(); // Notify that the break is starting
      set_time.value = "00:00:05";
      info.innerHTML = "Break Time!";
      timeoutId = setTimeout(() => {
        set_break.value = "00:00:10"; // Reset the work timer
        //again.innerHTML = "Break over! Get ready for the next work session.";
        startTimer(); // Start the next work cycle
      }, timeToMilliseconds(set_break.value)); // Regular break duration
    }

    logger(
      logs,
      completedPomodoros % 4 === 0 ? "Long Break Time!" : "Break Time!"
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

unpause.onclick=()=>{
  resume();
}

// Apply increment to session time (set_time)
increment[0].onclick = () => incrementTime(set_time, 5);    // Increment session time by 5 minutes

// Apply increment to break time (set_break)
increment[1].onclick = () => incrementTime(set_break, 5);  // Increment break time by 5 minutes

// Apply decrement to session time (set_time)
decrement[0].onclick = () => decrementTime(set_time, 5);  // Decrement session time by 5 minutes

//Apply decrement to break time (set_break) 
decrement[1].onclick = () => decrementTime(set_break,5); // Decrement break time by 5 minutes