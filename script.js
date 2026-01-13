// Sentinel Extension Logic - HYBRID MODE (Optimized with Init Progress Bar)

// Show Init Progress Bar immediately
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const status = document.getElementById("status");

progressContainer.style.opacity = "1";
progressBar.style.width = "0%";

// Animate Init Progress (Fake loading for demo)
let width = 0;
const initInterval = setInterval(() => {
    width += 5;
    progressBar.style.width = width + "%";
    if (width >= 100) {
        clearInterval(initInterval);

        // Hide progress bar after init
        setTimeout(() => {
            progressContainer.style.opacity = "0";
            // Reset for action button
            progressBar.style.width = "0%";
        }, 300);
    }
}, 50); // 1.5s total duration approx

// 1. FAILSAFE: Start the Demo Timer IMMEDIATELY
setTimeout(() => {
    enableButton("⚡ MITIGATE RISK");
    console.log("Demo Mode Activated");
}, 1500);

// 2. OPTIMIZATION: Try to connect to Tableau for Real Data
try {
    tableau.extensions.initializeAsync().then(() => {
        console.log("Sentinel Connected to Tableau");

        let dashboard = tableau.extensions.dashboardContent.dashboard;
        dashboard.worksheets.forEach(worksheet => {
            worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, async (event) => {
                const marks = await event.worksheet.getSelectedMarksAsync();
                if (marks.data.length > 0 && marks.data[0].data.length > 0) {
                    const count = marks.data[0].data.length;
                    enableButton("⚡ MITIGATE " + count + " ORDER(S)");
                }
            });
        });
    }, (err) => {
        console.warn("Tableau API Initialization Error:", err);
    });
} catch (e) {
    console.warn("Tableau Library not found, running in pure Demo Mode.");
}

function enableButton(text) {
    const btn = document.getElementById("mitigate-btn");

    if (btn.innerText.indexOf("EXECUTING") === -1) {
        btn.classList.add("active");
        btn.innerHTML = text;
        status.innerText = "Risks Detected. Awaiting Action.";
    }
}

function triggerMitigation() {
    const btn = document.getElementById("mitigate-btn");

    // Processing State
    btn.innerHTML = "🔄 EXECUTING FLOW...";
    btn.style.background = "linear-gradient(45deg, #11998e, #38ef7d)";

    // Reuse Progress Bar for Action
    progressContainer.style.opacity = "1";
    progressBar.style.width = "0%";

    let actionWidth = 0;
    const actionInterval = setInterval(() => {
        actionWidth += 5;
        progressBar.style.width = actionWidth + "%";
        if (actionWidth >= 100) clearInterval(actionInterval);
    }, 100);

    setTimeout(() => {
        btn.innerHTML = "✅ RESOLVED";
        status.innerText = "Salesforce Flow Triggered: Inventory Re-routed.";

        setTimeout(() => {
            progressContainer.style.opacity = "0";
        }, 500);

        setTimeout(() => {
            btn.innerHTML = "⚡ MITIGATE RISK";
            btn.classList.add("active");
            btn.style.background = "";
            status.innerText = "System Scanned. Ready.";
            progressBar.style.width = "0%";
        }, 4000);

    }, 2000);
}
