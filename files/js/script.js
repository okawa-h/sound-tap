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
			const audioContext = new AudioContext();

			setAllowSound(audioContext);

			loadAudioBuffer($target,audioContext,SOUND_PATH + sound,($target,buffer) => {

				$target.onclick = () => {

					play(audioContext,buffer);

				}

			});

		}

	}

	function setAllowSound(audioContext) {

		const eventName = typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup';
		function initAudioContext(){
			document.removeEventListener(eventName, initAudioContext);
			audioContext.resume();
		}
		document.addEventListener(eventName, initAudioContext);

	}

	function play(audioContext,buffer) {

		const source = audioContext.createBufferSource();
		source.buffer = buffer;
		source.connect(audioContext.destination);
		source.start(0);

	}

	function loadAudioBuffer($target,audioContext,src,callback) {

		const req = new XMLHttpRequest();
		req.responseType = 'arraybuffer';

		req.onreadystatechange = function() {
			if (req.readyState === 4) {
				if (req.status === 0 || req.status === 200) {
					audioContext.decodeAudioData(req.response,function(buffer) {

						callback($target,buffer);

					});
				}
			}
		};

		req.open('GET',src,true);
		req.send('');

	}

	document.addEventListener('DOMContentLoaded',init,false);

})();
