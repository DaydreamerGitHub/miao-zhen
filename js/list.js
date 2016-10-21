function init(){
   sliderPic();
   bindEvent();
   myProduct();
}

function sliderPic(){
		// 焦点图
	var nowIndex=2;
	var index=0;
	var len=$("#slider ul li").length;
	var timer=null;

    $("#slider").hover(function() {
		clearInterval(timer);
	},function() {
		timer = setInterval(function() {
			index++;
			if(index == len) {index = 0;}
			changeImg(index);
		},2500);
	}).trigger("mouseleave");

	function changeImg(curIndex){
		//$('.stefxSlider ol li').eq(curIndex).addClass('stefxcur').siblings().removeClass();
		var curPic=$('#slider ul li').eq(curIndex);
		curPic.css({'z-index':nowIndex++});
		curPic.hide();
		curPic.fadeIn(1000);
		index=curIndex;
	}
}

function bindEvent(){
	// 点击按钮推拉
	var $btn=$('#btn');
	$btn.on('click',function(){
		if($(this).is(".jiantou")){
           slideLeft($(this));
		}else{
		   slideRight($(this));
		}
   
    if(!$(this).data("flag")){
           slideLeft($(this))
           $(this).data("flag",true);
    }else{
       slideRight($(this))
       $(this).data("flag",false);
    }
	})
    
  function slideLeft($btn){
  	$('#content').stop()
  	             .animate({'width':0},400,function(){
                     $('#product-page').stop()
                                       .animate({'opacity':1},600);
                 });
    $('#scroll').css('top',0);
  	$btn.removeClass().addClass('jiantou-two')
  	       .stop()
  	       .animate({'left':169},600);
  }

  function slideRight($btn){
    $('#product-page').stop()
                      .animate({'opacity':0},600,function(){
                          $('#content').stop()
                                       .animate({'width':1000},400);
                          $btn.removeClass().addClass('jiantou')
                               .stop()
                               .animate({'left':966},600);
                      })
  }

	// 滑过显示登录
	$('.product-pic').on('mouseenter','.full',function(){
	    var w=$(this).outerWidth(),
	        h=$(this).outerHeight(),
	        html='<p><a href="#" class="login-btn">登录</a><a href="#">申请试用</a></p>';
	        $mask=$('<div class="mask"></div>');
	        $mask.width(w).height(h);
	        $mask.html(html).appendTo($(this));
	}).on('mouseleave','.full',function(){
	    $(this).children('.mask').remove();
	})

	// 点击翻页
	$('#pageNo').on('click','span',function(){
		var index=$(this).index(),
		    h=$('.product-pic').outerHeight();
		$('#scroll').stop()
		            .animate({
		               'top':-h*index
		            },500);
    $(this).addClass("curp").siblings().removeClass("curp");
	})

  // 滚轮翻页
/*  $('.product-pic-box').bind("mousewheel",function(e){
      //if (event.delta > 0) { alert("鼠标向上滚了！"); }
      e.preventDefault();
      console.log(e.clientY);
  })*/

	// 首页右侧导航
	$('#index-nav').on('click','a',function(){
       slideLeft($('#btn'));
       changeProductType($(this).index());
       $('.product-nav').css('background',$(this).data('color'));
	})
    
    // 产品页左侧导航
	$('#list-nav').on('click','a',function(){
      changeProductType($(this).index());
	})

  $('#index-nav').on('mouseover','a',function(){
      var col=$(this).data('color');
      $(this).css('background',col).siblings().css('background','none');
  })

  function changeProductType(index){
    $('#scroll').css('top',0);
    $('#scroll').children('div.product-type').removeClass('cur-type').eq(index).addClass('cur-type');
  }

  // 回到顶部
  $('#toTop').click(function(){
     $(window).scrollTop(0);
  })

  // 我的产品页滚动
  var prev_btn=$('#prev_btn'),
      next_btn=$('#next_btn'),
      $fat_list=$('#fat-list'),
      size=$fat_list.children().length,
      ww=$('#fat-scroll').width(),
      idx=0,
      $spans=$('#pic_num').children('span');

  $fat_list.width(ww*size);

  next_btn.on('click',showNextList);

  prev_btn.on('click',showPrevList);

  function showNextList(){
     if(next_btn.hasClass("next_disabled")) return false;
     next_btn.off('click');
     prev_btn.removeClass("prev_disabled").addClass("prev_btn");
     idx+=1;
     if(idx>=size-1){
        next_btn.removeClass().addClass("next_disabled");
     }
     $fat_list.stop()
             .animate({'left':-idx*ww},500,function(){
                  next_btn.on('click',showNextList);
              });
     $spans.eq(0).text('0'+(idx+1));
     $spans.eq(1).text('/0'+size);  
  }

  function showPrevList(){
     if(prev_btn.hasClass("prev_disabled")) return false;
     prev_btn.off('click');
     next_btn.removeClass("next_disabled").addClass("next_btn");
     idx-=1;
     if(idx<=0){
        prev_btn.removeClass().addClass("prev_disabled");
     }
     $fat_list.stop()
             .animate({'left':-idx*ww},500,function(){
                  prev_btn.on('click',showPrevList);
              });
     $spans.eq(0).text('0'+(idx+1));
     $spans.eq(1).text('/0'+size);  
  }

}

init();

/* 新闻资讯页焦点图 */
function pageSlider(){
   var $list=$('#img-list'),
       len=$list.children().length,
       w=$('#page-slider').width(),
       timer=null,
       index=0,
       numIdx=1,
       $nums=$('#num-info').children('span');
  
   $nums.last().text('/0'+len);
   $nums.first().text('0'+numIdx); 

   $list.width(w*(len+1))

   $('#page-slider').hover(function(){
      clearInterval(timer);
   },function(){
      timer=setInterval(function(){
      	index++;
      	if(index == len) { 
      		showFirstPic();
      		index = 0;
      	} else { 
      		showPics();
      	}
      },3000)
   }).trigger('mouseleave');

   function showPics() { 
   	 var nowLeft = -index*w; 
   	 numIdx=index+1;
   	 $list.stop(true,false).animate({"left":nowLeft},500); 
   	 $nums.first().text('0'+numIdx); 
   }
   
   function showFirstPic() { 
   	$list.append($list.children(":first").clone());
   	var nowLeft = -len*w; 
   	$list.stop(true,false).animate({"left":nowLeft},500,function() {
   		$list.css("left","0").children(":last").remove();
   	}); 
   	numIdx=1;
   	$nums.first().text('0'+numIdx); 
   }

   $('#prev').on('click',function(){
   	  index--;
   	  if(index<0){
   	  	 index=len-1;
   	  }
   	  showPics();
   })

   $('#next').on('click',function(){
   	  index++;
   	  if(index == len) { 
      	 showFirstPic();
      	 index = 0;
      }else { 
      	 showPics();
      }
   })
}
pageSlider();

//  个人中心
function myProduct(){
   var $upBtn=$('#upbtn'),
       $downBtn=$('#downbtn'),
       $proList=$('#my-pro-list'),
       h=$('#myprobox').height()/2;
   
   $upBtn.on('click',prevGroup);
   $downBtn.on('click',nextGroup);

   function prevGroup(){
      var pos=Math.abs($proList.position().top);
      if(pos<=0) return false;
      if($proList.is(":animated")) return false;
      $proList.stop()
              .animate({"top":"+="+h},500);
   }

   function nextGroup(){
      var pos=Math.abs($proList.position().top);
      if(pos>=($proList.height()-400)) return false;
      if($proList.is(":animated")) return false;
      $proList.stop()
              .animate({"top":"-="+h},500);
   }

   $('#my-pro-list>li').each(function(i){
       var id=i%6,cls="";
       switch(id){
          case 0:
          case 5:
          cls="gray";
          break;
          case 1:
          cls="red";
          break;
          case 2:
          case 3:
          cls="orange";
          break;
          case 4:
          cls="gray-2";
          break;
       }
       $(this).addClass(cls);
   })

   $('#my-pro-list').on('click','.tip',function(){
       showMask();
       $('#pro-mask').fadeIn();
   })

   $('#select').on('click','li',function(){
       var $confirm=$('#confirm');
       $(this).addClass("checked").siblings().removeClass("checked");
       if($(this).index()==1){
           $confirm.fadeIn();
           $('#nobuy').children().removeClass("checked");
       }else{
           $confirm.fadeOut();
       }
   })

   $('#nobuy').on('click','li',function(){
       $(this).addClass("checked").siblings().removeClass("checked");
       $('#select').children('li:last').removeClass("checked");
   })
   
   // 提交
   $('#submit').click(function(){
       var val=$('#pro-mask').find('li.checked').data("type");
       var $maskCon=$('#mask-con');
       if(val=="999") return false;
       $.ajax({
          url:"",
          type:"post",
          dataType:"json",
          success:function(data){
             $maskCon.html('<p>'+data.msg+'</p>');
          }
       })
   })

   $('#close-mask').click(function(){
       $('#pro-mask').fadeOut();
       hideMask();
   })
}

/* 关于我们 */
$('#hzicon').on('mouseenter','a',function(){
    $(this).children('p').css('display','block');
    $(this).children('div').css('display','block');
}).on('mouseleave','a',function(){
    $(this).children('p').css('display','none');
    $(this).children('div').css('display','none');
})

$('#team').on('mouseenter','a',function(){
    var idx=$(this).index();
    $('#rw_wrap div').eq(idx).addClass("rw_info").siblings().removeClass('rw_info');
    $(this).addClass('curItem').siblings().removeClass('curItem');
})

function scrollIcon(){
  var $upBtn=$('.topbtn'),
      $downBtn=$('.downbtn'),
      $proList=$('#icon-scroll'),
      h=$('.icon-group').height()/2;

  $upBtn.on('click',prevGroup);
  $downBtn.on('click',nextGroup);

  function prevGroup(){
     var pos=Math.abs($proList.position().top);
     if(pos<=0) return false;
     if($proList.is(":animated")) return false;
     $proList.stop()
             .animate({"top":"+="+h},500);
  }

  function nextGroup(){
     var pos=Math.abs($proList.position().top);
     if(pos>=($proList.height()-400)) return false;
     if($proList.is(":animated")) return false;
     $proList.stop()
             .animate({"top":"-="+h},500);
  }
}

scrollIcon();


// 显示蒙层
function showMask(){
   var h=$('body').height();
   if($('.markbg').length==0){
      $('<div class="markbg"></div>').height(h).appendTo($('body'));
   }
}
// 删除蒙层
function hideMask(){
   $('.markbg').remove();
}

// 首页点击关闭登录层
$('.login_close').click(function(){
    hideMask();
    $('.user-login').hide();
})



