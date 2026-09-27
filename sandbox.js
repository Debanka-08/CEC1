/* =========================================================
   PLANETARY CARBON BALANCE SANDBOX
   Complete corrected + upgraded JavaScript
   Pure JavaScript / No libraries
   ========================================================= */
/* =========================================================
   CLIMATE VARIABLES
   ========================================================= */
const variables = [
    /* HUMAN SOURCES */
    {
        id: "cars",
        name: "Cars, trucks and buses",
        icon: "🚗",
        group: "human",
        weight: 1.55,
        defaultValue: 35
    },
    {
        id: "airplanes",
        name: "Airplanes and cargo ships",
        icon: "✈️",
        group: "human",
        weight: 1.85,
        defaultValue: 30
    },
    {
        id: "power",
        name: "Coal and gas power plants",
        icon: "🏭",
        group: "human",
        weight: 2.60,
        defaultValue: 30
    },
    {
        id: "cement",
        name: "Cement and steel factories",
        icon: "🏗️",
        group: "human",
        weight: 1.90,
        defaultValue: 25
    },
    {
        id: "refineries",
        name: "Oil refineries",
        icon: "🛢️",
        group: "human",
        weight: 1.35,
        defaultValue: 25
    },
    {
        id: "landfills",
        name: "Landfills and waste sites",
        icon: "♻️",
        group: "human",
        weight: 0.95,
        defaultValue: 20
    },
    {
        id: "gas",
        name: "Gas heaters and stoves",
        icon: "🔥",
        group: "human",
        weight: 0.50,
        defaultValue: 25
    },
    /* NATURAL SOURCES */
    {
        id: "animals",
        name: "Animals and humans",
        icon: "🐄",
        group: "natural",
        weight: 0.70,
        defaultValue: 25
    },
    {
        id: "volcanoes",
        name: "Volcanoes and geothermal vents",
        icon: "🌋",
        group: "natural",
        weight: 0.90,
        defaultValue: 15
    },
    {
        id: "wildfires",
        name: "Wildfires",
        icon: "🔥",
        group: "natural",
        weight: 1.25,
        defaultValue: 15
    },
    {
        id: "decay",
        name: "Decaying plants and organisms",
        icon: "🍂",
        group: "natural",
        weight: 0.60,
        defaultValue: 25
    },
    /* NATURAL SINKS */
    {
        id: "forests",
        name: "Trees and forests",
        icon: "🌲",
        group: "sink",
        weight: 1.80,
        defaultValue: 65
    },
    {
        id: "oceans",
        name: "Oceans and marine life",
        icon: "🌊",
        group: "sink",
        weight: 1.55,
        defaultValue: 65
    },
    {
        id: "soils",
        name: "Soils and peatlands",
        icon: "🌱",
        group: "sink",
        weight: 1.20,
        defaultValue: 60
    }
];
/* =========================================================
   DOM REFERENCES
   ========================================================= */
const humanControls =
    document.getElementById("humanControls");
const naturalControls =
    document.getElementById("naturalControls");
const sinkControls =
    document.getElementById("sinkControls");
const stage =
    document.getElementById("environmentStage");
const statusIcon =
    document.getElementById("statusIcon");
const statusLabel =
    document.getElementById("statusLabel");
const statusDescription =
    document.getElementById("statusDescription");
const telemetryStatus =
    document.getElementById("telemetryStatus");
const emissionsValue =
    document.getElementById("emissionsValue");
const absorptionValue =
    document.getElementById("absorptionValue");
const balanceValue =
    document.getElementById("balanceValue");
const liveClimateMessage =
    document.getElementById("liveClimateMessage");
const graphType =
    document.getElementById("graphType");
const graphDescription =
    document.getElementById("graphDescription");
const canvas =
    document.getElementById("carbonChart");
const ctx =
    canvas.getContext("2d");
/* INDICATORS */
const airIndicator =
    document.getElementById("airIndicator");
const forestIndicator =
    document.getElementById("forestIndicator");
const oceanIndicator =
    document.getElementById("oceanIndicator");
const airQualityIndicator =
    document.getElementById("airQualityIndicator");
const soilIndicator =
    document.getElementById("soilIndicator");
const marineIndicator =
    document.getElementById("marineIndicator");
/* =========================================================
   SAFETY CHECK
   ========================================================= */
if (!stage || !canvas) {
    console.error(
        "Planetary Carbon Sandbox: Required HTML elements were not found."
    );
}
/* =========================================================
   STATE
   ========================================================= */
let currentData = {
    emissions: 0,
    absorption: 0,
    net: 0
};
let history = [];
let numberAnimationIds = [];
let graphAnimationFrame = null;
let sceneAnimationFrame = null;
let lastReactionTime = 0;
/* =========================================================
   GRAPH ANIMATION STATE
   ========================================================= */
const graphVisual = {
    emissions: 0,
    absorption: 0,
    net: 0,
    sources: [],
    sinks: [],
    history: []
};
const graphTarget = {
    emissions: 0,
    absorption: 0,
    net: 0,
    sources: [],
    sinks: [],
    history: []
};
/* =========================================================
   BASIC HELPERS
   ========================================================= */
function clamp(value, min = 0, max = 1) {
    return Math.min(
        max,
        Math.max(min, value)
    );
}
function lerp(start, end, amount) {
    return start +
        (end - start) * amount;
}
function getValue(id) {
    const slider =
        document.getElementById(
            `slider-${id}`
        );
    return slider
        ? Number(slider.value)
        : 0;
}
/* =========================================================
   CREATE CONTROLS
   ========================================================= */
function createControls() {
    variables.forEach(variable => {
        const wrapper =
            document.createElement("div");
        wrapper.className =
            "control-item";
        wrapper.innerHTML = `
            <div class="control-label">
                <label
                    class="control-name"
                    for="slider-${variable.id}"
                >
                    <span>${variable.icon}</span>
                    ${variable.name}
                </label>
                <output
                    id="value-${variable.id}"
                    class="control-value"
                    for="slider-${variable.id}"
                >
                    ${variable.defaultValue}%
                </output>
            </div>
            <div class="slider-row">
                <span class="slider-min">0</span>
                <input
                    id="slider-${variable.id}"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value="${variable.defaultValue}"
                    aria-label="${variable.name}"
                >
                <span class="slider-max">100</span>
            </div>
        `;
        if (variable.group === "human") {
            humanControls.appendChild(
                wrapper
            );
        }
        if (variable.group === "natural") {
            naturalControls.appendChild(
                wrapper
            );
        }
        if (variable.group === "sink") {
            sinkControls.appendChild(
                wrapper
            );
        }
        const slider =
            wrapper.querySelector("input");
        slider.addEventListener(
            "input",
            () => {
                updateValueBadge(
                    variable.id,
                    slider.value
                );
                updateSliderVisual(
                    slider
                );
                updateFactorStatus(
                    wrapper,
                    variable,
                    Number(slider.value)
                );
                updateModel();
                triggerFactorReaction(
                    variable
                );
            }
        );
        updateSliderVisual(
            slider
        );
        updateFactorStatus(
            wrapper,
            variable,
            variable.defaultValue
        );
    });
}
/* =========================================================
   FACTOR STATUS
   ========================================================= */
function getFactorState(
    variable,
    value
) {
    if (variable.group === "sink") {
        if (value >= 70) {
            return "good";
        }
        if (value >= 35) {
            return "medium";
        }
        return "bad";
    }
    if (value <= 34) {
        return "good";
    }
    if (value <= 69) {
        return "medium";
    }
    return "bad";
}
function updateFactorStatus(
    wrapper,
    variable,
    value
) {
    const state =
        getFactorState(
            variable,
            value
        );
    let color =
        "#d9a62e";
    let background =
        "rgba(217,166,46,.12)";
    if (state === "good") {
        color =
            "#2f9b61";
        background =
            "rgba(47,155,97,.12)";
    }
    if (state === "bad") {
        color =
            "#d44949";
        background =
            "rgba(212,73,73,.12)";
    }
    wrapper.style.setProperty(
        "--factor-color",
        color
    );
    wrapper.style.setProperty(
        "--factor-bg",
        background
    );
    wrapper.style.borderLeft =
        `3px solid ${color}`;
    wrapper.style.transition =
        "border-color .25s ease, background .25s ease";
    const badge =
        wrapper.querySelector(
            ".control-value"
        );
    const name =
        wrapper.querySelector(
            ".control-name"
        );
    if (badge) {
        badge.style.color =
            color;
        badge.style.background =
            background;
        badge.style.transition =
            "color .2s ease, background .2s ease";
    }
    if (name) {
        name.style.transition =
            "color .2s ease";
        name.style.color =
            color;
    }
}
/* =========================================================
   VALUE BADGE
   ========================================================= */
function updateValueBadge(
    id,
    value
) {
    const badge =
        document.getElementById(
            `value-${id}`
        );
    if (!badge) {
        return;
    }
    badge.textContent =
        `${value}%`;
    badge.animate(
        [
            {
                transform: "scale(1)"
            },
            {
                transform: "scale(1.12)"
            },
            {
                transform: "scale(1)"
            }
        ],
        {
            duration: 180,
            easing: "ease-out"
        }
    );
}
/* =========================================================
   SLIDER VISUAL FEEDBACK
   ========================================================= */
function updateSliderVisual(
    slider
) {
    const value =
        Number(slider.value);
    const percentage =
        value + "%";
    const variable =
        variables.find(
            item =>
                `slider-${item.id}` ===
                slider.id
        );
    if (!variable) {
        return;
    }
    const state =
        getFactorState(
            variable,
            value
        );
    let fill =
        "#d9a62e";
    if (state === "good") {
        fill = "#2f9b61";
    }
    if (state === "bad") {
        fill = "#d44949";
    }
    slider.style.background =
        `linear-gradient(
            90deg,
            ${fill} 0%,
            ${fill} ${percentage},
            #dce6e2 ${percentage},
            #dce6e2 100%
        )`;
    slider.style.setProperty(
        "--slider-color",
        fill
    );
}
/* =========================================================
   READ VARIABLE
   ========================================================= */
function getVariableValue(
    variable
) {
    return getValue(
        variable.id
    );
}
/* =========================================================
   CALCULATE MODEL
   ========================================================= */
function calculateModel() {
    let emissions = 0;
    let absorption = 0;
    variables.forEach(variable => {
        const value =
            getVariableValue(
                variable
            );
        const contribution =
            variable.weight *
            (value / 100) *
            10;
        if (
            variable.group === "human" ||
            variable.group === "natural"
        ) {
            emissions +=
                contribution;
        } else {
            absorption +=
                contribution;
        }
    });
    return {
        emissions,
        absorption,
        net:
            emissions -
            absorption
    };
}
/* =========================================================
   CONTINUOUS ENVIRONMENTAL STRESS
   ========================================================= */
function calculateEnvironmentalStress(
    model
) {
    const cars =
        getValue("cars");
    const airplanes =
        getValue("airplanes");
    const power =
        getValue("power");
    const cement =
        getValue("cement");
    const refineries =
        getValue("refineries");
    const landfills =
        getValue("landfills");
    const gas =
        getValue("gas");
    const animals =
        getValue("animals");
    const volcanoes =
        getValue("volcanoes");
    const wildfires =
        getValue("wildfires");
    const decay =
        getValue("decay");
    const forests =
        getValue("forests");
    const oceans =
        getValue("oceans");
    const soils =
        getValue("soils");
    /* NET STRESS */
    const netStress =
        clamp(
            (model.net + 20) / 140
        );
    /* INDUSTRIAL PRESSURE */
    const industrialStress =
        clamp(
            (
                cars * 0.12 +
                airplanes * 0.15 +
                power * 0.24 +
                cement * 0.18 +
                refineries * 0.13 +
                landfills * 0.09 +
                gas * 0.09
            ) / 100
        );
    /* NATURAL SOURCE PRESSURE */
    const naturalStress =
        clamp(
            (
                animals * 0.25 +
                volcanoes * 0.20 +
                wildfires * 0.35 +
                decay * 0.20
            ) / 100
        );
    /* FOREST STRESS */
    const forestStress =
        clamp(
            netStress * 0.45 +
            Math.pow(
                1 - forests / 100,
                0.78
            ) * 0.55
        );
    /* OCEAN STRESS */
    const oceanStress =
        clamp(
            netStress * 0.45 +
            Math.pow(
                1 - oceans / 100,
                0.78
            ) * 0.55
        );
    /* SOIL STRESS */
    const soilStress =
        clamp(
            netStress * 0.40 +
            Math.pow(
                1 - soils / 100,
                0.78
            ) * 0.60
        );
    /* FIRE STRESS */
    const fireStress =
        clamp(
            (wildfires / 100) * 0.50 +
            netStress * 0.35 +
            (1 - forests / 100) * 0.15
        );
    /* AIR STRESS */
    const airStress =
        clamp(
            netStress * 0.55 +
            industrialStress * 0.30 +
            naturalStress * 0.15
        );
    /* TOTAL VISUAL STRESS */
    const stress =
        clamp(
            netStress * 0.42 +
            industrialStress * 0.17 +
            forestStress * 0.13 +
            oceanStress * 0.12 +
            soilStress * 0.06 +
            fireStress * 0.10
        );
    return {
        stress,
        netStress,
        industrialStress,
        naturalStress,
        forestStress,
        oceanStress,
        soilStress,
        fireStress,
        airStress
    };
}
/* =========================================================
   APPLY ENVIRONMENT VARIABLES
   ========================================================= */
function updateEnvironmentVariables(
    model
) {
    if (!stage) {
        return;
    }
    const stress =
        calculateEnvironmentalStress(
            model
        );
    stage.style.setProperty(
        "--stress",
        stress.stress.toFixed(3)
    );
    stage.style.setProperty(
        "--air-stress",
        stress.airStress.toFixed(3)
    );
    stage.style.setProperty(
        "--forest-stress",
        stress.forestStress.toFixed(3)
    );
    stage.style.setProperty(
        "--ocean-stress",
        stress.oceanStress.toFixed(3)
    );
    stage.style.setProperty(
        "--fire-stress",
        stress.fireStress.toFixed(3)
    );
    stage.style.setProperty(
        "--industrial-stress",
        stress.industrialStress.toFixed(3)
    );
    stage.style.setProperty(
        "--soil-stress",
        stress.soilStress.toFixed(3)
    );
    stage.style.setProperty(
        "--natural-stress",
        stress.naturalStress.toFixed(3)
    );
    stage.style.setProperty(
        "--net-stress",
        stress.netStress.toFixed(3)
    );
}
/* =========================================================
   UPDATE MODEL
   ========================================================= */
function updateModel() {
    const model =
        calculateModel();
    currentData =
        model;
    updateNumbers(
        model
    );
    updateState(
        model.net
    );
    updateIndicators(
        model
    );
    updateEnvironmentVariables(
        model
    );
    addHistoryPoint(
        model.net
    );
    updateGraphTargets();
    startGraphAnimation();
}
/* =========================================================
   ANIMATED NUMBERS
   ========================================================= */
function animateNumber(
    element,
    target
) {
    if (!element) {
        return;
    }
    const oldAnimation =
        numberAnimationIds.find(
            item =>
                item.element === element
        );
    if (oldAnimation) {
        cancelAnimationFrame(
            oldAnimation.id
        );
    }
    const start =
        Number(
            element.textContent
                .replace(/[^\d.-]/g, "")
        ) || 0;
    const difference =
        target - start;
    const duration =
        320;
    const startTime =
        performance.now();
    function tick(now) {
        const progress =
            Math.min(
                (now - startTime) /
                duration,
                1
            );
        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );
        const value =
            start +
            difference *
            eased;
        element.textContent =
            value.toFixed(1);
        if (progress < 1) {
            const id =
                requestAnimationFrame(
                    tick
                );
            const existing =
                numberAnimationIds.find(
                    item =>
                        item.element ===
                        element
                );
            if (existing) {
                existing.id = id;
            } else {
                numberAnimationIds.push({
                    element,
                    id
                });
            }
        }
    }
    const id =
        requestAnimationFrame(
            tick
        );
    numberAnimationIds.push({
        element,
        id
    });
}
/* =========================================================
   UPDATE NUMBERS
   ========================================================= */
function updateNumbers(
    model
) {
    animateNumber(
        emissionsValue,
        model.emissions
    );
    animateNumber(
        absorptionValue,
        model.absorption
    );
    animateNumber(
        balanceValue,
        model.net
    );
}
/* =========================================================
   STATE LOGIC
   ========================================================= */
function getState(
    net
) {
    if (net <= 15) {
        return "stable";
    }
    if (net <= 100) {
        return "warning";
    }
    return "critical";
}
/* =========================================================
   UPDATE ENVIRONMENT STATE
   ========================================================= */
function updateState(
    net
) {
    const state =
        getState(
            net
        );
    stage.classList.remove(
        "stable",
        "warning",
        "critical"
    );
    stage.classList.add(
        state
    );
    if (state === "stable") {
        statusIcon.textContent =
            "✓";
        statusLabel.textContent =
            "STABLE";
        statusDescription.textContent =
            "The carbon system is within a relatively balanced range.";
        telemetryStatus.textContent =
            "✓ STABLE";
        telemetryStatus.className =
            "telemetry-status stable-status";
        liveClimateMessage.textContent =
            "Climate state: Stable. Natural sinks are currently able to offset the modelled emissions within the defined threshold.";
    }
    if (state === "warning") {
        statusIcon.textContent =
            "⚠";
        statusLabel.textContent =
            "WARNING";
        statusDescription.textContent =
            "Carbon pressure is increasing and environmental systems are becoming stressed.";
        telemetryStatus.textContent =
            "⚠ WARNING";
        telemetryStatus.className =
            "telemetry-status warning-status";
        liveClimateMessage.textContent =
            "Climate state: Warning. The modelled emissions are exceeding the absorption capacity enough to create visible environmental stress.";
    }
    if (state === "critical") {
        statusIcon.textContent =
            "✕";
        statusLabel.textContent =
            "CRITICAL COLLAPSE";
        statusDescription.textContent =
            "Very high net emissions create severe environmental pressure in the model.";
        telemetryStatus.textContent =
            "✕ CRITICAL COLLAPSE";
        telemetryStatus.className =
            "telemetry-status critical-status";
        liveClimateMessage.textContent =
            "Climate state: Critical Collapse. Modelled emissions are substantially higher than natural absorption, producing severe environmental responses.";
    }
}
/* =========================================================
   INDICATORS
   ========================================================= */
function updateIndicators(
    model
) {
    const net =
        model.net;
    if (net <= 15) {
        airIndicator.textContent =
            "Low";
        forestIndicator.textContent =
            "Healthy";
        oceanIndicator.textContent =
            "Healthy";
        airQualityIndicator.textContent =
            "Clear";
        soilIndicator.textContent =
            "Stable";
        marineIndicator.textContent =
            "Active";
    }
    else if (net <= 100) {
        airIndicator.textContent =
            "Rising";
        forestIndicator.textContent =
            "Stressed";
        oceanIndicator.textContent =
            "Under pressure";
        airQualityIndicator.textContent =
            "Hazy";
        soilIndicator.textContent =
            "Drying";
        marineIndicator.textContent =
            "Declining";
    }
    else {
        airIndicator.textContent =
            "Severe";
        forestIndicator.textContent =
            "Collapsing";
        oceanIndicator.textContent =
            "Acidified";
        airQualityIndicator.textContent =
            "Heavy smog";
        soilIndicator.textContent =
            "Degraded";
        marineIndicator.textContent =
            "Severely stressed";
    }
}
/* =========================================================
   HISTORY
   ========================================================= */
function addHistoryPoint(
    net
) {
    history.push(
        Number(net)
    );
    if (history.length > 35) {
        history.shift();
    }
}
/* =========================================================
   GRAPH DESCRIPTION
   ========================================================= */
function updateGraphDescription(
    type
) {
    const descriptions = {
        balance:
            "Gross emissions and absorption are compared with a compact scale.",
        sources:
            "Human and natural emission sources are compared by their current contribution.",
        sinks:
            "Forest, ocean and soil absorption are compared by current capacity.",
        donut:
            "Current gross emissions are divided among the modelled emission sources.",
        history:
            "Recent net-balance changes are plotted against time."
    };
    if (graphDescription) {
        graphDescription.textContent =
            descriptions[type] ||
            "";
    }
}
/* =========================================================
   CANVAS RESIZE
   ========================================================= */
function resizeCanvas() {
    if (!canvas) {
        return;
    }
    const rect =
        canvas.getBoundingClientRect();
    const ratio =
        Math.max(
            1,
            window.devicePixelRatio || 1
        );
    canvas.width =
        Math.max(
            1,
            rect.width * ratio
        );
    canvas.height =
        Math.max(
            1,
            rect.height * ratio
        );
    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );
    drawGraph();
}
/* =========================================================
   GRAPH DATA
   ========================================================= */
function getContributions(
    group
) {
    return variables
        .filter(
            variable =>
                variable.group === group
        )
        .map(
            variable => {
                const value =
                    getVariableValue(
                        variable
                    );
                return {
                    ...variable,
                    contribution:
                        variable.weight *
                        (value / 100) *
                        10
                };
            }
        );
}
/* =========================================================
   GRAPH TARGETS
   ========================================================= */
function updateGraphTargets() {
    const sourceData =
        getContributions("human")
            .concat(
                getContributions("natural")
            );
    const sinkData =
        getContributions("sink");
    graphTarget.emissions =
        currentData.emissions;
    graphTarget.absorption =
        currentData.absorption;
    graphTarget.net =
        currentData.net;
    graphTarget.sources =
        sourceData.map(
            item =>
                item.contribution
        );
    graphTarget.sinks =
        sinkData.map(
            item =>
                item.contribution
        );
    graphTarget.history =
        history.slice();
}
/* =========================================================
   GRAPH ANIMATION
   ========================================================= */
function startGraphAnimation() {
    if (graphAnimationFrame) {
        return;
    }
    function animate() {
        const speed =
            0.16;
        graphVisual.emissions =
            lerp(
                graphVisual.emissions,
                graphTarget.emissions,
                speed
            );
        graphVisual.absorption =
            lerp(
                graphVisual.absorption,
                graphTarget.absorption,
                speed
            );
        graphVisual.net =
            lerp(
                graphVisual.net,
                graphTarget.net,
                speed
            );
        graphVisual.sources =
            animateArray(
                graphVisual.sources,
                graphTarget.sources,
                speed
            );
        graphVisual.sinks =
            animateArray(
                graphVisual.sinks,
                graphTarget.sinks,
                speed
            );
        graphVisual.history =
            graphTarget.history.slice();
        drawGraph();
        const difference =
            Math.abs(
                graphVisual.emissions -
                graphTarget.emissions
            ) +
            Math.abs(
                graphVisual.absorption -
                graphTarget.absorption
            ) +
            Math.abs(
                graphVisual.net -
                graphTarget.net
            );
        if (difference > 0.02) {
            graphAnimationFrame =
                requestAnimationFrame(
                    animate
                );
        } else {
            graphVisual.emissions =
                graphTarget.emissions;
            graphVisual.absorption =
                graphTarget.absorption;
            graphVisual.net =
                graphTarget.net;
            graphVisual.sources =
                graphTarget.sources.slice();
            graphVisual.sinks =
                graphTarget.sinks.slice();
            graphAnimationFrame =
                null;
            drawGraph();
        }
    }
    graphAnimationFrame =
        requestAnimationFrame(
            animate
        );
}
function animateArray(
    current,
    target,
    amount
) {
    const result = [];
    for (
        let i = 0;
        i < target.length;
        i++
    ) {
        const currentValue =
            current[i] || 0;
        result[i] =
            lerp(
                currentValue,
                target[i],
                amount
            );
    }
    return result;
}
/* =========================================================
   CANVAS HELPERS
   ========================================================= */
function clearCanvas() {
    const width =
        canvas.clientWidth;
    const height =
        canvas.clientHeight;
    ctx.clearRect(
        0,
        0,
        width,
        height
    );
}
function drawText(
    text,
    x,
    y,
    size,
    color,
    weight = "600"
) {
    ctx.font =
        `${weight} ${size}px Inter, Arial, sans-serif`;
    ctx.fillStyle =
        color;
    ctx.fillText(
        text,
        x,
        y
    );
}
/* =========================================================
   GRAPH GRID
   ========================================================= */
function drawGrid(
    left,
    top,
    width,
    height,
    horizontalLines = 4,
    verticalLines = 5
) {
    ctx.save();
    ctx.strokeStyle =
        "rgba(255,255,255,.10)";
    ctx.lineWidth =
        1;
    ctx.setLineDash(
        [2, 5]
    );
    for (
        let i = 0;
        i <= horizontalLines;
        i++
    ) {
        const y =
            top +
            (i / horizontalLines) *
            height;
        ctx.beginPath();
        ctx.moveTo(
            left,
            y
        );
        ctx.lineTo(
            left + width,
            y
        );
        ctx.stroke();
    }
    for (
        let i = 0;
        i <= verticalLines;
        i++
    ) {
        const x =
            left +
            (i / verticalLines) *
            width;
        ctx.beginPath();
        ctx.moveTo(
            x,
            top
        );
        ctx.lineTo(
            x,
            top + height
        );
        ctx.stroke();
    }
    ctx.setLineDash(
        []
    );
    ctx.restore();
}
/* =========================================================
   GRAPH AXES
   ========================================================= */
function drawAxes(
    left,
    top,
    width,
    height,
    maxValue,
    unit = "kt"
) {
    const bottom =
        top + height;
    ctx.strokeStyle =
        "rgba(255,255,255,.30)";
    ctx.lineWidth =
        1;
    /* Y AXIS */
    ctx.beginPath();
    ctx.moveTo(
        left,
        top
    );
    ctx.lineTo(
        left,
        bottom
    );
    ctx.stroke();
    /* X AXIS */
    ctx.beginPath();
    ctx.moveTo(
        left,
        bottom
    );
    ctx.lineTo(
        left + width,
        bottom
    );
    ctx.stroke();
    /* Y LABELS */
    for (
        let i = 0;
        i <= 4;
        i++
    ) {
        const value =
            maxValue *
            (1 - i / 4);
        const y =
            top +
            (i / 4) *
            height;
        drawText(
            value.toFixed(1),
            3,
            y + 3,
            8,
            "#829c92"
        );
    }
    /* X SCALE */
    for (
        let i = 0;
        i <= 4;
        i++
    ) {
        const value =
            maxValue *
            (i / 4);
        const x =
            left +
            (i / 4) *
            width;
        drawText(
            value.toFixed(1),
            x - 8,
            bottom + 15,
            8,
            "#829c92"
        );
    }
    drawText(
        unit,
        left + width + 3,
        bottom + 15,
        8,
        "#829c92",
        "700"
    );
}
/* =========================================================
   ROUNDED RECT
   ========================================================= */
function roundRect(
    context,
    x,
    y,
    width,
    height,
    radius
) {
    context.beginPath();
    context.roundRect(
        x,
        y,
        width,
        height,
        radius
    );
    context.fill();
}
/* =========================================================
   HORIZONTAL BAR
   ========================================================= */
function drawHorizontalBar(
    x,
    y,
    width,
    height,
    ratio,
    color
) {
    const safeRatio =
        clamp(
            ratio
        );
    ctx.fillStyle =
        "rgba(255,255,255,.065)";
    roundRect(
        ctx,
        x,
        y,
        width,
        height,
        7
    );
    if (safeRatio <= 0) {
        return;
    }
    ctx.fillStyle =
        color;
    roundRect(
        ctx,
        x,
        y,
        width * safeRatio,
        height,
        7
    );
}
/* =========================================================
   BALANCE GRAPH
   ========================================================= */
function drawBalanceGraph() {
    const width =
        canvas.clientWidth;
    const height =
        canvas.clientHeight;
    const left =
        42;
    const top =
        25;
    const chartWidth =
        width - 58;
    const chartHeight =
        210;
    const maxValue =
        Math.max(
            graphVisual.emissions,
            graphVisual.absorption,
            1
        );
    drawGrid(
        left,
        top,
        chartWidth,
        chartHeight,
        4,
        4
    );
    drawAxes(
        left,
        top,
        chartWidth,
        chartHeight,
        maxValue
    );
    const emissionY =
        top + 42;
    const absorptionY =
        top + 128;
    drawText(
        "EMISSIONS",
        left + 5,
        emissionY - 10,
        10,
        "#df7777",
        "800"
    );
    drawText(
        `${graphVisual.emissions.toFixed(1)} kt`,
        left + chartWidth - 55,
        emissionY - 10,
        9,
        "#dbe6e2",
        "700"
    );
    drawHorizontalBar(
        left + 5,
        emissionY,
        chartWidth - 10,
        24,
        graphVisual.emissions /
        maxValue,
        "#df6666"
    );
    drawText(
        "ABSORPTION",
        left + 5,
        absorptionY - 10,
        10,
        "#62bf87",
        "800"
    );
    drawText(
        `${graphVisual.absorption.toFixed(1)} kt`,
        left + chartWidth - 55,
        absorptionY - 10,
        9,
        "#dbe6e2",
        "700"
    );
    drawHorizontalBar(
        left + 5,
        absorptionY,
        chartWidth - 10,
        24,
        graphVisual.absorption /
        maxValue,
        "#57b87b"
    );
    const state =
        getState(
            graphVisual.net
        );
    let label =
        "STABLE";
    if (state === "warning") {
        label = "WARNING";
    }
    if (state === "critical") {
        label = "CRITICAL";
    }
    drawText(
        `NET BALANCE  ${graphVisual.net >= 0 ? "+" : ""}${graphVisual.net.toFixed(1)} kt`,
        left + 5,
        height - 30,
        11,
        "#ffffff",
        "800"
    );
    drawText(
        label,
        width - 80,
        height - 30,
        9,
        state === "stable"
            ? "#62bf87"
            : state === "warning"
                ? "#e5bd48"
                : "#ef6b6b",
        "900"
    );
}
/* =========================================================
   SOURCE GRAPH
   ========================================================= */
function drawSourceGraph() {
    const width =
        canvas.clientWidth;
    const height =
        canvas.clientHeight;
    const data =
        getContributions("human")
            .concat(
                getContributions("natural")
            );
    const left =
        125;
    const right =
        35;
    const top =
        17;
    const chartWidth =
        width -
        left -
        right;
    const maxValue =
        Math.max(
            ...data.map(
                item =>
                    item.contribution
            ),
            1
        );
    const rowHeight =
        Math.min(
            25,
            (height - 30) /
            data.length
        );
    /* DOTTED VERTICAL SCALE */
    drawGrid(
        left,
        top,
        chartWidth,
        rowHeight * data.length,
        4,
        4
    );
    data.forEach(
        (item, index) => {
            const value =
                graphVisual.sources[index] ||
                0;
            const y =
                top +
                index *
                rowHeight;
            let label =
                item.name;
            if (label.length > 18) {
                label =
                    label.substring(
                        0,
                        17
                    ) +
                    "…";
            }
            drawText(
                label,
                4,
                y + 13,
                8,
                "#cbd8d3",
                "600"
            );
            const barY =
                y + 5;
            drawHorizontalBar(
                left,
                barY,
                chartWidth - 28,
                11,
                value / maxValue,
                item.group === "human"
                    ? "#df6666"
                    : "#d99b48"
            );
            drawText(
                value.toFixed(1),
                width - 25,
                y + 14,
                8,
                "#dce7e3",
                "800"
            );
        }
    );
    /* X AXIS */
    const axisY =
        height - 5;
    ctx.strokeStyle =
        "rgba(255,255,255,.25)";
    ctx.beginPath();
    ctx.moveTo(
        left,
        axisY
    );
    ctx.lineTo(
        width - right,
        axisY
    );
    ctx.stroke();
    drawText(
        "0",
        left - 3,
        axisY - 3,
        8,
        "#829c92"
    );
    drawText(
        `${maxValue.toFixed(1)} kt`,
        width - 48,
        axisY - 3,
        8,
        "#829c92"
    );
}
/* =========================================================
   SINK GRAPH
   ========================================================= */
function drawSinkGraph() {
    const width =
        canvas.clientWidth;
    const height =
        canvas.clientHeight;
    const data =
        getContributions(
            "sink"
        );
    const left =
        90;
    const right =
        35;
    const top =
        32;
    const chartWidth =
        width -
        left -
        right;
    const chartHeight =
        175;
    const maxValue =
        Math.max(
            ...data.map(
                item =>
                    item.contribution
            ),
            1
        );
    drawGrid(
        left,
        top,
        chartWidth,
        chartHeight,
        4,
        4
    );
    drawAxes(
        left,
        top,
        chartWidth,
        chartHeight,
        maxValue
    );
    data.forEach(
        (item, index) => {
            const value =
                graphVisual.sinks[index] ||
                0;
            const y =
                top +
                15 +
                index *
                55;
            let label =
                item.name;
            if (label.length > 13) {
                label =
                    label.substring(
                        0,
                        12
                    ) +
                    "…";
            }
            drawText(
                label,
                4,
                y + 8,
                9,
                "#cbd8d3",
                "700"
            );
            drawHorizontalBar(
                left,
                y,
                chartWidth - 12,
                20,
                value / maxValue,
                "#57b87b"
            );
            drawText(
                `${value.toFixed(1)} kt`,
                width - 42,
                y + 14,
                8,
                "#dce7e3",
                "800"
            );
        }
    );
    drawText(
        "Higher sink activity = greater carbon absorption",
        4,
        height - 12,
        8,
        "#829c92"
    );
}
/* =========================================================
   DONUT GRAPH
   ========================================================= */
function drawDonutGraph() {
    const width =
        canvas.clientWidth;
    const height =
        canvas.clientHeight;
    const data =
        getContributions("human")
            .concat(
                getContributions("natural")
            );
    const total =
        graphVisual.sources.reduce(
            (sum, value) =>
                sum + value,
            0
        );
    const centerX =
        width * 0.30;
    const centerY =
        height * 0.52;
    const radius =
        Math.min(
            75,
            height * 0.32
        );
    const innerRadius =
        radius * 0.54;
    let angle =
        -Math.PI / 2;
    data.forEach(
        (item, index) => {
            const value =
                graphVisual.sources[index] ||
                0;
            const portion =
                total === 0
                    ? 0
                    : value / total;
            const nextAngle =
                angle +
                portion *
                Math.PI *
                2;
            ctx.beginPath();
            ctx.moveTo(
                centerX,
                centerY
            );
            ctx.arc(
                centerX,
                centerY,
                radius,
                angle,
                nextAngle
            );
            ctx.closePath();
            ctx.fillStyle =
                item.group === "human"
                    ? "#df6666"
                    : "#d99b48";
            ctx.globalAlpha =
                0.45 +
                index * 0.025;
            ctx.fill();
            ctx.globalAlpha =
                1;
            angle =
                nextAngle;
        }
    );
    /* INNER CIRCLE */
    ctx.beginPath();
    ctx.arc(
        centerX,
        centerY,
        innerRadius,
        0,
        Math.PI * 2
    );
    ctx.fillStyle =
        "#11221f";
    ctx.fill();
    drawText(
        "EMISSIONS",
        centerX - 31,
        centerY - 3,
        8,
        "#91aaa1",
        "800"
    );
    drawText(
        total.toFixed(1),
        centerX - 17,
        centerY + 17,
        13,
        "#ffffff",
        "900"
    );
    /* LEGEND */
    data.forEach(
        (item, index) => {
            const y =
                22 +
                index * 22;
            const value =
                graphVisual.sources[index] ||
                0;
            let label =
                item.name;
            if (label.length > 17) {
                label =
                    label.substring(
                        0,
                        16
                    ) +
                    "…";
            }
            ctx.fillStyle =
                item.group === "human"
                    ? "#df6666"
                    : "#d99b48";
            ctx.fillRect(
                width * 0.54,
                y - 7,
                7,
                7
            );
            drawText(
                label,
                width * 0.58,
                y,
                8,
                "#cbd8d3"
            );
            drawText(
                value.toFixed(1),
                width - 25,
                y,
                8,
                "#91aaa1",
                "700"
            );
        }
    );
}
/* =========================================================
   HISTORY GRAPH
   ========================================================= */
function drawHistoryGraph() {
    const width =
        canvas.clientWidth;
    const height =
        canvas.clientHeight;
    const paddingLeft =
        35;
    const paddingRight =
        20;
    const paddingTop =
        20;
    const paddingBottom =
        30;
    const chartWidth =
        width -
        paddingLeft -
        paddingRight;
    const chartHeight =
        height -
        paddingTop -
        paddingBottom;
    const data =
        graphVisual.history;
    if (data.length < 2) {
        drawText(
            "Move a slider to build the balance history.",
            28,
            height / 2,
            11,
            "#91aaa1"
        );
        return;
    }
    const min =
        Math.min(
            ...data,
            0
        );
    const max =
        Math.max(
            ...data,
            15
        );
    const range =
        Math.max(
            max - min,
            1
        );
    drawGrid(
        paddingLeft,
        paddingTop,
        chartWidth,
        chartHeight,
        4,
        5
    );
    /* AXES */
    ctx.strokeStyle =
        "rgba(255,255,255,.28)";
    ctx.beginPath();
    ctx.moveTo(
        paddingLeft,
        paddingTop
    );
    ctx.lineTo(
        paddingLeft,
        height - paddingBottom
    );
    ctx.lineTo(
        width - paddingRight,
        height - paddingBottom
    );
    ctx.stroke();
    /* Y LABELS */
    for (
        let i = 0;
        i <= 4;
        i++
    ) {
        const value =
            max -
            ((max - min) *
            i / 4);
        const y =
            paddingTop +
            (i / 4) *
            chartHeight;
        drawText(
            value.toFixed(0),
            3,
            y + 3,
            8,
            "#829c92"
        );
    }
    /* ZERO LINE */
    if (
        min <= 0 &&
        max >= 0
    ) {
        const zeroY =
            paddingTop +
            ((max - 0) / range) *
            chartHeight;
        ctx.save();
        ctx.strokeStyle =
            "rgba(255,255,255,.28)";
        ctx.setLineDash(
            [3, 5]
        );
        ctx.beginPath();
        ctx.moveTo(
            paddingLeft,
            zeroY
        );
        ctx.lineTo(
            width - paddingRight,
            zeroY
        );
        ctx.stroke();
        ctx.restore();
        drawText(
            "0",
            paddingLeft + 4,
            zeroY - 5,
            8,
            "#a5b7b0",
            "700"
        );
    }
    /* LINE */
    ctx.beginPath();
    data.forEach(
        (value, index) => {
            const x =
                paddingLeft +
                (
                    index /
                    (data.length - 1)
                ) *
                chartWidth;
            const y =
                paddingTop +
                (
                    (max - value) /
                    range
                ) *
                chartHeight;
            if (index === 0) {
                ctx.moveTo(
                    x,
                    y
                );
            } else {
                ctx.lineTo(
                    x,
                    y
                );
            }
        }
    );
    ctx.strokeStyle =
        "#70c98f";
    ctx.lineWidth =
        2.5;
    ctx.lineJoin =
        "round";
    ctx.lineCap =
        "round";
    ctx.stroke();
    /* POINTS */
    data.forEach(
        (value, index) => {
            if (
                index !== data.length - 1 &&
                index % 5 !== 0
            ) {
                return;
            }
            const x =
                paddingLeft +
                (
                    index /
                    (data.length - 1)
                ) *
                chartWidth;
            const y =
                paddingTop +
                (
                    (max - value) /
                    range
                ) *
                chartHeight;
            ctx.beginPath();
            ctx.arc(
                x,
                y,
                index ===
                    data.length - 1
                    ? 5
                    : 2.5,
                0,
                Math.PI * 2
            );
            ctx.fillStyle =
                "#ffffff";
            ctx.fill();
            ctx.strokeStyle =
                "#70c98f";
            ctx.lineWidth =
                1.5;
            ctx.stroke();
        }
    );
    const last =
        data[data.length - 1];
    drawText(
        `Current: ${last >= 0 ? "+" : ""}${last.toFixed(1)} kt`,
        paddingLeft,
        height - 8,
        9,
        "#dce7e3",
        "800"
    );
    drawText(
        "TIME →",
        width - 48,
        height - 8,
        8,
        "#829c92",
        "800"
    );
}
/* =========================================================
   DRAW GRAPH
   ========================================================= */
function drawGraph() {
    if (
        !canvas ||
        !canvas.clientWidth
    ) {
        return;
    }
    clearCanvas();
    updateGraphDescription(
        graphType.value
    );
    switch (
        graphType.value
    ) {
        case "balance":
            drawBalanceGraph();
            break;
        case "sources":
            drawSourceGraph();
            break;
        case "sinks":
            drawSinkGraph();
            break;
        case "donut":
            drawDonutGraph();
            break;
        case "history":
            drawHistoryGraph();
            break;
    }
}
/* =========================================================
   GRAPH CHANGE
   ========================================================= */
graphType.addEventListener(
    "change",
    () => {
        drawGraph();
    }
);
/* =========================================================
   REACTION PARTICLES
   ========================================================= */
function createReactionParticle(
    variable
) {
    if (!stage) {
        return;
    }
    const now =
        performance.now();
    if (
        now - lastReactionTime <
        55
    ) {
        return;
    }
    lastReactionTime =
        now;
    const particle =
        document.createElement(
            "span"
        );
    particle.className =
        "sandbox-reaction-particle";
    let emoji =
        "•";
    let left =
        "50%";
    let top =
        "50%";
    if (
        variable.id === "forests"
    ) {
        emoji =
            variable.group === "sink"
                ? "🍃"
                : "🍂";
        left =
            "25%";
        top =
            "52%";
    }
    else if (
        variable.id === "oceans"
    ) {
        emoji =
            "💧";
        left =
            "82%";
        top =
            "72%";
    }
    else if (
        variable.id === "soils"
    ) {
        emoji =
            "🌱";
        left =
            "45%";
        top =
            "82%";
    }
    else if (
        variable.id === "wildfires"
    ) {
        emoji =
            "🔥";
        left =
            "62%";
        top =
            "72%";
    }
    else if (
        variable.group === "human"
    ) {
        emoji =
            variable.id === "cars"
                ? "💨"
                : variable.id === "power"
                    ? "☁️"
                    : "•";
        left =
            "48%";
        top =
            "34%";
    }
    else {
        emoji =
            variable.icon;
        left =
            "58%";
        top =
            "50%";
    }
    particle.textContent =
        emoji;
    particle.style.left =
        left;
    particle.style.top =
        top;
    particle.style.setProperty(
        "--rx",
        `${-20 + Math.random() * 40}px`
    );
    particle.style.setProperty(
        "--ry",
        `${-35 - Math.random() * 35}px`
    );
    stage.appendChild(
        particle
    );
    setTimeout(
        () => {
            particle.remove();
        },
        850
    );
}
function triggerFactorReaction(
    variable
) {
    createReactionParticle(
        variable
    );
    /* Direct visual pulse */
    const selectorMap = {
        forests:
            ".tree",
        oceans:
            ".ocean-layer, .fish, .whale",
        soils:
            ".soil-particles, .ground-layer",
        wildfires:
            ".wildfire",
        power:
            ".factory, .factory-smoke",
        cement:
            ".factory",
        refineries:
            ".factory",
        landfills:
            ".ground-layer",
        gas:
            ".factory",
        cars:
            ".air-particles",
        airplanes:
            ".cloud, .air-particles",
        animals:
            ".air-particles",
        volcanoes:
            ".air-particles",
        decay:
            ".falling-leaves"
    };
    const selector =
        selectorMap[
            variable.id
        ];
    if (!selector) {
        return;
    }
    document
        .querySelectorAll(
            selector
        )
        .forEach(
            element => {
                element.animate(
                    [
                        {
                            scale: "1"
                        },
                        {
                            scale: "1.035"
                        },
                        {
                            scale: "1"
                        }
                    ],
                    {
                        duration: 260,
                        easing: "ease-out"
                    }
                );
            }
        );
}
/* =========================================================
   EXTRA PARTICLES
   ========================================================= */
function createExtraParticles() {
    if (!stage) {
        return;
    }
    if (
        stage.querySelector(
            ".extra-particle"
        )
    ) {
        return;
    }
    for (
        let i = 0;
        i < 8;
        i++
    ) {
        const particle =
            document.createElement(
                "span"
            );
        particle.className =
            `extra-particle extra-particle-${i + 1}`;
        particle.setAttribute(
            "aria-hidden",
            "true"
        );
        stage.appendChild(
            particle
        );
    }
}
/* =========================================================
   CONTINUOUS MOTION LOOP
   ========================================================= */
function continuousSceneMotion(
    time
) {
    if (!stage) {
        return;
    }
    const seconds =
        time / 1000;
    const stress =
        Number(
            getComputedStyle(
                stage
            ).getPropertyValue(
                "--stress"
            )
        ) || 0;
    const air =
        Number(
            getComputedStyle(
                stage
            ).getPropertyValue(
                "--air-stress"
            )
        ) || 0;
    const ocean =
        Number(
            getComputedStyle(
                stage
            ).getPropertyValue(
                "--ocean-stress"
            )
        ) || 0;
    stage.style.setProperty(
        "--motion-wave",
        Math.sin(
            seconds * 1.7
        ).toFixed(3)
    );
    stage.style.setProperty(
        "--motion-fast",
        (
            0.5 +
            0.5 *
            Math.sin(
                seconds *
                (1.4 + stress * 2)
            )
        ).toFixed(3)
    );
    stage.style.setProperty(
        "--motion-slow",
        (
            0.5 +
            0.5 *
            Math.sin(
                seconds * 0.55
            )
        ).toFixed(3)
    );
    stage.style.setProperty(
        "--air-motion",
        (
            0.5 +
            0.5 *
            Math.sin(
                seconds *
                (1.1 + air * 2)
            )
        ).toFixed(3)
    );
    stage.style.setProperty(
        "--ocean-motion",
        (
            0.5 +
            0.5 *
            Math.sin(
                seconds *
                (1.5 - ocean * 0.55)
            )
        ).toFixed(3)
    );
    sceneAnimationFrame =
        requestAnimationFrame(
            continuousSceneMotion
        );
}
/* =========================================================
   RESPONSIVE CANVAS
   ========================================================= */
window.addEventListener(
    "resize",
    resizeCanvas
);
/* =========================================================
   INITIALISE
   ========================================================= */
createControls();
createExtraParticles();
requestAnimationFrame(
    () => {
        resizeCanvas();
        updateModel();
    }
);
/* =========================================================
   START CONTINUOUS ANIMATION
   ========================================================= */
requestAnimationFrame(
    continuousSceneMotion
);
/* =========================================================
   PERIODIC ENVIRONMENT REACTION
   ========================================================= */
setInterval(
    () => {
        if (!stage) {
            return;
        }
        const state =
            getState(
                currentData.net
            );
        const stageElements =
            document.querySelectorAll(
                ".tree, .factory, .ocean-layer, .wildfire"
            );
        stageElements.forEach(
            element => {
                element.animate(
                    [
                        {
                            translateY: "0px"
                        },
                        {
                            translateY:
                                state === "critical"
                                    ? "-4px"
                                    : "-2px"
                        },
                        {
                            translateY: "0px"
                        }
                    ],
                    {
                        duration:
                            state === "critical"
                                ? 650
                                : state === "warning"
                                    ? 900
                                    : 1250,
                        easing:
                            "ease-in-out"
                    }
                );
            }
        );
    },
    2200
);