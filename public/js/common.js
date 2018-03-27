  /*window.console = {
      log: function(str){
       document.getElementById("myLog").innerHTML =str;
         }
    }*/
/////
var audioStarted=false;
if( !(/iPhone|iPad|iPod/i.test(navigator.userAgent)) ) {
	audioStarted=true;
}
else
{
	
	//sendId('display','coucou')
}
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

function nVibrate(e){
if (navigator.vibrate) {
	navigator.vibrate(e);
	// vibration API supported
	}
}
///////
var room='r'+Math.floor(Math.random() * 4)+'';
var theRoom='01-welcome2';
var sound;
//console.log('hello')

function loade(url){
	var request = new XMLHttpRequest();
	request.open('GET',url, true);
	request.onload = function() {
  	if (request.status >= 200 && request.status < 400) {
    	var resp = request.responseText;
    //document.querySelector('#div').innerHTML = resp;
    	return resp;
  }
};
request.send();
}

function openDiv(div,url){
	//sendId(div,loade(url));
	$( "#"+div ).load( url );
	}
function page(room){
	if(audioStarted){
	//nVibrate(500);
	reset();
	openDiv("display", "page/"+room+"");
	
	nVibrate(500);	
}
theRoom=room;

}




function updateWidget(w) {
	var val = "";
	for(var i = 0; i < w.length; i++) {	
		if(typeof w[i]=== 'string'){
			w[i]=w[i].replace(/_/gi,',');
			w[i]=w[i].replace(/#/gi,' ');
			val+=w[i];
		}
 		else{			 
 			val+=w[i];
 			val+=' ';
		}
	}
	try{eval(val);}
	catch(err) {;}
}	  

function fbody(){
	console.log("hh");
	if(!audioStarted){
	StartAudioContext(Tone.context).then(function(){
		audioStarted=true;
		page(theRoom);
	}
	)
	}//started

	//screenfull.request();
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		screenfull.request();
		//noSleep.enable();
	
}
	
	if (!screenfull.enabled) {
		return false;
		screenfull.request();
	}
	
	//noSleep.enable(); // keep the screen on!


}
function audioActiv(){
;
}


function sendId(id,msg){
	return document.getElementById(id).innerHTML=msg;
	}

var socket = io.connect();
socket.on('connect', function() {
	//console.log('hello')
	//console.log(room);
	socket.emit('room',room);
	socket.on('update', function(w) {
			//console.log(w)
			updateWidget(w);       
	});
});




var isChromium = window.chrome,
    winNav = window.navigator,
    vendorName = winNav.vendor,
    isOpera = winNav.userAgent.indexOf("OPR") > -1,
    isIEedge = winNav.userAgent.indexOf("Edge") > -1,
    isIOSChrome = winNav.userAgent.match("CriOS");

var isFirefox = typeof InstallTrigger !== 'undefined';
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
