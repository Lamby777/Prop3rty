// GAME CODE
// Ground is an immovable prop

var bruh = new Prop(64, 0, 16, 16);
bruh.stretch = true;
bruh.yv = 0;

var ground = new Prop(0, cy*(1-level.ground), cx, cy);
ground.meta.physics.gravity = null;
ground.stretch = true;
ground.color("green");