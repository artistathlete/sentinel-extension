// Sentinel Extension Logic - DEMO MODE (ALWAYS READY)

tableau.extensions.initializeAsync().then(() => {
    console.log("Sentinel Guardian Loaded");

    // FORCE ENABLE after 1.5 seconds (Bypassing selection check for Demo)
    const btn = document.getElementById("mitigate-btn");
    const status = document.getElementById("status");

    setTimeout(() => {
        btn.classList.add("active");
        btn.innerHTML = "⚡ MITIGATE DETECTED RISKS";
        status.innerText = "Risks Detected. Ready for Mitigation.";
    }, 1500);

    // Keep listener just in case they do select something
    let dashboard = tableau.extensions.dashboardContent.dashboard;
    dashboard.worksheets.forEach(function (worksheet) {
        worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, (event) => {
            // Optional: Update count if they actually select something
            event.worksheet.getSelectedMarksAsync().then((marks) => {
                if (marks.data.length > 0 && marks.data[0].data.length > 0) {
                    btn.innerHTML = "⚡ MITIGATE " + marks.data[0].data.length + " ITEM(S)";
                }
            });
        });
    });
});

function triggerMitigation() {
    const btn = document.getElementById("mitigate-btn");
    const status = document.getElementById("status");

    // Processing State
    btn.innerHTML = "🔄 EXECUTING FLOW...";
    btn.style.background = "linear-gradient(45deg, #11998e, #38ef7d)"; // Green gradient

    // Simulate API Call
    setTimeout(() => {
        btn.innerHTML = "✅ RESOLVED";
        status.innerText = "Salesforce Flow Triggered: Inventory Re-routed.";

        // Reset after 4 seconds
        setTimeout(() => {
            btn.innerHTML = "⚡ MITIGATE DETECTED RISKS";
            btn.classList.add("active"); // Stay active for demo
            btn.style.background = ""; // Reset color
            status.innerText = "Risks Detected. Ready for Mitigation.";
        }, 4000);

    }, 2000);
}
