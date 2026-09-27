function nextStep(step) {
    document.querySelectorAll(".step").forEach(s => s.style.display = "none");
    document.getElementById("step" + step).style.display = "block";
    
    // Scroll to top of the page smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(step) {
    nextStep(step);
}

function calculate() {
    // Show calculating message with spinner
    document.getElementById("result").innerHTML = `
        <div class="resultxt">
            <div class="loading-spinner"></div>
            <div>🌍 Calculating Your Carbon Footprint...</div>
            <p style="font-size: 16px; margin-top: 10px; font-weight: normal;">Analyzing your environmental impact</p>
        </div>
    `;
    
    setTimeout(() => {
        // Get all input values
        const peopleCount = parseFloat(document.getElementById("peopleCount").value) || 0;
        const electricityUsage = parseFloat(document.getElementById("electricityUsage").value) || 0;
        const gridFactor = parseFloat(document.getElementById("gridFactor").value) || 0.82;
        const solarPanel = parseFloat(document.getElementById("solarPanel").value) || 0;
        const airTravel = parseFloat(document.getElementById("airTravel").value) || 0;
        const railTravel = parseFloat(document.getElementById("railTravel").value) || 0;
        const roadTravel = parseFloat(document.getElementById("roadTravel").value) || 0;
        const dietType = document.getElementById("dietType").value;
        const petrol = parseFloat(document.getElementById("petrol").value) || 0;
        const diesel = parseFloat(document.getElementById("diesel").value) || 0;
        const cng = parseFloat(document.getElementById("cng").value) || 0;
        const lpg = parseFloat(document.getElementById("lpg").value) || 0;
        const coal = parseFloat(document.getElementById("coal").value) || 0;
        const coke = parseFloat(document.getElementById("coke").value) || 0;

        // Emission factors (kg CO2 per unit)
        const emissionFactors = {
            electricity: gridFactor,
            airTravel: 0.255,
            railTravel: 0.041,
            roadTravel: 0.171,
            petrol: 2.31,
            diesel: 2.68,
            cng: 2.75,
            lpg: 2.98,
            coal: 2.42,
            coke: 3.43,
            diet: {
                veg: 1500,
                nonveg: 2500,
                vegan: 1200
            }
        };

        // Calculate emissions
        const netElectricity = Math.max(0, electricityUsage - solarPanel);
        const electricityEmissions = (netElectricity * emissionFactors.electricity * 12);
        const airEmissions = airTravel * emissionFactors.airTravel;
        const railEmissions = railTravel * emissionFactors.railTravel;
        const roadEmissions = roadTravel * emissionFactors.roadTravel * 12;
        const travelEmissions = airEmissions + railEmissions + roadEmissions;
        let dietEmissions = 0;
        if (dietType && peopleCount > 0) {
            dietEmissions = emissionFactors.diet[dietType] * peopleCount;
        }
        const petrolEmissions = petrol * emissionFactors.petrol * 12;
        const dieselEmissions = diesel * emissionFactors.diesel * 12;
        const cngEmissions = cng * emissionFactors.cng * 12;
        const lpgEmissions = lpg * emissionFactors.lpg * 12;
        const coalEmissions = coal * emissionFactors.coal * 12;
        const cokeEmissions = coke * emissionFactors.coke * 12;
        const fuelEmissions = petrolEmissions + dieselEmissions + cngEmissions + 
                             lpgEmissions + coalEmissions + cokeEmissions;

        const totalEmissions = electricityEmissions + travelEmissions + 
                              dietEmissions + fuelEmissions;
        const totalTonnes = (totalEmissions / 1000).toFixed(2);
        const perPersonEmissions = peopleCount > 0 ? 
                                  (totalEmissions / peopleCount / 1000).toFixed(2) : 
                                  totalTonnes;
        const treesNeeded = Math.ceil(totalEmissions / 21.77);

        // Generate enhanced breakdown
        const breakdown = `
            <div style="background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); padding: 25px; border-radius: 20px; margin-top: 20px; box-shadow: 0 8px 24px rgba(46, 125, 50, 0.2);">
                <h3 class='resultxt2' style="margin-top: 0; font-size: 30px;">
                    <span class="result-icon">📊</span>Your Annual Carbon Footprint
                </h3>
                
                <div class="result-box" style="background: linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%); text-align: center; border: 4px solid #4caf50;">
                    <div class="emission-value" style="font-size: 48px; color: #1b5e20;">
                        ${totalTonnes} <span style="font-size: 24px;">tonnes CO₂</span>
                    </div>
                    <p style="color: #558b2f; font-size: 18px; margin: 10px 0; font-weight: bold;">Total Annual Emissions</p>
                    <div class="comparison-badge">
                        Per Person: ${perPersonEmissions} tonnes CO₂/year
                    </div>
                </div>

                <div style="margin: 25px 0;">
                    <h4 style="color: #2e7d32; margin-bottom: 15px; font-size: 22px; text-align: left;">
                        <span class="result-icon">🔍</span>Emission Breakdown:
                    </h4>
                    <div class="breakdown-item">
                        <span style="font-size: 18px;"><strong>⚡ Electricity:</strong></span>
                        <span style="font-size: 20px; color: #1b5e20; font-weight: bold;">${(electricityEmissions/1000).toFixed(2)} tonnes</span>
                    </div>
                    <div class="breakdown-item">
                        <span style="font-size: 18px;"><strong>✈️ Travel:</strong></span>
                        <span style="font-size: 20px; color: #1b5e20; font-weight: bold;">${(travelEmissions/1000).toFixed(2)} tonnes</span>
                    </div>
                    <div class="breakdown-item">
                        <span style="font-size: 18px;"><strong>🍽️ Diet:</strong></span>
                        <span style="font-size: 20px; color: #1b5e20; font-weight: bold;">${(dietEmissions/1000).toFixed(2)} tonnes</span>
                    </div>
                    <div class="breakdown-item">
                        <span style="font-size: 18px;"><strong>⛽ Fuel:</strong></span>
                        <span style="font-size: 20px; color: #1b5e20; font-weight: bold;">${(fuelEmissions/1000).toFixed(2)} tonnes</span>
                    </div>
                </div>

                <div class="result-box" style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border: 3px solid #ff9800;">
                    <div class="trees-badge">
                        <span class="result-icon">🌳</span>Trees Needed: ${treesNeeded}
                    </div>
                    <p style="color: #e65100; margin: 10px 0; font-size: 15px;">
                        Plant ${treesNeeded} trees to offset your annual emissions
                    </p>
                    <p style="color: #bf360c; margin: 5px 0; font-size: 13px;">
                        (Based on 1 tree absorbing ~21.77 kg CO₂/year)
                    </p>
                </div>

                <div class="result-box" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border: 3px solid #2196f3;">
                    <p style="color: #01579b; margin: 10px 0; font-size: 16px;">
                        <strong>📈 Comparison:</strong> The average Indian carbon footprint is ~1.9 tonnes/year.
                    </p>
                    <div class="comparison-badge" style="background: ${perPersonEmissions > 1.9 ? 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)' : 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'};">
                        ${perPersonEmissions > 1.9 ? 
                          '⚠️ Above Average - Check our Tips page!' : 
                          '✅ Great! You\'re below average!'}
                    </div>
                </div>

                <div style="text-align: center; margin-top: 25px;">
                    <button class="result-button" onclick="window.print()">
                        🖨️ Print Results
                    </button>
                    <button class="result-button" onclick="clearResultsAndReload()" style="background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);">
                        🔄 Calculate Again
                    </button>
                    <button class="result-button" onclick="window.location.href='tips.html'" style="background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);">
                        💡 Show Tips
                    </button>
                    <button class="result-button" onclick="window.location.href='resources.html'" style="background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);">
                        📚 Explore Resources
                    </button>
                </div>
            </div>
        `;

        document.getElementById("result").innerHTML = breakdown;
        
        // Hide all inputs, labels, buttons, progress bar and heading in step5 when results are shown
        const step5 = document.getElementById("step5");
        const elementsToHide = step5.querySelectorAll("input, label, .hd2, .elecLogo, .progress-bar, .button-container");
        elementsToHide.forEach(element => element.style.display = "none");
    }, 2500);
}

// Slider Navigation Functionality
const track = document.getElementById('isaTrack');
let currentPosition = 0;
const itemWidth = 14.28;
let autoScrollTimeout;
let isHovering = false;

function manualScroll(direction) {
    track.classList.add('manual-scroll');
    
    if (direction === 'next') {
        currentPosition -= itemWidth;
    } else {
        currentPosition += itemWidth;
    }

    if (currentPosition <= -50) {
        currentPosition = 0;
    } else if (currentPosition > 0) {
        currentPosition = -50 + itemWidth;
    }

    track.style.transform = `translateX(${currentPosition}%)`;

    clearTimeout(autoScrollTimeout);
    if (!isHovering) {
        autoScrollTimeout = setTimeout(() => {
            track.classList.remove('manual-scroll');
            track.style.transform = '';
            currentPosition = 0;
        }, 5000);
    }
}

const slider = document.querySelector('.isa-slider');
if (slider) {
    slider.addEventListener('mouseenter', () => {
        isHovering = true;
        clearTimeout(autoScrollTimeout);
    });

    slider.addEventListener('mouseleave', () => {
        isHovering = false;
        if (track.classList.contains('manual-scroll')) {
            autoScrollTimeout = setTimeout(() => {
                track.classList.remove('manual-scroll');
                track.style.transform = '';
                currentPosition = 0;
            }, 3000);
        } else {
            track.classList.remove('manual-scroll');
        }
    });
}
// Credit Popup Functions
function showCreditPopup() {
    document.getElementById('creditPopup').classList.add('show');
}

function closeCreditPopup(event) {
    event.stopPropagation();
    document.getElementById('creditPopup').classList.remove('show');
}





const themeButton = document.getElementById("themeToggle");

if (localStorage.getItem("website-theme") === "dark") {
    document.body.classList.add("dark-mode");
}

function updateThemeButton() {
    if (!themeButton) return;

    themeButton.textContent =
        document.body.classList.contains("dark-mode")
            ? "☀️"
            : "🌙";
}

updateThemeButton();

if (themeButton) {
    themeButton.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        localStorage.setItem(
            "website-theme",
            document.body.classList.contains("dark-mode")
                ? "dark"
                : "light"
        );

        updateThemeButton();
    });
}

/* =========================================================
   HOUSEHOLD LIVE IMPACT TREE
   ADDITION ONLY
========================================================= */

(function () {

    function getHouseholdValue(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return 0;
        }

        const value =
            parseFloat(element.value);

        if (isNaN(value)) {
            return 0;
        }

        return Math.max(0, value);
    }


    function updateHouseholdLiveTree() {

        /* =================================================
           ELECTRICITY
        ================================================= */

        const electricityUsage =
            getHouseholdValue("electricityUsage");

        const gridFactor =
            getHouseholdValue("gridFactor") || 0.82;

        const solarPanel =
            getHouseholdValue("solarPanel");

        const electricity =
            Math.max(
                0,
                electricityUsage - solarPanel
            ) *
            gridFactor *
            12;


        /* =================================================
           TRANSPORT
        ================================================= */

        const airTravel =
            getHouseholdValue("airTravel");

        const railTravel =
            getHouseholdValue("railTravel");

        const roadTravel =
            getHouseholdValue("roadTravel");

        const transport =
            (airTravel * 0.255) +
            (railTravel * 0.041) +
            (roadTravel * 0.171 * 12);


        /* =================================================
           DIET
        ================================================= */

        const people =
            getHouseholdValue("peopleCount");

        const dietElement =
            document.getElementById("dietType");

        const dietType =
            dietElement
                ? dietElement.value
                : "";

        let diet = 0;

        if (dietType === "veg") {

            diet = 1500 * people;

        } else if (dietType === "nonveg") {

            diet = 2500 * people;

        } else if (dietType === "vegan") {

            diet = 1200 * people;
        }


        /* =================================================
           FUEL
        ================================================= */

        const fuel =
            (getHouseholdValue("petrol") * 2.31 * 12) +
            (getHouseholdValue("diesel") * 2.68 * 12) +
            (getHouseholdValue("cng") * 2.75 * 12) +
            (getHouseholdValue("lpg") * 2.98 * 12) +
            (getHouseholdValue("coal") * 2.42 * 12) +
            (getHouseholdValue("coke") * 3.43 * 12);


        /* =================================================
           TOTAL
        ================================================= */

        const total =
            electricity +
            transport +
            diet +
            fuel;


        /* =================================================
           DISPLAY VALUES
        ================================================= */

        const co2 =
            document.getElementById(
                "householdLiveCO2"
            );

        const electricityDisplay =
            document.getElementById(
                "householdLiveElectricity"
            );

        const transportDisplay =
            document.getElementById(
                "householdLiveTransport"
            );

        const dietDisplay =
            document.getElementById(
                "householdLiveDiet"
            );

        const fuelDisplay =
            document.getElementById(
                "householdLiveFuel"
            );


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


        if (dietDisplay) {

            dietDisplay.textContent =
                diet.toFixed(2) +
                " kg";
        }


        if (fuelDisplay) {

            fuelDisplay.textContent =
                fuel.toFixed(2) +
                " kg";
        }


        /* =================================================
           TREE
        ================================================= */

        const box =
            document.querySelector(
                ".household-live-tree"
            );

        const tree =
            document.getElementById(
                "householdLiveTreeEmoji"
            );

        const condition =
            document.getElementById(
                "householdTreeCondition"
            );


        if (!box || !tree || !condition) {
            return;
        }


        box.classList.remove(
            "tree-healthy",
            "tree-moderate",
            "tree-warning",
            "tree-danger"
        );


        /* =================================================
           TREE HEALTH
        ================================================= */

        if (total === 0) {

            tree.textContent = "🌱";

            condition.textContent =
                "Start entering your household data";

            box.classList.add(
                "tree-healthy"
            );

        }

        else if (total < 5000) {

            tree.textContent = "🌳";

            condition.textContent =
                "🌿 Healthy environment";

            box.classList.add(
                "tree-healthy"
            );

        }

        else if (total < 12000) {

            tree.textContent = "🌲";

            condition.textContent =
                "🌿 Environment needs attention";

            box.classList.add(
                "tree-moderate"
            );

        }

        else if (total < 20000) {

            tree.textContent = "🍂";

            condition.textContent =
                "🍂 Tree is under stress";

            box.classList.add(
                "tree-warning"
            );

        }

        else {

            tree.textContent = "🥀";

            condition.textContent =
                "⚠️ High environmental impact";

            box.classList.add(
                "tree-danger"
            );
        }
    }


    /* =====================================================
       REAL-TIME UPDATES
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const inputs =
                document.querySelectorAll(
                    ".Ecalc input, .Ecalc select"
                );


            inputs.forEach(
                function (input) {

                    input.addEventListener(
                        "input",
                        updateHouseholdLiveTree
                    );

                    input.addEventListener(
                        "change",
                        updateHouseholdLiveTree
                    );
                }
            );


            updateHouseholdLiveTree();
        }
    );

})();