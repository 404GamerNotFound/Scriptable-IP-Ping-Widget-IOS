const ip = args.widgetParameter || "http-statuscode.com"; // ADD IP OR DOMAIN as Widget Parameter
const url = `http://${ip}`;
const fileManager = FileManager.local();
const historyFilePath = fileManager.joinPath(fileManager.documentsDirectory(), 'ping_history.json');

// Save Ping Data
async function savePingData(pingData) {
    let historyData = [];
    if (fileManager.fileExists(historyFilePath)) {
        const rawHistoryData = fileManager.readString(historyFilePath);
        historyData = JSON.parse(rawHistoryData);
    }
    historyData.push(pingData);
    // Delete old data
    if (historyData.length > 42) {
        historyData = historyData.slice(-42);
    }
    fileManager.writeString(historyFilePath, JSON.stringify(historyData));
}

// read old hostory entry
function readPingHistory() {
    if (fileManager.fileExists(historyFilePath)) {
        const rawHistoryData = fileManager.readString(historyFilePath);
        return JSON.parse(rawHistoryData);
    } else {
        return [];
    }
}

function addHistoryEntry(column, data) {
    const pingColor = data.ping > 500 ? Color.red() : (data.ping > 200 ? Color.yellow() : Color.green());
    const formattedDate = new Date(data.timestamp).toLocaleString(); // Date in local format
    
    let historyText = column.addText(`${data.ping} (${formattedDate})`);
    historyText.textColor = pingColor;
    historyText.font = Font.systemFont(10);
}




async function pingServer() {
    const start = new Date().getTime();
    let statusCode = null;
    let dataSize = null;
    const req = new Request(url);
    try {
        const responseText = await req.loadString();
        const end = new Date().getTime();
        statusCode = req.response.statusCode; // HTTP-Statuscode
        dataSize = responseText.length; // Size of the response
        return { ping: end - start, statusCode, dataSize };
    } catch (e) {
        console.log(e);
        return { ping: "Error", statusCode: "Error", dataSize: "Error" };
    }
}

function formatTime(date) {
    let ampm = "AM";
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    
    if (hours === 0) {
        hours = 12;
    } else if (hours > 12) {
        hours = hours - 12;
        ampm = "PM";
    }
    
    return `${hours}:${minutes}:${seconds} ${ampm}`;
}

async function createWidget(result, size = "small") {
    let widget = new ListWidget();
    widget.backgroundColor = new Color("#1A1A1A");
    
    if (size === "medium") {
        let mainStack = widget.addStack();
        mainStack.layoutHorizontally();
        
        // Left side - Large Ping
        // Ping Stack with centered content
        let pingStack = mainStack.addStack();
        pingStack.layoutVertically();
        pingStack.centerAlignContent();  // center
        pingStack.size = new Size(150, 0); // Set a fixed width for the pingStack
        
        // Ping Value
        let pingValue = pingStack.addText(`${result.ping}`);
        pingValue.textColor = Color.green();
        pingValue.font = Font.boldSystemFont(60);
        pingValue.textOpacity = 1.0;
        
        // Ping Unit
        let pingUnit = pingStack.addText(`ms`);
        pingUnit.textColor = Color.green();
        pingUnit.font = Font.systemFont(16);
        pingUnit.textOpacity = 0.8;
        
        mainStack.addSpacer();
        
        // Right side - Detail
        let detailsStack = mainStack.addStack();
        detailsStack.layoutVertically();
        detailsStack.spacing = 4;
        detailsStack.size = new Size(150, 0); // Set a fixed width for the detailsStack
        
        let title = detailsStack.addText("Server Ping");
        title.textColor = Color.white();
        title.font = Font.boldSystemFont(20);
        
        widget.addSpacer(9);
        
        
        let pingTextIp = detailsStack.addText(`${url}`);
        pingTextIp.textColor = Color.white();
        pingTextIp.font = Font.systemFont(8);
        
        let statusText = detailsStack.addText(`Status: ${result.statusCode}`);
        statusText.textColor = Color.white();
        statusText.font = Font.systemFont(12);
        
        let sizeText = detailsStack.addText(`Size: ${result.dataSize} Zeichen`);
        sizeText.textColor = Color.white();
        sizeText.font = Font.systemFont(12);
        
        const updateTime = new Date();
        let updateText = detailsStack.addText(`Updated: ${formatTime(updateTime)}`);
        updateText.textColor = Color.gray();
        updateText.font = Font.systemFont(12);
    } else if (size === "large") {
        let mainStack = widget.addStack();
        mainStack.layoutHorizontally();
        
        // Left side - Large Ping
        // Ping Stack with centered content
        let pingStack = mainStack.addStack();
        pingStack.layoutVertically();
        pingStack.centerAlignContent();
        pingStack.size = new Size(150, 0); // Set a fixed width for the pingStack
        
        // Ping Value
        let pingValue = pingStack.addText(`${result.ping}`);
        pingValue.textColor = Color.green();
        pingValue.font = Font.boldSystemFont(60);
        pingValue.textOpacity = 1.0;
        
        // Ping Unit
        let pingUnit = pingStack.addText(`ms`);
        pingUnit.textColor = Color.green();
        pingUnit.font = Font.systemFont(16);
        pingUnit.textOpacity = 0.8;
        
        mainStack.addSpacer();
        
        // Right side - Detail
        let detailsStack = mainStack.addStack();
        detailsStack.layoutVertically();
        detailsStack.spacing = 4;
        detailsStack.size = new Size(150, 0); // Set a fixed width for the detailsStack
        
        let title = detailsStack.addText("Server Ping");
        title.textColor = Color.white();
        title.font = Font.boldSystemFont(20);
        
        widget.addSpacer(9);
        
        
        let pingTextIp = detailsStack.addText(`${url}`);
        pingTextIp.textColor = Color.white();
        pingTextIp.font = Font.systemFont(8);
        
        let statusText = detailsStack.addText(`Status: ${result.statusCode}`);
        statusText.textColor = Color.white();
        statusText.font = Font.systemFont(12);
        
        let sizeText = detailsStack.addText(`Size: ${result.dataSize} Zeichen`);
        sizeText.textColor = Color.white();
        sizeText.font = Font.systemFont(12);
        
        const updateTime = new Date();
        let updateText = detailsStack.addText(`Updated: ${formatTime(updateTime)}`);
        updateText.textColor = Color.gray();
        updateText.font = Font.systemFont(12);
        
        // Trennlinie oder Spacer
        widget.addSpacer();
        
        // Historie-Stack
        let historyStack = widget.addStack();
        historyStack.layoutHorizontally();
        
        // Berechnen der Breite für jede Spalte
        let columnWidth = 150; // Beispielbreite, passen Sie sie nach Bedarf an
        
        let leftColumn = historyStack.addStack();
        leftColumn.layoutVertically();
        leftColumn.size = new Size(columnWidth, 0);
        
        historyStack.addSpacer(); // Fügt einen Spacer zwischen den Spalten hinzu
        
        let rightColumn = historyStack.addStack();
        rightColumn.layoutVertically();
        rightColumn.size = new Size(columnWidth, 0);
        
        
        // Verteilung der Historiendaten auf die Spalten
        const historyData = readPingHistory();
        const halfLength = Math.ceil(historyData.length / 2);
        
        for (let i = 0; i < halfLength; i++) {
            addHistoryEntry(leftColumn, historyData[i]);
        }
        
        for (let i = halfLength; i < historyData.length; i++) {
            addHistoryEntry(rightColumn, historyData[i]);
        }
        
    } else {
        // Title
        let title = widget.addText("Server Ping");
        title.textColor = Color.white();
        title.font = Font.boldSystemFont(16);
        
        widget.addSpacer(5);
        
        // URL
        let pingTextIp = widget.addText(`${url}`);
        pingTextIp.textColor = Color.white();
        pingTextIp.font = Font.systemFont(8);
        
        widget.addSpacer(5);
        
        // Ping
        let pingText = widget.addText(`${result.ping} ms`);
        pingText.textColor = Color.green();
        pingText.font = Font.systemFont(32);
        
        widget.addSpacer(5);
        
        // Status and Size
        let statusText = widget.addText(`Status: ${result.statusCode} \nSize: ${result.dataSize} Zeichen`);
        statusText.textColor = Color.white();
        statusText.font = Font.systemFont(12);
        
        widget.addSpacer(5);
        
        // Updated Time
        const updateTime = new Date();
        let updateText = widget.addText(`Updated: ${formatTime(updateTime)}`);
        updateText.textColor = Color.gray();
        updateText.font = Font.systemFont(12);
        
    }
    
    return widget;
}

async function main() {
    const result = await pingServer();
    await savePingData({ ping: result.ping, timestamp: new Date().toISOString() }); // Speichern mit Zeitstempel
    
    let widget;
    if (config.widgetFamily === "medium") {
        widget = await createWidget(result, "medium");
    } else if (config.widgetFamily === "large") {
        widget = await createWidget(result, "large");
    } else {
        widget = await createWidget(result, "small");
    }
    
    if (config.runsInWidget) {
        Script.setWidget(widget);
    } else {
        config.widgetFamily === "medium" ? widget.presentMedium() : widget.presentSmall();
    }
    Script.complete();
}

main();
