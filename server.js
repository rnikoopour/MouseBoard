'use strict';

const robot = require('robotjs');
const ws = require('websocket');
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app);


const events = require('events');


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

app.ws('/', (ws, req) => {
    console.log('connected');
});

app.listen(9000);



//eventEmitter.on('mouseMove', moveMouse);
//eventEmitter.on('click', click);
//eventEmitter.on('type', type);

function type(key, modifiers) {
    if (!modifiers) modifiers = [];
    else if(!Array.isArray(modifiers)) modifiers = [modifiers];
    robot.keyTap(key, modifiers);
    // Doing this cuz it gets stuck on cmd + tab
    modifiers.forEach((modifier) => {
	robot.keyTap(modifier);
    });
}

function click(btn, dblClick) {
    if (dblClick) robot.mouseClick(btn, true);
    else robot.mouseClick(btn, false);
}

function normalizeMouse(val) {
    return val > 0 ? val : 1;
}

function moveMouse(x, y) {
    const mouse = robot.getMousePos();
    const xPos = normalizeMouse(mouse.x + x)
    const yPos = normalizeMouse(mouse.y + y);
    robot.moveMouseSmooth(xPos, yPos);
}

function test() {
//    eventEmitter.emit('click', 'left');
    //eventEmitter.emit('type', 'f');
}

test();

