// Sentinel Extension Logic - HYBRID MODE (Optimized with Init Progress Bar)

// ... Init Progress Bar Logic (Same as before) ...
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const status = document.getElementById("status");

progressContainer.style.opacity = "1";
progressBar.style.width = "0%";

let width = 0;
const initInterval = setInterval(() => {
    width += 5;
    progressBar.style.width = width + "%";
    if (width >= 100) {
        clearInterval(initInterval);
        setTimeout(() => {
            progressContainer.style.opacity = "0";
            progressBar.style.width = "0%";
        }, 300);
    }
}, 50);

setTimeout(() => {
    enableButton("⚡ MITIGATE RISK");
    console.log("Demo Mode Activated");
}, 1500);

try {
    tableau.extensions.initializeAsync().then(() => {
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
    }, (err) => { console.warn(err); });
} catch (e) { console.warn(e); }

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
        // DETAILED FEEDBACK for the user
        status.innerHTML = "Salesforce Flow Triggered.<br>Inventory re-routed from <b>Hub B</b> to <b>Hub A</b>.<br>Ticket #SF-4291 Created.";
        status.style.color = "#38ef7d"; // Green text

        setTimeout(() => {
            progressContainer.style.opacity = "0";
        }, 500);

        setTimeout(() => {
            btn.innerHTML = "⚡ MITIGATE RISK";
            btn.classList.add("active");
            btn.style.background = "";
            status.innerHTML = "System Scanned. Ready."; // Reset text
            status.style.color = "#888"; // Reset color
            progressBar.style.width = "0%";
        }, 6000); // Longer wait time to read the message

    }, 2000);
}
