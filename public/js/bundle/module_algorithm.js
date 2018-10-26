"use strict";

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

var time = 0;
var dt = 0.01;

/*Method sliding window computation, require less computation than the naive one*/
var ansX = [];
var ansY = [];
var ansZ = [];
var computedSpeedRate = 0;
var sumLastElem = 0;
var sumFirstElem = 0;
function computeSpeedRateAdaptativeWindow(windowLength, newX, newY, newZ) {
  if (ansX.length >= windowLength) {
    var firstElementX = ansX.shift();
    var firstElementY = ansY.shift();
    var firstElementZ = ansZ.shift();
    sumFirstElem = firstElementX + firstElementY + firstElementZ;
  }
  var x = Math.abs(newX / g);
  // let x = (newX/g);
  ansX.push(x);
  var y = Math.abs(newY / g);
  // let y = (newY/g);
  ansY.push(y);
  var z = Math.abs(newZ / g);
  //let z = (newZ/g);
  ansZ.push(z);

  sumLastElem = x + y + z;
  computedSpeedRate = computedSpeedRate - sumFirstElem + sumLastElem;

  return computedSpeedRate;
}

//Algorithm de calcul naif de la vitesse selon une fenetre: retourne le meme resultat que l'algorithme evolué
var ansXNaif = [];
var ansYNaif = [];
var ansZNaif = [];
function computeSpeedRateAdaptativeWindowNaif(windowLength, x, y, z) {
  console.log("The function computeSpeedRateAdaptativeWindowNaif is deprecated, use computeSpeedRateAdaptativeWindow instead.");
  if (ansXNaif.length >= windowLength) {
    ansXNaif.shift();
    ansYNaif.shift();
    ansZNaif.shift();
  }
  ansXNaif.push(x / g);
  ansYNaif.push(y / g);
  ansZNaif.push(z / g);

  var speedRate = 0;
  for (var i = 0; i < windowLength; i++) {
    speedRate += ansXNaif[i] + ansYNaif[i] + ansZNaif[i];
    //speedRate += Math.abs(ansX[i]/g)+ Math.abs(ansY[i]/g) +  Math.abs(ansZ[i]/g);
    // speedRate +=Math.sqrt(Math.pow( Math.abs(ansX[i]/g) ,2)+ Math.pow(  Math.abs(ansY[i]/g),2) + Math.pow( Math.abs(ansZ[i]/g),2));
  }
  return speedRate;
}

function displayAcceleroWindowSpeed(windowLength, data) {
  time += dt;
  var speedRate = computeSpeedRateAdaptativeWindow(windowLength, data.accelerometer.x, data.accelerometer.y, data.accelerometer.z);
  var frameAccelero = {
    time: time,
    data: [data.accelerometer.x * speedRate, data.accelerometer.y * speedRate, data.accelerometer.z * speedRate],
    metadata: true
  };
  eventInAccelero.processFrame(frameAccelero);
}

//For the sliding window of kinestetic awareness replication
var slidingWindow = [];
function displayEMGWindow(windowLength, data) {
  timeEMG += dtEMG;
  //Slinding window of EMG
  if (slidingWindow.length > windowLength) {
    slidingWindow.shift();
  }
  slidingWindow.push(Math.max.apply(Math, _toConsumableArray(data)));
  var maxSliding = Math.max.apply(Math, slidingWindow);
  var frameEMGSliding = {
    time: timeEMG,
    data: slidingWindow[slidingWindow.length - 1] / maxSliding
  };

  var frameEMG = {
    time: timeEMG,
    data: data
  };
  eventInEMGSliding.processFrame(frameEMGSliding);
  eventInEMG.processFrame(frameEMG);
}

//variables for the savitzky-golay filter
var arrayFilteringX = [];
var arrayFilteringY = [];
var arrayFilteringZ = [];
var ansx = [];
var ansy = [];
var ansz = [];
var options = { derivative: 1, windowSize: SGWindowLength - 1 };
var optionsGolayLowPass = { derivative: 0 };
function displaySmoothness(windowLengthSG, data) {
  //Calculing smoothness
  arrayFilteringX.push(data.accelerometer.x);
  arrayFilteringY.push(data.accelerometer.y);
  arrayFilteringZ.push(data.accelerometer.z);

  //taille de la fenetre de calcule de l'algorithme
  if (arrayFilteringZ.length >= windowLengthSG) {
    arrayFilteringX.shift();
    arrayFilteringY.shift();
    arrayFilteringZ.shift();

    //apllication de savitzky-golay filter
    ansx = SG(arrayFilteringX, 1, options);
    ansy = SG(arrayFilteringY, 1, options);
    ansz = SG(arrayFilteringZ, 1, options);

    //normalising data
    var normaliseData = Math.sqrt(Math.pow(ansx[ansx.length - 1], 2) + Math.pow(ansy[ansy.length - 1], 2) + Math.pow(ansz[ansz.length - 1], 2));
    var amplitudeData = computeAmplitudeWindow(amplitudeWindowLength, normaliseData);
    var speedRate = computeSpeedRateAdaptativeWindow(speedRateWindowLength, data.accelerometer.x, data.accelerometer.y, data.accelerometer.z);
    // console.log("speedRate : " + speedRate);

    if (recording) {
      arrayRecorded.push(normaliseData);
      console.log("arrayRecorded : " + arrayRecorded.length);
    }

    var frameSmoothness = {
      time: time,
      data: amplitudeData,
      //data: normaliseData,
      metadata: null
    };
    eventInSmoothness.processFrame(frameSmoothness);
  }
}

//version naive de l'algorithme, le for peut etre remplacé comme dans la fonction: computeSpeedRateAdaptativeWindow
//Moyenne des données du jerk normalisé
var arrayAmplitude = [];
function computeAmplitudeWindow(windowLength, data) {
  var amplitudeRate = 0;
  if (arrayAmplitude.length > windowLength) {
    arrayAmplitude.shift();
  }
  arrayAmplitude.push(data);
  for (var i = 0; i < windowLength; i++) {
    amplitudeRate += arrayAmplitude[i];
  }
  amplitudeRate /= windowLength;
  // console.log("amplitudeRate : " + amplitudeRate );
  return amplitudeRate;
}

window.setSGWindowLength = function (newValue) {
  //console.log("new value SG : " + newValue);
  SGWindowLength = newValue;
  options = { derivative: 1, windowSize: SGWindowLength - 1 };

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZV9hbGdvcml0aG0uanMiXSwibmFtZXMiOlsidGltZSIsImR0IiwiYW5zWCIsImFuc1kiLCJhbnNaIiwiY29tcHV0ZWRTcGVlZFJhdGUiLCJzdW1MYXN0RWxlbSIsInN1bUZpcnN0RWxlbSIsImNvbXB1dGVTcGVlZFJhdGVBZGFwdGF0aXZlV2luZG93Iiwid2luZG93TGVuZ3RoIiwibmV3WCIsIm5ld1kiLCJuZXdaIiwibGVuZ3RoIiwiZmlyc3RFbGVtZW50WCIsInNoaWZ0IiwiZmlyc3RFbGVtZW50WSIsImZpcnN0RWxlbWVudFoiLCJ4IiwiTWF0aCIsImFicyIsImciLCJwdXNoIiwieSIsInoiLCJhbnNYTmFpZiIsImFuc1lOYWlmIiwiYW5zWk5haWYiLCJjb21wdXRlU3BlZWRSYXRlQWRhcHRhdGl2ZVdpbmRvd05haWYiLCJjb25zb2xlIiwibG9nIiwic3BlZWRSYXRlIiwiaSIsImRpc3BsYXlBY2NlbGVyb1dpbmRvd1NwZWVkIiwiZGF0YSIsImFjY2VsZXJvbWV0ZXIiLCJmcmFtZUFjY2VsZXJvIiwibWV0YWRhdGEiLCJldmVudEluQWNjZWxlcm8iLCJwcm9jZXNzRnJhbWUiLCJzbGlkaW5nV2luZG93IiwiZGlzcGxheUVNR1dpbmRvdyIsInRpbWVFTUciLCJkdEVNRyIsIm1heCIsIm1heFNsaWRpbmciLCJmcmFtZUVNR1NsaWRpbmciLCJmcmFtZUVNRyIsImV2ZW50SW5FTUdTbGlkaW5nIiwiZXZlbnRJbkVNRyIsImFycmF5RmlsdGVyaW5nWCIsImFycmF5RmlsdGVyaW5nWSIsImFycmF5RmlsdGVyaW5nWiIsImFuc3giLCJhbnN5IiwiYW5zeiIsIm9wdGlvbnMiLCJkZXJpdmF0aXZlIiwid2luZG93U2l6ZSIsIlNHV2luZG93TGVuZ3RoIiwib3B0aW9uc0dvbGF5TG93UGFzcyIsImRpc3BsYXlTbW9vdGhuZXNzIiwid2luZG93TGVuZ3RoU0ciLCJTRyIsIm5vcm1hbGlzZURhdGEiLCJzcXJ0IiwicG93IiwiYW1wbGl0dWRlRGF0YSIsImNvbXB1dGVBbXBsaXR1ZGVXaW5kb3ciLCJhbXBsaXR1ZGVXaW5kb3dMZW5ndGgiLCJzcGVlZFJhdGVXaW5kb3dMZW5ndGgiLCJyZWNvcmRpbmciLCJhcnJheVJlY29yZGVkIiwiZnJhbWVTbW9vdGhuZXNzIiwiZXZlbnRJblNtb290aG5lc3MiLCJhcnJheUFtcGxpdHVkZSIsImFtcGxpdHVkZVJhdGUiLCJ3aW5kb3ciLCJzZXRTR1dpbmRvd0xlbmd0aCIsIm5ld1ZhbHVlIiwic2V0QW1wbGl0dWRlV2luZG93TGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLE9BQUosQUFBVztBQUNYLElBQUksS0FBSixBQUFTOztBQUVUO0FBQ0EsSUFBSSxPQUFKLEFBQVc7QUFDWCxJQUFJLE9BQUosQUFBVztBQUNYLElBQUksT0FBSixBQUFXO0FBQ1gsSUFBSSxvQkFBSixBQUF3QjtBQUN4QixJQUFJLGNBQUosQUFBa0I7QUFDbEIsSUFBSSxlQUFKLEFBQW1CO0FBQ25CLFNBQUEsQUFBUyxpQ0FBVCxBQUEwQyxjQUExQyxBQUF3RCxNQUF4RCxBQUE2RCxNQUE3RCxBQUFrRSxNQUFNLEFBQ3RFO01BQUksS0FBQSxBQUFLLFVBQVQsQUFBbUIsY0FBYyxBQUMvQjtRQUFJLGdCQUFnQixLQUFwQixBQUFvQixBQUFLLEFBQ3pCO1FBQUksZ0JBQWdCLEtBQXBCLEFBQW9CLEFBQUssQUFDekI7UUFBSSxnQkFBZ0IsS0FBcEIsQUFBb0IsQUFBSyxBQUN6QjttQkFBZSxBQUFDLGdCQUFELEFBQW9CLGdCQUFuQyxBQUFzRCxBQUN2RDtBQUNEO01BQUksSUFBSSxLQUFBLEFBQUssSUFBSSxPQUFqQixBQUFRLEFBQWMsQUFDdEI7QUFDQTtPQUFBLEFBQUssS0FBTCxBQUFVLEFBQ1Y7TUFBSSxJQUFJLEtBQUEsQUFBSyxJQUFJLE9BQWpCLEFBQVEsQUFBYyxBQUN0QjtBQUNBO09BQUEsQUFBSyxLQUFMLEFBQVUsQUFDVjtNQUFJLElBQUksS0FBQSxBQUFLLElBQUksT0FBakIsQUFBUSxBQUFjLEFBQ3RCO0FB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STtZQUFrQixBQUNkLEFBQ047WUFGb0IsQUFFZCxBQUNOO0FBQ0E7Z0JBSkYsQUFBc0IsQUFJWCxBQUVYO0FBTnNCLEFBQ3BCO3NCQUtGLEFBQWtCLGFBQWxCLEFBQStCLEFBQ2hDO0FBQ0Y7OztBQUVEO0FBQ0E7QUFDQSxJQUFJLGlCQUFKLEFBQW9CO0FBQ3BCLFNBQUEsQUFBUyx1QkFBVCxBQUFnQyxjQUFoQyxBQUE4QyxNQUFLLEFBQ2pEO01BQUksZ0JBQUosQUFBb0IsQUFDcEI7TUFBRyxlQUFBLEFBQWUsU0FBbEIsQUFBMkIsY0FBYSxBQUN0QzttQkFBQSxBQUFlLEFBQ2hCO0FBQ0Q7aUJBQUEsQUFBZSxLQUFmLEFBQW9CLEFBQ3BCO09BQUssSUFBSSxJQUFULEFBQWEsR0FBRyxJQUFoQixBQUFvQixjQUFwQixBQUFtQyxLQUFLLEFBQ3RDO3FCQUFpQixlQUFqQixBQUFpQixBQUFlLEFBQ2pDO0FBQ0Q7bUJBQUEsQUFBaUIsQUFDakI7QUFDQTtTQUFBLEFBQU8sQUFDUjs7O0FBRUQsT0FBQSxBQUFPLG9CQUFvQixVQUFBLEFBQVUsVUFBUyxBQUM1QztBQUNBO21CQUFBLEFBQWdCLEFBQ2hCO1lBQVUsRUFBQyxZQUFELEFBQWEsR0FBRSxZQUFZLGlCQUFyQyxBQUFVLEFBQTBDLEFBRXBEOztvQkFBQSxBQUFrQixBQUNsQjtvQkFBQSxBQUFrQixBQUNsQjtvQkFBQSxBQUFrQixBQUNsQjtTQUFBLEFBQU8sQUFDUDtTQUFBLEFBQU8sQUFDUDtTQUFBLEFBQU8sQUFDUjtBQVhEOztBQWFBLE9BQUEsQUFBTywyQkFBMkIsVUFBQSxBQUFVLFVBQVUsQUFDcEQ7MEJBQUEsQUFBd0IsQUFDekI7QUFGRCIsImZpbGUiOiJtb2R1bGVfYWxnb3JpdGhtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbnZhciB0aW1lID0gMDtcbnZhciBkdCA9IDAuMDE7XG5cbi8qTWV0aG9kIHNsaWRpbmcgd2luZG93IGNvbXB1dGF0aW9uLCByZXF1aXJlIGxlc3MgY29tcHV0YXRpb24gdGhhbiB0aGUgbmFpdmUgb25lKi9cbnZhciBhbnNYID0gW107XG52YXIgYW5zWSA9IFtdO1xudmFyIGFuc1ogPSBbXTtcbnZhciBjb21wdXRlZFNwZWVkUmF0ZSA9IDA7XG52YXIgc3VtTGFzdEVsZW0gPSAwO1xudmFyIHN1bUZpcnN0RWxlbSA9IDA7XG5mdW5jdGlvbiBjb21wdXRlU3BlZWRSYXRlQWRhcHRhdGl2ZVdpbmRvdyh3aW5kb3dMZW5ndGgsIG5ld1gsbmV3WSxuZXdaKSB7XG4gIGlmIChhbnNYLmxlbmd0aCA+PSB3aW5kb3dMZW5ndGgpIHtcbiAgICB2YXIgZmlyc3RFbGVtZW50WCA9IGFuc1guc2hpZnQoKTtcbiAgICB2YXIgZmlyc3RFbGVtZW50WSA9IGFuc1kuc2hpZnQoKTtcbiAgICB2YXIgZmlyc3RFbGVtZW50WiA9IGFuc1ouc2hpZnQoKTtcbiAgICBzdW1GaXJzdEVsZW0gPSAoZmlyc3RFbGVtZW50WCApICsgKGZpcnN0RWxlbWVudFkgKSArIChmaXJzdEVsZW1lbnRaICk7XG4gIH1cbiAgbGV0IHggPSBNYXRoLmFicyhuZXdYL2cpO1xuICAvLyBsZXQgeCA9IChuZXdYL2cpO1xuICBhbnNYLnB1c2goeCk7XG4gIGxldCB5ID0gTWF0aC5hYnMobmV3WS9nKTtcbiAgLy8gbGV0IHkgPSAobmV3WS9nKTtcbiAgYW5zWS5wdXNoKHkpO1xuICBsZXQgeiA9IE1hdGguYWJzKG5ld1ovZyk7XG4gIC8vbGV0IHogPSAobmV3Wi9nKTtcbiAgYW5zWi5wdXNoKHopO1xuICBcbiAgc3VtTGFzdEVsZW0gPSAoeCkrKHkpKyh6KTtcbiAgY29tcHV0ZWRTcGVlZFJhdGUgPSBjb21wdXRlZFNwZWVkUmF0ZSAtIHN1bUZpcnN0RWxlbSArIHN1bUxhc3RFbGVtO1xuICBcbiAgcmV0dXJuIGNvbXB1dGVkU3BlZWRSYXRlO1xufVxuXG5cbi8vQWxnb3JpdGhtIGRlIGNhbGN1bCBuYWlmIGRlIGxhIHZpdGVzc2Ugc2Vsb24gdW5lIGZlbmV0cmU6IHJldG91cm5lIGxlIG1lbWUgcmVzdWx0YXQgcXVlIGwnYWxnb3JpdGhtZSBldm9sdcOpXG52YXIgYW5zWE5haWYgPSBbXTtcbnZhciBhbnNZTmFpZiA9IFtdO1xudmFyIGFuc1pOYWlmID0gW107XG5mdW5jdGlvbiBjb21wdXRlU3BlZWRSYXRlQWRhcHRhdGl2ZVdpbmRvd05haWYod2luZG93TGVuZ3RoLHgseSx6KXtcbiAgY29uc29sZS5sb2coXCJUaGUgZnVuY3Rpb24gY29tcHV0ZVNwZWVkUmF0ZUFkYXB0YXRpdmVXaW5kb3dOYWlmIGlzIGRlcHJlY2F0ZWQsIHVzZSBjb21wdXRlU3BlZWRSYXRlQWRhcHRhdGl2ZVdpbmRvdyBpbnN0ZWFkLlwiKTtcbiAgaWYgKGFuc1hOYWlmLmxlbmd0aCA+PSB3aW5kb3dMZW5ndGgpIHtcbiAgICBhbnNYTmFpZi5zaGlmdCgpO1xuICAgIGFuc1lOYWlmLnNoaWZ0KCk7XG4gICAgYW5zWk5haWYuc2hpZnQoKTtcbiAgfVxuICBhbnNYTmFpZi5wdXNoKHgvZyk7XG4gIGFuc1lOYWlmLnB1c2goeS9nKTtcbiAgYW5zWk5haWYucHVzaCh6L2cpO1xuICBcbiAgbGV0ICBzcGVlZFJhdGUgPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd0xlbmd0aCA7IGkrKykge1xuICAgIHNwZWVkUmF0ZSArPSAoYW5zWE5haWZbaV0pICsgKGFuc1lOYWlmW2ldKSArIChhbnNaTmFpZltpXSk7XG4gICAgLy9zcGVlZFJhdGUgKz0gTWF0aC5hYnMoYW5zWFtpXS9nKSsgTWF0aC5hYnMoYW5zWVtpXS9nKSArICBNYXRoLmFicyhhbnNaW2ldL2cpO1xuICAgIC8vIHNwZWVkUmF0ZSArPU1hdGguc3FydChNYXRoLnBvdyggTWF0aC5hYnMoYW5zWFtpXS9nKSAsMikrIE1hdGgucG93KCAgTWF0aC5hYnMoYW5zWVtpXS9nKSwyKSArIE1hdGgucG93KCBNYXRoLmFicyhhbnNaW2ldL2cpLDIpKTtcbiAgfVxuICByZXR1cm4gc3BlZWRSYXRlO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5QWNjZWxlcm9XaW5kb3dTcGVlZCh3aW5kb3dMZW5ndGgsIGRhdGEpe1xuICB0aW1lICs9IGR0O1xuICBsZXQgc3BlZWRSYXRlID0gY29tcHV0ZVNwZWVkUmF0ZUFkYXB0YXRpdmVXaW5kb3cod2luZG93TGVuZ3RoLGRhdGEuYWNjZWxlcm9tZXRlci54LCBkYXRhLmFjY2VsZXJvbWV0ZXIueSwgZGF0YS5hY2NlbGVyb21ldGVyLnopO1xuICBjb25zdCBmcmFtZUFjY2VsZXJvID0ge1xuICAgIHRpbWU6IHRpbWUsXG4gICAgZGF0YTogW2RhdGEuYWNjZWxlcm9tZXRlci54KihzcGVlZFJhdGUpLCBkYXRhLmFjY2VsZXJvbWV0ZXIueSooc3BlZWRSYXRlKSwgZGF0YS5hY2NlbGVyb21ldGVyLnoqKHNwZWVkUmF0ZSldLFxuICAgIG1ldGFkYXRhOnRydWUsXG4gIH07XG4gIGV2ZW50SW5BY2NlbGVyby5wcm9jZXNzRnJhbWUoZnJhbWVBY2NlbGVybyk7XG59XG5cblxuLy9Gb3IgdGhlIHNsaWRpbmcgd2luZG93IG9mIGtpbmVzdGV0aWMgYXdhcmVuZXNzIHJlcGxpY2F0aW9uXG5sZXQgc2xpZGluZ1dpbmRvdyA9IFtdO1xuZnVuY3Rpb24gZGlzcGxheUVNR1dpbmRvdyh3aW5kb3dMZW5ndGgsIGRhdGEpe1xuICB0aW1lRU1HICs9IGR0RU1HO1xuICAvL1NsaW5kaW5nIHdpbmRvdyBvZiBFTUdcbiAgaWYoc2xpZGluZ1dpbmRvdy5sZW5ndGggPiB3aW5kb3dMZW5ndGgpe1xuICAgIHNsaWRpbmdXaW5kb3cuc2hpZnQoKTtcbiAgfVxuICBzbGlkaW5nV2luZG93LnB1c2goTWF0aC5tYXgoLi4uZGF0YSkpO1xuICBsZXQgbWF4U2xpZGluZyA9IE1hdGgubWF4KC4uLnNsaWRpbmdXaW5kb3cpO1xuICBjb25zdCBmcmFtZUVNR1NsaWRpbmcgPSB7XG4gICAgdGltZTogdGltZUVNRyxcbiAgICBkYXRhOiBzbGlkaW5nV2luZG93W3NsaWRpbmdXaW5kb3cubGVuZ3RoLTFdL21heFNsaWRpbmcsXG4gIH07XG4gIFxuICBjb25zdCBmcmFtZUVNRyA9IHtcbiAgICB0aW1lOiB0aW1lRU1HLFxuICAgIGRhdGE6IGRhdGEsXG4gIH07XG4gIGV2ZW50SW5FTUdTbGlkaW5nLnByb2Nlc3NGcmFtZShmcmFtZUVNR1NsaWRpbmcpO1xuICBldmVudEluRU1HLnByb2Nlc3NGcmFtZShmcmFtZUVNRyk7XG59XG5cblxuLy92YXJpYWJsZXMgZm9yIHRoZSBzYXZpdHpreS1nb2xheSBmaWx0ZXJcbmxldCBhcnJheUZpbHRlcmluZ1ggPSBbXTtcbmxldCBhcnJheUZpbHRlcmluZ1kgPSBbXTtcbmxldCBhcnJheUZpbHRlcmluZ1ogPSBbXTtcbmxldCBhbnN4ID0gW107XG5sZXQgYW5zeSA9IFtdO1xubGV0IGFuc3ogPSBbXTtcbnZhciBvcHRpb25zID0ge2Rlcml2YXRpdmU6IDEsd2luZG93U2l6ZTogU0dXaW5kb3dMZW5ndGgtMX07XG5sZXQgb3B0aW9uc0dvbGF5TG93UGFzcyA9IHtkZXJpdmF0aXZlOiAwfTtcbmZ1bmN0aW9uIGRpc3BsYXlTbW9vdGhuZXNzKHdpbmRvd0xlbmd0aFNHLCBkYXRhICl7XG4gIC8vQ2FsY3VsaW5nIHNtb290aG5lc3NcbiAgYXJyYXlGaWx0ZXJpbmdYLnB1c2goZGF0YS5hY2NlbGVyb21ldGVyLngpO1xuICBhcnJheUZpbHRlcmluZ1kucHVzaChkYXRhLmFjY2VsZXJvbWV0ZXIueSk7XG4gIGFycmF5RmlsdGVyaW5nWi5wdXNoKGRhdGEuYWNjZWxlcm9tZXRlci56KTtcbiAgXG4gIC8vdGFpbGxlIGRlIGxhIGZlbmV0cmUgZGUgY2FsY3VsZSBkZSBsJ2FsZ29yaXRobWVcbiAgaWYoYXJyYXlGaWx0ZXJpbmdaLmxlbmd0aCA+PSB3aW5kb3dMZW5ndGhTRyApe1xuICAgIGFycmF5RmlsdGVyaW5nWC5zaGlmdCgpO1xuICAgIGFycmF5RmlsdGVyaW5nWS5zaGlmdCgpO1xuICAgIGFycmF5RmlsdGVyaW5nWi5zaGlmdCgpO1xuICAgIFxuICAgIC8vYXBsbGljYXRpb24gZGUgc2F2aXR6a3ktZ29sYXkgZmlsdGVyXG4gICAgYW5zeCA9ICBTRyhhcnJheUZpbHRlcmluZ1gsIDEsIG9wdGlvbnMpO1xuICAgIGFuc3kgPSAgU0coYXJyYXlGaWx0ZXJpbmdZLCAxLCBvcHRpb25zKTtcbiAgICBhbnN6ID0gIFNHKGFycmF5RmlsdGVyaW5nWiwgMSwgb3B0aW9ucyk7XG4gICAgXG4gICAgLy9ub3JtYWxpc2luZyBkYXRhXG4gICAgbGV0IG5vcm1hbGlzZURhdGEgPSBNYXRoLnNxcnQoTWF0aC5wb3coYW5zeFthbnN4Lmxlbmd0aCAtIDFdLDIpK01hdGgucG93KGFuc3lbYW5zeS5sZW5ndGggLSAxXSwyKStNYXRoLnBvdyhhbnN6W2Fuc3oubGVuZ3RoIC0gMV0sMikpO1xuICAgIGxldCBhbXBsaXR1ZGVEYXRhID0gY29tcHV0ZUFtcGxpdHVkZVdpbmRvdyhhbXBsaXR1ZGVXaW5kb3dMZW5ndGgsbm9ybWFsaXNlRGF0YSk7XG4gICAgbGV0IHNwZWVkUmF0ZSA9IGNvbXB1dGVTcGVlZFJhdGVBZGFwdGF0aXZlV2luZG93KHNwZWVkUmF0ZVdpbmRvd0xlbmd0aCxkYXRhLmFjY2VsZXJvbWV0ZXIueCxkYXRhLmFjY2VsZXJvbWV0ZXIueSxkYXRhLmFjY2VsZXJvbWV0ZXIueik7XG4gICAgLy8gY29uc29sZS5sb2coXCJzcGVlZFJhdGUgOiBcIiArIHNwZWVkUmF0ZSk7XG4gICAgXG4gICAgaWYocmVjb3JkaW5nKXtcbiAgICAgIGFycmF5UmVjb3JkZWQucHVzaChub3JtYWxpc2VEYXRhKTtcbiAgICAgIGNvbnNvbGUubG9nKFwiYXJyYXlSZWNvcmRlZCA6IFwiICsgYXJyYXlSZWNvcmRlZC5sZW5ndGgpO1xuICAgIH1cbiAgICBcbiAgICBsZXQgZnJhbWVTbW9vdGhuZXNzID0ge1xuICAgICAgdGltZTogdGltZSxcbiAgICAgIGRhdGE6IGFtcGxpdHVkZURhdGEsXG4gICAgICAvL2RhdGE6IG5vcm1hbGlzZURhdGEsXG4gICAgICBtZXRhZGF0YTpudWxsLFxuICAgIH07XG4gICAgZXZlbnRJblNtb290aG5lc3MucHJvY2Vzc0ZyYW1lKGZyYW1lU21vb3RobmVzcyk7XG4gIH1cbn1cblxuLy92ZXJzaW9uIG5haXZlIGRlIGwnYWxnb3JpdGhtZSwgbGUgZm9yIHBldXQgZXRyZSByZW1wbGFjw6kgY29tbWUgZGFucyBsYSBmb25jdGlvbjogY29tcHV0ZVNwZWVkUmF0ZUFkYXB0YXRpdmVXaW5kb3dcbi8vTW95ZW5uZSBkZXMgZG9ubsOpZXMgZHUgamVyayBub3JtYWxpc8OpXG52YXIgYXJyYXlBbXBsaXR1ZGUgPVtdO1xuZnVuY3Rpb24gY29tcHV0ZUFtcGxpdHVkZVdpbmRvdyh3aW5kb3dMZW5ndGgsIGRhdGEpe1xuICBsZXQgYW1wbGl0dWRlUmF0ZSA9IDA7XG4gIGlmKGFycmF5QW1wbGl0dWRlLmxlbmd0aCA+IHdpbmRvd0xlbmd0aCl7XG4gICAgYXJyYXlBbXBsaXR1ZGUuc2hpZnQoKTtcbiAgfVxuICBhcnJheUFtcGxpdHVkZS5wdXNoKGRhdGEpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHdpbmRvd0xlbmd0aCA7IGkrKykge1xuICAgIGFtcGxpdHVkZVJhdGUgKz0gYXJyYXlBbXBsaXR1ZGVbaV07XG4gIH1cbiAgYW1wbGl0dWRlUmF0ZSAvPSB3aW5kb3dMZW5ndGg7XG4gIC8vIGNvbnNvbGUubG9nKFwiYW1wbGl0dWRlUmF0ZSA6IFwiICsgYW1wbGl0dWRlUmF0ZSApO1xuICByZXR1cm4gYW1wbGl0dWRlUmF0ZTtcbn1cblxud2luZG93LnNldFNHV2luZG93TGVuZ3RoID0gZnVuY3Rpb24gKG5ld1ZhbHVlKXtcbiAgLy9jb25zb2xlLmxvZyhcIm5ldyB2YWx1ZSBTRyA6IFwiICsgbmV3VmFsdWUpO1xuICBTR1dpbmRvd0xlbmd0aD0gbmV3VmFsdWU7XG4gIG9wdGlvbnMgPSB7ZGVyaXZhdGl2ZTogMSx3aW5kb3dTaXplOiBTR1dpbmRvd0xlbmd0aC0xfTtcbiAgXG4gIGFycmF5RmlsdGVyaW5nWCA9IFtdO1xuICBhcnJheUZpbHRlcmluZ1kgPSBbXTtcbiAgYXJyYXlGaWx0ZXJpbmdaID0gW107XG4gIGFuc1ggPSBbXTtcbiAgYW5zWSA9IFtdO1xuICBhbnNaID0gW107XG59O1xuXG53aW5kb3cuc2V0QW1wbGl0dWRlV2luZG93TGVuZ3RoID0gZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XG4gIGFtcGxpdHVkZVdpbmRvd0xlbmd0aCA9IG5ld1ZhbHVlO1xufTtcbiJdfQ==