//sound for init
var context,isPlaying=false,o;
var supportAudio=true,supportAccelero=true;
var oscillateur,oscillateurBis,noeudGain, timer;
//var    isInit=false;

//room shaker, orientation
function accelerOff(){
    window.ondevicemotion = null;
} 
function soundOff(){
    oscillateurBis.stop();
        //oscillateur.stop();
    }
/*
if(room=='r0'||room=='r1'){
  sound=new Howl({
   // src: ['../sound/vieux-tel.wav'
          //  src: ['../sound/org.mp3','../sound/org.ogg','../sound/org.wav'],
            src: ['../sound/rires.mp3','../sound/rires.ogg','../sound/rires.wav'],
    });
}
else{ sound=new Howl({
   // src: ['../sound/vieux-tel.wav'
           src: ['../sound/org.mp3','../sound/org.ogg','../sound/org.wav'],
           // src: ['../sound/rires.wav'],
    });}
  sound.play();
  sound.stop();
*/
  if('webkitAudioContext' in window || 'AudioContext' in window ) {
         context = new (window.AudioContext || window.webkitAudioContext)();
         o = context.createOscillator()
         oscillateur = context.createOscillator();
 		 oscillateurBis = context.createOscillator();
 		 noeudGain = context.createGain();
     }
     else{console.log('no')}
function preloadImages(array, waitForOtherResources, timeout) {

    if (!preloadImages.list) {
        preloadImages.list = [];
    }
              var loaded = false, list = preloadImages.list, imgs = array.slice(0), t = timeout || 15*1000, timer;


    if (!waitForOtherResources || document.readyState === 'complete') {
        loadNow();
    } else {
        window.addEventListener("load", function() {
            clearTimeout(timer);
            loadNow();
        });
        // in case window.addEventListener doesn't get called (sometimes some resource gets stuck)
        // then preload the images anyway after some timeout time
        timer = setTimeout(loadNow, t);
    }

    function loadNow() {
        if (!loaded) {
            loaded = true;
            for (var i = 0; i < imgs.length; i++) {
                var img = new Image();
                img.onload = img.onerror = img.onabort = function() {
                    var index = list.indexOf(this);
                    if (index !== -1) {
                        // remove image from the array once it's loaded
                        // for memory consumption reasons
                        list.splice(index, 1);
                    }
                }
                list.push(img);
                img.src = imgs[i];
            }
        }
    }
}
//preloadImages(['../img/ambre.jpg','../img/mario.jpg','../img/david.jpg','../img/isa.jpg']);

/*$(window).unload(function(){
    sound.play()
});

 window.addEventListener("pagehide", function(evt){
       sound.play();
    }, false);
 window.addEventListener("pageshow", function(evt){
       sound.stop();
    }, false);*/
/*function vibrate(){



    if (isIOSChrome) {
     // is Google Chrome on IOS
     // traitement
     window.navigator.vibrate(3000);
     timer = setTimeout(vibrate,3000); 
} else if (
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEedge === false
    ) {
     // is Google Chrome
     // traitement
     window.navigator.vibrate(3000);
     timer = setTimeout(vibrate,3000); 
}  else if(isFirefox){
    window.navigator.vibrate(3000);
    timer = setTimeout(vibrate,3000); 
}else { 
     // not Google Chrome 
}

}


function stopVibrate() {


      if (isIOSChrome) {
     // is Google Chrome on IOS
     // traitement
     clearTimeout(timer);
     timer = 0;
     window.navigator.vibrate(0);
} else if (
    isChromium !== null &&
    typeof isChromium !== "undefined" &&
    vendorName === "Google Inc." &&
    isOpera === false &&
    isIEedge === false
    ) {
     // is Google Chrome
     // traitement
     clearTimeout(timer);
     timer = 0;
     window.navigator.vibrate(0);
} else if(isFirefox){
    clearTimeout(timer);
    timer = 0;
    window.navigator.vibrate(0);
} else { 
     // not Google Chrome 
} 


}*/

 
