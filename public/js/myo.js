import myo from 'devices-ts';

//Wrapper to the MYO API
myo.connect("com.stolksdorf.myAwesomeApp");

//console.log("IN MYO SCRIPT");

myo.on("fist", myo => {
    console.log("Hello Myo!");
    myo.vibrate();
})

myMyo.on('connected', function(){
    myMyo.streamEMG(true);
});

myMyo.on('emg', function(data){
    console.log(data);
});


