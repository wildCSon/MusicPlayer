(function($,root){
	var $scope = $(document.body);

	function renderInfo(data){
		var html = '';
	 	html += "<h1 class='song-name'>"+data.song+"</h1><h1 class='singer-name'>"+data.singer+"</h1><h1 class='album-name'>"+data.album+"</h1>;"
	 	$scope.find('.song-info').html(html);
	}

	function renderImg(src){
		var image = new Image();
		image.onload = function(){
			$scope.find('.song-img img').attr('src',src);
			root.blurImg(image,$scope);
		}
		image.src = src;
	}	

	function renderIsLike(isLike){
		if(isLike){
			$scope.find('.like-btn').addClass('liked');
		}else{
			$scope.find('.like-btn').removeClass('liked');
		}
	}
	root.render = function(data){
		renderInfo(data);
		renderImg(data.image); 
		renderIsLike(data.isLike);
	}
}(window.Zepto,window.player||(window.player={})))