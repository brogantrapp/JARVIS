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

if(!chat || !input){
console.error("Missing HTML elements");
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
// SYSTEM BARS
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
// AI (CHROMEBOOK FRIENDLY)
// =============================

async function askAI(message){

try{

const res = await fetch(
"https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
inputs: message
})
}
);

const data = await res.json();

// different possible formats
if(Array.isArray(data) && data[0]?.generated_text){
return data[0].generated_text;
}

if(data.generated_text){
return data.generated_text;
}

if(typeof data === "string"){
return data;
}

return "AI responded but format was unexpected.";

}catch(err){

console.error("AI error:", err);

return "AI module offline or unreachable.";

}

}

// =============================
// SKILLS SYSTEM (v2)
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
run: () => "All systems operational."
},

{
name: "identity",
keywords: ["who are you","your name"],
run: () => "I am J.A.R.V.I.S., your assistant system."
},

{
name: "creator",
keywords: ["who made you","creator"],
run: () => "Built by Brogan with AI assistance."
},

{
name: "intel",
keywords: ["map","intel"],
run: () => "Intel Map detected. Integration pending."
},

{
name: "code",
keywords: ["code","python","javascript"],
run: () => "Coding help enabled via AI when needed."
}

];

// =============================
// FALLBACK
// =============================

const fallback = [
"I'm not sure yet.",
"That module is not active.",
"I can learn that later.",
"No direct skill found.",
"Processing request..."
];

// =============================
// SMART ROUTER
// =============================

async function smartResponse(text){

const skillResult = findSkill(text);

// if skill matched, use it
if(skillResult && !fallback.includes(skillResult)){
return skillResult;
}

// otherwise AI
return await askAI(text);

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

return null;
}

// =============================
// COMMAND PROCESSOR
// =============================

async function processCommand(text){

const t = text.toLowerCase();

statusText.innerText = "ANALYZING...";

setTimeout(async () => {

const response = await smartResponse(t);

typeJarvis(response);

statusText.innerText = "STANDBY";

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
