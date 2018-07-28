
      // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // 3. This function creates an <iframe> (and YouTube player)
      //    after the API code downloads.
      var player;
      function onYouTubeIframeAPIReady() {
      }

      // 4. The API will call this function when the video player is ready.
      
      function onPlayerReady(event) {
        //event.target.playVideo();
      }

var videoLoaded = false;

function changeVideo() {
	var url = document.getElementById("videoURL").value
	var index = url.indexOf("=");
	var id = url.slice(index + 1);
	if (videoLoaded) {
		player.loadVideoById(id, 0, "large");
	}
	else {
		player = new YT.Player('player', {
      		height: '540',
      		width: window.innerWidth,
      		videoId: id,
      		events: {
      			'onReady': onPlayerReady,
      			'onStateChange': onPlayerStateChange
      		}
    	});
    	videoLoaded = true;
	}
}
      // 5. The API calls this function when the player's state changes.
      //    The function indicates that when playing a video (state=1),
      //    the player should play for six seconds and then stop.
var intervalSecs = 5;
var myTimer;
var bSlowDown = false;
var startTime = 0;
var currTime = 0;
var endTime = 5;
var timeoutTime = 5000;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
      timeoutTime = intervalSecs * 1000;
      
      currTime = nowTime();
      endTime = startTime + intervalSecs;
      if (currTime < endTime) { //video restarted in middle of section
        timeoutTime = (endTime - currTime) * 1000;
      }
      if (bSlowDown) {
          timeoutTime = timeoutTime * 2;
      }
      clearTimeout(myTimer);
      myTimer = setTimeout(pauseVideo, timeoutTime);
      console.log("timeoutTime:" + timeoutTime + ", currTime:" + currTime + ", startTime:" + startTime + ", endTime:" + endTime + ", intervalSecs: " + intervalSecs);
    }
}

function pauseVideo() {
  //end of section
  player.pauseVideo();
  player.setPlaybackRate(1);
  bSlowDown = false;
  startTime = nowTime();
}

function replay() {
  var seekTime = startTime; //seekTime will be where to seek to to replay, will = starTime if in middle of the section

  currTime = nowTime();

  if (currTime == startTime || currTime - intervalSecs > startTime || currTime < startTime) {  //at end of section or navigated to new section in video (ahead or behind)
    seekTime = currTime - intervalSecs;
  }

  if (seekTime < 0) { //navigated close to beginning of video
    seekTime = 0; 
  }

  startTime = seekTime;

  player.seekTo(seekTime, true);
  player.playVideo();
}

function repeatFast() {
  player.setPlaybackRate(1);
  bSlowDown = false;
  replay();
}
function repeatSlow() {
  player.setPlaybackRate(0.5);
  bSlowDown = true;
  replay();
}

function playSlowVideo() {
  player.setPlaybackRate(0.5);
  bSlowDown = true;
  player.pauseVideo();
	player.playVideo();
}

function playFastVideo() {
  player.setPlaybackRate(1);
  bSlowDown = false;
  player.pauseVideo();
  player.playVideo();
}

function changeInterval() {
  var newInterval = parseInt(document.getElementById("interval").value);
  if (newInterval > 0) {
    intervalSecs = newInterval;
    startTime = nowTime();
  }
  else {
    alert("Invalid interval");
  }
}

function nowTime() {
  return Math.round(player.getCurrentTime());
}