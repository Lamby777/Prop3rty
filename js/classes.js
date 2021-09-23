// Prop Classes

class BasicProp {
	constructor(x=0, y=0, w=16, h=16, extra) {
		this.x = x, this.y = y,
		this.w = w, this.h = h,
		this.img = null,
		this.sheet = null,
		this.name = extra?.name && null, // undefined big bad
		this.type = extra?.type && "Generic",
		this.col = extra?.col ?? "white",
		this.border = {
			size: extra?.border?.size ?? 4,
			col: extra?.border?.col ?? "white",
		};

		this.meta = {
			flipped: false,
			screenWrap: false,
			borderBypass: false,
		};
	}

	touching(rect) {
		let [x, y, w, h] = prepareDynput(
			this.x, this.y,
			this.w, this.h);
		let [rx, ry, rw, rh] = prepareDynput(
			rect.x, rect.y,
			rect.w, rect.h);
		return !(rx > (x + w) ||
				(rx + rw) < x ||
				ry > (y + h) ||
				(ry + rh) < y);
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
		let [x, y, w, h] = prepareDynput(
			this.x, this.y,
			this.w, this.h);
		if (this.sheet) this.animate();
		if (this.sheet) {
			c.drawImage(this.img,
				(this.frame * (this.img.width/this.frames)),
				0, (this.img.width / this.frames),
				this.img.height,
				x, y);
		} else if (this.img) {
			c.drawImage(this.img,
			x, y, w, h);
		} else {
			c.beginPath();
			if (this.border.size > 0) {
				c.lineWidth = this.border.size;
				c.strokeStyle = this.border.col;
				//c.strokeRect(this.x, this.y, this.w, this.h);
			}
			c.fillStyle = this.col;
			c.rect(x, y, w, h);
			c.closePath();
			c.stroke();
			c.fill();
		}
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
}








class Prop extends BasicProp {
	constructor(x=0, y=0, w=16, h=16, extra) {
		super(x, y, w, h);
		this.xv = extra?.xv ?? 0,
		this.yv = extra?.yv ?? 0,
		this.terminalVelocity = extra?.terminalVelocity ?? 20,
		this.collisionLayers = extra?.collisionLayers ?? [];
		Object.assign(this.meta, {
			physics: {
				gravity: "default",
			},
		});
		props.push(this);
	}

	prepareUpdate() {
		if (this.meta.physics.gravity) {
			// Gravity
			if (this.meta.physics.gravity === "default") {
				this.yv -= level.gravity;
				if (Math.abs(this.yv>this.terminalVelocity))
					this.yv = (this.yv < 0) ? -this.terminalVelocity : this.terminalVelocity;
			} else if (this.meta.physics.gravity === "custom") {
				// Custom gravity
			}

			// Collision detection
			if (this.collisionLayers.length > 0) {
				//
			}
		}
		if (this.sheet) this.animate();
		
		// Apply velocities
		this.x += this.xv;
		this.y -= this.yv;

		// Border bypass and screen wrapping
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
		this.prepareUpdate();
		super.update();
	}
}

class Text extends BasicProp {
	//
}

function prepareDynput(...args) {
	return args.map(x =>
		((x instanceof Function) ? x() : x));
}
