// GAME CODE
// Ground is an immovable prop

var bruh = new Prop(()=>{cx/2}, 0, 16, 16);
bruh.stretch = true;
bruh.yv = 0;
bruh.color("red");
bruh.setBorder(4, "white");

var ground = new Prop(dv.cy, 50, 20, 20);
ground.meta.physics.gravity = null;
ground.stretch = true;
ground.color("green");
