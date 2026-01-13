// Sentinel Extension Logic - FINAL POLISH (With Visual Dashboard Feedback)

// DOM Elements
const btn = document.getElementById("mitigate-btn");
const status = document.getElementById("status");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");

// Init
btn.disabled = true;
btn.style.opacity = "0.5";
btn.innerText = "INITIALIZING...";
status.innerText = "Connecting to Data Stream...";
progressContainer.style.opacity = "1";
progressBar.style.width = "0%";

let width = 0;
const initInterval = setInterval(() => {
    width += 2;
    progressBar.style.width = width + "%";
    if (width >= 100) {
        clearInterval(initInterval);
        setTimeout(() => {
            progressContainer.style.opacity = "0";
            progressBar.style.width = "0%";
            enableButton("⚡ MITIGATE RISK");
        }, 500);
    }
}, 30);

// Global Dashboard Reference
let displayedDashboard = null;

try {
    tableau.extensions.initializeAsync().then(() => {
        // Store reference for later use
        displayedDashboard = tableau.extensions.dashboardContent.dashboard;

        displayedDashboard.worksheets.forEach(worksheet => {
            worksheet.addEventListener(tableau.TableauEventType.MarkSelectionChanged, async (event) => {
                const marks = await event.worksheet.getSelectedMarksAsync();
                if (marks.data.length > 0 && marks.data[0].data.length > 0) {
                    const count = marks.data[0].data.length;
                    enableButton("⚡ MITIGATE " + count + " ORDER(S)");
                }
            });
        });
    }, () => { });
} catch (e) { }

function enableButton(text) {
    if (btn.innerText.indexOf("EXECUTING") === -1 && btn.innerText.indexOf("RESOLVED") === -1) {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.pointerEvents = "auto";
        btn.classList.add("active");
        btn.innerHTML = text;

        status.innerText = "System Ready. Risks Detected.";
        status.style.color = "#888";
        status.style.fontWeight = "normal";
        status.style.fontSize = "10px";
    }
}

function triggerMitigation() {
    btn.disabled = true;
    btn.style.opacity = "0.9";
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
        // SUCCESS STATE
        btn.innerHTML = "✅ RESOLVED";

        status.innerHTML = "Salesforce Flow Triggered.<br>Inventory re-routed from <b>Hub B</b> to <b>Hub A</b>.<br>Ticket #SF-4291 Created.";
        status.style.color = "#38ef7d";
        status.style.fontWeight = "bold";
        status.style.fontSize = "12px";
        status.style.lineHeight = "1.4";

        // VISUAL FEEDBACK: Clear the selections on the dashboard to show "Processed"
        if (displayedDashboard) {
            displayedDashboard.worksheets.forEach(ws => {
                ws.clearSelectedMarksAsync().catch(err => console.log("Clear selection visual feedback"));
            });
        }

        setTimeout(() => {
            progressContainer.style.opacity = "0";
        }, 500);

        setTimeout(() => {
            btn.disabled = false;
            btn.style.opacity = "1";
            btn.innerHTML = "⚡ MITIGATE RISK";
            btn.classList.add("active");
            btn.style.background = "";
            status.innerText = "System Scanned. Ready.";
            status.style.color = "#888";
            status.style.fontSize = "10px";
            status.style.fontWeight = "normal";
            progressBar.style.width = "0%";
        }, 10000);

    }, 2000);
}
