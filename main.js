let set_time = document.getElementById("settime");
set_time.value = "00:01:00"; // Default timer value

let set_break = document.getElementById("setbreak");
set_break.value = "00:01:00"; // Default break value

// Coverting Time to Milliseconds

const timeToMilliseconds = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600000 + minutes * 60000 + seconds * 1000;
};

// Coverting Time to Seconds

const timeToSecond = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Coverting Seconds to Time (HH:MM:SS)

const secondsToTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

//Initialize variables for timer management
let timeoutId,
  timerInterval,
  cycles = 4,
  currentCycle = 0;

// Get references to DOM elements
let reset = document.getElementsByClassName("refresh")[0];
let go = document.getElementsByClassName("start")[0];
let information = document.getElementsByClassName("message")[0];
let info = document.getElementsByClassName("breakMess")[0];
let pause = document.getElementsByClassName("wait")[0];
let done = document.getElementsByClassName("done")[0];
let again = document.getElementsByClassName("repeat")[0];
let alarmSound = document.getElementById("sound");
let increment = document.getElementsByClassName("add");
let decrement = document.getElementsByClassName("minus");

let remainingTime; // Store the remaining time
let isPaused = false; // Track pause state
let isInBreak = false; // Track if it's break time
let remainingTimeout; // Store remaining time for the timeout transitions

/*1.RESET all timer values and clear any running timers or intervals
  2.Clear displayed messages and reset the cycle counter
  3.Set work time to "00:00:07" and break time to "00:00:03"
  4.Stop any ongoing timers, intervals, and ensure the timer is not paused or in break mode
  5.Notify the user that the timer has been successfully */
function playAlarm() {
  alarmSound.play();
  setTimeout(() => {
    alarmSound.pause();
  }, 5000);
}

reset.onclick = () => {
  information.innerHTML = "";
  info.innerHTML = "";
  done.innerHTML = "";
  again.innerHTML = "";
  currentCycle = 0;
  set_time.value = "00:00:07";
  clearTimeout(timeoutId);
  set_break.value = "00:00:03";
  alarmSound.pause();
  clearTimeout(timeoutId);
  alert("Timer successfully reset to 00:00:07.");
  clearInterval(timerInterval);
  isPaused = false;
  isInBreak = false;
  remainingTimeout = null;
};

/*1.Function to update the countdown timer
  2.Takes time in seconds as input and sets the remaining time
  3.Starts a 1-second interval to decrease the remaining time each second
  4.Updates the timer display with the new time formatted as HH:MM:SS
  5.When the timer reaches 0, stops the interval and can optionally trigger a break countdown*/

function updateCountdown(timeInSeconds) {
  remainingTime = timeInSeconds;

  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      const newTime = secondsToTime(remainingTime);
      set_time.value = newTime;
    } else {
      clearInterval(timerInterval);
      breakupdateCountdown(); // Start break countdown when time reaches 0
    }
  }, 1000);
}

function breakupdateCountdown() {
  isInBreak = true;
  let breaktimeInseconds = timeToSecond(set_break.value);

  timerInterval = setInterval(() => {
    if (breaktimeInseconds > 0) {
      breaktimeInseconds--;
      const newbreakTime = secondsToTime(breaktimeInseconds);
      set_break.value = newbreakTime;
    } else {
      clearInterval(timerInterval);
      set_time.value = "00:00:07"; //Reset main timer for the next cycle
      isInBreak = false;
      startTimer(); // Start the next cycle
    }
  }, 1000);
}

/*Pause the timer when the button is clicked
  If the timer is not already paused:
  1. Stop the timer by clearing the interval (prevents further countdown)
  2. Clear any timeout for transitioning between sessions (if applicable)
  3. Set the isPaused flag to true to indicate the timer is now paused
  4. Calculate and store the remaining time in milliseconds for future resumption*/

pause.onclick = () => {
  alarmSound.pause();
  if (!isPaused) {
    clearInterval(timerInterval); // Pause the timer by clearing the interval
    clearTimeout(timeoutId); // Clear the transition timeout
    isPaused = true;
    remainingTimeout =
      timeToMilliseconds(set_time.value) - remainingTime * 1000; // Store remaining time for transition
  }
};

/*Increment function for the first button (work session):
  1. Convert the current time value from the timer (set_time) into milliseconds
  2. Add 5 minutes (5 * 60 * 1000 milliseconds) to the current time
  3. Convert the updated time back to seconds, then format it to HH:MM:SS
  4. Update the set_time input field with the new time

  Increment function for the second button (break session):
  1. Convert the current break time (set_break) into milliseconds
  2. Add 5 minutes (5 * 60 * 1000 milliseconds) to the current break time
  3. Convert the updated time back to seconds, then format it to HH:MM:SS
  4. Update the set_break input field with the new break time*/

  
increment[0].onclick = () => {
  let value = timeToMilliseconds(set_time.value) + 5 * 60 * 1000;
  let totalSeconds = Math.floor(value / 1000);
  let t = secondsToTime(totalSeconds);
  set_time.value = t;
};

increment[1].onclick = () => {
  let value = timeToMilliseconds(set_break.value) + 5 * 60 * 1000;
  let totalSeconds = Math.floor(value / 1000);
  let t = secondsToTime(totalSeconds);
  set_break.value =t
};


/*Decrement function for work session:
  1. Check if set_time is greater than "00:00:00"
  2. Subtract 5 minutes from set_time if true, update display
  3. If set_time is "00:00:00", do not decrement further

  Decrement function for break session:
  1. Check if set_break is greater than "00:00:00"
  2. Subtract 5 minutes from set_break if true, update display
  3. If set_break is "00:00:00", do not decrement further*/

decrement[0].onclick = () => {
  if (set_time.value > "00:00:00") {
    let value = timeToMilliseconds(set_time.value) - 5 * 60 * 1000;
    let totalSeconds = Math.floor(value / 1000);
    let t = secondsToTime(totalSeconds);
    set_time.value = t;
  } else {
    set_time.value = "00:00:00";
  }
};

decrement[1].onclick = () => {
  if (set_break.value > "00:00:00") {
    let value = timeToMilliseconds(set_break.value) - 5 * 60 * 1000;
    let totalSeconds = Math.floor(value / 1000);
    let t = secondsToTime(totalSeconds);
    set_break.value = t;
  } else {
    set_break.value = "00:00:00";
  }
};

// Start or resume the timer based on the current cycle
// 1. If there are remaining cycles:
//    - If paused, resume from the remaining time and transition with the remaining timeout
//    - If not paused, start a fresh cycle with the initial time and set up the transition
// 2. Clear previous messages and display "TIMER STARTED!!"
// 3. When all cycles are completed, clear messages and display "All cycles completed!"

go.onclick = () => {
  const startTimer = () => {
    if (currentCycle < cycles) {
      again.innerHTML = "";
      info.innerHTML = "";
      alarmSound.pause();
      if (isPaused) {
        // Resume from where it left off
        isPaused = false;
        updateCountdown(remainingTime); // Use remaining time
        timeoutId = setTimeout(() => {
          currentCycle++;
          startBreak();
        }, remainingTimeout); // Resume transition with remaining timeout
      } else {
        // Fresh cycle
        const initialTimeInSeconds = timeToSecond(set_time.value);
        updateCountdown(initialTimeInSeconds);
        timeoutId = setTimeout(() => {
          currentCycle++;
          startBreak();
        }, timeToMilliseconds(set_time.value));
      }
      information.innerHTML = "TIMER STARTED!!";
    } else {
      info.innerHTML = "";
      again.innerHTML = "";
      done.innerHTML = "All cycles completed!";
      playAlarm();
    }
  };

  /*Start the break period after a cycle
  1. Clear previous messages from the display
  2. Display "Break Time!" to indicate the break period has started
  3. Set a timeout for the break duration based on set_break value
    - After the break duration ends, update set_time to "00:00:07" for the next cycle
    - Show "Break over! Get ready for the next cycle." message
    - Call startTimer() to begin the next timer cycle*/

  const startBreak = () => {
    information.innerHTML = ""; // Clear old messages
    info.innerHTML = "";
    again.innerHTML = ""; // Clear old break messages
    info.innerHTML = "Break Time!";
    playAlarm();
    timeoutId = setTimeout(() => {
      set_time.value = "00:00:07";
      again.innerHTML = "Break over! Get ready for the next cycle.";
      startTimer();
    }, timeToMilliseconds(set_break.value));
  };

  startTimer(); // Start the first timer cycle
};








// function clickHandler(obj) {
//   console.log("clicHandler", obj);
//   let value = timeToMilliseconds(obj.value) + 5 * 60 * 1000;
//   let totalSeconds = Math.floor(value / 1000);
//   let t = secondsToTime(totalSeconds);
//   obj.value = t;
// }


//   increment[0].onclick = () => {
//       clickHandler(set_time);
//   };
//   increment[1].onclick = () => {
//     clickHandler(set_break);
//   }

// function breakupdateCountdown() {
//   isInBreak = true;
//   let breaktimeInseconds = timeToSecond(set_break.value);

//   timerInterval = setInterval(() => {
//     if (breaktimeInseconds > 0) {
//       breaktimeInseconds--;
//       const newbreakTime = secondsToTime(breaktimeInseconds);
//       set_break.value = newbreakTime;
//     } else {
//       clearInterval(timerInterval);
//       set_time.value = "00:00:07"; // Reset main timer for the next cycle
//       isInBreak = false;
//       startTimer(); // Start the next cycle
//     }
//   }, 1000);
// }

// let set_time = document.getElementById("settime");
//         set_time.value = "00:00:07";  // Default timer value

//         let set_break = document.getElementById("setbreak");
//         set_break.value = "00:00:02";  // Default break value

//         let countDown = document.getElementById("timer");
//         countDown.innerHTML = set_time.value;

//         let timeoutId, cycles = 4, currentCycle = 0;
//         let reset = document.getElementsByClassName("refresh")[0];
//         let go = document.getElementsByClassName("start")[0];
//         let information = document.getElementsByClassName("message")[0];
//         let info = document.getElementsByClassName("breakMess")[0];
//         let done = document.getElementsByClassName("done")[0];
//         let alarmSound = document.getElementById("sound");

//         // Convert time string (HH:MM:SS) to total seconds
//         const timeToSeconds = (time) => {
//             const [hours, minutes, seconds] = time.split(':').map(Number);
//             return (hours * 3600) + (minutes * 60) + seconds;
//         };

//         // Convert total seconds to time string (HH:MM:SS)
//         function formatTime(totalSeconds) {
//             const hours = Math.floor(totalSeconds / 3600);
//             const minutes = Math.floor((totalSeconds % 3600) / 60);
//             const seconds = totalSeconds % 60;
//             return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//         }

//         // Reset function
//         function redo() {
//             clearInterval(timerInterval);
//             information.innerHTML = ""; // Clear messages
//             info.innerHTML = "";
//             done.innerHTML = ""; // Clear break messages
//             currentCycle = 0;
//             timeInSeconds = timeToSeconds(set_time.value); // Reset to default time
//             countDown.innerHTML = formatTime(timeInSeconds);
//             alert("Timer successfully reset to 00:00:07.");
//         }

//         let timerInterval;
//         let timeInSeconds = timeToSeconds(set_time.value); // Convert set time to seconds

//         // Update the countdown every second
//         function updateCountdown() {
//             if (timeInSeconds > 0) {
//                 timeInSeconds--;  // Decrease the time by 1 second
//                 const newTime = formatTime(timeInSeconds);  // Format the time back to HH:MM:SS

//                 // Update both the input field and the div with the new time
//                 set_time.value = newTime;
//                 countDown.innerHTML = newTime;
//             } else {
//                 clearInterval(timerInterval);  // Stop the countdown when time reaches 0
//                 alert('Time is up!');
//             }
//         }

//         reset.onclick = () => {
//             redo();
//         };

//         go.onclick = () => {
//             timeInSeconds = timeToSeconds(set_time.value); // Reinitialize time
//             clearInterval(timerInterval); // Ensure no other intervals are running
//             timerInterval = setInterval(updateCountdown, 1000); // Start the countdown
//         };

// function formatTime(totalSeconds) {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
// }

// // Set the initial time in seconds for countdown
// let timeInSeconds = inSeconds(set_time.value);

// // Function to update the countdown every second
// function updateCountdown() {
//     if (timeInSeconds > 0) {
//         timeInSeconds--;  // Decrease the time by 1 second
//         const newTime = formatTime(timeInSeconds);  // Format the time back to HH:MM:SS

//         // Update both the input field and the div with the new time
//         set_time.value = newTime;
//         countDown.innerHTML = newTime;
//     } else {
//         clearInterval(timerInterval);  // Stop the countdown when time reaches 0
//         alert('Time is up!');
//     }
// }

// // Start the countdown using setInterval
// let timerInterval = setInterval(updateCountdown, 1000);

//let braekInformation= document.getElementsByClassName("breakMessage")[0];
//let breakInfo=document.getElementsByClassName("breakMess")[0];
//const redo = document.getElementsByClassName("again")[0];
// let second=document.getElementsByClassName("seconds")[0];
// second.onclick=(e)=>{
//   let num=prompt("enter your time in seconds");
//   const sec = num * 1000;
//   function getData(dataId) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         console.log (dataId);
//         resolve("success");
//         },sec);
//     });
//   }
//   async function getAllData(){
//     console.log("your alarm is set for " +num+ " seconds");
//     await getData("have a break");
//   }

//   getAllData();
// };

// let minute=document.getElementsByClassName("minutes")[0];
// minute.onclick=(e)=>{
//   let num=prompt("enter your time in minutes")
//   let min = num * 60000;
//   function getData(dataId) {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         console.log (dataId);
//         resolve("success");
//         },min);
//     });
//   }

//   // function getData(dataId,min)

//   async function getAllData(){
//     console.log("your alarm is set for " +num+ " minutes");
//     await getData("have a break");
//   }
//   getAllData();
// };

// let hour=document.getElementsByClassName("hours")[0]
// hour.onclick=(e)=>{
// let num=prompt("enter your time in hours");
// const hou= num * 3600000;
// function getData(dataId) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log (dataId);
//       resolve("success");
//       },hou);
//   });
// }

// async function getAllData(){
//   console.log("your alarm is set for " +num+ " hours");
//   await getData("have a break");
// }
// getAllData();
// };
