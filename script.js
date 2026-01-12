tableau.extensions.initializeAsync().then(() => {
    console.log("Sentinel Loaded");
    let dashboard = tableau.extensions.dashboardContent.dashboard;
    dashboard.addEventListener(tableau.TableauEventType.MarkSelectionChanged, onSelectionChanged);
});

async function onSelectionChanged(event) {
    const marks = await event.worksheet.getSelectedMarksAsync();
    const btn = document.getElementById("mitigate-btn");
    const status = document.getElementById("status");
    if (marks.data[0].data.length > 0) {
        btn.classList.add("active");
        btn.innerHTML = "⚡ MITIGATE " + marks.data[0].data.length + " ITEM(S)";
        status.innerText = "Risk Detected. Awaiting Action.";
    } else {
        btn.classList.remove("active");
        btn.innerHTML = "⚡ MITIGATE RISK";
        status.innerText = "Scanning Dashboard...";
    }
}

function triggerMitigation() {
    const btn = document.getElementById("mitigate-btn");
    const status = document.getElementById("status");
    btn.innerHTML = "🔄 EXECUTING...";
    btn.style.background = "linear-gradient(45deg, #11998e, #38ef7d)";
    setTimeout(() => {
        btn.innerHTML = "✅ RESOLVED";
        status.innerText = "Salesforce Flow Triggered.";
        setTimeout(() => {
            btn.innerHtml = "⚡ MITIGATE RISK";
            btn.classList.remove("active");
            btn.style.background = "";
            status.innerText = "Scanning Dashboard...";
        }, 3000);
    }, 1500);
}
