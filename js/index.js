var game = null
$(function () {


    //切换页面
    window.change = function change(index) {
        var allPart = $('.part')
        allPart.addClass('hidden')
        $(allPart[index]).removeClass('hidden')
        var allChildren = $(allPart)[index].children
        $.each(allChildren, function (i, j) {
            $(j).addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $(this).removeClass('animated zoomIn')
            })
        })
    }

    // //切换弹窗
    // window.changeTips = function changeTips(type) {     //0 等待开始  1开始  2 结束弹窗
    //     if(type != 1){
    //         $('.part').removeClass('hidden');
    //         if(type ==  0){
    //             $('.box1').show();
    //             $('.box2').hide();
    //         }else{
    //             $('.box1').hide();
    //             $('.box2').show();
    //         }
    //     }else {
    //         $('.part').addClass('hidden');
    //     }
    // }

    //分数发给后台
    window.sendGift = function sendGift(giftNum, integralNum) {
        $.ajax({
            url:'https://wx.weibeicc.com/wx/user/christmas_game',
            type:'post',
            dateType:'json',
            contentType: 'application/json;charset=utf-8',
            headers:{
                "X-Litemall-Token": getQueryString("token")
	            // "X-Litemall-Token": 'GRAIN:TOKEN:2448af31a49347d'
            },
            data:JSON.stringify({
                "giftNum": giftNum,
                "integralNum": integralNum
            }),
            success:function(data){
                // console.log("sucess");
                change(2);
                if(data.data.data.times > 3){
                    $(".tip-2").hide();
                }
                $(".gift").html("太棒啦，你接住了" + game.gift_num + "个礼品");
                $(".integral").html("共计"+game.score+"积分~");
            },
            error:function(data){
                // console.log("error");
            }
        });
    }

    //加载数据
    var img = new Image();
    var picArr = ['https://enuo.weibeicc.com/12game/f0.png', 'https://enuo.weibeicc.com/12game/f1.png', './img/backMain.png', 'https://enuo.weibeicc.com/12game/bg.png',
        './img/bg2.png', 'https://enuo.weibeicc.com/12game/f2.png', './img/bt_again.png', './img/bt_backMain.png', './img/bt_regular.png',
        './img/bt_start.png', 'https://enuo.weibeicc.com/12game/caishen.png',
        'https://enuo.weibeicc.com/12game/caishen2.png', './img/gange_bt.png', './img/over.png', 'https://enuo.weibeicc.com/12game/f3.png', , 'https://enuo.weibeicc.com/12game/title.png'
    ]
    var now = 0;
    loadImg();

    function loadImg() {
        img.src = picArr[now];

        function go() {
            now++;
            if (now < picArr.length) {
                loadImg()
            } else {
                start()
            }
        }

        img.onerror = go;
        img.onload = go;
    }

    function start() {
        $('.load').addClass('hidden') //隐藏加载界面
        //显示第一个页面
        change(0)
        game = new Game('#canvas');


        //立即开始
        $('.part1 .tips-bg').tap(function () {
            change(1)
            // game = new Game('#canvas')
            clearTimeout(game.startClock);
            game.start();
        })
        //再玩一次
        $('.go-play').tap(function () {
            change(1)
            game = new Game('#canvas')
            clearTimeout(game.startClock);
            game.start();
        })
        //关闭
        $('.close').tap(function () {
            // uni.navigateTo({
            //     url:'/pages/gameStart/gameStart'
            // })
            uni.navigateBack({
                delta: 1
            })
        })
        // change(0)
        //生成排名排版
        // render_ranks()
        //开始游戏
        // $('.part1_start').tap(function () {
        //     game = new Game('#canvas')
        //     change(1)
        // })
        // $('.btn_again').tap(function () {
        //     game = new Game('#canvas')
        //     change(1)
        // })
        //游戏规则
        // $('.part1_regular').tap(function () {
        //     change(3)
        // })

        //返回首页
        // $('.rank_back').tap(function () {
        //     change(0)
        // })
        // $('.regular_back').tap(function () {
        //     change(0)
        // })
        // $('.btn_index').tap(function () {
        //     change(0)
        // })
        //排名生成
        // function render_ranks() {
        //     var line = 10
        //     var plays = $('.players')
        //     for (var a = 0; a < line; a++) {
        //         var play = $('<li class="player ' + color(a) + '"></li>').appendTo(plays)
        //         $('<div class=player_num>' + (a + 1) + '</div>').appendTo(play)
        //         var num = $('<div class="player_name"></div>').appendTo(play)
        //         $('<div class="headr"></div>').appendTo(num)
        //         $('<span>您的排名</span>').appendTo(num)
        //         $('<div class="player_point">2500</div>').appendTo(play)
        //     }
        // }

        //排名颜色
        // function color(a) {
        //     var cla = "";
        //     if (a % 2 == 0) {
        //         cla += 'wt'
        //     } else {
        //         cla += 'red'
        //     }

        //     if (a == 0) {
        //         cla += ' yellow'
        //     } else {
        //         cla += ' white'
        //     }
        //     return cla
        // }
    }
    
    // 获取地址栏参数
    function getQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

})