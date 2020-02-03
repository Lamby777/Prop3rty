///////////////////////////////////////////
//        Prop 3 by DexieTheSheep        //
//   https://github.com/Lamby777/Prop    //
///////////////////////////////////////////

// Constants
const DEV = true, // Shows stats 4 nerds
	SHOW_FPS = true,
	MAX_FPS = 60,
	FRAMETIME = Math.floor(1000/MAX_FPS),
	FRAMECOUNT_INTERVAL = 5 // Frames to wait to draw count
	DEFAULT_RESOLUTION = [1366, 768]; // Cbook

// Initialize Variables
let lastFramecount, fps,
	cx, cy, sx, sy, // Canvas w/h and stretching
	props = [],
	level = {
		ground: 20/100, // ground percentage of screen
		friction: 0.8,
		accel: 1.9,
		gravity: 1,
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

class BasicProp {
	constructor(x=0, y=0, w=16, h=16) {
		this.x = x, this.y = y,
		this.w = w, this.h = h,
		this.img = null,
		this.sheet = null,
		this.col = "white",
		this.stretch = true;
		this.border = {
			active: false,
			size: 4,
			col: "red",
		};
	}

	touching(rect) {
		return !(rect.x > (this.x + this.w) ||
				(rect.x + rect.w) < this.x ||
				rect.y > (this.y + this.h) ||
				(rect.y + rect.h) < this.y);
	}

	image(src) {
		if (!src) this.color();
		else {
			this.img = new Image();
			this.img.src = SRC_DIR + src;
		}
	}

	color(src="white") {
		this.img = null;
		this.sheet = null;
		this.col = src;
	}
	
	sprite(src, fw=16) {
		if (!src) this.color();
		else {
			this.sheet = new Image();
			this.sheet.src = SRC_DIR + src;
			this.frames = this.img % fw;
		}
	}

	update() {
		let sw = this.w, sh = this.h;
		if (this.sheet) this.animate();
		if (this.stretch) sw *= sx, sh *= sy;
		if (this.sheet) {
			c.drawImage(this.img,
				(this.frame * (this.img.width/this.frames)),
				0, (this.img.width / this.frames),
				this.img.height,
				this.x, this.y,
				this.sw, this.sh);
		} else if (this.img) {
			c.drawImage(this.img,
			this.x, this.y,
			this.sw, this.sh);
		} else {
			c.fillStyle = this.col;
			if (this.border.active) {
				c.strokeSize = this.border.size;
				c.strokeStyle = this.border.col;
			}
			c.strokeRect(this.x, this.y, this.sw, this.sh);
			c.stroke();
		}
	}

	animate() {
		// Function for choosing frames.
		// Customize it to whatever you need.
	}
}

class Prop extends BasicProp {
	constructor(x=0, y=0, w=16, h=16) {
		super(x, y, w, h);
		this.xv = 0, this.yv = 0,
		this.meta = {
			physics: {
				gravity: "default",
			},
			enabled: false,
			flipped: false,
			screenWrap: false,
			borderBypass: false,
		};
		props.push(this);
	}

	prepareUpdate() {
		if (this.meta.physics.gravity) {
			if (this.meta.physics.gravity === "default")
			this.y += level.gravity - this.yv
			else this.y += this.physics.gravity;
		}
		if (this.sheet) this.animate();
		this.x += this.xv;
		this.y -= this.yv;
		if (!this.meta.borderBypass) {
			if (this.x + this.w > cx) {
				this.x = cx - this.w;
			}
			if (this.x < 0) {
				this.x = 0;
			}
		}
		if (this.meta.screenWrap) {
			if (this.x + this.w >= cx) {
				this.x = 1;
			} else if (this.x <= 0) {
				this.x = (cx - this.w) - 1;
			}
		}
	}

	update() {
		let sw = this.w, sh = this.h;
		this.prepareUpdate();
		if (this.stretch) sw *= sx, sh *= sy;
		if (this.sheet) {
			c.drawImage(this.img,
				(this.frame * (this.img.width/this.frames)),
				0, (this.img.width / this.frames),
				this.img.height,
				this.x, this.y,
				this.sw, this.sh);
		} else if (this.img) {
			c.drawImage(this.img,
			this.x, this.y,
			this.sw, this.sh);
		} else {
			c.fillStyle = this.col;
			if (this.border.active) {
				c.strokeSize = this.border.size;
				c.strokeStyle = this.border.col;
			}
			c.strokeRect(this.x, this.y, this.sw, this.sh);
			c.stroke();
		}
	}

	animate() {
		// Function for choosing frames.
		// Customize it to whatever you need.
	}
}

class debugPart extends Prop {
	constructor(x=0, y=0, w=16, h=16) {
		super(x, y, w, h);
		setInterval(() => {
			alert(this.x)
		}, 10000);
	}
}

class Text {}

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

// GAME CODE
// Ground is an immovable prop
//let ground = new levelPart(0, cy*level.ground, cx, cy*level.ground);
//let ground = new levelPart(0, 0, cx, cy);
//ground.color("green");
let bruh = new Prop(0, 0, 16, 16);
bruh.stretch = true;

// Start updating screen
setInterval(update, FRAMETIME);
