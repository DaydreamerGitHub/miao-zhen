/*
   by 1403A
*/
// 解决命名冲突
;(function(){
    var data=null;
    // 定义一个匿名自执行函数->公共方法
    var common=function(){
         // 首页焦点图
         var sliderPic=function(){
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
       },
       // 显示遮罩层
       showMask=function(){
          // 如果页面中没有遮罩的盒子，则将它创建出来
          if($('#markbg').length==0){
             $('<div class="markbg" id="markbg"></div>').height($('body').height()).appendTo($('body'));
          }
       },
       // 删除遮罩层
       hideMask=function(){
          $('#markbg').remove();
       },
       // 首页点击按钮推拉
       bindEvent=function(){
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
             $('#btn').removeClass().addClass('jiantou-two')
                    .stop()
                    .animate({'left':169},600);
           }

           function slideRight($btn){
             $('#product-page').stop()
                               .animate({'opacity':0},600,function(){
                                   $('#content').stop()
                                                .animate({'width':1000},400);
                                   $('#btn').removeClass().addClass('jiantou')
                                        .stop()
                                        .animate({'left':966},600);
                               })
           }
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


           // 产品页点击导航切换内容
           var clickChange=function($curA){
              var $curType=$('#scroll').find('div#type'+$curA.data('id'));
              $curType.addClass('cur-type').siblings().removeClass('cur-type');
              $('#scroll').css('top',0);
              createButton();
           }

           var hoverNav=function(){
              $('#index-nav').on('mouseenter','a',function(){
                  $(this).css('background',$(this).data('color')).siblings().css('background','none');
              }).on('click','a',function(){
                  slideLeft();
                  var bgColor=$(this).data('color');
                  $('#prodcut-nav').css('background',bgColor);
                  clickChange($(this));
              })
           }
           hoverNav();


           $('#list-nav').on('click','a',function(){
                clickChange($(this));
           });

            // 点击方块按钮翻页
            $('#pageNo').on('click','span',function(){
              var index=$(this).index(),
                  h=$('.product-pic').outerHeight();
              $('#scroll').stop()
                          .animate({
                             'top':-h*index
                          },500);
               $(this).addClass("curp").siblings().removeClass("curp");
            })
       }, 
       // 渲染产品入口页左侧的导航
       renderNav=function(name,id){
          $('<a href="javascript:void(0)" data-id="'+id+'">'+name+'</a>').appendTo($('#list-nav'));
          $('<a href="javascript:void(0)" data-id="'+id+'">'+name+'</a>').appendTo($('#index-nav'))
       },
       // 渲染产品信息
       renderToDom=function(data){
          // 遍历的是产品分类
          for(var i=0,len=data.length;i<len;i++){
             var obj=data[i];
             renderNav(obj.name,obj.id);
             var total=obj.template_type,
                 products=obj.products,
                 size=products.length,
                 pageCount=Math.ceil(size/total),  
                 $typeBox=$('<div class="product-type" id="type'+obj.id+'"></div>'),
                 // 渲染色块
                 getBaseHtml=function(n){
                    // 如果没有传n过来,n默认为0
                    n=typeof(n)==="undefined"?0:n;
                    var baseHtml="",
                        j=n*total; 
                    for(j;j<size;j++){
                       var item=products[j];
                       if(j<total*(n+1)){
                          baseHtml+='<div class="pos product_'+total+'_'+(j%total)+'">'
                                       +'<div class="full" data-login="'+item.login_flag+'">'
                                           +'<p class="icon">'
                                                +'<img src="http://localhost/zhizhen/img'+item.image+'">'
                                           +'</p>'
                                           +'<h2><a href="'+item.site+'">'+item.name+'</a></h2>'
                                           +'<h3>'+item.summary+'</h3>'
                                       +'</div>'
                                    +'</div>'
                       }
                    }
                    // 每一页不足7个的补齐
                    var t=size-n*total;  
                    for(t;t<total;t++){
                       baseHtml+='<div class="pos product_'+total+'_'+t+'" style="background:'+obj.color+'">'
                                +'<div class="full">'
                                    +'<p class="icon"></p>'
                                    +'<h2>敬请期待</h2>'
                                    +'<h3></h3>'
                                +'</div>'
                             +'</div>'
                    }
                    return baseHtml;
                 }
             
             // 如果需要分页(页数大于1页)
             if(pageCount>1){
                for(var p=0;p<pageCount;p++){
                   var html=getBaseHtml(p);
                   $('<div class="product-pic"></div>').html(html).appendTo($typeBox);
                }
             }else{
                $('<div class="product-pic"></div>').html(getBaseHtml()).appendTo($typeBox);
             }  
           
             $typeBox.appendTo($('#scroll'));
          }
          $('#scroll>div.product-type:eq(0)').addClass('cur-type').siblings().removeClass('cur-type');
       },
       // ajax请求，获取数据
       getData=function(){
           $.ajax({
               url:"data.json",
               type:"get",
               async:false,    // 同步
               data:{},
               dataType:"json",
               success:function(data){
                   renderToDom(data);
               }
           })
       },
       // 生成色块按钮
       createButton=function(){
          var len=$('#scroll div.cur-type').children('div.product-pic').length,
              i,str="";
          for(i=0;i<len;i++){
             str+='<span></span>';
          }
          $('#pageNo').html(str).children('span:first').addClass('curp').siblings().removeClass('curp');
       }
       // 我的产品页start->产品滚动 
       productSlider=function(){
          // 根据索引添加背景色
          $('#my-pro-list>li').each(function(i){
              var idx=i%6,cls="";
              switch(idx){
                 case 0:
                 case 5:
                 cls="gray";
                 break;
                 case 1:
                 cls="red"
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
          // 点击按钮滚动
          var $up=$('#upbtn'),
              $down=$('#downbtn'),
              $list=$('#my-pro-list'),
              list_h=$list.outerHeight(),
              box_h=$('#myprobox').outerHeight(),
              $tip=$list.find('div[data-type=tip]'),
              dis=box_h/2,
              nextGroup=function(){
                 var top=Math.abs($list.position().top);
                 if(top==(list_h-box_h)) return false;
                 if($list.is(":animated")) return false;
                 $list.stop()
                      .animate({'top':'-='+dis});
              },
              prevGroup=function(){
                 var top=Math.abs($list.position().top);
                 if(top<=0) return false;
                 if($list.is(":animated")) return false;
                 $list.stop()
                      .animate({'top':'+='+dis});
              },
              // 点击产品到期时间弹出消息窗口
              showMessage=function(){
                  showMask();
                  $('#pro-mask').css('display','block');
                  $('#mask-con').css('display','block');
                  $('#confirm').css('display','none');
                  $('#select li').eq(0).addClass('checked').siblings().removeClass();
                  $('#pro-mask div.tip').remove();
                  $('#select').on('click','li',function(){
                      var $confirm=$('#confirm');
                      $(this).addClass("checked").siblings().removeClass();
                      if($(this).index()==0){
                         $confirm.fadeOut();
                      }else{
                         $('#nobuy').children().removeClass();
                         $confirm.fadeIn();
                      }
                  })
                  $('#nobuy').on('click','li',function(){
                      $(this).addClass("checked").siblings().removeClass();
                      $('#select').children('li').last().removeClass();
                  })
                  $('#close-mask').click(function(){
                      hideMask();
                      $('#pro-mask').css('display','none');
                  })
                  $('#trybtn').on('click',function(){
                      var checkLi=$('#mask-con li').filter(".checked");
                      if(checkLi.data("type")=="999") return;
                      $.ajax({
                         url:"submit.json",
                         type:"get",
                         data:checkLi.data("type"),
                         success:function(data){
                            $('#mask-con').hide();
                            $('<div class="tip">'+data.msg+'</div>').appendTo($('#pro-mask'));
                         }
                      })
                  })
              }

          $down.on('click',nextGroup);
          $up.on('click',prevGroup);
          $tip.on('click',showMessage);
       }
       return {
          index:function(){
             sliderPic();
             bindEvent();
             getData();
             createButton();
          },
          user:function(){
             productSlider();
          }
       }
    }()
    window.common=common;
})()