/**
 *
 * This Script is where I declare all the dom elelement variable I will use in  client side.
 * So all the DOM element will be declared only one. We declare the video and the segment history.
 * */


//var video_current = document.getElementById('videojs');

var video_current = videojs('videojs',{
                                        plugins: {
                                          abLoopPlugin: {
                                            createButtons: false
                                            , enabled:false			//defaults to false
                                            ,loopIfBeforeStart:false //allow video to play normally before the loop section? defaults to true
                                            ,loopIfAfterEnd:false	// defaults to true
                                            ,pauseAfterLooping: false     	//if true, after looping video will pause. Defaults to false
                                            ,pauseBeforeLooping: false
                                          }
                                        }
                                      });

var modalVideo = document.getElementById('videoPickerOverview');
