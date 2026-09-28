/* =========================================================
   PLANETARY CARBON BALANCE SANDBOX
   Complete upgraded interactive model
   ========================================================= */
const variables=[
{id:"cars",name:"Cars, trucks and buses",icon:"🚗",group:"human",weight:1.55,default:35},
{id:"airplanes",name:"Airplanes and cargo ships",icon:"✈️",group:"human",weight:1.85,default:30},
{id:"power",name:"Coal and gas power plants",icon:"🏭",group:"human",weight:2.60,default:30},
{id:"cement",name:"Cement and steel factories",icon:"🏗️",group:"human",weight:1.90,default:25},
{id:"refineries",name:"Oil refineries",icon:"🛢️",group:"human",weight:1.35,default:25},
{id:"landfills",name:"Landfills and waste sites",icon:"♻️",group:"human",weight:.95,default:20},
{id:"gas",name:"Gas heaters and stoves",icon:"🔥",group:"human",weight:.50,default:25},
{id:"animals",name:"Animals and humans",icon:"🐄",group:"natural",weight:.70,default:25},
{id:"volcanoes",name:"Volcanoes and geothermal vents",icon:"🌋",group:"natural",weight:.90,default:15},
{id:"wildfires",name:"Wildfires",icon:"🔥",group:"natural",weight:1.25,default:15},
{id:"decay",name:"Decaying plants and organisms",icon:"🍂",group:"natural",weight:.60,default:25},
{id:"forests",name:"Trees and forests",icon:"🌲",group:"sink",weight:1.80,default:65},
{id:"oceans",name:"Oceans and marine life",icon:"🌊",group:"sink",weight:1.55,default:65},
{id:"soils",name:"Soils and peatlands",icon:"🌱",group:"sink",weight:1.20,default:60}
];
const humanControls=document.getElementById("humanControls");
const naturalControls=document.getElementById("naturalControls");
const sinkControls=document.getElementById("sinkControls");
const stage=document.getElementById("environmentStage");
const statusIcon=document.getElementById("statusIcon");
const statusLabel=document.getElementById("statusLabel");
const statusDescription=document.getElementById("statusDescription");
const telemetryStatus=document.getElementById("telemetryStatus");
const emissionsValue=document.getElementById("emissionsValue");
const absorptionValue=document.getElementById("absorptionValue");
const balanceValue=document.getElementById("balanceValue");
const liveClimateMessage=document.getElementById("liveClimateMessage");
const graphType=document.getElementById("graphType");
const graphDescription=document.getElementById("graphDescription");
const canvas=document.getElementById("carbonChart");
const ctx=canvas.getContext("2d");
const simulationYear=document.getElementById("simulationYear");
const simulationStep=document.getElementById("simulationStep");
const changeIndicator=document.getElementById("changeIndicator");
const changeArrow=document.getElementById("changeArrow");
const changeTitle=document.getElementById("changeTitle");
const changeText=document.getElementById("changeText");
const previousBalance=document.getElementById("previousBalance");
const currentBalance=document.getElementById("currentBalance");
const balanceDelta=document.getElementById("balanceDelta");
const comparisonArrow=document.getElementById("comparisonArrow");
const chartLiveValue=document.getElementById("chartLiveValue");
const accessibilityLive=document.getElementById("accessibilityLive");
const emissionsChange=document.getElementById("emissionsChange");
const absorptionChange=document.getElementById("absorptionChange");
const balanceChange=document.getElementById("balanceChange");
const metricCards=[document.getElementById("emissionsCard"),document.getElementById("absorptionCard"),document.getElementById("balanceCard")];
const indicatorElements={
air:document.getElementById("airIndicator"),
forest:document.getElementById("forestIndicator"),
ocean:document.getElementById("oceanIndicator"),
airQuality:document.getElementById("airQualityIndicator"),
soil:document.getElementById("soilIndicator"),
marine:document.getElementById("marineIndicator")
};
const indicatorDetails={
air:document.getElementById("airDetail"),
forest:document.getElementById("forestDetail"),
ocean:document.getElementById("oceanDetail"),
airQuality:document.getElementById("airQualityDetail"),
soil:document.getElementById("soilDetail"),
marine:document.getElementById("marineDetail")
};
let currentData={emissions:0,absorption:0,net:0};
let previousData={emissions:0,absorption:0,net:0};
let history=[];
let numberAnimationIds=[];
let graphAnimationFrame=null;
let sceneAnimationFrame=null;
let simulationTick=0;
let simulationYearValue=2026;
let lastChangedVariable=null;
let lastInteractionTime=0;
let graphVisual={emissions:0,absorption:0,net:0,sources:[],sinks:[],history:[]};
function clamp(value,min=0,max=1){return Math.max(min,Math.min(max,value))}
function lerp(a,b,t){return a+(b-a)*t}
function getValue(id){const input=document.querySelector(`input[data-id="${id}"]`);return input?Number(input.value):0}
function formatNumber(value){return Number(value).toFixed(1)}
function signed(value){return `${value>0?"+":""}${formatNumber(value)}`}
function createControls(){
variables.forEach(variable=>{
const wrapper=document.createElement("div");
wrapper.className="control-item";
wrapper.dataset.id=variable.id;
wrapper.innerHTML=`<div class="control-label"><span class="control-name"><span>${variable.icon}</span>${variable.name}</span><span class="control-value" data-value-for="${variable.id}">${variable.default}%</span></div><div class="slider-row"><span class="slider-min">0</span><input type="range" min="0" max="100" value="${variable.default}" step="1" data-id="${variable.id}" aria-label="${variable.name}"><span class="slider-max">100</span></div>`;
const target=variable.group==="human"?humanControls:variable.group==="natural"?naturalControls:sinkControls;
target.appendChild(wrapper);
const input=wrapper.querySelector("input");
input.addEventListener("input",()=>{
lastChangedVariable=variable;
simulationTick++;
updateValueBadge(variable.id,input.value);
updateSliderVisual(input,variable.group);
updateFactorStatus(wrapper,variable,input.value);
updateModel(true);
triggerFactorReaction(variable);
});
input.addEventListener("change",()=>announceCurrentState(variable));
updateValueBadge(variable.id,variable.default);
updateSliderVisual(input,variable.group);
updateFactorStatus(wrapper,variable,variable.default);
});
}
function getFactorState(variable,value){
const v=Number(value);
if(variable.group==="sink"){
if(v>=70)return"good";
if(v>=35)return"medium";
return"bad";
}
if(v<=34)return"good";
if(v<=69)return"medium";
return"bad";
}
function updateFactorStatus(wrapper,variable,value){
const state=getFactorState(variable,value);
const colours={good:{border:"#3eaf6a",bg:"#f0faf3",badge:"#dff3e7"},medium:{border:"#d49b19",bg:"#fff9e8",badge:"#fff3d1"},bad:{border:"#d84747",bg:"#fff1f1",badge:"#ffe1e1"}};
const c=colours[state];
wrapper.style.borderLeft=`3px solid ${c.border}`;
wrapper.style.background=c.bg;
const badge=wrapper.querySelector(".control-value");
badge.style.background=c.badge;
badge.style.color=c.border;
}
function updateValueBadge(id,value){
const badge=document.querySelector(`[data-value-for="${id}"]`);
if(!badge)return;
badge.textContent=`${value}%`;
badge.style.transform="scale(1.08)";
clearTimeout(badge._timer);
badge._timer=setTimeout(()=>badge.style.transform="scale(1)",130);
}
function updateSliderVisual(input,group){
const value=Number(input.value);
let left,right;
if(group==="sink"){left="#d84747";right="#42a866"}else{left="#42a866";right="#d84747"}
const middle="#e0ad2f";
input.style.background=`linear-gradient(90deg,${left} 0%,${middle} 48%,${right} 100%)`;
input.style.setProperty("--value",`${value}%`);
}
function calculateModel(){
let emissions=0;
let absorption=0;
variables.forEach(variable=>{
const contribution=variable.weight*getValue(variable.id)/100*10;
if(variable.group==="sink")absorption+=contribution;
else emissions+=contribution;
});
return{emissions,absorption,net:emissions-absorption};
}
function calculateEnvironmentalStress(model){
const netStress=clamp((model.net+80)/180);
const industrial=clamp((getValue("power")*.32+getValue("cement")*.24+getValue("refineries")*.18+getValue("cars")*.12+getValue("airplanes")*.14)/100);
const natural=clamp((getValue("animals")*.35+getValue("volcanoes")*.25+getValue("wildfires")*.25+getValue("decay")*.15)/100);
const forestStress=clamp(.65-netValue("forests")*.55+netStress*.55+getValue("wildfires")*.18);
const oceanStress=clamp(.2+netStress*.55+(100-getValue("oceans"))/100*.35);
const soilStress=clamp(.2+netStress*.45+(100-getValue("soils"))/100*.35+getValue("landfills")/100*.15);
const fireStress=clamp(getValue("wildfires")/100*.65+netStress*.5+(100-getValue("forests"))/100*.2);
const airStress=clamp(netStress*.72+industrial*.38+natural*.12);
return{netStress,industrialStress:industrial,naturalStress:natural,forestStress,oceanStress,soilStress,fireStress,airStress,overall:clamp(netStress*.55+industrial*.18+natural*.1+forestStress*.08+oceanStress*.09)};
}
function netValue(id){return getValue(id)/100}
function updateEnvironmentVariables(model){
const stress=calculateEnvironmentalStress(model);
stage.style.setProperty("--stress",stress.overall);
stage.style.setProperty("--air-stress",stress.airStress);
stage.style.setProperty("--forest-stress",stress.forestStress);
stage.style.setProperty("--ocean-stress",stress.oceanStress);
stage.style.setProperty("--fire-stress",stress.fireStress);
stage.style.setProperty("--industrial-stress",stress.industrialStress);
stage.style.setProperty("--soil-stress",stress.soilStress);
stage.style.setProperty("--natural-stress",stress.naturalStress);
stage.style.setProperty("--net-stress",stress.netStress);
}
function animateNumber(element,start,end,duration=360){
const id=Symbol();
numberAnimationIds.push(id);
const startTime=performance.now();
function frame(now){
if(!numberAnimationIds.includes(id))return;
const progress=clamp((now-startTime)/duration);
const eased=1-Math.pow(1-progress,3);
element.textContent=formatNumber(lerp(start,end,eased));
if(progress<1)requestAnimationFrame(frame);
else{
element.textContent=formatNumber(end);
numberAnimationIds=numberAnimationIds.filter(x=>x!==id);
}
}
requestAnimationFrame(frame);
}
function updateNumbers(model,changed){
animateNumber(emissionsValue,currentData.emissions,model.emissions);
animateNumber(absorptionValue,currentData.absorption,model.absorption);
animateNumber(balanceValue,currentData.net,model.net);
if(changed){
const eDelta=model.emissions-currentData.emissions;
const aDelta=model.absorption-currentData.absorption;
const nDelta=model.net-currentData.net;
emissionsChange.textContent=`${eDelta===0?"":signed(eDelta)} kt`;
absorptionChange.textContent=`${aDelta===0?"":signed(aDelta)} kt`;
balanceChange.textContent=`${nDelta===0?"":signed(nDelta)} kt`;
flashMetric(metricCards[0]);
flashMetric(metricCards[1]);
flashMetric(metricCards[2]);
}
}
function flashMetric(card){
card.classList.remove("live-change");
void card.offsetWidth;
card.classList.add("live-change");
}
function getState(net){
if(net<=15)return"stable";
if(net<=100)return"warning";
return"critical";
}
function updateState(model){
const state=getState(model.net);
stage.classList.remove("stable","warning","critical");
stage.classList.add(state);
if(state==="stable"){
statusIcon.textContent="✓";
statusLabel.textContent="STABLE";
statusDescription.textContent="The carbon system is within a relatively balanced range.";
telemetryStatus.textContent="✓ STABLE";
telemetryStatus.className="telemetry-status stable-status";
}else if(state==="warning"){
statusIcon.textContent="⚠";
statusLabel.textContent="WARNING";
statusDescription.textContent="Carbon pressure is increasing and environmental systems are becoming stressed.";
telemetryStatus.textContent="⚠ WARNING";
telemetryStatus.className="telemetry-status warning-status";
}else{
statusIcon.textContent="✕";
statusLabel.textContent="CRITICAL COLLAPSE";
statusDescription.textContent="Very high net emissions are placing severe pressure on the simulated environment.";
telemetryStatus.textContent="✕ CRITICAL";
telemetryStatus.className="telemetry-status critical-status";
}
return state;
}
function getLevel(value,labels){
const v=clamp(value);
const index=Math.min(labels.length-1,Math.floor(v*labels.length));
return labels[index];
}
function updateIndicators(model){
const stress=calculateEnvironmentalStress(model);
const sets={
air:["Low","Moderate","Elevated","High","Extreme"],
forest:["Healthy","Slight stress","Stressed","Damaged","Severely stressed"],
ocean:["Healthy","Changing","Stressed","Acidifying","Severely stressed"],
airQuality:["Clear","Slightly hazy","Hazy","Poor","Very poor"],
soil:["Stable","Drying","Under pressure","Degraded","Severely degraded"],
marine:["Active","Slightly affected","Under pressure","Declining","Severely affected"]
};
const values={
air:stress.airStress,
forest:stress.forestStress,
ocean:stress.oceanStress,
airQuality:stress.airStress,
soil:stress.soilStress,
marine:stress.oceanStress
};
Object.keys(values).forEach(key=>{
const newValue=getLevel(values[key],sets[key]);
if(indicatorElements[key].textContent!==newValue){
indicatorElements[key].textContent=newValue;
indicatorElements[key].parentElement.parentElement.classList.remove("changed");
void indicatorElements[key].parentElement.parentElement.offsetWidth;
indicatorElements[key].parentElement.parentElement.classList.add("changed");
}
const direction=values[key]>.58?"Pressure increasing":values[key]>.3?"Moderate change":"Relatively stable";
indicatorDetails[key].textContent=direction;
});
}
function addHistoryPoint(net){
history.push({net,time:simulationYearValue});
if(history.length>35)history.shift();
}
function updateSimulationTime(model,changed){
if(!changed&&simulationTick===0)return;
const magnitude=Math.abs(model.net-previousData.net);
const direction=model.net>previousData.net?"increase":model.net<previousData.net?"decrease":"no change";
if(changed){
const timeAdvance=direction==="increase"?Math.max(1,Math.round(magnitude/2)):direction==="decrease"?Math.max(1,Math.round(magnitude/2)):1;
simulationYearValue=Math.min(2100,simulationYearValue+timeAdvance);
}
const milestones=[2026,2030,2040,2050,2075,2100];
let nearest=milestones.reduce((a,b)=>Math.abs(b-simulationYearValue)<Math.abs(a-simulationYearValue)?b:a,2026);
if(simulationYearValue<2026)nearest=2026;
simulationYear.textContent=simulationYearValue;
simulationStep.textContent=simulationYearValue===2026?"BASELINE":`STEP ${simulationTick}`;
}
function updateChangePanel(model){
const delta=model.net-previousData.net;
const abs=Math.abs(delta);
if(simulationTick===0){
changeArrow.textContent="→";
changeTitle.textContent="BASELINE";
changeText.textContent="Move a climate variable to begin the simulation.";
}else if(delta>0){
changeArrow.textContent="↑";
changeTitle.textContent="CARBON PRESSURE INCREASED";
changeText.textContent=`Net balance rose by ${formatNumber(abs)} kt. Environmental stress is increasing.`;
}else if(delta<0){
changeArrow.textContent="↓";
changeTitle.textContent="CARBON PRESSURE REDUCED";
changeText.textContent=`Net balance fell by ${formatNumber(abs)} kt. Environmental conditions are improving.`;
}else{
changeArrow.textContent="→";
changeTitle.textContent="NO NET CHANGE";
changeText.textContent="The selected adjustment produced no net balance change.";
}
changeIndicator.classList.remove("changed");
void changeIndicator.offsetWidth;
changeIndicator.classList.add("changed");
previousBalance.textContent=`${formatNumber(previousData.net)} kt`;
currentBalance.textContent=`${formatNumber(model.net)} kt`;
balanceDelta.textContent=`${signed(delta)} kt`;
comparisonArrow.textContent=delta>0?"↑":delta<0?"↓":"→";
}
function buildLiveMessage(model,state){
const delta=model.net-previousData.net;
const stress=calculateEnvironmentalStress(model);
let direction=delta>0?"Net carbon pressure increased":delta<0?"Net carbon pressure decreased":"Net carbon pressure is unchanged";
let environment=state==="stable"?"The simulated environmental system remains relatively balanced.":state==="warning"?"Several environmental systems are experiencing increasing pressure.":"The simulated environment is experiencing severe pressure.";
return`Climate state: ${state.toUpperCase()}. ${direction} by ${formatNumber(Math.abs(delta))} kt. Atmospheric pressure is ${getLevel(stress.airStress,["low","moderate","elevated","high","extreme"])} and forest stress is ${getLevel(stress.forestStress,["low","moderate","noticeable","high","severe"])}. ${environment}`;
}
function announceCurrentState(variable){
if(!variable)return;
const model=currentData;
const delta=model.net-previousData.net;
const direction=delta>0?"increased":delta<0?"decreased":"did not change";
const year=simulationYearValue;
accessibilityLive.textContent=`Simulation year ${year}. ${variable.name} is now ${getValue(variable.id)} percent. Net carbon balance ${direction} by ${formatNumber(Math.abs(delta))} kilotons. Current net balance is ${formatNumber(model.net)} kilotons.`;
}
function updateGraphTargets(model){
graphVisual.emissions=model.emissions;
graphVisual.absorption=model.absorption;
graphVisual.net=model.net;
graphVisual.sources=variables.filter(v=>v.group!=="sink").map(v=>({name:v.name,value:v.weight*getValue(v.id)/100*10,icon:v.icon}));
graphVisual.sinks=variables.filter(v=>v.group==="sink").map(v=>({name:v.name,value:v.weight*getValue(v.id)/100*10,icon:v.icon}));
graphVisual.history=history.map(p=>p.net);
startGraphAnimation();
}
function startGraphAnimation(){
if(graphAnimationFrame)cancelAnimationFrame(graphAnimationFrame);
const target={emissions:graphVisual.emissions,absorption:graphVisual.absorption,net:graphVisual.net};
const start={emissions:graphCanvasState.emissions,absorption:graphCanvasState.absorption,net:graphCanvasState.net};
const startTime=performance.now();
function animate(now){
const p=clamp((now-startTime)/420);
const eased=1-Math.pow(1-p,3);
graphCanvasState.emissions=lerp(start.emissions,target.emissions,eased);
graphCanvasState.absorption=lerp(start.absorption,target.absorption,eased);
graphCanvasState.net=lerp(start.net,target.net,eased);
drawGraph();
if(p<1)graphAnimationFrame=requestAnimationFrame(animate);
}
graphAnimationFrame=requestAnimationFrame(animate);
}
const graphCanvasState={emissions:0,absorption:0,net:0};
function resizeCanvas(){
const rect=canvas.getBoundingClientRect();
const ratio=window.devicePixelRatio||1;
canvas.width=Math.round(rect.width*ratio);
canvas.height=Math.round(rect.height*ratio);
ctx.setTransform(ratio,0,0,ratio,0,0);
drawGraph();
}
function getContributions(group){
return variables.filter(v=>v.group===group).map(v=>({name:v.name,value:v.weight*getValue(v.id)/100*10,icon:v.icon}));
}
function drawLabel(text,x,y,size=11,color="#b8ccc5"){
ctx.fillStyle=color;
ctx.font=`700 ${size}px Inter,Segoe UI,Arial,sans-serif`;
ctx.fillText(text,x,y);
}
function drawBalanceGraph(){
const w=canvas.clientWidth;
const h=canvas.clientHeight;
const max=Math.max(graphCanvasState.emissions,graphCanvasState.absorption,1);
const left=55;
const right=35;
const top=42;
const bottom=55;
const usableW=w-left-right;
const usableH=h-top-bottom;
const barH=38;
const y1=top+usableH*.20;
const y2=top+usableH*.57;
const yAxisMax=Math.ceil(max/10)*10||10;
const yTicks=5;
ctx.save();
ctx.strokeStyle="rgba(255,255,255,.28)";
ctx.lineWidth=1;
ctx.beginPath();
ctx.moveTo(left,top);
ctx.lineTo(left,h-bottom);
ctx.lineTo(w-right,h-bottom);
ctx.stroke();
for(let i=0;i<=yTicks;i++){
const value=(yAxisMax/yTicks)*(yTicks-i);
const y=top+(usableH/yTicks)*i;
ctx.strokeStyle="rgba(255,255,255,.08)";
ctx.beginPath();
ctx.moveTo(left,y);
ctx.lineTo(w-right,y);
ctx.stroke();
drawLabel(formatNumber(value),8,y+4,9,"#91aaa1");
}
const barMax=Math.max(yAxisMax,1);
drawLabel("EMISSIONS",left+8,y1-10,10,"#dca0a0");
drawLabel("ABSORPTION",left+8,y2-10,10,"#9bd6af");
ctx.fillStyle="rgba(223,102,102,.82)";
ctx.fillRect(left,y1,usableW*(graphCanvasState.emissions/barMax),barH);
ctx.fillStyle="rgba(87,184,123,.82)";
ctx.fillRect(left,y2,usableW*(graphCanvasState.absorption/barMax),barH);
drawLabel(`${formatNumber(graphCanvasState.emissions)} kt`,left+usableW*(graphCanvasState.emissions/barMax)+8,y1+25,12,"#fff");
drawLabel(`${formatNumber(graphCanvasState.absorption)} kt`,left+usableW*(graphCanvasState.absorption/barMax)+8,y2+25,12,"#fff");
const xMarks=["LOW","MID","HIGH"];
for(let i=0;i<xMarks.length;i++){
const x=left+(usableW/2)*i;
ctx.strokeStyle="rgba(255,255,255,.18)";
ctx.beginPath();
ctx.moveTo(x,h-bottom);
ctx.lineTo(x,h-bottom+6);
ctx.stroke();
drawLabel(xMarks[i],x-(i===1?12:9),h-bottom+20,9,"#91aaa1");
}
drawLabel("CARBON BALANCE SCALE",w/2-60,h-12,9,"#91aaa1");
drawLabel(`NET BALANCE: ${signed(graphCanvasState.net)} kt`,left,h-28,12,"#d9e9e3");
ctx.restore();
}
function drawSourceGraph(){
const w=canvas.clientWidth;
const h=canvas.clientHeight;
const items=getContributions("human").concat(getContributions("natural")).sort((a,b)=>b.value-a.value).slice(0,7);
const max=Math.max(...items.map(x=>x.value),1);
const left=145;
const usable=w-left-35;
items.forEach((item,i)=>{
const y=28+i*38;
drawLabel(item.icon+" "+item.name.substring(0,18),10,y+12,9,"#a9bdb6");
ctx.fillStyle=i<7?"rgba(215,91,91,.8)":"rgba(255,255,255,.2)";
ctx.fillRect(left,y,usable*(item.value/max),22);
drawLabel(formatNumber(item.value),left+usable*(item.value/max)+7,y+15,9,"#fff");
});
}
function drawSinkGraph(){
const w=canvas.clientWidth;
const h=canvas.clientHeight;
const items=getContributions("sink");
const max=Math.max(...items.map(x=>x.value),1);
const left=145;
const usable=w-left-35;
items.forEach((item,i)=>{
const y=55+i*75;
drawLabel(item.icon+" "+item.name,10,y+15,10,"#a9bdb6");
ctx.fillStyle="rgba(87,184,123,.82)";
ctx.fillRect(left,y,usable*(item.value/max),32);
drawLabel(formatNumber(item.value),left+usable*(item.value/max)+8,y+21,10,"#fff");
});
}
function drawDonutGraph(){
const w=canvas.clientWidth;
const h=canvas.clientHeight;
const cx=w*.36;
const cy=h*.52;
const radius=Math.min(w,h)*.28;
const items=getContributions("human").concat(getContributions("natural"));
const total=items.reduce((s,x)=>s+x.value,0)||1;
let angle=-Math.PI/2;
items.forEach((item,i)=>{
const next=angle+(item.value/total)*Math.PI*2;
ctx.beginPath();
ctx.moveTo(cx,cy);
ctx.arc(cx,cy,radius,angle,next);
ctx.closePath();
ctx.fillStyle=`hsl(${i*27},58%,${52+i%3*5}%)`;
ctx.fill();
angle=next;
});
ctx.beginPath();
ctx.arc(cx,cy,radius*.56,0,Math.PI*2);
ctx.fillStyle="#142b27";
ctx.fill();
drawLabel(`${formatNumber(total)}`,cx-25,cy+4,15,"#fff");
drawLabel("TOTAL",cx-19,cy+20,8,"#91aaa1");
items.slice(0,7).forEach((item,i)=>{
const x=w*.62;
const y=35+i*35;
ctx.fillStyle=`hsl(${i*27},58%,${52+i%3*5}%)`;
ctx.fillRect(x,y,9,9);
drawLabel(item.name.substring(0,20),x+17,y+9,9,"#a9bdb6");
});
}
function drawHistoryGraph(){
const w=canvas.clientWidth;
const h=canvas.clientHeight;
const values=history.length?history.map(x=>x.net):[currentData.net];
const years=history.length?history.map(x=>x.time):[simulationYearValue];
const maxRaw=Math.max(...values,10);
const minRaw=Math.min(...values,-10);
const padding=Math.max(10,Math.abs(maxRaw-minRaw)*.12);
const max=maxRaw+padding;
const min=minRaw-padding;
const range=Math.max(max-min,20);
const left=68;
const right=25;
const top=38;
const bottom=58;
const usableW=w-left-right;
const usableH=h-top-bottom;
const zeroY=top+(max/range)*usableH;
ctx.save();
ctx.strokeStyle="rgba(255,255,255,.28)";
ctx.lineWidth=1;
ctx.beginPath();
ctx.moveTo(left,top);
ctx.lineTo(left,h-bottom);
ctx.lineTo(w-right,h-bottom);
ctx.stroke();
const yTicks=5;
for(let i=0;i<=yTicks;i++){
const value=max-(range/yTicks)*i;
const y=top+(usableH/yTicks)*i;
ctx.strokeStyle="rgba(255,255,255,.09)";
ctx.beginPath();
ctx.moveTo(left,y);
ctx.lineTo(w-right,y);
ctx.stroke();
drawLabel(formatNumber(value),8,y+4,9,"#91aaa1");
}
ctx.strokeStyle="rgba(255,255,255,.3)";
ctx.beginPath();
ctx.moveTo(left,zeroY);
ctx.lineTo(w-right,zeroY);
ctx.stroke();
drawLabel("0",43,zeroY+4,9,"#b8ccc5");
const xTicks=Math.min(6,Math.max(2,years.length));
for(let i=0;i<xTicks;i++){
const index=years.length===1?0:Math.round(i*(years.length-1)/(xTicks-1));
const x=years.length===1?left+usableW/2:left+(index/(years.length-1))*usableW;
ctx.strokeStyle="rgba(255,255,255,.18)";
ctx.beginPath();
ctx.moveTo(x,h-bottom);
ctx.lineTo(x,h-bottom+6);
ctx.stroke();
const label=String(years[index]);
const textWidth=ctx.measureText(label).width;
drawLabel(label,x-textWidth/2,h-bottom+21,9,"#91aaa1");
}
drawLabel("NET BALANCE (kt)",8,18,9,"#91aaa1");
drawLabel("SIMULATION YEAR",w/2-45,h-12,9,"#91aaa1");
ctx.beginPath();
values.forEach((value,i)=>{
const x=values.length===1?left+usableW/2:left+(i/(values.length-1))*usableW;
const y=top+(max-value)/range*usableH;
if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
});
ctx.strokeStyle="#75c891";
ctx.lineWidth=3;
ctx.stroke();
values.forEach((value,i)=>{
const x=values.length===1?left+usableW/2:left+(i/(values.length-1))*usableW;
const y=top+(max-value)/range*usableH;
ctx.beginPath();
ctx.arc(x,y,5,0,Math.PI*2);
ctx.fillStyle="#142b27";
ctx.fill();
ctx.strokeStyle="#75c891";
ctx.lineWidth=2;
ctx.stroke();
});
if(values.length){
const lastIndex=values.length-1;
const lastX=values.length===1?left+usableW/2:left+(lastIndex/(values.length-1))*usableW;
const lastY=top+(max-values[lastIndex])/range*usableH;
ctx.beginPath();
ctx.arc(lastX,lastY,8,0,Math.PI*2);
ctx.strokeStyle="rgba(117,200,145,.35)";
ctx.lineWidth=3;
ctx.stroke();
drawLabel(`${formatNumber(values[lastIndex])} kt`,Math.min(lastX+10,w-90),lastY-10,10,"#d8eee1");
}
ctx.restore();
}
function updateGraphDescription(){
const descriptions={
balance:"Gross emissions and gross absorption are shown as horizontal bars.",
sources:"The largest simulated carbon-emitting sources are displayed for comparison.",
sinks:"The modelled contribution of forests, oceans and soils is shown here.",
donut:"The composition of modelled carbon emissions is shown as a proportional ring.",
history:"Each meaningful slider adjustment adds a point to the simulated balance timeline."
};
graphDescription.textContent=descriptions[graphType.value];
}
function drawGraph(){
const w=canvas.clientWidth;
const h=canvas.clientHeight;
ctx.clearRect(0,0,w,h);
ctx.lineWidth=1;
if(graphType.value==="balance")drawBalanceGraph();
else if(graphType.value==="sources")drawSourceGraph();
else if(graphType.value==="sinks")drawSinkGraph();
else if(graphType.value==="donut")drawDonutGraph();
else drawHistoryGraph();
chartLiveValue.textContent=`NET ${signed(graphCanvasState.net)} KT`;
}
function updateModel(changed=false){
const model=calculateModel();
previousData={...currentData};
if(changed)updateSimulationTime(model,true);
updateNumbers(model,changed);
currentData=model;
updateState(model);
updateIndicators(model);
updateEnvironmentVariables(model);
if(changed)addHistoryPoint(model.net);
updateGraphTargets(model);
const state=getState(model.net);
liveClimateMessage.textContent=buildLiveMessage(model,state);
if(changed)updateChangePanel(model);
if(changed&&lastChangedVariable)announceCurrentState(lastChangedVariable);
}
function createReactionParticle(variable){
const particle=document.createElement("span");
particle.className="extra-particle reaction-particle";
particle.textContent=variable.icon;
particle.style.left=`${25+Math.random()*50}%`;
particle.style.top=`${25+Math.random()*40}%`;
particle.style.fontSize="1.2rem";
particle.style.width="auto";
particle.style.height="auto";
particle.style.background="transparent";
particle.style.animation="reactionPop .8s ease-out forwards";
stage.appendChild(particle);
setTimeout(()=>particle.remove(),850);
}
function triggerFactorReaction(variable){
createReactionParticle(variable);
const selectors={
forests:".tree",
oceans:".ocean-layer,.fish,.whale",
soils:".soil-particles,.ground-layer",
wildfires:".wildfire",
power:".factory,.factory-smoke",
cement:".factory",
refineries:".factory",
landfills:".ground-layer",
gas:".factory",
cars:".air-particles",
airplanes:".cloud,.air-particles",
animals:".air-particles",
volcanoes:".air-particles",
decay:".air-particles,.falling-leaves"
};
const elements=document.querySelectorAll(selectors[variable.id]||".air-particles");
elements.forEach(element=>{
element.classList.remove("factor-react");
void element.offsetWidth;
element.classList.add("factor-react");
});
}
function createExtraParticles(){
if(stage.querySelector(".extra-particle"))return;
for(let i=1;i<=8;i++){
const particle=document.createElement("span");
particle.className=`extra-particle p${i}`;
stage.appendChild(particle);
}
}
function continuousSceneMotion(time){
const wave=(Math.sin(time/700)+1)/2;
const fast=(Math.sin(time/320)+1)/2;
const slow=(Math.sin(time/1700)+1)/2;
stage.style.setProperty("--motion-wave",wave);
stage.style.setProperty("--motion-fast",fast);
stage.style.setProperty("--motion-slow",slow);
sceneAnimationFrame=requestAnimationFrame(continuousSceneMotion);
}
graphType.addEventListener("change",()=>{updateGraphDescription();drawGraph()});
window.addEventListener("resize",resizeCanvas);
createControls();
createExtraParticles();
updateGraphDescription();
requestAnimationFrame(()=>{
resizeCanvas();
updateModel(false);
});
requestAnimationFrame(continuousSceneMotion);
setInterval(()=>{
const state=getState(currentData.net);
document.querySelectorAll(".tree,.factory,.ocean-layer,.wildfire").forEach(element=>{
element.classList.remove("scene-pulse");
void element.offsetWidth;
if(state!=="stable"||Math.random()>.35)element.classList.add("scene-pulse");
});
},2200);