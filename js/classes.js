"use strict";

// Constants
const DEFAULT_DRAG = 0.8; //0.8;


// Prop Classes

class AbstractProp {
	constructor(x=0, y=0, extra) {
		this.x = x, this.y = y,
		this.dynamics = extra?.dynamics ?? {},
		this.name = extra?.name ?? null, // undefined big bad
		this.type = extra?.type ?? ["Generic"];
		prepareDynamics.call(this);
	}
}

class Camera extends AbstractProp {
	static instances = [];

	constructor(x=0, y=0, extra) {
		super(x, y, extra);
		this.active = false,
		this.w = extra?.w ?? cx,
		this.h = extra?.h ?? cy;
		this.type = extra?.type ?? [];

		this.type.append("Camera"); // All cameras have type "Camera"
		Camera.instances.push(this);

		// Make active camera if none exists
		if (!Camera.instances.some((v)=>v.active) &&
			// WILL NOT AUTO-ACTIVATE IF EXTRA EXPLICITLY SETS STATUS!
			extra?.active !== false) this.active = true;
	}

	static getActiveCamera() {
		// Returns active camera, and if there's no active, returns null.
		return Camera.instances.filter((v)=>v.active)?.[0] ?? null;
	}

	setCameraViewport(w,h) {}
}

class BasicProp extends AbstractProp {
	constructor(x=0, y=0, w=16, h=16, extra) {
		super(x, y, extra);
		this.w = w, this.h = h,
		this.xf, this.yf, this.wf, this.hf,
		this.img = null,
		this.sheet = null,
		this.col = extra?.col ?? "white",
		this.drawLayer = extra?.drawLayer ?? 500,
		this.border = {
			size: extra?.border?.size ?? 4,
			col: extra?.border?.col ?? "white",
		},
		this.meta = {
			flipped: false,
		};
		
		prepareDynamics.call(this);
	}

	touching(rect, sides) {
		if (sides)
		   return [ !(rect.x > (this.x + this.w)),   // Right side
					!(this.x > (rect.x + rect.w)),   // Left side
					!(rect.y > (this.y + this.h)),   // Above
					!(this.y > (rect.y + rect.h)),]; // Below
		else
			return !(rect.x > (this.x + this.w) ||   // If other obj on right
					this.x  > (rect.x + rect.w) ||   // If other obj to left
					rect.y  > (this.y + this.h) ||   // If other obj above cube
					this.y  > (rect.y + rect.h));    // If other obj below
	}

	collisionsWith(r2) { // It's borrowing, not stealing! :)
		let dx=(this.x+this.w/2)-(r2.x+r2.w/2);
		let dy=(this.y+this.h/2)-(r2.y+r2.h/2);
		let width=(this.w+r2.w)/2;
		let height=(this.h+r2.h)/2;
		let crossWidth=width*dy;
		let crossHeight=height*dx;
		let collision=[];

		if(Math.abs(dx)<=width && Math.abs(dy)<=height){
			if(crossWidth>crossHeight) {
				collision.push((crossWidth>(-crossHeight))?"bottom":"left");
			} else {
				collision.push((crossWidth>(-crossHeight))?"right":"top");
			}
		} return(collision);
	}


	image(src) {
		if (!src) this.color();
		else {
			this.img = new Image();
			this.img.src = SRC_DIR + src;
		}
	}

	color(src) {
		if (!src) src = "white";
		this.img = null;
		this.sheet = null;
		this.col = src;
	}

	setBorder(width, col) {
		Object.assign(this.border, {col: col, size: width});
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
		//if (this.constructor === BasicProp ) {} // If direct instance of BasicProp
		if (this.sheet) {
			this.animate();
			c.drawImage(this.img,
				(this.frame * (this.img.width/this.frames)),
				0, (this.img.width / this.frames),
				this.img.height,
				this.x, this.y);
		} else if (this.img) {
			c.drawImage(this.img,
			this.x, this.y, this.w, this.h);
		} else {
			c.beginPath();
			if (this.border.size > 0) {
				c.lineWidth = this.border.size;
				c.strokeStyle = this.border.col;
				//c.strokeRect(this.x, this.y, this.w, this.h);
			}
			c.fillStyle = this.col;
			c.rect(this.x, this.y, this.w, this.h);
			c.closePath();
			c.stroke();
			c.fill();
		}

		this.afterKeys();
	}

	animate() {
		// Function for choosing frames.
		// Customize it to whatever you need.
		c.drawImage(this.img,
			(this.frame * (this.img.width/this.frames)),
			0, (this.img.width / this.frames),
			this.img.height,
			this.x, this.y,
			this.w, this.h);
	}
	
	afterKeys() {
		for (const key of Object.keys(afterKeyActions)) {
			if (currentKeys.includes(key))
				afterKeyActions[key].forEach((f)=>{f()});
		}
	}
}



class Prop extends BasicProp {
	constructor(x=0, y=0, w=16, h=16, extra) {
		super(x, y, w, h, extra);
		this.xv = extra?.xv ?? 0,
		this.yv = extra?.yv ?? 0,
		this.maxSpeed = extra?.maxSpeed ?? 10,
		this.terminalVelocity = extra?.terminalVelocity ?? 20,
		this.collisionLayers = extra?.collisionLayers ?? [];
		this.currentCollisions = 0;
		Object.assign(this.meta, {
			screenWrap: false,
			borderBypassX: true,
			borderBypassY: true,
			physics: {
				gravity: extra?.meta?.physics?.gravity !== undefined ?
					extra?.meta?.physics?.gravity : "default",
				acceleration: extra?.meta?.physics?.acceleration ?? 50,
				drag: extra?.meta?.physics?.drag ?? DEFAULT_DRAG,
				collisionRoughness: extra?.meta?.physics?.collisionRoughness ?? 0,
				immovable: extra?.meta?.physics?.immovable ?? false,
			},
		});
		props.push(this);
	}

	prepareUpdate() {
		this.beforeKeys();
		prepareDynamics.call(this);
		
		if (this.meta.physics.gravity) { // Apply gravity if exists
			if (this.meta.physics.gravity instanceof Function) {
				// Custom Gravity Function
				this.meta.physics.gravity.call(this);
			} else if (this.meta.physics.gravity === "default") {
				// Default Gravity
				this.yv -= level.gravity;
			}
		}

		if (Math.abs(this.yv)>this.terminalVelocity)
			this.yv = (this.yv < 0) ? -this.terminalVelocity : this.terminalVelocity;
		if (Math.abs(this.xv)>this.maxSpeed) {
			this.xv = (this.xv < 0) ? -this.maxSpeed : this.maxSpeed;
		}
		if (this.meta.physics?.drag) {
			this.xv *= this.meta.physics.drag;
			if (!this.meta.physics.gravity) this.yv *= this.meta.physics.drag;
		}

		// Collision detection
		if (this.collisionLayers.length > 0 &&
			!this.meta.physics.immovable) {
			let colProps = props.filter((prop) => {
				return (
					prop.collisionLayers.some((val) => {
						return this.collisionLayers.includes(val)
					}) && prop !== this
				);
			});

			this.currentCollisions = colProps.length;
			collisionRemoveVelocity.call(this, colProps);
		}

		this.controlKeys();

		//let x3 = getPropsByName("Bruh Cube")[0].yv;
		//if (x3 !== 0) console.log(x3);

		if (this.sheet) this.animate();
	}

	applyVelocity() {
		// Apply velocities
		this.x += this.xv;
		this.y -= this.yv;

		// Border bypass and screen wrapping
		if (!this.meta.borderBypassX) {
			if (this.x + this.w > cx)	this.x = cx - this.w;
			else if (this.x < 0)		this.x = 0;
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
		this.controlKeys();
		this.applyVelocity();
		super.update();
	}

	beforeKeys() {
		for (const key of Object.keys(beforeKeyActions)) {
			if (currentKeys.includes(key))
				beforeKeyActions[key].forEach((f)=>{f()});
		}
	}

	controlKeys() {
		for (const key of Object.keys(controlKeyActions)) {
			if (currentKeys.includes(key))
				controlKeyActions[key].forEach((f)=>{f()});
		}
	}
}

/*class Environment extends Prop {
	constructor {
		super();
	}
}*/

class Text extends AbstractProp {
	constructor(x=0,y=0,text,extra) {
		super(x,y,extra);
		
		// If text given isn't a string, make it one.
		if (text === undefined) text = "";
		else if (text instanceof Number) text = Number(text);
		else if (text instanceof Function) {
			textf = text;
			text = "";
		}

		this.col = extra?.col ?? "white",
		this.drawLayer = extra?.drawLayer ?? 500,
		this.border = {
			size: extra?.border?.size ?? 4,
			col: extra?.border?.col ?? "white",
		};
	}
}

class TextProp extends BasicProp {
	//
}

function prepareDynput(...args) {
	return args.map(x =>
		((x instanceof Function) ? x() : null));
}

function prepareDynStats() {
	for (const i of ["x", "y", "w", "h"]) {
		if (this?.[i+"f"] instanceof Function) {
			this[i] = this[i+"f"]();
		}
	}
}

function prepareDynamics() {
	// Check if dynamics is valid
	if ((!this.dynamics instanceof Object) ||
		Object.keys(this.dynamics).length < 1) return;
	
	// Apply each dynamic
	for (const dynamic in this.dynamics) {
		this[dynamic] = this.dynamics[dynamic]();
	}
}

function collisionRemoveVelocity(colProps) {
	for (const i of colProps) {
		let res = this.collisionsWith(i);
		// If left side collision
		switch (res[0]) {
			case "left":
				this.x = (i.x - this.w)-1;
				this.xv *= i.meta.physics.collisionRoughness; break;
			case "right":
				this.x = (i.x + i.w)+1;
				this.xv *= i.meta.physics.collisionRoughness; break;
			case "top":
				this.y = (i.y - this.h)-1;
				this.yv *= i.meta.physics.collisionRoughness; break;
				//this.yv = 0; break;
			case "bottom":
				this.y = (i.y + i.h)+1;
				this.yv *= i.meta.physics.collisionRoughness; break;
		}
	}
}
