// GAME CODE
// Ground is an immovable prop

var bruh = new Prop(64, 0, 16, 16, {
	border: {size: 4},
	name: "Bruh Cube",
});
bruh.color("red");

var ground = new Prop(()=>50, 50, 20, 20, {
	border: {size: 4},
	name: "Grass",
});
ground.meta.physics.gravity = null;
ground.color("green");
