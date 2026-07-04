// ==========================================
// J.A.R.V.I.S. v0.2
// PART 1
// ==========================================

// ---------- ELEMENTS ----------

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

// ---------- STARTUP ----------

const startupMessages = [

"Systems Online.",
"Initializing Core...",
"Loading Interface...",
"Connecting Modules...",
"Diagnostics Complete.",
"Awaiting Command."

];

let startupIndex = 0;

function startupSequence(){

if(startupIndex >= startupMessages.length){

state.innerText = "AWAITING COMMAND";

statusText.innerText = "All systems operational.";

return;

}

state.innerText = startupMessages[startupIndex];

startupIndex++;

setTimeout(startupSequence,800);

}

setTimeout(startupSequence,800);

// ---------- CLOCK ----------

function updateClock(){

const now = new Date();

clock.innerText = now.toLocaleTimeString();

date.innerText = now.toDateString();

}

updateClock();

setInterval(updateClock,1000);

// ---------- SYSTEM BARS ----------

function randomStat(){

return Math.floor(Math.random()*70)+20;

}

function updateBars(){

cpuBar.style.width=randomStat()+"%";

ramBar.style.width=randomStat()+"%";

netBar.style.width=randomStat()+"%";

}

updateBars();

setInterval(updateBars,2500);

// ---------- CHAT ----------

function addMessage(text,type){

const div=document.createElement("div");

div.className="message "+type;

div.innerHTML=text;

chat.appendChild(div);

chat.scrollTop=chat.scrollHeight;

}

// ---------- TYPING ----------

function typeJarvis(text){

state.innerText="PROCESSING...";

const bubble=document.createElement("div");

bubble.className="message jarvis";

chat.appendChild(bubble);

let i=0;

const timer=setInterval(()=>{

bubble.innerHTML+=text.charAt(i);

chat.scrollTop=chat.scrollHeight;

i++;

if(i>=text.length){

clearInterval(timer);

state.innerText="AWAITING COMMAND";

}

},18);

}

// ---------- RANDOM GREETINGS ----------

const greetings=[

"Good to see you, Brogan.",

"Hello again.",

"Welcome back.",

"Systems are operating normally.",

"Awaiting your instructions.",

"What can I do for you?",

"Online and ready."

];

// ---------- SEND ----------

function sendMessage(){

const text=input.value.trim();

if(text==="") return;

addMessage(text,"user");

input.value="";

processCommand(text);

}

input.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

sendMessage();

}

});

// ---------- PROCESS ----------

function processCommand(text){

const t=text.toLowerCase();

statusText.innerText="Analyzing request...";

setTimeout(()=>{

const response=getResponse(t);

typeJarvis(response);

statusText.innerText="Standing by.";

updateMissionLog(text);

},500);

}

// ---------- LOG ----------

function updateMissionLog(command){

const now=new Date().toLocaleTimeString();

log.innerHTML=

"• Last Command ("+now+")<br>"+

command+"<br><br>"+

log.innerHTML;

}

// ---------- RESPONSE ENGINE ----------

function getResponse(t){

// Greetings

if(

t.includes("hello") ||

t.includes("hi") ||

t.includes("hey")

){

return randomFrom(greetings);

}

// Time

if(

t.includes("time")

){

return "The current time is "+new Date().toLocaleTimeString()+".";

}

// Date

if(

t.includes("date") ||

t.includes("today")

){

return "Today is "+new Date().toDateString()+".";

}

// Name

if(

t.includes("your name")

||

t.includes("who are you")

){

return "I am J.A.R.V.I.S., your personal artificial intelligence assistant.";

}

// Creator

if(

t.includes("who made you")

||

t.includes("creator")

){

return "I am currently being developed by Brogan with assistance from ChatGPT.";

}

// Status

if(

t.includes("status")

||

t.includes("systems")

){

return "All primary systems are functioning normally.";

}

// Continue in Part 2...// ==========================================
// J.A.R.V.I.S. v0.2
// PART 2
// ==========================================

// ---------- RANDOM HELPER ----------

function randomFrom(arr){
return arr[Math.floor(Math.random()*arr.length)];
}

// ---------- AI HOOK (FUTURE READY) ----------

async function askAI(prompt){

// This is where we will later connect:
// - Ollama (FREE local AI)
// - OR OpenAI API (optional)
//
// For now it just simulates thinking.

return "I'm not connected to a full AI model yet, but I understood: " + prompt;

}

// ---------- MAIN RESPONSE ENGINE CONTINUED ----------

function getResponse(t){

// Greetings

if(
t.includes("hello") ||
t.includes("hi") ||
t.includes("hey")
){
return randomFrom(greetings);
}

// Time

if(t.includes("time")){
return "The current time is " + new Date().toLocaleTimeString() + ".";
}

// Date / Today

if(
t.includes("date") ||
t.includes("today")
){
return "Today is " + new Date().toDateString() + ".";
}

// Status

if(t.includes("status") || t.includes("systems")){
return "All systems are stable. Core temperature nominal. Interface online.";
}

// Who are you

if(
t.includes("who are you") ||
t.includes("your name")
){
return "I am J.A.R.V.I.S., your personal AI assistant interface.";
}

// Who made you

if(
t.includes("who made you") ||
t.includes("creator")
){
return "I was built as a custom assistant system by Brogan, with development assistance.";
}

// Weather (placeholder)

if(t.includes("weather")){
return "Weather module is not connected yet. We will add real-time data next.";
}

// News (placeholder)

if(t.includes("news")){
return "News module offline. We can integrate live feeds later.";
}

// Intel Map reference (your project hook)

if(t.includes("map") || t.includes("intel")){

return "Intel Map detected. I can integrate with your mapping system once we connect APIs.";

}

// Coding help

if(
t.includes("code") ||
t.includes("python") ||
t.includes("javascript")
){

return "I can help with coding. What are you trying to build?";

}

// Fun Easter egg

if(t.includes("iron man") || t.includes("tony stark")){
return "Tony Stark built something similar... but I think ours will be better.";
}

// Emergency / dramatic mode

if(t.includes("emergency")){
return "Emergency mode not configured. All systems still online.";
}

// Fallback → more human-like response

const fallbackResponses = [

"I'm not fully trained on that yet, but I can learn it.",

"Interesting request. We can add that to my capabilities.",

"I don't have a module for that yet.",

"Processing... but no matching command found.",

"That feature isn't active yet, but it can be built."

];

// Default fallback
return randomFrom(fallbackResponses);

}

// ---------- OPTIONAL: FUTURE VOICE HOOK ----------

function speak(text){

// We will later replace this with high-quality TTS (Piper / ElevenLabs / browser voice)

if('speechSynthesis' in window){

const utterance = new SpeechSynthesisUtterance(text);

utterance.rate = 1;

utterance.pitch = 0.9;

speechSynthesis.speak(utterance);

}

}

// ---------- AUTO SPEAK (OPTIONAL) ----------

// Uncomment this if you want JARVIS to speak responses
// inside typeJarvis() later

/*
const originalTypeJarvis = typeJarvis;

typeJarvis = function(text){

originalTypeJarvis(text);

setTimeout(()=>speak(text),500);

};
*/

// ---------- BOOT COMPLETE MESSAGE ----------

setTimeout(()=>{

addMessage("System fully initialized. JARVIS is now operational.","jarvis");

},4000);
