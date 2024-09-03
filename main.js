

let set_time = document.getElementById("settime");
set_time.value = "00:25:00";  // Default timer value

let set_break = document.getElementById("setbreak");
set_break.value = "00:05:00";  // Default break value

let timeoutId;
const reset = document.getElementsByClassName("refresh")[0];
const redo = document.getElementsByClassName("again")[0];
const go = document.getElementsByClassName("start")[0];

reset.onclick = () => { set_time.value = "00:25:00"; clearTimeout(timeoutId); }
redo.onclick = () => { set_break.value = "00:05:00"; clearTimeout(timeoutId); }

const timeToMilliseconds = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
};

go.onclick = () => {
    let cycles = 4, currentCycle = 0;

    const startTimer = () => {
        if (currentCycle < cycles) {
            console.log("Cycle " + (currentCycle + 1) + ": Your alarm is set for " + set_time.value);
            timeoutId = setTimeout(() => {
                console.log("Time's up! Take a break.");
                currentCycle++;
                startBreak();
            }, timeToMilliseconds(set_time.value));
        } else {
            console.log("All cycles completed!");
        }
    };

    const startBreak = () => {
        console.log("Break time! Your break is set for " + set_break.value);
        timeoutId = setTimeout(() => {
            console.log("Break over! Get ready for the next cycle.");
            startTimer();
        }, timeToMilliseconds(set_break.value));
    };

    startTimer(); // Start the first timer cycle
};




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
