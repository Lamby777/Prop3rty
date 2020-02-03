// Shows stats 4 nerds
const DEV = true,
	// FPS counter
	SHOW_FPS = true,
	// Max FPS
	MAX_FPS = 60,
	// Time between frames, is done automatically
	FRAMETIME = Math.floor(1000/MAX_FPS),
	// Frames per counter draw.
	// Must have SHOW_FPS set to true.
	FRAMECOUNT_INTERVAL = 5
	// Resolution to play normally at.
	// Any other res will have some form of stretching.
	DEFAULT_RESOLUTION = [1366, 768];