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

// safety check (prevents total crash)
if(!chat || !input){
console.error("Missing HTML elements - check IDs");
return;
}

// =============================
// CONFIG
// =============================

const GROQ_API_KEY = "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";

// =============================
// CLOCK (SAFE)
// =============================

function updateClock(){

try{

const now = new Date();

if(clock) clock.innerText = now.toLocaleTimeString();
if(date) date.innerText = now.toDateString();

}catch(err){
console.error("Clock error:", err);
}

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
try{
cpuBar.style.width = rand()+"%";
ramBar.style.width = rand()+"%";
netBar.style.width = rand()+"%";
}catch(e){
console.error("Bars error:", e);
}
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
// TYPE EFFECT + VOICE HOOK
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

// optional voice (safe)
speak(text);
}

}, 16);

}

// =============================
// VOICE OUTPUT (SAFE)
// =============================

function speak(text){

try{

// stop overlapping speech
speechSynthesis.cancel();

const speech = new SpeechSynthesisUtterance(text);

// JARVIS-style tuning
speech.rate = 0.92;     // slightly slower = more authoritative
speech.pitch = 0.85;    // lower = more “AI / male assistant feel”
speech.volume = 1;

// try to find best available voice
const voices = speechSynthesis.getVoices();

let jarvisVoice = voices.find(v =>
v.name.toLowerCase().includes("english") &&
(v.name.toLowerCase().includes("uk") ||
 v.name.toLowerCase().includes("brit") ||
 v.lang === "en-GB")
);

// fallback chain if UK voice not found
if(!jarvisVoice){
jarvisVoice = voices.find(v =>
v.name.toLowerCase().includes("david") ||
v.name.toLowerCase().includes("mark") ||
v.name.toLowerCase().includes("male")
);
}

if(jarvisVoice){
speech.voice = jarvisVoice;
}

speechSynthesis.speak(speech);

}catch(err){
console.error("Voice error:", err);
}

}

// =============================
// AI (GROQ - STABLE)
// =============================

async function askAI(message){

if(GROQ_API_KEY === "PASTE_YOUR_KEY_HERE"){
return "AI key missing. Please add your Groq API key.";
}

try{

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 8000);

const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
method: "POST",
signal: controller.signal,
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${GROQ_API_KEY}`
},
body: JSON.stringify({
model: "llama-3.1-8b-instant",
messages: [
{
role: "system",
content: "You are JARVIS. Address the user as Brogan. Never say Master. Keep responses short (1-3 sentences). Be clear, direct, and slightly futuristic."
},
{
role: "user",
content: message
}
]
})
});

clearTimeout(timeout);

const data = await res.json();

return data.choices?.[0]?.message?.content
|| "No AI response received.";

}catch(err){

console.error("AI ERROR:", err);

return "AI system unavailable.";

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
"JARVIS online.",
"Systems ready.",
"Good to see you, Brogan."
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
run: () => "Built by Brogan with development assistance."
},

{
name: "intel",
keywords: ["map","intel"],
run: () => "Intel Map detected. Integration pending."
},

{
name: "code",
keywords: ["code","python","javascript"],
run: () => "AI brain will handle coding requests when needed."
}

];

// =============================
// FALLBACK
// =============================

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

// =============================
// ROUTER
// =============================

async function smartResponse(text){

try{

const skill = findSkill(text);

if(skill){
return skill;
}

return await askAI(text);

}catch(err){

console.error("Router error:", err);

return "System error.";

}

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
// PROCESS COMMAND (SAFE)
// =============================

async function processCommand(text){

statusText.innerText = "ANALYZING...";

try{

const response = await smartResponse(text);

if(!response){
typeJarvis("No response received.");
return;
}

typeJarvis(response);

statusText.innerText = "STANDBY";

updateLog(text);

}catch(err){

console.error("Process error:", err);

typeJarvis("System error occurred.");

statusText.innerText = "ERROR";

}

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

});
