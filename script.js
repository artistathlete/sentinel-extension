// Sentinel Extension Logic - HYBRID MODE (Optimized with Blocking Init)

// DOM Elements
const btn = document.getElementById("mitigate-btn");
const status = document.getElementById("status");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");

// Block Button Initially
btn.disabled = true;
btn.style.opacity = "0.5";
btn.innerText = "INITIALIZING...";
status.innerText = "Connecting to Data Stream...";

// Show Init Progress
progressContainer.style.opacity = "1";
progressBar.style.width = "0%";

// Animate Initialization (Fake 2s Load)
let width = 0;
const initInterval = setInterval(() => {
    width += 2; // Slower increment
    progressBar.style.width = width + "%";

    if (width >= 100) {
        clearInterval(initInterval);

        // Init Complete!
        setTimeout(() => {
            progressContainer.style.opacity = "0";
            progressBar.style.width = "0%";
            enableButton("⚡ MITIGATE RISK");
            console.log("System Ready");
        }, 500);
    }
}, 30); // 1.5s total

// TABLEAU LOGIC (Background)
try {
    tableau.extensions.initializeAsync().then(() => {
        // Just register listeners, don't mess with the UI yet to avoid conflicting with the Init Animation
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
    }, (err) => console.warn(err));
} catch (e) { }

function enableButton(text) {
    // Only unblock if we aren't already executing
    if (btn.innerText.indexOf("EXECUTING") === -1) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
        btn.classList.add("active");
        btn.innerHTML = text;
        status.innerText = "System Ready. Risks Detected.";
        status.style.color = "#888";
    }
}

function triggerMitigation() {
    // Disable during action
    btn.disabled = true;
    btn.style.opacity = "0.8";

    btn.innerHTML = "🔄 EXECUTING FLOW...";
    btn.style.background = "linear-gradient(45deg, #11998e, #38ef7d)";

    progressContainer.style.opacity = "1";
    let actionWidth = 0;
    const actionInterval = setInterval(() => {
        actionWidth += 5;
        progressBar.style.width = actionWidth + "%";
        if (actionWidth >= 100) clearInterval(actionInterval);
    }, 100);

    setTimeout(() => {
        btn.innerHTML = "✅ RESOLVED";
        status.innerHTML = "Salesforce Flow Triggered.<br>Inventory re-routed from <b>Hub B</b> to <b>Hub A</b>.<br>Ticket #SF-4291 Created.";
        status.style.color = "#38ef7d";

        setTimeout(() => {
            progressContainer.style.opacity = "0";
        }, 500);

        setTimeout(() => {
            // Reset to ready state
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.innerHTML = "⚡ MITIGATE RISK";
            btn.classList.add("active");
            btn.style.background = "";
            status.innerText = "System Scanned. Ready.";
            status.style.color = "#888";
            progressBar.style.width = "0%";
        }, 6000);

    }, 2000);
}
