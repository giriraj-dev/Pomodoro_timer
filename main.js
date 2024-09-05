let set_time = document.getElementById("settime");
set_time.value = "00:00:07";  // Default timer value

let set_break = document.getElementById("setbreak");
set_break.value = "00:00:02";  // Default break value

// let countDown = document.getElementById("timer");
// countDown.innerHTML = set_time.value;

const timeToMilliseconds = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
};

const timeToSecond = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + (seconds);
};

const secondsToTime=(totalSeconds)=>{
    const hours = Math.floor(totalSeconds / 3600);
    const minutes= Math.floor ((totalSeconds % 3600)/60);
    const seconds=totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

let timeoutId, timerInterval, cycles = 4, currentCycle = 0;
let reset = document.getElementsByClassName("refresh")[0];
let go = document.getElementsByClassName("start")[0];
let information= document.getElementsByClassName("message")[0];
let info=document.getElementsByClassName("breakMess")[0];
let pause=document.getElementsByClassName("wait")[0];
let done=document.getElementsByClassName("done")[0];
let again=document.getElementsByClassName("repeat")[0];
let alarmSound = document.getElementById("sound");

reset.onclick=()=>{
    information.innerHTML = ""; // Clear  messages
    info.innerHTML = "";// Clear break messages
    done.innerHTML="";
    again.innerHTML="" 
    currentCycle=0;
    set_time.value = "00:00:07"; clearTimeout(timeoutId); 
    set_break.value = "00:00:03"; clearTimeout(timeoutId); 
    alert("Timer successfully reset to 00:00:07.");
    clearInterval(timerInterval);
}

function updateCountdown(){
    // let timeInSeconds=duration;
    let timeInseconds= timeToSecond(set_time.value);

    timerInterval = setInterval(()=>{
        if(timeInseconds>0){
            timeInseconds--;
            const newTime=secondsToTime(timeInseconds);

            set_time.value = newTime;
        }
        else{
            clearInterval(timerInterval);
           // cancelIdleCallback();
        }
    },1000);
}

go.onclick = () => {
    const startTimer = () => {
        if (currentCycle < cycles) {
            information.innerHTML = ""; // Clear old messages
            info.innerHTML = ""; // Clear old break messages
            again.innerHTML="";
            updateCountdown();
            information.innerHTML="Cycle " + (currentCycle + 1) + ": Your alarm is set for " + set_time.value;
            timeoutId = setTimeout(() => {
                currentCycle++;
                startBreak();
            }, timeToMilliseconds(set_time.value));
        } else {
            info.innerHTML="";
            done.innerHTML="All cycles completed!";
        }
    };

    const startBreak = () => {
        information.innerHTML = ""; // Clear old messages
        info.innerHTML = "";
        again.innerHTML="" // Clear old break messages
        info.innerHTML="Break time! Your break is set for " + set_break.value;
        timeoutId = setTimeout(() => {
            set_time.value = "00:00:07";
            again.innerHTML="Break over! Get ready for the next cycle.";
            startTimer();
        }, timeToMilliseconds(set_break.value));
    };

    startTimer(); // Start the first timer cycle
};



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
