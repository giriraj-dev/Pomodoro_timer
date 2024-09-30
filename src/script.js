// Select DOM elements
const setTime = document.getElementById('settime');
const setBreak = document.getElementById('setbreak');
const startBtn = document.querySelector('.start');
const pauseBtn = document.querySelector('.wait');
const resumeBtn = document.querySelector('.resume');
const resetBtn = document.querySelector('.reset');
const sessionInfo = document.getElementById('session-info');
const alarm = document.getElementById('alarm');

// Get the increment and decrement buttons
const incrementWorkBtn = document.getElementById('increment-work');
const decrementWorkBtn = document.getElementById('decrement-work');
const incrementBreakBtn = document.getElementById('increment-break');
const decrementBreakBtn = document.getElementById('decrement-break');
let store = document.getElementsByClassName("save")[0];

// global variables are initialized to store values like timers, log messages, and completed Pomodoro counts
let timerInterval, timeoutId;
let remainingTime, remainingTimeout;
let isPaused = false;
let completedPomodoros = 0;
let completedTimers=0;

// Sample logs array
let logs = [];

// Store the initial values
let initialWorkTime, initialBreakTime;

// Utility functions
const timeToSeconds = (timeStr) => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

const secondsToTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

//Alarm function (Plays an alarm sound for 5 seconds when a session ends)
const playAlarm=()=>{
    alarm.play();
    setTimeout(()=>{
      alarm.pause();
    },5000);
}

// Update the input field directly with the remaining time
const updateTimeInput = (inputElement, timeInSeconds) => {
  inputElement.value = secondsToTime(timeInSeconds);
};

// Start the work or break countdown
const startCountdown = (timeInSeconds, isBreak) => {
  remainingTime = timeInSeconds;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateTimeInput(isBreak ? setBreak : setTime, remainingTime);
    } else {
      clearInterval(timerInterval);
      if (!isBreak) {
        resetTimers();  // Reset timers after work session ends
        startBreakCountdown(); // Start break session
      } else {
        resetTimers();  // Reset timers after break session ends
        completedPomodoros++;
        if (completedPomodoros % 4 === 0) {
          startLongBreakCountdown(); // Long break every 4 Pomodoros
        } else {
          startWorkCountdown(); // Next work session
        }
      }
    }
  }, 1000);
};

// Reset the timers to the initial values
const resetTimers = () => {
  setTime.value = secondsToTime(initialWorkTime);
  setBreak.value = secondsToTime(initialBreakTime);
};

// Start work session countdown
const startWorkCountdown = () => {
  const workTimeInSeconds = initialWorkTime;
  sessionInfo.textContent = `Work Session ${Math.floor(completedPomodoros / 2) + 1}`;
  completedTimers++;
  startCountdown(workTimeInSeconds, false);
  logger(logs, "Timer started");
};

// Start break session countdown
const startBreakCountdown = () => {
  playAlarm();
  const breakTimeInSeconds = initialBreakTime;
  sessionInfo.textContent = "Break Time!";
  setTimeout(() => {
    playAlarm();
    sessionInfo.textContent = "Work session starting in 5 seconds!";
  }, (breakTimeInSeconds - 5) * 1000); // Alert 5 seconds before break ends
  startCountdown(breakTimeInSeconds, true);
  logger(logs, "Break Time");
};

// Start long break session countdown
const startLongBreakCountdown = () => {
  sessionInfo.textContent = "Long Break Time! Enjoy!";
  logger(logs, "Long break time");
  playAlarm();
  const longBreakTimeInSeconds = timeToSeconds("00:15:00");
  startCountdown(longBreakTimeInSeconds, true);
};

// Start button
startBtn.addEventListener('click', () => {
  // Capture initial values only when the start button is pressed for the first time
  initialWorkTime = timeToSeconds(setTime.value);
  initialBreakTime = timeToSeconds(setBreak.value);
  startWorkCountdown();
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  incrementWorkBtn.disabled = true;
  decrementWorkBtn.disabled = true;
  incrementBreakBtn.disabled = true;
  decrementBreakBtn.disabled = true;
});

// Pause button
pauseBtn.addEventListener('click', () => {
  if (!isPaused) {
    clearInterval(timerInterval);
    clearTimeout(timeoutId);
    isPaused = true;
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
  }
});

// Resume button
resumeBtn.addEventListener('click', () => {
  if (isPaused) {
    isPaused = false;
    startCountdown(remainingTime, sessionInfo.textContent.includes("Break"));
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
  }
});

// Reset button
resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  completedPomodoros = 0;
  sessionInfo.textContent = '';
  setTime.value = "00:25:00";
  setBreak.value = "00:05:00";
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  incrementWorkBtn.disabled = false;
  decrementWorkBtn.disabled = false;
  incrementBreakBtn.disabled = false;
  decrementBreakBtn.disabled = false;
  alert("RESET ALL TIMERS");
});

// General function to increment time by adding minutes
const incrementTime = (inputField, minutesToAdd) => {
  let valueInSeconds = timeToSeconds(inputField.value) + minutesToAdd * 60; // Add minutes in seconds
  inputField.value = secondsToTime(valueInSeconds); // Update the time in the input field
};

// General function to decrement time by subtracting minutes
const decrementTime = (inputField, minutesToSubtract) => {
  let valueInSeconds = timeToSeconds(inputField.value) - minutesToSubtract * 60; // Subtract minutes in seconds
  inputField.value = valueInSeconds > 0 ? secondsToTime(valueInSeconds) : "00:00:00"; // Ensure time doesn't go below zero
};


// Add event listeners to increment/decrement work time by 5 minutes
incrementWorkBtn.addEventListener('click', () => incrementTime(setTime,5)); // Add1 minutes to work timer
decrementWorkBtn.addEventListener('click', () => decrementTime(setTime,5)); // Subtract1 minutes from work timer

// Add event listeners to increment/decrement break time by1 minutes
incrementBreakBtn.addEventListener('click', () => incrementTime(setBreak,5)); // Add1 minutes to break timer
decrementBreakBtn.addEventListener('click', () => decrementTime(setBreak,5)); // Subtract1 minutes from break timer


// Logger function to display logs with only 2 messages visible at first
const logger = (logs, message) => {
  logs.push(message); // Add the message to the log array
  let store = document.getElementsByClassName("save")[0];
  store.innerHTML = ""; // Clear the previous logs

  // Render logs and add the first two messages as visible
  logs.forEach((log, index) => {
    let div = document.createElement("div");
    div.id="history";
    div.innerHTML = log;
    store.appendChild(div);
    
    div.classList.add("message");
    if (index < 2) { // Show first two messages initially
      div.classList.add("visible");
    }
  });

  // Handle visibility of "See More" and "Go on Top" buttons
  const messages = document.querySelectorAll('.message');
  const seeMoreBtn = document.getElementById('seeMore');
  const goTopBtn = document.getElementById('goTop');

  // Show "See More" button if there are more than 2 messages
  if (logs.length > 2) {
    seeMoreBtn.style.display = 'inline';
  }

  // Show all messages when "See More" is clicked
  seeMoreBtn.onclick = () => {
    messages.forEach((msg, index) => {
      if (index >= 2) {
        msg.classList.add("visible");
      }
    });
    seeMoreBtn.style.display = 'none'; // Hide "See More" button
    goTopBtn.style.display = 'inline'; // Show "Go on Top" button
  };

  // Scroll back to top and hide extra messages
  goTopBtn.onclick = () => {
    messages.forEach((msg, index) => {
      if (index >= 2) {
        msg.classList.remove("visible");
      }
    });
    seeMoreBtn.style.display = 'inline'; // Show "See More" button
    goTopBtn.style.display = 'none'; // Hide "Go on Top" button
    window.scrollTo(0, 0); // Scroll to the top of the page
  };
};

// Scroll to top button script
let mybutton = document.getElementById("myBtn");

window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (document.documentElement.scrollTop > 100) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// Scroll to top function
function topFunction() {
  document.documentElement.scrollTop = 0;
}