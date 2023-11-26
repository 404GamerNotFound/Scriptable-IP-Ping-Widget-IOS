const ip = "localhost"; // ADD IP OR DOMAIN
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
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

async function createWidget(result) {
    let widget = new ListWidget();
    widget.backgroundColor = new Color("#1A1A1A");

    let title = widget.addText("Server Ping");
    title.textColor = Color.white();
    title.font = Font.boldSystemFont(16);

    let pingTextIp = widget.addText(`${url}`);
    pingTextIp.textColor = Color.white();
    pingTextIp.font = Font.systemFont(8);

    widget.addSpacer(5);

    let pingText = widget.addText(`${result.ping} ms`);
    pingText.textColor = Color.green();
    pingText.font = Font.systemFont(32);

    widget.addSpacer(5);

    let statusText = widget.addText(`Status: ${result.statusCode} \nSize: ${result.dataSize} Zeichen`);
    statusText.textColor = Color.white();
    statusText.font = Font.systemFont(12);

    widget.addSpacer(5);

    const updateTime = new Date();
    let updateText = widget.addText(`Updated: ${formatTime(updateTime)}`);
    updateText.textColor = Color.gray();
    updateText.font = Font.systemFont(12);

    return widget;
}

async function main() {
    const result = await pingServer();
    const widget = await createWidget(result);
    if (config.runsInWidget) {
        Script.setWidget(widget);
    } else {
        widget.presentSmall();
    }
    Script.complete();
}

main();
