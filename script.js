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

// safety check
if(!chat || !input){
console.error("Missing elements - check HTML IDs");
return;
}

// =============================
// CLOCK
// =============================

function updateClock(){
const now = new Date();
clock.innerText = now.toLocaleTimeString();
date.innerText = now.toDateString();
}

updateClock();
setInterval(updateClock, 1000);

// =============================
// SYSTEM STATS (fake for now)
// =============================

function rand(){
return Math.floor(Math.random()*70)+20;
}

function updateBars(){
cpuBar.style.width = rand()+"%";
ramBar.style.width = rand()+"%";
netBar.style.width = rand()+"%";
}

updateBars();
setInterval(updateBars, 2500);

// =============================
// CHAT SYSTEM
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

state.innerText = "THINKING...";

const bubble = document.createElement("div");
bubble.className = "message jarvis";
chat.appendChild(bubble);

let i = 0;

const interval = setInterval(() => {

bubble.innerHTML += text.charAt(i);
i++;

chat.scrollTop = chat.scrollHeight;

if(i >= text.length){
clearInterval(interval);
state.innerText = "AWAITING COMMAND";
}

}, 18);
}

// =============================
// COMMAND SYSTEM v2 (SKILLS ENGINE)
// =============================

const skills = [

{
name: "greeting",
keywords: ["hello","hi","hey"],
run: () => random([
"Hello, Brogan.",
"Good to see you.",
"Systems online.",
"JARVIS ready."
])
},

{
name: "time",
keywords: ["time","clock"],
run: () => "Current time is " + new Date().toLocaleTimeString()
},

{
name: "date",
keywords: ["date","today"],
run: () => "Today is " + new Date().toDateString()
},

{
name: "status",
keywords: ["status","systems"],
run: () => "All systems are fully operational."
},

{
name: "identity",
keywords: ["who are you","your name"],
run: () => "I am J.A.R.V.I.S., your assistant system."
},

{
name: "creator",
keywords: ["who made you","creator"],
run: () => "I was built by Brogan, with development assistance."
},

{
name: "intel",
keywords: ["map","intel"],
run: () => "Intel Map integration detected. Connection not yet active."
},

{
name: "code",
keywords: ["code","python","javascript"],
run: () => "Coding assistance is available once AI brain is connected."
}

];

// =============================
// FALLBACK RESPONSES
// =============================

const fallback = [
"I'm not sure about that yet.",
"That feature isn't installed.",
"I can learn that later.",
"No matching system found.",
"Module not available."
];

// =============================
// COMMAND PROCESSOR
// =============================

function processCommand(text){

const t = text.toLowerCase();

statusText.innerText = "ANALYZING...";

setTimeout(() => {

const response = findSkill(t);

typeJarvis(response);

statusText.innerText = "STANDBY";

updateLog(text);

}, 400);
}

// =============================
// SKILL FINDER
// =============================

function findSkill(text){

for(const skill of skills){

for(const key of skill.keywords){

if(text.includes(key)){
return skill.run();
}

}

}

return random(fallback);
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
// INPUT
// =============================

window.sendMessage = function(){

const text = input.value.trim();
if(!text) return;

addMessage(text,"user");

input.value = "";

processCommand(text);

};

input.addEventListener("keydown",(e)=>{
if(e.key === "Enter"){
sendMessage();
}
});

// =============================
// HELPERS
// =============================

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

});
