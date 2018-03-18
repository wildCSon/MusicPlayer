var $ = window.Zepto;
var $scope = $(document.body);
var root = window.player;
var render = root.render;//渲染
var songList = '';
var controlManager;
var audioManager =new root.audioManager();
var processor = root.processor;
var playList = root.playlist;

function bindClick(){
	$scope.on('playChange',function(e,index,flag){
		render(songList[index]);		
		audioManager.setAudioSource(songList[index].audio);
		if(audioManager.status == 'play'||flag){
			audioManager.play();
			$scope.find('.play-btn').addClass('playing');
			processor.start();
		}
		processor.renderAllTime(songList[index].duration);
		processor.upDate(0);
	})
	$scope.find('.next-btn').on('click',function(){
		var index = controlManager.next();
		$scope.trigger('playChange',index);
	})
	$scope.find('.prev-btn').on('click',function(){
		var index = controlManager.prev();
		$scope.trigger('playChange',index);
	})
	$scope.find('.play-btn').on('click',function(){
		if(audioManager.status=='pause'){
			audioManager.play();
			$(this).addClass('playing');
			processor.start();
		}else{
			audioManager.pause();
			$(this).removeClass('playing');
			processor.stop();
		}
	})
	$scope.find('.list-btn').on('click',function(){
		playList.show(controlManager);
	})
}

function bindTouch(){
	var $sliderPoint = $scope.find('.silder-point');
	var offset = $scope.find('.processor').offset();
	var left = offset.left;
	var width = offset.width;
	$sliderPoint.on('touchstart',function(){
		processor.stop();
	}).on('touchmove',function(e){
		var x = e.changedTouches[0].clientX;
		var percent = (x-left)/width;
		processor.upDate(percent);
		if(percent<0){
			percent=0;
		}else if(percent>1){
			percent=1;
		}
	}).on('touchend',function(e){
		var x = e.changedTouches[0].clientX;
		var percent = (x-left)/width;
		var curDuration = songList[controlManager.index].duration*percent;
		processor.start(percent);
		audioManager.jumpToPlay(curDuration);
		$scope.find('.play-btn').addClass('playing');
	})
}	

function getData(url){
	$.ajax({
		url:url,
		type:'GET',
		success:function(data){
			playList.renderList(data);
			controlManager = new root.controlManager(data.length);
			songList = data;
			bindClick();
			bindTouch();
			$scope.trigger('playChange',0);
		}
	})
}

getData('./mock/data.json');

