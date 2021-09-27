"use strict";

// GAME CODE
// Ground is an immovable prop

var ground = new Prop(0, 400, 500, 400, {
	border: {size: 4},
	name: "Grass",
	type: ["Environment"],
});
ground.yf = (() => cy/2); // Will always be the middle of screen

ground.meta.physics.gravity = null;
ground.color("green");


var bruh = new Prop(64, 0, 32, 32, {
	border: {size: 4},
	name: "Bruh Cube",
	type: ["Player"],
});

bruh.color("red");
bruh.meta.physics.acceleration = 1;
bruh.maxSpeed = 10;

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
