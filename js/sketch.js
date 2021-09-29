"use strict";

////////////////////////////////////////////
//        Prop 3 by DexieTheSheep         //
//  https://github.com/Lamby777/Prop3rty  //
////////////////////////////////////////////

// Constants

// Initialize Variables

var lastFramecount, fps,
	cx, cy, sx, sy, // Canvas w/h and stretching
	props = [],
	level = {
		ground: 20/100, // ground percentage of screen
		friction: 0.8,
		airFriction: 0.05,
		accel: 1.9,
		gravity: 0.1,
	};

// Canvas
let canvas = document.getElementById("prop-canvas");
const c = canvas.getContext("2d");

// On page load, plus every time the page is resized
window.onload = window.onresize = function() {
	// Set canvas to cover full page
	canvas.width  = cx = window.innerWidth,
	canvas.height = cy = window.innerHeight,
	// Set canvas stretch ratios
	//(sx > 1) means your screen is wider than native
	sx = cx/DEFAULT_RESOLUTION[0],
	sy = cy/DEFAULT_RESOLUTION[1];
}

let fpsdraw = 0;
function update() {
	c.clearRect(0,0,cx,cy);
	redrawProps();

	// Redraw FPS counter
	if (SHOW_FPS) {
		fpsdraw--;
		if (fpsdraw <= 0) {
			fps = redrawFramecount();
			fpsdraw = FRAMECOUNT_INTERVAL-1;
		}
		c.strokeStyle = "white";
		c.fillStyle = "black";
		c.lineWidth = 1;
		c.strokeText(
			fps.toString(),
		0.8*cx, 0.8*cy);
	}
}

function redrawProps() {
	for (let prop of props) {
		prop.prepareUpdate?.();
	} for (let prop of props) {
		prop.update?.();
	}
}

function redrawFramecount() {
	if (lastFramecount === undefined) {
		lastFramecount = performance.now();
		return 0;
	}
	let pnow = performance.now();
	let delta = (pnow - lastFramecount)/(FRAMECOUNT_INTERVAL * 1000);
	lastFramecount = pnow;
	return Math.round(1/delta);
}

function getPropsByType(type) {
	return props.filter((x)=>{return x?.type.includes?.(type)});
}

// Like "getElementById" for props.
// Duplicate names on props is discouraged, use "type" for that.
function getPropsByName(name) {
	return props.filter((x)=>{return x?.name === name});
}



// Pass Keyboard Input to Game

var currentKeys = [];

var beforeKeyActions = {}, // Before physics
	controlKeyActions = {}, // After vel modification, before vel application
	afterKeyActions = {}, // Before update (After physics)
	upKeyActions = {}, // On key released
	downKeyActions = {}; // On key pressed (Fire once)

document.addEventListener("keydown", (e)=>{
	let key = e.code;
	if (currentKeys.includes(key)) return;
	else {
		currentKeys.push(key);
		if (downKeyActions[key]) {
			downKeyActions[key].forEach((f)=>{f()});
		}
	}
});

document.addEventListener("keyup", (e)=>{
	let key = e.code;
	currentKeys = currentKeys.filter((val) => val !== key);
	if (upKeyActions[key]) {
		upKeyActions[key].forEach((f)=>{f()});
	}
});

// Type is the type of key input ("up" "down" or a while)
// Action is the function to run
function bindKey(key, type, action) {
	if (["before", "after", "control", "down", "up"].includes(type)) {
		let currentActionArray = window[type + "KeyActions"];
		if (!currentActionArray[key]?.length) currentActionArray[key] = [];
		currentActionArray[key].push(action);
		//return currentActionArray[key].length-1;
	} else throw TypeError(
		'Prop3 bindKey argument #2 requires "before," "after," "control," "down," or "up."');
}

import("/js/test.js").then(() => {
	// Start updating screen
	setInterval(update, FRAMETIME);
});

function sortProps(by) {
	if (by instanceof Function) props.sort(by);
	else {
		if (by === "") {}
		// 
		else props.sort((a,b) => a.drawLayer - b.drawLayer);
	}
}
