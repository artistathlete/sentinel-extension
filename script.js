// Sentinel Extension Logic - HYBRID MODE (Optimized)

// 1. FAILSAFE: Start the Demo Timer IMMEDIATELY
// This guarantees the button appears even if Tableau API hangs.
setTimeout(() => {
    enableButton("⚡ MITIGATE RISK");
    console.log("Demo Mode Activated");
}, 1500);

// 2. OPTIMIZATION: Try to connect to Tableau for Real Data
// If this succeeds, it will overwrite the "Demo" text with real "Item Counts"
try {
    tableau.extensions.initializeAsync().then(() => {
        console.log("Sentinel Connected to Tableau");

        let dashboard = tableau.extensions.dashboardContent.dashboard;
        dashboard.worksheets.forEach(worksheet => {
            worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, async (event) => {
                const marks = await event.worksheet.getSelectedMarksAsync();
                if (marks.data.length > 0 && marks.data[0].data.length > 0) {
                    // Real selection found! Update button with specific count
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

// Helper Function
function enableButton(text) {
    const btn = document.getElementById("mitigate-btn");
    const status = document.getElementById("status");

    // Only update if not already clicking
    if (btn.innerText.indexOf("EXECUTING") === -1) {
        btn.classList.add("active");
        btn.innerHTML = text;
        status.innerText = "Risks Detected. Awaiting Action.";
    }
}

// Action Logic
function triggerMitigation() {
    const btn = document.getElementById("mitigate-btn");
    const status = document.getElementById("status");

    // Processing State
    btn.innerHTML = "🔄 EXECUTING FLOW...";
    btn.style.background = "linear-gradient(45deg, #11998e, #38ef7d)"; // Green gradient

    // Simulate API Call delay
    setTimeout(() => {
        btn.innerHTML = "✅ RESOLVED";
        status.innerText = "Salesforce Flow Triggered: Inventory Re-routed.";

        // Reset after 4 seconds
        setTimeout(() => {
            btn.innerHTML = "⚡ MITIGATE RISK";
            btn.classList.add("active"); // Keep active for convenience
            btn.style.background = ""; // Reset color
            status.innerText = "System Scanned. Ready.";
        }, 4000);

    }, 2000);
}
