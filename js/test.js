// GAME CODE
// Ground is an immovable prop
let ground = new Prop(0, cy*level.ground, cx, cy);
ground.meta.physics.gravity = "default";
ground.stretch = true;
ground.color("green");
let bruh = new Prop(0, 0, 16, 16);
bruh.meta.physics.gravity = "default";
bruh.stretch = true;
bruh.yv = 0;
