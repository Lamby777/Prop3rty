// Prop Classes

class BasicProp {
	constructor(x=0, y=0, w=16, h=16) {
		this.x = x, this.y = y,
		this.w = w, this.h = h,
		this.img = null,
		this.sheet = null,
		this.col = "white",
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
		if (this.sheet) this.animate();
		if (this.sheet) {
			c.drawImage(this.img,
				(this.frame * (this.img.width/this.frames)),
				0, (this.img.width / this.frames),
				this.img.height,
				this.x, this.y);
		} else if (this.img) {
			c.drawImage(this.img,
			this.x, this.y,
			this.w, this.h);
		} else {
			c.fillStyle = this.col;
			if (this.border.active) {
				c.strokeSize = this.border.size;
				c.strokeStyle = this.border.col;
			}
			c.strokeRect(this.x, this.y, this.w, this.h);
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
		this.prepareUpdate();
		if (this.sheet) {
			c.drawImage(this.img,
				(this.frame * (this.img.width/this.frames)),
				0, (this.img.width / this.frames),
				this.img.height,
				this.x, this.y,
				this.w, this.h);
		} else if (this.img) {
			c.drawImage(this.img,
			this.x, this.y,
			this.w, this.h);
		} else {
			c.fillStyle = this.col;
			if (this.border.active) {
				c.strokeSize = this.border.size;
				c.strokeStyle = this.border.col;
			}
			c.strokeRect(this.x, this.y, this.w, this.h);
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

class Text extends BasicProp {
	//
}