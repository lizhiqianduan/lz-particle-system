
(function(gl){

    gl.Particles = Particles;

    var sysIndex = 0; // 标示粒子系统的ID，同一页面有可能存在多个粒子系统

//  粒子系统构造类
    function Particles(opt){
        // 默认参数。opt可以覆盖这些值，但类型不能变
        var defaultOptions = {
            emmitterArea:{x0:0,y0:0,x1:200,y1:20},        // 粒子发射区域。这里假设是一个长方形区域，x0 y0,x1 y1，两个点即可确定一个区域
            accelerationXArea:[-5,5],                       // x轴粒子的加速度范围
            accelerationYArea:[0,5],                        // y轴粒子的加速度范围
            axisXInitSpeedArea:[0,10],                      // x轴粒子的初始速度范围
            axisYInitSpeedArea:[0,10],                      // y轴粒子的初始速度范围
            particlesMaxCount:100,                          // 粒子最大数目
            aliveMaxTime:10000,                             // 粒子最大存活时间
            timerSpace:10                                   // 刷新间隔
        };


        // 合并对象至default
        for(var key in opt){
            if(defaultOptions[key]){
                defaultOptions[key] = opt[key];
            }
        }

        // 粒子系统ID
        this.sysId = ++sysIndex;

        // 对象的私有变量
        this._config = defaultOptions;
        this._timerId = 0;
        this._lastUpdateAllTime = Date.now();
        this._currentParticles = {};

    }


//  //////////////// 粒子对象公有方法 /////////////////

//  动画开始
    Particles.prototype.start = function () {
        var self = this;
        var config = self._config;
        self._timerId = setInterval(function(){

            // 创建一个新的粒子
            createOneParticle(self);

            // 更新所有节点
            updateAll(self);

            // 更新之后回调事件
            if(self.onFrameComputed && typeof self.onFrameComputed == "function"){
                self.onFrameComputed.apply(self,[self._currentParticles]);
            }
        },config.timerSpace);
        return self;
    };

//  停止动画
    Particles.prototype.stop = function(){
        clearInterval(this._timerId);
        this._currentParticles = {};
    };

//  更改配置信息
    Particles.prototype.changeConfig = function(newConfig){
        for(var key in newConfig){
            if(this._config[key]){
                this._config[key] = newConfig[key];
            }
        }
    };


//  获取当前系统中粒子的数量
    Particles.prototype.getCurrentParticlesCount = function(){
        return parseInt(Object.keys(this._currentParticles).length);
    };

//  每帧动画完成计算后的回调函数，需要用户覆盖，以便canvas或者dom来渲染
    Particles.prototype.onFrameComputed = function(currentParticles){
        // todo:
    };





//  //////////////// 私有方法 /////////////////////////////////////////////////////////////////////////

//  @sys : 粒子系统对象
//  @config : 粒子系统的配置参数
//  根据构造参数创建粒子
    function createOneParticle(sys){
        var config = sys._config;

        if(sys.getCurrentParticlesCount()>=config.particlesMaxCount)
            return null;

        var particle = {
            id:0,                   // 粒子id
            aliveTime:1000,         // 粒子存活时间
            createTime:Date.now(),  // 粒子创建时间
            x:0,y:0,                // 粒子当前位置
            axisXSpeed:0,           // 粒子当前X轴速度
            axisYSpeed:0,           // 粒子当前Y轴速度
            accelerationX:0,        // x加速度
            accelerationY:0         // y加速度
        };
        particle.x = getRandom(config.emmitterArea.x0,config.emmitterArea.x1);
        particle.y = getRandom(config.emmitterArea.y0,config.emmitterArea.y1);
        particle.accelerationX = getRandom(config.accelerationXArea[0],config.accelerationXArea[1]);
        particle.accelerationY = getRandom(config.accelerationYArea[0],config.accelerationYArea[1]);
        particle.aliveTime = getRandom(config.aliveMaxTime/2,config.aliveMaxTime);
        particle.axisXSpeed = getRandom(config.axisXInitSpeedArea[0],config.axisXInitSpeedArea[1]);
        particle.axisYSpeed = getRandom(config.axisYInitSpeedArea[0],config.axisYInitSpeedArea[1]);
        particle.id = getRandom(0,config.particlesMaxCount);
        while(sys._currentParticles[particle.id]){
            particle.id = getRandom(0,config.particlesMaxCount);
        }

        // 添加到当前系统的粒子map中
        if(particle) sys._currentParticles[particle.id] = particle;
        return particle;
    }

//  获取某个粒子的下一个状态
    function getParticleNextStatus(particle,lastTimeSpace){
        var newParticle = {};
        var t = lastTimeSpace/1000; // 假设时间t为1
//        console.log(t,lastTimeSpace);
        newParticle.x = particle.x + particle.axisXSpeed * t + particle.accelerationX*t*t/2;
        newParticle.y = particle.y + particle.axisYSpeed * t + particle.accelerationX*t*t/2;
        newParticle.axisXSpeed = particle.axisXSpeed + particle.accelerationX * t;
        newParticle.axisYSpeed = particle.axisYSpeed + particle.accelerationY * t;
        newParticle.id = particle.id;
        newParticle.aliveTime = particle.aliveTime;
        newParticle.createTime = particle.createTime;
        newParticle.accelerationX = particle.accelerationX;
        newParticle.accelerationY = particle.accelerationY;
        return newParticle;
    }

//  更新所有粒子状态
    function updateAll(sys){
        var curTime = Date.now();
        var currentParticles = sys._currentParticles;
        var lastTimeSpace = curTime - sys._lastUpdateAllTime; // 上次刷新界面的时间差
        for(var key in currentParticles){
            var particle = getParticleNextStatus(currentParticles[key],lastTimeSpace);
            delete currentParticles[key];
            currentParticles[key] = particle;

            if(curTime-particle.createTime>=particle.aliveTime)
                delete currentParticles[key];
        }
        sys._lastUpdateAllTime = curTime;
    }



//  获取某个范围内的一个随机数
    function getRandom(min,max){
        min = parseInt(min);
        max = parseInt(max);
        if(min>max ) return console.log("getRandom error!");
        if(min == max) return Math.floor(min);
        return min+Math.floor(Math.random()*(max-min));
    }


})(window);








