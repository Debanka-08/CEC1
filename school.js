/* =========================================================
   QUICK FACTS
   ========================================================= */
const schoolQuickFacts = {
    1: {
        title: "School Profile",
        subtitle: "Small facts. Big impact.",
        source: "Sources: U.S. DOE • Global E-waste Monitor • UNFCCC",
        facts: [
            ["💡", "90%", "LED bulbs can use up to 90% less energy than incandescent bulbs."],
            ["♻️", "62M", "Around 62 million tonnes of e-waste were generated globally in 2022."],
            ["🔄", "22.3%", "Only 22.3% of 2022 global e-waste was formally collected and recycled."],
            ["🌡️", "1.5°C", "The Paris Agreement aims to limit warming to well below 2°C and pursue efforts toward 1.5°C."]
        ]
    },
    2: {
        title: "Electricity & Solar",
        subtitle: "Clean electricity can reduce emissions.",
        source: "Source: IEA Global Energy Review 2026",
        facts: [
            ["🌍", "34%", "Renewables supplied around 34% of global electricity in 2025."],
            ["☀️", "2,700 TWh", "Solar PV generated nearly 2,700 TWh of electricity globally in 2025."],
            ["📈", "600 TWh", "Global solar generation increased by about 600 TWh in 2025."],
            ["🔆", "8%+", "Solar PV supplied more than 8% of global electricity in 2025."]
        ]
    },
    3: {
        title: "Transportation",
        subtitle: "How we travel affects our footprint.",
        source: "Sources: U.S. DOE • IEA Global Energy Review 2026",
        facts: [
            ["⚡", "87–91%", "A typical EV converts about 87–91% of energy into movement, compared with about 30% for conventional gasoline vehicles."],
            ["🛢️", "1.7M", "The global EV fleet avoided around 1.7 million barrels of oil use per day in 2025."],
            ["♻️", "22%", "Regenerative braking can recover around 22% of braking energy on a cited combined driving cycle."],
            ["🚗", "20M+", "Global electric-car sales surpassed 20 million in 2025."]
        ]
    },
    4: {
        title: "Fuel & Water",
        subtitle: "Fuel and water use both have an impact.",
        source: "Sources: IEA • UN-Water / UNESCO",
        facts: [
            ["🌱", "4%+", "Liquid biofuels supplied more than 4% of global transport fuel in 2024."],
            ["💧", "0.5%", "Only about 0.5% of Earth's water is usable and available freshwater."],
            ["🌾", "72%", "Agriculture accounts for about 72% of global freshwater withdrawals."],
            ["🍽️", "2,000–5,000 L", "Producing one person's daily food can require roughly 2,000–5,000 litres of water."]
        ]
    },
    5: {
        title: "School Waste",
        subtitle: "Reducing waste also reduces impact.",
        source: "Sources: UNEP • Global E-waste Monitor",
        facts: [
            ["🗑️", "2.1–2.3B", "Humanity generates roughly 2.1–2.3 billion tonnes of municipal solid waste each year."],
            ["💻", "62M", "The world generated about 62 million tonnes of e-waste in 2022."],
            ["📈", "3.8B", "Annual municipal waste could reach about 3.8 billion tonnes by 2050 if current patterns continue."],
            ["♻️", "22.3%", "Only 22.3% of 2022 global e-waste was formally collected and recycled."]
        ]
    },
    result: {
        title: "Conclusion & Impact",
        subtitle: "Your result is the starting point for improvement.",
        source: "Key takeaways for a more sustainable school.",
        facts: [
            ["🌱", "Every kg counts", "Even small reductions in energy use, travel, fuel and waste can lower the school's total carbon footprint."],
            ["⚡", "Energy matters", "Using electricity efficiently and increasing solar energy can reduce emissions from the school's energy use."],
            ["🚌", "Smarter travel", "Shared and public transport, walking and cycling can help reduce transportation-related emissions."],
            ["📊", "Measure → Improve", "Your carbon-footprint result helps identify areas where your school can make future improvements."]
        ]
    }
};

/* =========================================================
   UPDATE QUICK FACTS
   ========================================================= */
function updateQuickFacts(stepNumber) {
    const panel = document.getElementById("quickFactsPanel");
    if (!panel) return;

    const data = schoolQuickFacts[stepNumber] || schoolQuickFacts[1];

    const title = document.getElementById("quickFactsTitle");
    const subtitle = document.getElementById("quickFactsSubtitle");
    const source = document.getElementById("quickFactsSource");

    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.subtitle;
    if (source) source.textContent = data.source;

    data.facts.forEach(function(fact, index) {
        const number = index + 1;

        const icon = document.getElementById("factIcon" + number);
        const value = document.getElementById("factValue" + number);
        const text = document.getElementById("factText" + number);

        if (icon) icon.textContent = fact[0];
        if (value) value.textContent = fact[1];
        if (text) text.textContent = fact[2];
    });

    panel.classList.remove("facts-changing");
    void panel.offsetWidth;
    panel.classList.add("facts-changing");
}

/* =========================================================
   NEXT STEP
   ========================================================= */
function schoolNextStep(stepNumber) {
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById("schoolStep" + i);
        if (step) step.style.display = "none";
    }

    const nextStep = document.getElementById("schoolStep" + stepNumber);

    if (nextStep) {
        nextStep.style.display = "block";
        updateQuickFacts(stepNumber);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

/* =========================================================
   PREVIOUS STEP
   ========================================================= */
function schoolPrevStep(stepNumber) {
    for (let i = 1; i <= 5; i++) {
        const step = document.getElementById("schoolStep" + i);
        if (step) step.style.display = "none";
    }

    const previousStep = document.getElementById("schoolStep" + stepNumber);

    if (previousStep) {
        previousStep.style.display = "block";
        updateQuickFacts(stepNumber);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

/* =========================================================
   SCHOOL VALUE
   ========================================================= */
function schoolValue(id) {
    const element = document.getElementById(id);

    if (!element) return 0;

    const value = parseFloat(element.value);

    if (isNaN(value)) return 0;

    return Math.max(0, value);
}

/* =========================================================
   CARBON TRACKING — LOCAL STORAGE
   ========================================================= */
function getCarbonCalculationHistory() {
    try {
        const storedHistory = localStorage.getItem("carbonCalcHistory");

        if (!storedHistory) {
            return [];
        }

        const parsedHistory = JSON.parse(storedHistory);

        if (!Array.isArray(parsedHistory)) {
            return [];
        }

        return parsedHistory.filter(function(record) {
            return (
                record &&
                typeof record.timestamp === "string" &&
                typeof record.value === "number" &&
                Number.isFinite(record.value)
            );
        });
    } catch (error) {
        console.warn("Carbon tracking history could not be read:", error);
        return [];
    }
}

/* =========================================================
   SAVE CARBON CALCULATION
   ========================================================= */
function saveCarbonCalculation(totalTonnes) {
    try {
        if (!Number.isFinite(totalTonnes)) {
            return {
                history: getCarbonCalculationHistory(),
                variance: 0,
                hasPrevious: false
            };
        }

        const history = getCarbonCalculationHistory();

        const previousValue =
            history.length > 0
                ? Number(history[history.length - 1].value)
                : null;

        const currentRecord = {
            timestamp: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            }),
            value: parseFloat(totalTonnes)
        };

        history.push(currentRecord);

        localStorage.setItem(
            "carbonCalcHistory",
            JSON.stringify(history)
        );

        const variance =
            previousValue !== null
                ? currentRecord.value - previousValue
                : 0;

        return {
            history: history,
            variance: variance,
            hasPrevious: previousValue !== null
        };
    } catch (error) {
        console.warn("Carbon tracking history could not be saved:", error);

        return {
            history: getCarbonCalculationHistory(),
            variance: 0,
            hasPrevious: false
        };
    }
}

/* =========================================================
   TRACKING STYLES
   ========================================================= */
function injectCarbonTrackingStyles() {
    if (document.getElementById("carbonTrackingStyles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "carbonTrackingStyles";

    style.textContent = `
        .carbon-tracking-widget {
            margin-top: 28px;
            padding: 22px;
            border: 1px solid rgba(46, 125, 50, 0.16);
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.96);
            box-shadow: 0 10px 30px rgba(27, 94, 32, 0.08);
            font-family: inherit;
        }

        .carbon-tracking-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 16px;
        }

        .carbon-tracking-title {
            margin: 0;
            color: #1b5e20;
            font-size: 1.15rem;
            font-weight: 700;
        }

        .carbon-clear-button {
            border: 0;
            background: transparent;
            color: #777;
            font-size: 0.82rem;
            font-weight: 600;
            cursor: pointer;
            padding: 5px 2px;
            text-decoration: underline;
            text-underline-offset: 3px;
        }

        .carbon-clear-button:hover {
            color: #c62828;
        }

        .carbon-trend {
            padding: 14px 16px;
            border-radius: 13px;
            margin-bottom: 18px;
            font-size: 0.94rem;
            line-height: 1.5;
            font-weight: 600;
        }

        .carbon-trend-up {
            background: #ffebee;
            color: #b71c1c;
            border-left: 4px solid #d32f2f;
        }

        .carbon-trend-down {
            background: #e8f5e9;
            color: #1b5e20;
            border-left: 4px solid #43a047;
        }

        .carbon-trend-even {
            background: #f5f5f5;
            color: #555;
            border-left: 4px solid #9e9e9e;
        }

        .carbon-history-table-wrap {
            width: 100%;
            overflow-x: auto;
        }

        .carbon-history-table {
            width: 100%;
            border-collapse: collapse;
            min-width: 340px;
        }

        .carbon-history-table th {
            text-align: left;
            padding: 10px 8px;
            color: #666;
            font-size: 0.76rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            border-bottom: 1px solid #e5e5e5;
        }

        .carbon-history-table td {
            padding: 12px 8px;
            color: #333;
            font-size: 0.9rem;
            border-bottom: 1px solid #eeeeee;
        }

        .carbon-history-table tbody tr:last-child td {
            border-bottom: 0;
        }

        .carbon-history-value {
            color: #1b5e20;
            font-weight: 700;
            text-align: right;
            white-space: nowrap;
        }

        .carbon-history-date {
            white-space: nowrap;
        }

        .carbon-history-empty {
            margin: 0;
            color: #777;
            font-size: 0.9rem;
            line-height: 1.5;
        }

        @media (max-width: 600px) {
            .carbon-tracking-widget {
                padding: 17px;
                border-radius: 15px;
            }

            .carbon-tracking-header {
                align-items: flex-start;
            }

            .carbon-tracking-title {
                font-size: 1rem;
            }

            .carbon-clear-button {
                font-size: 0.76rem;
            }
        }
    `;

    document.head.appendChild(style);
}

/* =========================================================
   CLEAR CARBON HISTORY
   ========================================================= */
function clearCarbonHistory() {
    try {
        localStorage.removeItem("carbonCalcHistory");

        alert("Tracking logs cleared.");

        renderCarbonTracking([], 0, false);
    } catch (error) {
        console.warn("Carbon tracking history could not be cleared:", error);

        alert("The tracking logs could not be cleared.");
    }
}

/* =========================================================
   RENDER CARBON TRACKING
   ========================================================= */
function renderCarbonTracking(history, variance, hasPrevious) {
    const result = document.getElementById("schoolResult");

    if (!result) return;

    injectCarbonTrackingStyles();

    let widget = document.getElementById("carbonTrackingWidget");

    if (!widget) {
        widget = document.createElement("div");
        widget.id = "carbonTrackingWidget";
        widget.className = "carbon-tracking-widget";
        result.appendChild(widget);
    }

    let trendHTML = "";

    if (hasPrevious) {
        if (variance > 0) {
            trendHTML = `
                <div class="carbon-trend carbon-trend-up">
                    📈 Your carbon footprint increased by ${Math.abs(variance).toFixed(2)} tonnes since your last check.
                </div>
            `;
        } else if (variance < 0) {
            trendHTML = `
                <div class="carbon-trend carbon-trend-down">
                    📉 You successfully slashed ${Math.abs(variance).toFixed(2)} tonnes from your carbon footprint since your last check.
                </div>
            `;
        } else {
            trendHTML = `
                <div class="carbon-trend carbon-trend-even">
                    ⚖️ Your carbon footprint remains exactly the same as your last check.
                </div>
            `;
        }
    }

    const recentHistory = history
        .slice()
        .reverse()
        .slice(0, 5);

    let tableHTML = "";

    if (recentHistory.length > 0) {
        tableHTML = `
            <div class="carbon-history-table-wrap">
                <table class="carbon-history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th style="text-align:right;">Carbon Impact</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentHistory.map(function(record) {
                            return `
                                <tr>
                                    <td class="carbon-history-date">
                                        ${record.timestamp}
                                    </td>
                                    <td class="carbon-history-value">
                                        ${Number(record.value).toFixed(2)} tonnes
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        `;
    } else {
        tableHTML = `
            <p class="carbon-history-empty">
                No tracking records are currently stored in this browser.
            </p>
        `;
    }

    widget.innerHTML = `
        <div class="carbon-tracking-header">
            <h3 class="carbon-tracking-title">
                📋 Your Tracking History
            </h3>

            <button
                type="button"
                class="carbon-clear-button"
                onclick="clearCarbonHistory()"
            >
                Clear Logs
            </button>
        </div>

        ${trendHTML}

        ${tableHTML}
    `;
}

/* =========================================================
   CALCULATE SCHOOL CARBON
   ========================================================= */
function calculateSchoolCarbon() {
    const students = schoolValue("students");
    const staff = schoolValue("staff");
    const totalPeople = students + staff;

    const schoolArea = schoolValue("schoolArea");

    /* ELECTRICITY */
    const gridElectricity = schoolValue("gridElectricity");
    const solarElectricity = schoolValue("solarElectricity");
    const electricityFactor =
        schoolValue("electricityFactor") || 0.82;

    const netElectricity =
        Math.max(0, gridElectricity - solarElectricity);

    const electricityEmissions =
        netElectricity * electricityFactor;

    /* TRANSPORT */
    const busDiesel = schoolValue("busDiesel");
    const schoolPetrol = schoolValue("schoolPetrol");
    const carTravel = schoolValue("carTravel");
    const twoWheelerTravel = schoolValue("twoWheelerTravel");
    const publicBusTravel = schoolValue("publicBusTravel");
    const metroTravel = schoolValue("metroTravel");

    const transportEmissions =
        (busDiesel * 2.68) +
        (schoolPetrol * 2.31) +
        (carTravel * 0.171) +
        (twoWheelerTravel * 0.103) +
        (publicBusTravel * 0.089) +
        (metroTravel * 0.041);

    /* FUEL + WATER */
    const generatorDiesel = schoolValue("generatorDiesel");
    const schoolLPG = schoolValue("schoolLPG");
    const waterUsage = schoolValue("waterUsage");

    const fuelWaterEmissions =
        (generatorDiesel * 2.68) +
        (schoolLPG * 2.98) +
        (waterUsage * 0.344);

    /* WASTE */
    const foodWaste = schoolValue("foodWaste");
    const paperWaste = schoolValue("paperWaste");
    const plasticWaste = schoolValue("plasticWaste");
    const otherWaste = schoolValue("otherWaste");

    const recycledPercent =
        Math.min(100, schoolValue("recycledPercent"));

    const wasteBeforeRecycling =
        (foodWaste * 0.50) +
        (paperWaste * 1.30) +
        (plasticWaste * 2.70) +
        (otherWaste * 0.80);

    const wasteEmissions =
        wasteBeforeRecycling *
        (1 - recycledPercent / 100);

    /* TOTAL */
    const totalEmissions =
        electricityEmissions +
        transportEmissions +
        fuelWaterEmissions +
        wasteEmissions;

    const totalTonnes = totalEmissions / 1000;

    const perPerson =
        totalPeople > 0
            ? totalEmissions / totalPeople
            : 0;

    const perArea =
        schoolArea > 0
            ? totalEmissions / schoolArea
            : 0;

    /* =====================================================
       LOCAL STORAGE CARBON TRACKING
       ===================================================== */
    const trackingData =
        saveCarbonCalculation(totalTonnes);

    /* RESULT NUMBERS */
    const schoolTotal =
        document.getElementById("schoolTotal");

    const schoolTotalKg =
        document.getElementById("schoolTotalKg");

    const schoolPerPerson =
        document.getElementById("schoolPerPerson");

    const schoolPerArea =
        document.getElementById("schoolPerArea");

    if (schoolTotal) {
        schoolTotal.textContent =
            totalTonnes.toFixed(2);
    }

    if (schoolTotalKg) {
        schoolTotalKg.textContent =
            totalEmissions.toFixed(2) + " kg CO₂e";
    }

    if (schoolPerPerson) {
        schoolPerPerson.textContent =
            perPerson.toFixed(2) + " kg CO₂e";
    }

    if (schoolPerArea) {
        schoolPerArea.textContent =
            perArea.toFixed(2) + " kg CO₂e";
    }

    /* BREAKDOWN */
    const schoolElectricity =
        document.getElementById("schoolElectricity");

    const schoolTransport =
        document.getElementById("schoolTransport");

    const schoolFuel =
        document.getElementById("schoolFuel");

    const schoolWaste =
        document.getElementById("schoolWaste");

    if (schoolElectricity) {
        schoolElectricity.textContent =
            (electricityEmissions / 1000).toFixed(2) +
            " tonnes";
    }

    if (schoolTransport) {
        schoolTransport.textContent =
            (transportEmissions / 1000).toFixed(2) +
            " tonnes";
    }

    if (schoolFuel) {
        schoolFuel.textContent =
            (fuelWaterEmissions / 1000).toFixed(2) +
            " tonnes";
    }

    if (schoolWaste) {
        schoolWaste.textContent =
            (wasteEmissions / 1000).toFixed(2) +
            " tonnes";
    }

    /* BARS */
    const safeTotal =
        totalEmissions > 0
            ? totalEmissions
            : 1;

    const electricityBar =
        document.getElementById("electricityBar");

    const transportBar =
        document.getElementById("transportBar");

    const fuelBar =
        document.getElementById("fuelBar");

    const wasteBar =
        document.getElementById("wasteBar");

    if (electricityBar) {
        electricityBar.style.width =
            (electricityEmissions / safeTotal * 100) + "%";
    }

    if (transportBar) {
        transportBar.style.width =
            (transportEmissions / safeTotal * 100) + "%";
    }

    if (fuelBar) {
        fuelBar.style.width =
            (fuelWaterEmissions / safeTotal * 100) + "%";
    }

    if (wasteBar) {
        wasteBar.style.width =
            (wasteEmissions / safeTotal * 100) + "%";
    }

    /* TREES */
    const treesNeeded =
        Math.ceil(totalEmissions / 21.77);

    const schoolTrees =
        document.getElementById("schoolTrees");

    if (schoolTrees) {
        schoolTrees.textContent =
            treesNeeded;
    }

    /* RESULT MESSAGE */
    const message =
        document.getElementById("schoolResultMessage");

    if (message) {
        if (totalTonnes === 0) {
            message.textContent =
                "🌱 Your school has no recorded emissions yet.";
        } else if (totalTonnes < 50) {
            message.textContent =
                "🌱 Your school's estimated footprint is relatively low. Keep improving!";
        } else if (totalTonnes < 150) {
            message.textContent =
                "🌍 There is room to reduce your school's carbon footprint.";
        } else {
            message.textContent =
                "♻️ Your school has a significant footprint. Energy, transport and waste reductions can make a big difference.";
        }
    }

    /* =====================================================
       DISPLAY TRACKING HISTORY
       ===================================================== */
    renderCarbonTracking(
        trackingData.history,
        trackingData.variance,
        trackingData.hasPrevious
    );

    /* SHOW RESULT + CONCLUSION FACTS */
    updateQuickFacts("result");

    const result =
        document.getElementById("schoolResult");

    if (result) {
        result.style.display = "block";

        result.scrollIntoView({
            behavior: "smooth"
        });
    }
}

/* =========================================================
   CALCULATE AGAIN
   ========================================================= */
function calculateSchoolAgain() {
    const result =
        document.getElementById("schoolResult");

    if (result) {
        result.style.display = "none";
    }

    schoolNextStep(1);
}

/* =========================================================
   LIVE TREE — ADD ONLY
   ========================================================= */
(function() {
    function liveTreeNumber(id) {
        const element =
            document.getElementById(id);

        if (!element) return 0;

        const value =
            parseFloat(element.value);

        return isNaN(value)
            ? 0
            : Math.max(0, value);
    }

    function updateLiveTree() {
        /* ELECTRICITY */
        const gridElectricity =
            liveTreeNumber("gridElectricity");

        const solarElectricity =
            liveTreeNumber("solarElectricity");

        const electricityFactor =
            liveTreeNumber("electricityFactor") || 0.82;

        const electricity =
            Math.max(
                0,
                gridElectricity - solarElectricity
            ) * electricityFactor;

        /* TRANSPORT */
        const transport =
            (liveTreeNumber("busDiesel") * 2.68) +
            (liveTreeNumber("schoolPetrol") * 2.31) +
            (liveTreeNumber("carTravel") * 0.171) +
            (liveTreeNumber("twoWheelerTravel") * 0.103) +
            (liveTreeNumber("publicBusTravel") * 0.089) +
            (liveTreeNumber("metroTravel") * 0.041);

        /* FUEL + WATER */
        const fuel =
            (liveTreeNumber("generatorDiesel") * 2.68) +
            (liveTreeNumber("schoolLPG") * 2.98) +
            (liveTreeNumber("waterUsage") * 0.344);

        /* WASTE */
        const recycled =
            Math.min(
                100,
                liveTreeNumber("recycledPercent")
            );

        const wasteBeforeRecycling =
            (liveTreeNumber("foodWaste") * 0.50) +
            (liveTreeNumber("paperWaste") * 1.30) +
            (liveTreeNumber("plasticWaste") * 2.70) +
            (liveTreeNumber("otherWaste") * 0.80);

        const waste =
            wasteBeforeRecycling *
            (1 - recycled / 100);

        /* TOTAL */
        const total =
            electricity +
            transport +
            fuel +
            waste;

        /* NUMBERS */
        const co2 =
            document.getElementById("liveTreeCO2");

        const electricityDisplay =
            document.getElementById("liveElectricity");

        const transportDisplay =
            document.getElementById("liveTransport");

        const fuelDisplay =
            document.getElementById("liveFuel");

        const wasteDisplay =
            document.getElementById("liveWaste");

        if (co2) {
            co2.textContent =
                total.toFixed(2) +
                " kg CO₂e";
        }

        if (electricityDisplay) {
            electricityDisplay.textContent =
                electricity.toFixed(2) +
                " kg";
        }

        if (transportDisplay) {
            transportDisplay.textContent =
                transport.toFixed(2) +
                " kg";
        }

        if (fuelDisplay) {
            fuelDisplay.textContent =
                fuel.toFixed(2) +
                " kg";
        }

        if (wasteDisplay) {
            wasteDisplay.textContent =
                waste.toFixed(2) +
                " kg";
        }

        /* TREE */
        const box =
            document.querySelector(".live-tree-box");

        const tree =
            document.getElementById("liveTreeEmoji");

        const condition =
            document.getElementById("liveTreeCondition");

        if (!box || !tree || !condition) {
            return;
        }

        box.classList.remove(
            "tree-healthy",
            "tree-moderate",
            "tree-warning",
            "tree-danger"
        );

        if (total === 0) {
            tree.textContent = "🌱";

            condition.textContent =
                "Start entering your school's data";

            box.classList.add("tree-healthy");

        } else if (total < 5000) {
            tree.textContent = "🌳";

            condition.textContent =
                "🌿 Healthy environment";

            box.classList.add("tree-healthy");

        } else if (total < 20000) {
            tree.textContent = "🌲";

            condition.textContent =
                "🌿 Environment needs attention";

            box.classList.add("tree-moderate");

        } else if (total < 50000) {
            tree.textContent = "🍂🌳";

            condition.textContent =
                "🍂 Tree is under stress";

            box.classList.add("tree-warning");

        } else {
            tree.textContent = "🥀🌳";

            condition.textContent =
                "⚠️ High environmental impact";

            box.classList.add("tree-danger");
        }
    }

    /* =====================================================
       LISTEN TO SCHOOL INPUTS
       ===================================================== */
    document.addEventListener(
        "DOMContentLoaded",
        function() {
            const schoolInputs =
                document.querySelectorAll(
                    ".school-calc input, .school-calc select"
                );

            schoolInputs.forEach(function(input) {
                input.addEventListener(
                    "input",
                    updateLiveTree
                );

                input.addEventListener(
                    "change",
                    updateLiveTree
                );
            });

            updateLiveTree();
        }
    );
})();

/* =========================================================
   INITIAL QUICK FACTS
   ========================================================= */
document.addEventListener(
    "DOMContentLoaded",
    function() {
        updateQuickFacts(1);
    }
);