"use strict";

// GAME CODE
// Ground is an immovable prop

var bruh = new Prop(64, 0, 32, 32, {
	border: {size: 4},
	name: "Bruh Cube",
	type: ["Player"],
});
bruh.color("red");

var ground = new Prop(()=>50, 400, 500, 400, {
	border: {size: 4},
	name: "Grass",
	type: ["Environment"],
});
ground.meta.physics.gravity = null;
ground.color("green");

bindKey("KeyW", "down", ()=>{
	bruh.yv = cy/100;
});

bindKey("KeyA", "before", ()=>{
	bruh.xv -= 1;
});

bindKey("KeyD", "before", ()=>{
	bruh.xv += 1;
});
