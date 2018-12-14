/**
 * ...
 * @author keita
 *
 *
 */

// var _audio;
var _bytes;
var _analyser;
var _points = {};
var _menuControllerElement;
var _equalizerCanvasElement;
var _isPlay = false;
var _isInit = false;

let instance;

class AudioInputManeger {

    static getGain( label ) {
        return instance.getGain( label );
    }

    constructor() {
        instance = this;
    }

    init(initComplate) {
            
    
    var path;
    var report = 0;
    
    var soundAllowed = function (stream) {
        //Audio stops listening in FF without // window.persistAudioStream = stream;
        //https://bugzilla.mozilla.org/show_bug.cgi?id=965483
        //https://support.mozilla.org/en-US/questions/984179
        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource( stream );
        _analyser = audioContent.createAnalyser();
        audioStream.connect(_analyser);
        _analyser.fftSize = 2048;
        _analyser.smoothingTimeConstant = 0.0

        _bytes = new Uint8Array(_analyser.frequencyBinCount);
      
        _isInit = true;

        initComplate();

    }

    var soundNotAllowed = function (error) {
        // document.body.innerHTML = "You must allow your microphone.";
        console.log(error);
    }

    /*window.navigator = window.navigator || {};
    /*navigator.getUserMedia =  navigator.getUserMedia       ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia    ||
                              null;*/
    navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);
    
    }

    debugShow() {
    
        var debugCanvasElement = document.createElement("canvas");

        document.body.appendChild( debugCanvasElement );

        debugCanvasElement.style.zIndex = 9999;
        debugCanvasElement.style.position = "absolute";
        debugCanvasElement.style.top = "0px";
        debugCanvasElement.style.left = "0px";
        debugCanvasElement.style.opacity = .8;
        var ctx = debugCanvasElement.getContext("2d");
    
        var $p = new Processing(debugCanvasElement);
        var CANVAS_WIDTH = 1024;
        var CANVAS_HEIGHT = 300;
    
        $p.setup = function () {
            $p.frameRate(32);
            $p.noLoop();
            $p.background(0); // prevet white flash at the start of rendering
            $p.size(CANVAS_WIDTH, 500);
        };
    
        var UNIT_COUNT = _analyser.frequencyBinCount;
        var UNIT_HEIGHT = Math.round(CANVAS_HEIGHT / 512); // round to align bars
        var UNIT_WIDTH = Math.round(CANVAS_WIDTH / UNIT_COUNT); // round to align bars
    
        var height = 0;
        $p.draw = function () {
    
            _analyser.getByteFrequencyData(_bytes);
            $p.background(0);
            $p.stroke(255);
            $p.fill(255);
    
            for (var i = 0; i < UNIT_COUNT * 0.1; i++) {
                height = _bytes[i] + Math.abs(_bytes[i] / calculate_a_weighting(44100 / 2048 * i));
                // height = _bytes[i]/calculate_a_weighting(44100/2048*i);
                // height *= UNIT_HEIGHT * 0.1;
                height -= 160;
                $p.rect(
                    (i * UNIT_WIDTH) * 10,
                    500,
                    (UNIT_WIDTH - 2) * 10,
                    height * -1
                );
    
    
                if (pos) {
                    ctx.fillStyle = "red";
                    ctx.font = 'italic 400 24px Unknown Font, sans-serif';
                    ctx.fillText(parseInt(pos.x * 0.1), parseInt(pos.x * 0.1) * 10, pos.y - 30);
                    ctx.fillStyle = "white";
                }
    
            }
        }
    
        // start rendering
        $p.setup();
        $p.loop();
    
        var pos;
        debugCanvasElement.onmousemove = function (e) {
            pos = getMousePos(debugCanvasElement, e);
        }

        var isShow = false;
        debugCanvasElement.style.display = 'none';
        document.addEventListener('keydown', (event) => {
            switch (event.key){
                case 'a':
                isShow = !isShow;
                break;
            }

            if( isShow ){
                debugCanvasElement.style.display = 'block';
            }else{
                debugCanvasElement.style.display = 'none';
            }
        }, false);

          
    
        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect(), // abs. size of element
                scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
                scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
    
            return {
                x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
                y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
            }
        }
    }

    getControllerElement() {
        return _menuControllerElement;
    }

    play() {
        _audio.play();
        _isPlay = true;

        if (_equalizerCanvasElement)return;

        _equalizerCanvasElement = document.getElementById('AudioInputManegerController_equalizer');
        var context = _equalizerCanvasElement.getContext("2d");
        _equalizerCanvasElement.width = 25;
        _equalizerCanvasElement.height = 12;
        _equalizerCanvasElement.onclick =()=> {
            this.togglePlayPause();
        }
        _audio.loop = true;
        _audio.volume = 0.0;
        function loop() {
            setTimeout(loop, 66);

            if (_audio.volume < 0.99) {
                _audio.volume += 0.005;
            } else {
                _audio.volume = 1.0;
            }

            context.clearRect(0, 0, 25, 12);
            context.beginPath();
            if (_isPlay) {
                context.fillStyle = "#ffffff";
                var height = 0;
                for (var i = 0; i < 5; i++) {
                    height = 4 + _bytes[i * 10] * 0.1 + Math.random() * (i + 2) * 4;
                    context.rect(i * 5, 16 - height, 4, height);
                }
            } else {
                context.fillStyle = "#777777";
                var height = 0;
                for (var i = 0; i < 5; i++) {
                    height = 10 - i;
                    context.rect(i * 5, 16 - height, 4, height);
                }
            }
            context.fill();

        }

        loop();

    }

    togglePlayPause() {
        if (_isPlay)this.pause();
        else        this.play();
    }

    // pause() {
    //     _isPlay = false;
    //     _audio.pause();
    // }

    // stop() {
    //     _audio.pause();
    //     _audio.currentTime = 0;
    // }

    update() {

        if( !_isInit )return

        _analyser.getByteFrequencyData(_bytes);

        var UNIT_COUNT = _analyser.frequencyBinCount;

        var gain;

        for (var key in _points) {
            _points[key].gain = 0;
        }

        for (var i = 0; i < UNIT_COUNT * 0.1; i++) {
            gain = _bytes[i] + Math.abs(_bytes[i] / calculate_a_weighting(44100 / 2048 * i));
            for (var key in _points) {
                if (i == _points[key].freq - 1) _points[key].gain += gain / 3;
                if (i == _points[key].freq + 0) _points[key].gain += gain / 3;
                if (i == _points[key].freq + 1) {
                    _points[key].gain += gain / 3;
                    if (_points[key].gain <= 130) _points[key].gain = 0;
                }
            }
        }
    }

    getBytes() {
        if( !_bytes )return [];
        return _bytes;
    }

    getIsPlay() {
        return _isPlay;
    }

    setPoint(label, freq) {

        _points[label] = {freq: freq, gain: 0};

    }

    removePoint(label) {

        delete _points[label];

    }

    getGain(label) {
        if (!_points.hasOwnProperty(label))return 0;
        return _points[label].gain
    }

}

var calculate_a_weighting = function (freq) {

    var f2 = freq * freq;
    var f4 = f2 * f2;
    var w = 10 * Math.log10(1.562339 * f4 / ((f2 + 11589.09305) * (f2 + 544440.6705)));
    w += 10 * Math.log10(2.242881 * Math.pow(10, 16) * f4 / (Math.pow(f2 + 424.3186774, 2) * Math.pow(f2 + 148699001.4, 2)));
    return w;
}


export{AudioInputManeger};
