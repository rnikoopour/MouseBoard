'use strict';

const robot = require('robotjs');
const express = require('express');

const app = express();
const expressWs = require('express-ws')(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

app.ws('/', (ws, req) => {
    console.log('connected');
    ws.on('message', (msgString) => {
	const {msg, args} = JSON.parse(msgString);
	switch (msg) {
	case 'moveMouse':
	    moveMouse(args);
	    break;
	case 'click':
	    click(args);
	    break;
	case 'keyboard':
	    try {
		keyboard(args);
	    } catch (e) {
		console.log(args);
	    }
	    break;
	}
    });
});

const port = 9000;
const listenOn = '0.0.0.0';

app.listen(port, listenOn, () => {
    console.log(`listening on ${listenOn}:${port}`);
});

function keyboard({key, modifierKeys}) {
    robot.keyTap(key);
    // Doing this cuz it gets stuck on cmd + tab
}

function click({btn, dblClick}) {
    robot.mouseClick(btn, dblClick);
}

function normalizeMouse(val) {
    return val > 0 ? val : 1;
}

function moveMouse({x, y}) {
    const mouse = robot.getMousePos();
    const xPos = normalizeMouse(mouse.x + x)
    const yPos = normalizeMouse(mouse.y + y);
    robot.moveMouseSmooth(xPos, yPos);
}

