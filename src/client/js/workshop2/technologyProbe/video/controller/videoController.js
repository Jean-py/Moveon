var timerRepetition;
var speedrate = 1;

var timerVideo = document.getElementById("timerVideo");
// Sliders
var knobMin = document.getElementById("range-slider_handle-min");

var rangeSliderTrack = document.getElementById("rangeSliderTrack");
var wrapperCommandAndRangeid = document.getElementById("wrapperCommandAndRangeid");

var divCardBoard = document.getElementById("divCardBoard");
var body = document.getElementsByTagName("BODY")[0];


var KNOB_WIDTH = 25;

var NUMBER_OF_TICK = parseInt(WIDTH_RANGE_SLIDER_TRACK, 10);
var VALUE_KNOB_MIN = 0;
var WIDTH_MID_KNOB_MIN = 0.5;
var currentValueKnob = VALUE_KNOB_MIN;
var videoDuration = "1:47";


//Click  space to playpause the video
document.addEventListener("keydown", function (e) {
  if(  document.activeElement.className === 'textSegment') {
  
  } else if(e.keyCode == 32){
    console.log("in the if keydown");
    player.playPausecallback();
    event.preventDefault();
  }
  // Annuler l'action par défaut pour éviter qu'elle ne soit traitée deux fois.
  //event.preventDefault();
}, true);


if(video_current !== null){
 video_current.ready(function () {
    this.on('timeupdate', function () {
        knobMin.style.left = parseFloat(document.getElementsByClassName("vjs-play-progress")[0].style.width,10) - WIDTH_MID_KNOB_MIN +"%" ; // Returns (string) "70px
    })
  });
 
}


var vjsButtonComponent = videojs.getComponent('Button');
videojs.registerComponent('DownloadButton', videojs.extend(vjsButtonComponent, {
  constructor: function () {
    vjsButtonComponent.apply(this, arguments);
  },
  handleClick: function () {
    document.location = '/path/to/your/video.mp4'; //< there are many variants here so it is up to you how to get video url
  },
  buildCSSClass: function () {
    return 'vjs-control vjs-download-button';
  },
  createControlTextEl: function (button) {
    return $(button).html($('<span class="glyphicon glyphicon-download-alt"></span>').attr('title', 'Download'));
  }
}));

videojs(
  'videojs_html5_api',
  {fluid: true},
  function () {
    this.getChild('controlBar').addChild('DownloadButton', {});
  }
);

