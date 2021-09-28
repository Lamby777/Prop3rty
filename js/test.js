"use strict";

// GAME CODE
// Ground is an immovable prop

var ground = new Prop(0, 400, 500, 400, {
	border: {size: 4},
	name: "Grass",
	type: ["Environment"],
	collisionLayers: [1],
	meta: {
		physics: {
			immovable: true,
		}
	}
});
ground.yf = (() => cy*0.7);
ground.wf = (() => cx);
ground.meta.physics.gravity = null;
ground.color("green");
ground.drawLayer = 400;


var bruh = new Prop(64, 0, 32, 32, {
	border: {size: 4},
	name: "Bruh Cube",
	type: ["Player"],
	collisionLayers: [1],
});
bruh.color("red");
//bruh.meta.physics.gravity = null;
bruh.meta.physics.acceleration = 1;
bruh.maxSpeed = 5;


var bruh2 = new Prop(128, 0, 32, 32, {
	border: {size: 4},
	name: "Bruh Cube #2",
	collisionLayers: [1],
});
bruh2.color("orange");
//bruh2.meta.physics.gravity = null;
bruh2.meta.physics.acceleration = 1;
bruh2.maxSpeed = 10;

sortProps();

bindKey("KeyW", "down", ()=>{
	bruh.yv = 5;
});

bindKey("KeyS", "down", ()=>{
	bruh.yv -= 3;
});

bindKey("KeyA", "before", ()=>{
	bruh.xv -= bruh.meta.physics.acceleration;
});

bindKey("KeyD", "before", ()=>{
	bruh.xv += bruh.meta.physics.acceleration;
});

bindKey("KeyQ", "down", ()=>{
	bruh.y += 50;
});

bindKey("KeyT", "down", ()=>{
	console.log(bruh.collisionsWith(bruh2));
});
