////////////////////////////////////////////
//        Prop 3 by DexieTheSheep         //
//  https://github.com/Lamby777/Prop3rty  //
////////////////////////////////////////////

// Constants

// Initialize Variables
let lastFramecount, fps,
	cx, cy, sx, sy, // Canvas w/h and stretching
	props = [],
	level = {
		ground: 20/100, // ground percentage of screen
		friction: 0.8,
		airFriction: 0.05,
		accel: 1.9,
		gravity: 0.1,
		maxfall: 10,
	};

// Canvas
let canvas = document.getElementById("prop-canvas");
const c = canvas.getContext("2d");

// On page load, plus every time the page is resized
window.onload = window.onresize = function() {
	// Set canvas to cover full page
	canvas.width  = cx = window.innerWidth,
	canvas.height = cy = window.innerHeight,
	// Set canvas stretching Higher sx or sy (1920/1366 > 1)
	// means your screen is bigger than default
	sx = cx/DEFAULT_RESOLUTION[0],
	sy = cy/DEFAULT_RESOLUTION[1];
}

let fpsdraw = 0;
function update() {
	c.clearRect(0,0,cx,cy);
	redrawProps();
	if (SHOW_FPS) {
		fpsdraw--;
		if (fpsdraw <= 0) {
			fps = redrawFramecount();
			fpsdraw = FRAMECOUNT_INTERVAL-1;
		}
		c.strokeStyle = "white";
		c.fillStyle = "black";
		c.strokeSize = 4;
		c.strokeText(fps.toString(), 0.8*cx, 0.8*cy);
		c.stroke();
	}
}

function redrawProps() {
	for (prop of props) {
		prop.update();
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

import("/js/test.js").then(() => {

	// Start updating screen
	setInterval(update, FRAMETIME);
});
