/*
/!* This file is for test only *!/
/!*

You will find here duplicated code from multiple part
 *!/


console.log("**** TESTING FILE IS ON **** ");
var analyzeData = document.getElementById('analyzeData');
var dataAnalyst = DataAnalyst;

analyzeData.addEventListener("click", analyzeDatafctn);
var btnloadSH1 = document.getElementById('loadSHvideo1');
btnloadSH1.addEventListener("click", loadSH1 );
analyzeData.addEventListener("mousedown", analyzeData);




//WHen the video is loaded
var test = function () {
  video.addEventListener('loadedmetadata', function() {
    Player.playPausecallback();
  
    /!*console.log(generateJSONfromvar());
    var generatedJson = JSON.stringify(P1W2);
    var my_JSON_object = JSON.parse(generatedJson);
    console.log(my_JSON_object);
    for (let k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }
    analyzeData.click();
  
    console.log(generateJSONfromvar());
    var generatedJson = JSON.stringify(P2W2);
    var my_JSON_object = JSON.parse(generatedJson);
    console.log(my_JSON_object);
    for (let k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }
    analyzeData.click();
  
    console.log(generateJSONfromvar());
    var generatedJson = JSON.stringify(P3W2);
    var my_JSON_object = JSON.parse(generatedJson);
    console.log(my_JSON_object);
    for (let k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }
    analyzeData.click();
  
    console.log(generateJSONfromvar());
    var generatedJson = JSON.stringify(P9W2);
    var my_JSON_object = JSON.parse(generatedJson);
    console.log(my_JSON_object);
    for (let k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }    analyzeData.click();
  
  
    console.log(generateJSONfromvar());
    var generatedJson = JSON.stringify(P11W2);
    var my_JSON_object = JSON.parse(generatedJson);
    console.log(my_JSON_object);
    for (let k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }    analyzeData.click();
    analyzeData.click();*!/
  
    console.log(generateJSONfromvar());
    var generatedJson = JSON.stringify(GI1);
    var my_JSON_object = JSON.parse(generatedJson);
    console.log(my_JSON_object);
    for (let k = 0; k < my_JSON_object.length; k++) {
      addingNewCardsFromJSon(my_JSON_object[k]);
    }
    analyzeData.click();
  
  
  });
};

test();


function analyzeDatafctn(){
  analyseData1();
}


function loadSH1(){
  loadJSONSegmentHistory1() ;
}

/!*
End of testing File
 *!/*/
