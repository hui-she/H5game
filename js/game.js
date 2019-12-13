(function () {
    var Game = function (id) {
        this.canvas = document.querySelector(id);
        this.ctx = this.canvas.getContext('2d');
        this.phone = {
            w: document.documentElement.clientWidth || 375,
            h: document.documentElement.clientHeight || 600
        }
        this.canvas.width = this.phone.w
        this.canvas.height = this.phone.h
        this.init()
    }
    Game.prototype.init = function () {
        this.isEnd = false;//游戏结束
        this.touching = false;//是否触摸财神
        this.five_num_left = 0;//掉落起始位置
        this.cloud_num_left = 0;
        this.boom_num_left = 0;
        this.pig_num_left = 0;
        this.five_num = 30;//最大数量
        this.cloud_num = 20;
        this.boom_num = 10;
        this.pig_num = 2;
        this.moneyList = [];//掉落集合
        this.cai = new Image();//ai
        this.cai.src = "https://enuo.weibeicc.com/12game/caishen2.png";
        this.rect = { //财神
            x: this.phone.w / 2 - 51,
            y: this.phone.h - 109,
            w: 130,
            h: 140
        }
        this.score = 0;    //总分
        this.gift_num = 0;  //接住的礼物
        this.time = 30;//游戏时间
        this.times = 30;    //进度条时间
        this.clock;         //倒计时
        this.bar;           //倒计时进度
        this.startNum = 3;     //321 go
        this.startClock;        //go定时器


        document.addEventListener('touchstart', touch, {passive: false});
        document.addEventListener('touchmove', touch, {passive: false});
        document.addEventListener('touchend', touch, {passive: false});
        var that = this

        function touch(event) {//点击
            var event = event || window.event;
            event.preventDefault();
            switch (event.type) {
                case "touchmove":
                    if (that.touching) {
                        var x = 0
                        if (event.touches[0].clientX - that.rect.w / 2 <= 0) {
                            that.rect.x = 0
                        } else if (event.touches[0].clientX >=that.rect.w / 2  && event.touches[0].clientX <=that.phone.w-that.rect.w/2) {
                            that.rect.x = event.touches[0].clientX - that.rect.w / 2
                        } else {
                            that.rect.x = that.phone.w - that.rect.w
                        }
                    }
                    break;
                case "touchstart":
                    if (event.touches[0].clientX > game.rect.x && event.touches[0].clientX < game.rect.x + game.rect.w && event.touches[0].clientY > game.rect.y) {
                        that.touching = true
                    }
                    break;
                case "touchend":
                    that.touching = false
            }
        }

        var goCount = function () {
            if (that.startNum < 0) {
                clearTimeout(that.startClock);
                change(1)
                that.start()
                // sendGift(that.gift_num, that.score);
            } else {
                if(that.startNum == 0) {
                    $(".time-btn").html("GO");
                }else{
                    $(".time-btn").html(that.startNum + "S");
                }
                that.startNum = that.startNum - 1;
                that.startClock = setTimeout(goCount, 1000);
            }
        }
        goCount()
        // this.start()
        
    }
    Game.prototype.start = function () {
        var that = this
        var addInterval = setInterval(function () {
            if (!that.isEnd) {
                that.addMoney(Math.random() * (that.phone.w - 80));
            } else {
                clearInterval(addInterval);
            }
        }, 380);
        var animate = function (now) {
            that.clear();
            that.draw();
            if (!that.isEnd) {
                requestNextAnimationFrame(animate);
            }
        }
        var timedCount = function () {
            $(".time_out").html("剩余时间:" + that.time);
            $(".time-box").html(that.time + "S");
            if (that.time <= 0) {
                clearTimeout(that.clock);
                that.isEnd = true;
                // change(2)
                sendGift(that.gift_num, that.score);
            } else {
                that.time = that.time - 1;
                that.clock = setTimeout(timedCount, 1000);
            }
        }
        var barCount = function () {
            $(".bar").css({width: 5.5*that.times/30 +'rem'});
            if (that.time <= 0) {
                clearTimeout(that.bar);
            } else {
                that.times = that.times - 0.1;
                that.bar = setTimeout(barCount, 100);
            }
        }
        timedCount();
        barCount();
        window.requestNextAnimationFrame(animate);
    }

    Game.prototype.addMoney = function (x) {//掉钱
        var random = Math.floor(Math.random() * 62);
        if (0<=random && random< 30  && game.five_num_left >= 0 && game.five_num > 0 && !game.isEnd) {
            this.moneyList.push(new money(x, "five"));
            game.five_num--;
        } else if (random >=60 && random<= 62 && game.pig_num_left >= 0 && game.pig_num > 0 && !game.isEnd) {
            this.moneyList.push(new money(x, "pig"));
            game.pig_num--;
        } else if (random >=30 && random<= 40 && game.boom_num_left >= 0 && game.boom_num > 0 && !game.isEnd) {
            this.moneyList.push(new money(x, "boom"));
            game.boom_num--;
        } else if (random >=40 && random<= 60 && game.cloud_num_left >= 0 && game.cloud_num > 0 && !game.isEnd) {
            this.moneyList.push(new money(x, "cloud"));
            game.cloud_num--;
        }
    }
    Game.prototype.draw = function () {
        this.clear()
        this.moneyList.forEach(function (item) {
            item.drop();
        });
        this.move()
        $('.score').html("得分:" + game.score)
        // $('.get_point').html(game.score)
        // $('.get_max').html(game.gift_num)
        /*   game.ctx.font = "24px 微软雅黑";
         game.ctx.fillStyle = "red";
         game.ctx.fillText("score:" + game.score, 10, 50);*/
        /*
         game.ctx.fillText("5元× " + five_num, 30, 918);
         game.ctx.fillText("10元× " + ten_num, 180, 918);
         game.ctx.fillText("空× " + empty_num, 350, 918);
         game.ctx.fillText("炸弹× " + zad_num, 500, 918);*/

    }


    Game.prototype.clear = function () {//清屏
        game.ctx.clearRect(0, 0, game.phone.w, game.phone.h);
    }
    Game.prototype.move = function () {
        game.ctx.drawImage(game.cai, game.rect.x || 0, (game.phone.h - game.rect.h), game.rect.w, game.rect.h);
    }
    window.Game = Game
})()
