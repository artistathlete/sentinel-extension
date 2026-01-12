// Sentinel Extension Logic

// 1. Initialize Tableau Extensions API
tableau.extensions.initializeAsync().then(() => {
    console.log("Sentinel Guardian Loaded");

    // 2. Add Event Listener to ALL Worksheets
    const dashboard = tableau.extensions.dashboardContent.dashboard;

    // We must attach the listener to *each* worksheet, not the dashboard itself
    dashboard.worksheets.forEach(function (worksheet) {
        worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, onSelectionChanged);
    });
});

async function onSelectionChanged(event) {
    // getSelectedMarksAsync() returns the marks for the worksheet where the event happened
    const marks = await event.worksheet.getSelectedMarksAsync();

    const btn = document.getElementById("mitigate-btn");
    const status = document.getElementById("status");

    // Check if any marks are selected
    if (marks.data.length > 0 && marks.data[0].data.length > 0) {
        // Data selected!
        btn.classList.add("active");

        // Dynamic Text
        const count = marks.data[0].data.length;
        btn.innerHTML = "⚡ MITIGATE " + count + " ITEM(S)";
        status.innerText = "Risk Detected. Awaiting Action.";
    } else {
        // Deselected
        btn.classList.remove("active");
        btn.innerHTML = "⚡ MITIGATE RISK";
        status.innerText = "Scanning Dashboard...";
    }
}

function triggerMitigation() {
    const btn = document.getElementById("mitigate-btn");
    const status = document.getElementById("status");

    // Processing State
    btn.innerHTML = "🔄 EXECUTING...";
    btn.style.background = "linear-gradient(45deg, #11998e, #38ef7d)"; // Green gradient

    // Simulate API Call
    setTimeout(() => {
        btn.innerHTML = "✅ RESOLVED";
        status.innerText = "Salesforce Flow Triggered: Inventory Re-routed.";

        // Reset after 3 seconds
        setTimeout(() => {
            btn.innerHTML = "⚡ MITIGATE RISK";
            btn.classList.remove("active");
            btn.style.background = ""; // Reset color
            status.innerText = "Scanning Dashboard...";
        }, 3000);

    }, 1500);
}

// FAILSAFE: Click the "Scanning..." text to force-enable the button (for Demo reliability)
document.getElementById("status").addEventListener("click", function () {
    const btn = document.getElementById("mitigate-btn");
    btn.classList.add("active");
    btn.innerHTML = "⚡ MITIGATE RISK (DEMO)";
});
