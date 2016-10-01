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

const modifierKeys = {
    Meta: {
	key: 'command',
	pressed: false
    },
    Alt: {
	key: 'alt',
	pressed: false
    },
    Shift: {
	key: 'shift',
	pressed: false
    },
    Control: {
	key: 'control'
	pressed: false
    }
}

const keyTransformer = {
    Backspace: 'backspace',
    Tab: 'tab'
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowRight: 'right',
    ArrowLeft: 'left',
    Enter: 'enter',
    F1: 'f1',
    F2: 'f2',
    F3: 'f3',
    F4: 'f4',
    F5: 'f5',
    F6: 'f6',
    F7: 'f7',
    F8: 'f8',
    F9: 'f9',
    F10: 'f10',
    F11: 'f11',
    F12: 'f12'
};

function keyboard({key, modifierKeys}) {
    if (modifierKeys[key]) {
	modifierKeys[key].pressed = !modifierKeys[key].pressed;
    } else {
	const transformedKey = keyTransformer[key] || key;
	let modifiers = [];
	for (let key in modifierKeys) {
	    if (modifierKeys[key].pressed) modifiers.push(modifierKeys[key].key);
	}
	robot.keyTap(tranformedKey, modifiers);
    }
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

