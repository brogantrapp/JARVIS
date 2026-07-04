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
// CONFIG (PUT YOUR KEY HERE)
// =============================

const GROQ_API_KEY = "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";

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

}, 16);
}

// =============================
// AI (GROQ - FAST + RELIABLE)
// =============================

async function askAI(message){

if(GROQ_API_KEY === "PASTE_YOUR_KEY_HERE"){
return "AI key missing. Add your Groq API key first.";
}

try{

const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${GROQ_API_KEY}`
},
body: JSON.stringify({
model: "llama-3.1-8b-instant",
messages: [
{
role: "system",
content: "content: "You are JARVIS, a helpful AI assistant. Address the user as Brogan. Try not to use the word 'Master'. Keep responses concise, clear, and slightly futuristic in tone."."
},
{
role: "user",
content: message
}
],
temperature: 0.7
})
});

const data = await res.json();

return data.choices?.[0]?.message?.content
|| "No AI response received.";

}catch(err){

console.error(err);

return "AI system unreachable.";

}

}

// =============================
// SKILLS (COMMAND SYSTEM V2)
// =============================

const skills = [

{
name: "greeting",
keywords: ["hello","hi","hey"],
run: () => random([
"Hello, Brogan.",
"Good to see you.",
"JARVIS online.",
"Systems ready."
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
run: () => "I am J.A.R.V.I.S., your AI assistant interface."
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
run: () => "Coding help will use AI brain when available."
}

];

// =============================
// FALLBACK
// =============================

const fallback = [
"I'm not sure about that yet.",
"That capability isn't active.",
"I can learn this later.",
"No skill matched.",
"Processing via AI..."
];

// =============================
// ROUTER
// =============================

async function smartResponse(text){

const skill = findSkill(text);

if(skill){
return skill;
}

// fallback to AI
return await askAI(text);

}

// =============================
// FIND SKILL
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
// PROCESS COMMAND
// =============================

async function processCommand(text){

statusText.innerText = "ANALYZING...";

setTimeout(async () => {

const response = await smartResponse(text);

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
