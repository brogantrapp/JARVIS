window.addEventListener("DOMContentLoaded", () => {

// =============================
// ELEMENTS
// =============================

const chat = document.getElementById("chat");
const input = document.getElementById("prompt");

const clock = document.getElementById("clock");
const date = document.getElementById("date");

const cpuBar = document.getElementById("cpuBar");
const ramBar = document.getElementById("ramBar");
const netBar = document.getElementById("netBar");

const statusText = document.getElementById("statusText");
const state = document.getElementById("jarvisState");
const log = document.getElementById("log");

// safety check (prevents silent failure)
if(!chat || !input){
console.error("Missing HTML elements. Check IDs in index.html");
return;
}

// =============================
// CLOCK (FIXED)
// =============================

function updateClock(){
const now = new Date();
clock.innerText = now.toLocaleTimeString();
date.innerText = now.toDateString();
}

updateClock();
setInterval(updateClock, 1000);

// =============================
// SYSTEM BARS
// =============================

function rand(){
return Math.floor(Math.random()*70)+20;
}

function updateBars(){
cpuBar.style.width = rand() + "%";
ramBar.style.width = rand() + "%";
netBar.style.width = rand() + "%";
}

updateBars();
setInterval(updateBars, 2500);

// =============================
// CHAT
// =============================

function addMessage(text,type){
const div = document.createElement("div");
div.className = "message " + type;
div.innerHTML = text;
chat.appendChild(div);
chat.scrollTop = chat.scrollHeight;
}

// =============================
// TYPING EFFECT
// =============================

function typeJarvis(text){

state.innerText = "PROCESSING...";

const bubble = document.createElement("div");
bubble.className = "message jarvis";
chat.appendChild(bubble);

let i = 0;

const timer = setInterval(() => {
bubble.innerHTML += text.charAt(i);
i++;

if(i >= text.length){
clearInterval(timer);
state.innerText = "AWAITING COMMAND";
}

chat.scrollTop = chat.scrollHeight;

}, 18);
}

// =============================
// COMMAND ENGINE
// =============================

function processCommand(text){

const t = text.toLowerCase();

statusText.innerText = "Analyzing...";

setTimeout(() => {

typeJarvis(getResponse(t));
statusText.innerText = "Standing by.";
updateLog(text);

}, 300);
}

// =============================
// LOG
// =============================

function updateLog(cmd){
const time = new Date().toLocaleTimeString();

log.innerHTML =
`• ${time}<br>${cmd}<br><br>` + log.innerHTML;
}

// =============================
// RESPONSE ENGINE
// =============================

function getResponse(t){

if(t.includes("hello") || t.includes("hi") || t.includes("hey")){
return "Hello, Brogan.";
}

if(t.includes("time")){
return "Current time is " + new Date().toLocaleTimeString();
}

if(t.includes("date")){
return "Today is " + new Date().toDateString();
}

if(t.includes("who are you")){
return "I am J.A.R.V.I.S., your assistant.";
}

if(t.includes("status")){
return "All systems operational.";
}

return "I’m online. I just don’t have that capability yet.";
}

// =============================
// SEND MESSAGE (FIXED)
// =============================

window.sendMessage = function(){

const text = input.value.trim();
if(!text) return;

addMessage(text,"user");
input.value = "";

processCommand(text);
};

// Enter key support
input.addEventListener("keydown", (e) => {
if(e.key === "Enter"){
sendMessage();
}
});

});
