// GAME CODE
// Ground is an immovable prop

var bruh = new Prop(64, 0, 16, 16);
bruh.stretch = true;
bruh.yv = 0;
bruh.color("orange");
bruh.setBorder(4, "white");

var ground = new Prop(0, 50, 20, 20);
ground.meta.physics.gravity = null;
ground.stretch = true;
ground.color("green");
ground.setBorder(4, "white");
