// GAME CODE
// Ground is an immovable prop

var bruh = new Prop(64, 0, 32, 32, {
	border: {size: 4},
	name: "Bruh Cube",
	type: ["Player"],
});
bruh.color("red");

var ground = new Prop(/*()=>*/50, 400, 500, 400, {
	border: {size: 4},
	name: "Grass",
	type: ["Environment"],
});
ground.meta.physics.gravity = null;
ground.color("green");

bindKey("KeyW", "up", ()=>{
	bruh.yv = 5;
});

bindKey("KeyD", "after", ()=>{
	bruh.xv = 1;
});
