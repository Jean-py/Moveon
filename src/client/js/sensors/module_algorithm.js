

var time = 0;
var dt = 0.01;

/*Method sliding window computation, require less computation than the naive one*/
var ansX = [];
var ansY = [];
var ansZ = [];
var computedSpeedRate = 0;
var sumLastElem = 0;
var sumFirstElem = 0;
function computeSpeedRateAdaptativeWindow(windowLength, newX,newY,newZ) {
  if (ansX.length >= windowLength) {
    var firstElementX = ansX.shift();
    var firstElementY = ansY.shift();
    var firstElementZ = ansZ.shift();
    sumFirstElem = (firstElementX ) + (firstElementY ) + (firstElementZ );
  }
  let x = Math.abs(newX/g);
  // let x = (newX/g);
  ansX.push(x);
  let y = Math.abs(newY/g);
  // let y = (newY/g);
  ansY.push(y);
  let z = Math.abs(newZ/g);
  //let z = (newZ/g);
  ansZ.push(z);
  
  sumLastElem = (x)+(y)+(z);
  computedSpeedRate = computedSpeedRate - sumFirstElem + sumLastElem;
  
  return computedSpeedRate;
}


//Algorithm de calcul naif de la vitesse selon une fenetre: retourne le meme resultat que l'algorithme evolué
var ansXNaif = [];
var ansYNaif = [];
var ansZNaif = [];
function computeSpeedRateAdaptativeWindowNaif(windowLength,x,y,z){
  console.log("The function computeSpeedRateAdaptativeWindowNaif is deprecated, use computeSpeedRateAdaptativeWindow instead.");
  if (ansXNaif.length >= windowLength) {
    ansXNaif.shift();
    ansYNaif.shift();
    ansZNaif.shift();
  }
  ansXNaif.push(x/g);
  ansYNaif.push(y/g);
  ansZNaif.push(z/g);
  
  let  speedRate = 0;
  for (let i = 0; i < windowLength ; i++) {
    speedRate += (ansXNaif[i]) + (ansYNaif[i]) + (ansZNaif[i]);
    //speedRate += Math.abs(ansX[i]/g)+ Math.abs(ansY[i]/g) +  Math.abs(ansZ[i]/g);
    // speedRate +=Math.sqrt(Math.pow( Math.abs(ansX[i]/g) ,2)+ Math.pow(  Math.abs(ansY[i]/g),2) + Math.pow( Math.abs(ansZ[i]/g),2));
  }
  return speedRate;
}

function displayAcceleroWindowSpeed(windowLength, data){
  time += dt;
  let speedRate = computeSpeedRateAdaptativeWindow(windowLength,data.accelerometer.x, data.accelerometer.y, data.accelerometer.z);
  const frameAccelero = {
    time: time,
    data: [data.accelerometer.x*(speedRate), data.accelerometer.y*(speedRate), data.accelerometer.z*(speedRate)],
    metadata:true,
  };
  eventInAccelero.processFrame(frameAccelero);
}


//For the sliding window of kinestetic awareness replication
let slidingWindow = [];
function displayEMGWindow(windowLength, data){
  timeEMG += dtEMG;
  //Slinding window of EMG
  if(slidingWindow.length > windowLength){
    slidingWindow.shift();
  }
  slidingWindow.push(Math.max(...data));
  let maxSliding = Math.max(...slidingWindow);
  const frameEMGSliding = {
    time: timeEMG,
    data: slidingWindow[slidingWindow.length-1]/maxSliding,
  };
  
  const frameEMG = {
    time: timeEMG,
    data: data,
  };
  eventInEMGSliding.processFrame(frameEMGSliding);
  eventInEMG.processFrame(frameEMG);
}


//variables for the savitzky-golay filter
let arrayFilteringX = [];
let arrayFilteringY = [];
let arrayFilteringZ = [];
let ansx = [];
let ansy = [];
let ansz = [];
var options = {derivative: 1,windowSize: SGWindowLength-1};
let optionsGolayLowPass = {derivative: 0};
function displaySmoothness(windowLengthSG, data ){
  //Calculing smoothness
  arrayFilteringX.push(data.accelerometer.x);
  arrayFilteringY.push(data.accelerometer.y);
  arrayFilteringZ.push(data.accelerometer.z);
  
  //taille de la fenetre de calcule de l'algorithme
  if(arrayFilteringZ.length >= windowLengthSG ){
    arrayFilteringX.shift();
    arrayFilteringY.shift();
    arrayFilteringZ.shift();
    
    //apllication de savitzky-golay filter
    ansx =  SG(arrayFilteringX, 1, options);
    ansy =  SG(arrayFilteringY, 1, options);
    ansz =  SG(arrayFilteringZ, 1, options);
    
    //normalising data
    let normaliseData = Math.sqrt(Math.pow(ansx[ansx.length - 1],2)+Math.pow(ansy[ansy.length - 1],2)+Math.pow(ansz[ansz.length - 1],2));
    let amplitudeData = computeAmplitudeWindow(amplitudeWindowLength,normaliseData);
    let speedRate = computeSpeedRateAdaptativeWindow(speedRateWindowLength,data.accelerometer.x,data.accelerometer.y,data.accelerometer.z);
    // console.log("speedRate : " + speedRate);
    
    if(recording){
      arrayRecorded.push(normaliseData);
      console.log("arrayRecorded : " + arrayRecorded.length);
    }
    
    let frameSmoothness = {
      time: time,
      data: amplitudeData,
      //data: normaliseData,
      metadata:null,
    };
    eventInSmoothness.processFrame(frameSmoothness);
  }
}

//version naive de l'algorithme, le for peut etre remplacé comme dans la fonction: computeSpeedRateAdaptativeWindow
//Moyenne des données du jerk normalisé
var arrayAmplitude =[];
function computeAmplitudeWindow(windowLength, data){
  let amplitudeRate = 0;
  if(arrayAmplitude.length > windowLength){
    arrayAmplitude.shift();
  }
  arrayAmplitude.push(data);
  for (let i = 0; i < windowLength ; i++) {
    amplitudeRate += arrayAmplitude[i];
  }
  amplitudeRate /= windowLength;
  // console.log("amplitudeRate : " + amplitudeRate );
  return amplitudeRate;
}

window.setSGWindowLength = function (newValue){
  //console.log("new value SG : " + newValue);
  SGWindowLength= newValue;
  options = {derivative: 1,windowSize: SGWindowLength-1};
  
  arrayFilteringX = [];
  arrayFilteringY = [];
  arrayFilteringZ = [];
  ansX = [];
  ansY = [];
  ansZ = [];
};

window.setAmplitudeWindowLength = function (newValue) {
  amplitudeWindowLength = newValue;
};
