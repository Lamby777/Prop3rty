"use strict";

// GAME CODE

SRC_DIR = "/src/"; // Folder of game assets

var ground = new Prop(0, 400, 500, 400, {
	border: {size: 4},
	name: "Grass",
	type: ["Environment"],
	collisionLayers: [1],
	meta: {
		physics: {
			immovable: true,
			gravity: null,
		},
	},
	dynamics: {
		y: (() => cy*0.7),
		w: (() => cx),
	},
});
ground.color("green");
ground.drawLayer = 400;


var ground2 = new Prop(0, 0, 500, 50, {
	border: {size: 4},
	name: "Ceiling",
	type: ["Environment"],
	collisionLayers: [1],
	meta: {
		physics: {
			immovable: true,
			gravity: null,
		},
	},
	dynamics: {
		w: (() => cx),
	},
});
ground2.color("green");
ground2.drawLayer = 400;/**/



var bruh = new Prop(64, 100, 48, 48, {
	border: {size: 4},
	name: "Bruh Cube",
	type: ["Player"],
	collisionLayers: [1],
	maxSpeed: 5,
	meta: {
		physics: {
			acceleration: 1,
		},
	},
});
bruh.color("red");
bruh.image("karel.png");
//bruh.meta.physics.gravity = null;


var bruh2 = new Prop(128, 100, 32, 32, {
	border: {size: 4},
	name: "Bruh Cube #2",
	collisionLayers: [1],
	maxSpeed: 3,
	meta: {
		physics: {
			acceleration: 1,
		},
	},
});
bruh2.color("aqua");

sortProps();

/*bindToGame("tick", () => {
	//
});*/

bindKey("KeyW", "down", ()=>{
	bruh.yv = 5;
});

bindKey("KeyS", "down", ()=>{
	bruh.yv -= 3;
});

bindKey("KeyA", "control", ()=>{
	bruh.xv -= bruh.meta.physics.acceleration;
	if (bruh.xv < -bruh.maxSpeed) bruh.xv = -bruh.maxSpeed;
});

bindKey("KeyD", "control", ()=>{
	bruh.xv += bruh.meta.physics.acceleration;
	if (bruh.xv > bruh.maxSpeed) bruh.xv = bruh.maxSpeed;
});

bindKey("KeyQ", "down", ()=>{
	bruh.y += 50;
});

bindKey("KeyE", "down", ()=>{
	bruh.y -= 50;
});

bindKey("KeyT", "down", ()=>{
	console.log(bruh,bruh2,ground);
});
