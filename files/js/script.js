(function() {

	function init() {

		setup();

	}

	function setup() {

		const SOUND_PATH = 'files/sound/';
		const $sounds = document.querySelectorAll('[data-sound]');

		for (let i = 0; i < $sounds.length; i++) {

			const $target = $sounds[i];
			const sound   = $target.dataset.sound;
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			const context      = new AudioContext();

			loadAudioBuffer($target,context,SOUND_PATH + sound,($target,buffer) => {

				const eventName = typeof $target.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown';
				$target.addEventListener(eventName,() => {

					play(context,buffer);

				});

			});

		}

	}

	function play(audioContext,audioBuffer) {

		const source = audioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(audioContext.destination);
		source.start(0);

	}

	function loadAudioBuffer($target,audioContext,src,callback) {

		const request = new XMLHttpRequest();
		request.responseType = 'arraybuffer';
		request.onload = () => {

			audioContext.decodeAudioData(request.response, (audioBuffer) => {

				callback($target,audioBuffer);

			});

		}

		request.open('GET', src, true);
		request.send();

		const eventName = typeof $target.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
		$target.addEventListener(eventName, initAudioContext);
		function initAudioContext(){
			$target.removeEventListener(eventName,initAudioContext);
			audioContext.resume();
		}

	}

	document.addEventListener('DOMContentLoaded',init,false);

})();
