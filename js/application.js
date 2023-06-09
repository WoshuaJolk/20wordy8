// Wait till the browser is ready to render the game (avoids glitches)
// window.requestAnimationFrame(function () {
//   new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
// });

function start() {
	document.querySelector('#loading').remove();
	new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
}

