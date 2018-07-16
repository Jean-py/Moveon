//Wrapper to access to data sensors of a smartphone
    var _alphaGyro = 0;
    var _betaGyro = 0;
    var _gammaGyro = 0;
    var _xAccelero =0;
    var _yAccelero =0;
    var _zAccelero =0;
    
    function init(){
        // Check to make sure the browser supprots DeviceOrientationEvents
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', deviceOrientationHandler, false);
        }
        function deviceOrientationHandler() {
            // Get the left-to-right tilt (in degrees).
            _gammaGyro = event.gamma;

            // Get the front-to-back tilt (in degrees).
            _betaGyro = event.beta;

            // Get the direction of the device (in degrees).
            _alphaGyro = event.alpha;
        }
  

    }
    

    //TODO analyser cette partie du code qui me semble bancale pour le
//      moment. Le code doit renvoyer un boolean et il
//      faut eviter le !=null, mais c'est le seul moyen que j'ai maintenant pour tester la valeur
    function isConnected(){
        return (window.DeviceOrientationEvent != null);
    }




//TODO
//Normaliser le gyro + Accelero
//Ajouter des fonctions?

//add listener to orientation

// Accelero
/*
function getxAccelero(eventData){
    return ${eventData.accelerationIncludingGravity.x};
}

function getyAccelero(eventData){
    return ${eventData.accelerationIncludingGravity.y};
}

function getzAccelero(eventData){
    return ${eventData.accelerationIncludingGravity.z};
}
*/

//Gyroscope
/*function getAlphaGyroscope(eventData){
    return  ${eventData.rotationRate.alpha};
}

function getBetaGyroscope(eventData){
    return  ${eventData.rotationRate.beta};
}

function getGammaGyroscope(eventData){
    return  ${eventData.rotationRate.gamma};
}*/

//Orientation
/*
function getxOrientation(event){
    return event.alpha;
}
function getyOrientation(event){
    return event.beta;
}
function getzOrientation(event){
    return event.gamma;
}
*/



