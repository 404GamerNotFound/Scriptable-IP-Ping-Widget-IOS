const ip = args.widgetParameter || "http-statuscode.com"; // ADD IP OR DOMAIN as Widget Parameter
const url = `http://${ip}`;

async function pingServer() {
    const start = new Date().getTime();
    let statusCode = null;
    let dataSize = null;
    const req = new Request(url);
    try {
        const responseText = await req.loadString();
        const end = new Date().getTime();
        statusCode = req.response.statusCode; // HTTP-Statuscode
        dataSize = responseText.length; // Länge des Antworttextes
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

    // Right side - Details
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
    let widget;
    if (config.widgetFamily === "medium") {
        widget = await createWidget(result, "medium");
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
