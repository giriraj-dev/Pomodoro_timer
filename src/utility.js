const resetAll = () => {
    clearInterval(timerInterval);
    clearTimeout(timeoutId);
    alarmSound.pause();

    // Reset the displayed times and messages
    set_time.value = "00:00:05";
    set_break.value = "00:00:10";
    information.innerHTML = "";
    info.innerHTML = "";
    done.innerHTML = "";
    again.innerHTML = "";
    completedPomodoros = 0; // Reset completed Pomodoros count
    isPaused = false;
    //isInBreak = false;
    alert("Timer successfully reset");
};

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
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart( 2,"0")}:${String(seconds).padStart(2, "0")}`;
};
/* Function to play the alarm sound */
function playAlarm() {
    alarmSound.play();
    setTimeout(() => alarmSound.pause(), 5000); // Stop after 5 seconds
}

// General function to increment time
const incrementTime = (inputField, minutesToAdd) => {
    let value = timeToMilliseconds(inputField.value) + minutesToAdd * 60 * 1000;
    inputField.value = secondsToTime(Math.floor(value / 1000)); // Update the time in the input field
};
const decrementTime = (inputField, minutesToAdd) => {
    let value = timeToMilliseconds(inputField.value) - minutesToAdd * 60 * 1000;
    inputField.value =
    value > 0 ? secondsToTime(Math.floor(value / 1000)) : "00:00:00";
};

const logger = (logs, message) =>{
    logs.push(`${new Date()}---${message}`);
    let store = document.getElementsByClassName("save")[0];
    store.innerHTML = "";
    localStorage.setItem("logger", JSON.stringify(logs));
};

const printLog = (id) =>{
    //console.log("this");
    const logs = JSON.parse(localStorage.getItem("logger"));
    const loggerDiv = document.getElementById(id);


logs.forEach((log) => {
    let div = document.createElement("div");
    // Apply CSS styles to the log message
    div.style.color = "blue"; 
    div.style.fontSize = "14px"; 
    div.style.border = "1px solid black";
    div.style.padding = "5px"; 
    div.style.marginBottom = "5px";

    div.innerHTML = log;
    loggerDiv.appendChild(div);
});
};
// logger(logs, "Timer started");