// Wait till the browser is ready to render the game (avoids glitches)
// window.requestAnimationFrame(function () {
//   new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);
// });

function start() {
	document.querySelector('#loading').remove();
	new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager);

	window.addEventListener('touchstart', (evt) => {
		for (let i = 0; i < evt.touches.length; i++) {
			const touch = evt.touches.item(i);

			if (touch !== null) {
				const { target } = touch;

				target.focus();
			}
		}
	});
}

