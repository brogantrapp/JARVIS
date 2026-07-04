window.addEventListener("DOMContentLoaded", () => {

// =============================
// ELEMENTS
// =============================

const chat = document.getElementById("chat");
const input = document.getElementById("prompt");

const statusText = document.getElementById("statusText");
const state = document.getElementById("jarvisState");
const log = document.getElementById("log");

const utcPanel = document.getElementById("utcTime");

if(!chat || !input){
console.error("Missing HTML elements");
return;
}

// =============================
// CONFIG
// =============================

const GROQ_API_KEY = "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";

// =============================
// UTC CLOCK CORE
// =============================

function updateUTC(){

try{

if(!utcPanel) return;

const now = new Date();
const utc = now.toISOString().split("T")[1].split(".")[0];

utcPanel.innerText = utc;

}catch(err){
console.error("UTC error:", err);
}

}

updateUTC();
setInterval(updateUTC, 1000);

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
// VOICE OUTPUT
// =============================

function speak(text){

try{

speechSynthesis.cancel();

const speech = new SpeechSynthesisUtterance(text);

speech.rate = 0.9;
speech.pitch = 0.75;
speech.volume = 1;

let voices = speechSynthesis.getVoices();

if(!voices || voices.length === 0){
speechSynthesis.onvoiceschanged = () => speak(text);
return;
}

const jarvisVoice =
voices.find(v => v.lang === "en-GB") ||
voices.find(v => v.name.toLowerCase().includes("david")) ||
voices.find(v => v.name.toLowerCase().includes("male")) ||
voices[0];

speech.voice = jarvisVoice;

speechSynthesis.speak(speech);

}catch(err){
console.error("Voice error:", err);
}

}

// =============================
// TYPE EFFECT
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

speak(text);
}

}, 16);

}

// =============================
// AI (GROQ)
// =============================

async function askAI(message){

if(GROQ_API_KEY === "PASTE_YOUR_KEY_HERE"){
return "AI key missing.";
}

try{

const controller = new AbortController();
setTimeout(() => controller.abort(), 8000);

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
content: "You are JARVIS. Address the user as Brogan. Keep responses short (1–3 sentences). Never say Master."
},
{
role: "user",
content: message
}
]
})
});

const data = await res.json();

return data.choices?.[0]?.message?.content || "No response.";

}catch(err){
console.error(err);
return "AI unavailable.";
}

}

// =============================
// SKILLS
// =============================

const skills = [

{
name:"greeting",
keywords:["hello","hi","hey"],
run:()=>random([
"Hello, Brogan.",
"JARVIS online.",
"Systems ready."
])
},

{
name:"time",
keywords:["time","clock"],
run:()=> "Current time is " + new Date().toLocaleTimeString()
},

{
name:"date",
keywords:["date","today"],
run:()=> "Today is " + new Date().toDateString()
},

{
name:"status",
keywords:["status"],
run:()=> "All systems operational."
}

];

// =============================
// HELPERS
// =============================

function random(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

// =============================
// FIND SKILL
// =============================

function findSkill(text){
for(const s of skills){
for(const k of s.keywords){
if(text.includes(k)){
return s.run();
}
}
}
return null;
}

// =============================
// SMART ROUTER
// =============================

async function smartResponse(text){

const skill = findSkill(text);

if(skill){
return skill;
}

return await askAI(text);

}

// =============================
// PROCESS COMMAND
// =============================

async function processCommand(text){

statusText.innerText = "ANALYZING...";

try{

const response = await smartResponse(text);

typeJarvis(response);

statusText.innerText = "STANDBY";

updateLog(text);

}catch(err){

console.error(err);

typeJarvis("System error.");

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
