// GAME CODE
// Ground is an immovable prop

var bruh = new Prop(64, 0, 32, 32, {
	border: {size: 4},
	name: "Bruh Cube",
});
bruh.color("red");

var ground = new Prop(/*()=>*/50, 400, 500, 400, {
	border: {size: 4},
	name: "Grass",
});
ground.meta.physics.gravity = null;
ground.color("green");
