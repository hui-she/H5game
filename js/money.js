(function () {
    var five = new Image();//5 圣诞饼干10分
    five.src = "https://enuo.weibeicc.com/12game/f1.png";

    var pig = new Image();//100 圣诞糖果500分
    pig.src = "https://enuo.weibeicc.com/12game/f2.png";
	
	var cloud = new Image();//空的 圣诞帽50分
    cloud.src = "https://enuo.weibeicc.com/12game/f3.png";
	
	var boom = new Image();//炸弹 圣诞蜡烛100分
    boom.src = "https://enuo.weibeicc.com/12game/f0.png";

    var sub = new Image();//炸弹-200分
    sub.src = "https://enuo.weibeicc.com/12game/f5.png";

    var moneyEnum = {
        five: {
            image: five,
            speed: 5,
            value: 10,
            widths:76,
			heights:102,
        },
        cloud: {
            image: cloud,
            speed: 5,
            value: 50,
            widths:92,
			heights:57,
        }, pig: {
            image: pig,
            speed: 9,
            value: 500,
            widths:40,
			heights:94,
        }, boom: {
            image: boom,
            speed: 5,
            value: 100,
            widths:80,
			heights:120,
        }, sub: {
            image: sub,
            speed: 8,
            value: -200,
            widths:83,
			heights:71,
        }
    };


    var money = function (x, type) {
        this.x = x;
        this.y = 0;
        this.type = type;
        this.status = 0;//0正在掉落，1接住 ，2没接住
        this.widths = moneyEnum[this.type].widths;
        this.heights = moneyEnum[this.type].heights;


    }

    money.prototype.draw = function () {
        if (this.status == 0) {
            game.ctx.drawImage(moneyEnum[this.type].image, this.x, this.y, moneyEnum[this.type].widths, moneyEnum[this.type].heights);
        }
    }

    money.prototype.drop = function () {
        //速度叠加
        this.y += moneyEnum[this.type].speed;
        var top = this.y
        var bottom = this.y + this.heights
        var left = this.x
        var right = this.x + this.widths
        var caiY = game.phone.h - game.rect.h
        if (this.status == 0 && caiY <= bottom && ((game.rect.x <= left && left <= (+game.rect.x + game.rect.w)) || (game.rect.x <= right && (+game.rect.x + game.rect.w) >= right))) {//
            this.status = 1;
            game.score += moneyEnum[this.type].value;//记录总分数
            if(game.score<0){
                game.score = 0;
            }
            if(this.type == "sub"){
                game.booms_num ++;       //炸弹总数
            }else{
                game.gift_num ++;       //礼物总数
            }
        } else if (this.y >= game.phone.h) {
            this.status = 2;
        }
        this.draw();
    }

    window.money = money;
})();