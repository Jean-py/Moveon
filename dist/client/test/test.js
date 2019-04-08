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
"use strict";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEiLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4vISogVGhpcyBmaWxlIGlzIGZvciB0ZXN0IG9ubHkgKiEvXG4vISpcblxuWW91IHdpbGwgZmluZCBoZXJlIGR1cGxpY2F0ZWQgY29kZSBmcm9tIG11bHRpcGxlIHBhcnRcbiAqIS9cblxuXG5jb25zb2xlLmxvZyhcIioqKiogVEVTVElORyBGSUxFIElTIE9OICoqKiogXCIpO1xudmFyIGFuYWx5emVEYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FuYWx5emVEYXRhJyk7XG52YXIgZGF0YUFuYWx5c3QgPSBEYXRhQW5hbHlzdDtcblxuYW5hbHl6ZURhdGEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGFuYWx5emVEYXRhZmN0bik7XG52YXIgYnRubG9hZFNIMSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkU0h2aWRlbzEnKTtcbmJ0bmxvYWRTSDEuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxvYWRTSDEgKTtcbmFuYWx5emVEYXRhLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgYW5hbHl6ZURhdGEpO1xuXG5cblxuXG4vL1dIZW4gdGhlIHZpZGVvIGlzIGxvYWRlZFxudmFyIHRlc3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZG1ldGFkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgUGxheWVyLnBsYXlQYXVzZWNhbGxiYWNrKCk7XG4gIFxuICAgIC8hKmNvbnNvbGUubG9nKGdlbmVyYXRlSlNPTmZyb212YXIoKSk7XG4gICAgdmFyIGdlbmVyYXRlZEpzb24gPSBKU09OLnN0cmluZ2lmeShQMVcyKTtcbiAgICB2YXIgbXlfSlNPTl9vYmplY3QgPSBKU09OLnBhcnNlKGdlbmVyYXRlZEpzb24pO1xuICAgIGNvbnNvbGUubG9nKG15X0pTT05fb2JqZWN0KTtcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IG15X0pTT05fb2JqZWN0Lmxlbmd0aDsgaysrKSB7XG4gICAgICBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKG15X0pTT05fb2JqZWN0W2tdKTtcbiAgICB9XG4gICAgYW5hbHl6ZURhdGEuY2xpY2soKTtcbiAgXG4gICAgY29uc29sZS5sb2coZ2VuZXJhdGVKU09OZnJvbXZhcigpKTtcbiAgICB2YXIgZ2VuZXJhdGVkSnNvbiA9IEpTT04uc3RyaW5naWZ5KFAyVzIpO1xuICAgIHZhciBteV9KU09OX29iamVjdCA9IEpTT04ucGFyc2UoZ2VuZXJhdGVkSnNvbik7XG4gICAgY29uc29sZS5sb2cobXlfSlNPTl9vYmplY3QpO1xuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbXlfSlNPTl9vYmplY3QubGVuZ3RoOyBrKyspIHtcbiAgICAgIGFkZGluZ05ld0NhcmRzRnJvbUpTb24obXlfSlNPTl9vYmplY3Rba10pO1xuICAgIH1cbiAgICBhbmFseXplRGF0YS5jbGljaygpO1xuICBcbiAgICBjb25zb2xlLmxvZyhnZW5lcmF0ZUpTT05mcm9tdmFyKCkpO1xuICAgIHZhciBnZW5lcmF0ZWRKc29uID0gSlNPTi5zdHJpbmdpZnkoUDNXMik7XG4gICAgdmFyIG15X0pTT05fb2JqZWN0ID0gSlNPTi5wYXJzZShnZW5lcmF0ZWRKc29uKTtcbiAgICBjb25zb2xlLmxvZyhteV9KU09OX29iamVjdCk7XG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBteV9KU09OX29iamVjdC5sZW5ndGg7IGsrKykge1xuICAgICAgYWRkaW5nTmV3Q2FyZHNGcm9tSlNvbihteV9KU09OX29iamVjdFtrXSk7XG4gICAgfVxuICAgIGFuYWx5emVEYXRhLmNsaWNrKCk7XG4gIFxuICAgIGNvbnNvbGUubG9nKGdlbmVyYXRlSlNPTmZyb212YXIoKSk7XG4gICAgdmFyIGdlbmVyYXRlZEpzb24gPSBKU09OLnN0cmluZ2lmeShQOVcyKTtcbiAgICB2YXIgbXlfSlNPTl9vYmplY3QgPSBKU09OLnBhcnNlKGdlbmVyYXRlZEpzb24pO1xuICAgIGNvbnNvbGUubG9nKG15X0pTT05fb2JqZWN0KTtcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IG15X0pTT05fb2JqZWN0Lmxlbmd0aDsgaysrKSB7XG4gICAgICBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKG15X0pTT05fb2JqZWN0W2tdKTtcbiAgICB9ICAgIGFuYWx5emVEYXRhLmNsaWNrKCk7XG4gIFxuICBcbiAgICBjb25zb2xlLmxvZyhnZW5lcmF0ZUpTT05mcm9tdmFyKCkpO1xuICAgIHZhciBnZW5lcmF0ZWRKc29uID0gSlNPTi5zdHJpbmdpZnkoUDExVzIpO1xuICAgIHZhciBteV9KU09OX29iamVjdCA9IEpTT04ucGFyc2UoZ2VuZXJhdGVkSnNvbik7XG4gICAgY29uc29sZS5sb2cobXlfSlNPTl9vYmplY3QpO1xuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbXlfSlNPTl9vYmplY3QubGVuZ3RoOyBrKyspIHtcbiAgICAgIGFkZGluZ05ld0NhcmRzRnJvbUpTb24obXlfSlNPTl9vYmplY3Rba10pO1xuICAgIH0gICAgYW5hbHl6ZURhdGEuY2xpY2soKTtcbiAgICBhbmFseXplRGF0YS5jbGljaygpOyohL1xuICBcbiAgICBjb25zb2xlLmxvZyhnZW5lcmF0ZUpTT05mcm9tdmFyKCkpO1xuICAgIHZhciBnZW5lcmF0ZWRKc29uID0gSlNPTi5zdHJpbmdpZnkoR0kxKTtcbiAgICB2YXIgbXlfSlNPTl9vYmplY3QgPSBKU09OLnBhcnNlKGdlbmVyYXRlZEpzb24pO1xuICAgIGNvbnNvbGUubG9nKG15X0pTT05fb2JqZWN0KTtcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IG15X0pTT05fb2JqZWN0Lmxlbmd0aDsgaysrKSB7XG4gICAgICBhZGRpbmdOZXdDYXJkc0Zyb21KU29uKG15X0pTT05fb2JqZWN0W2tdKTtcbiAgICB9XG4gICAgYW5hbHl6ZURhdGEuY2xpY2soKTtcbiAgXG4gIFxuICB9KTtcbn07XG5cbnRlc3QoKTtcblxuXG5mdW5jdGlvbiBhbmFseXplRGF0YWZjdG4oKXtcbiAgYW5hbHlzZURhdGExKCk7XG59XG5cblxuZnVuY3Rpb24gbG9hZFNIMSgpe1xuICBsb2FkSlNPTlNlZ21lbnRIaXN0b3J5MSgpIDtcbn1cblxuLyEqXG5FbmQgb2YgdGVzdGluZyBGaWxlXG4gKiEvKi9cbiJdfQ==