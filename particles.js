
(function(gl){

    gl.Particles = Particles;

    var emmitterArea = {
        x0:200,y0:0,x1:800,y1:20
    };	                                // 粒子发射区域。这里假设是一个长方形区域，x0 y0,x1 y1，两个点即可确定一个区域
    var particlesMaxCount = 100;	        // 粒子最大数目
    var particlesSize = 20;				// 初始化粒子的大小（px）。这里都为正方形，长宽相等
    var axisXInitSpeed = 0;			    // x轴粒子的初始速度
    var axisYInitSpeed = 20;			// y轴粒子的初始速度
    var accelerationX = 1;				// 系统的x轴加速度大小
    var accelerationY = 1;				// 系统的y轴加速度大小
    var emmitterAngle = [0,180];		// 每个粒子的可发射角度，范围为[0,359]
    var aliveMaxTime = 10000;            // 每个粒子最大存活时间

    var currentParticles = {};          // 当前系统中的粒子，粒子id为key，方便管理
    var timerId = 0;                    // 粒子系统的定时器ID
    var timerSpace = 50;                 // 定时器刷新间隔
    var fps = 1000/timerSpace;          // 帧率
    var lastUpdateAllTime = Date.now(); // 上次更新粒子状态的时间

//  粒子系统构造类
    function Particles(opt){
//        this.init(opt);
    }


//  //////////////// 粒子对象公有方法 /////////////////

//    Particles.prototype.init = function (opt) {
//        console.log(opt);
//    };



//  动画开始
    Particles.prototype.start = function () {
        var self = this;
        timerId = setInterval(function(){

            var particle = createOneParticle();
            // 添加到当前系统的粒子map中
            if(particle) currentParticles[particle.id] = particle;

            // 更新所有节点
            updateAll();

            if(self.onFrameComputed && typeof self.onFrameComputed == "function"){
                self.onFrameComputed.apply(this,[currentParticles]);
            }
        },timerSpace);
    };

//  每帧完成计算
    Particles.prototype.onFrameComputed = function(currentParticles){
//        console.log(currentParticles);
    };



//  //////////////// 私有方法 ////////////////
//  粒子创建工厂
//  返回一个粒子的大小、位置、旋转角度
    function createOneParticle(){
        if(getCurrentParticlesCount()>=particlesMaxCount)
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
        particle.x = getRandom(emmitterArea.x0,emmitterArea.x1);
        particle.y = getRandom(emmitterArea.y0,emmitterArea.y1);
        particle.accelerationX = accelerationX;
        particle.accelerationY = accelerationY;
        particle.aliveTime = aliveMaxTime;

        // 测试一下，具体参数应该构造函数传递
        particle.accelerationX = getRandom(-5,5);
        particle.accelerationy = getRandom(0,20);
        particle.aliveTime = getRandom(aliveMaxTime/2,aliveMaxTime);

        particle.axisXSpeed = axisXInitSpeed;
        particle.axisYSpeed = axisYInitSpeed;
        particle.id = getRandom(0,particlesMaxCount);

//        console.log(particle.id);
        while(currentParticles[particle.id]){
            particle.id = getRandom(0,particlesMaxCount);
//            console.log(particle.id);
        }

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
    function updateAll(){
        var curTime = Date.now();

        var lastTimeSpace = curTime-lastUpdateAllTime; // 上次刷新界面的时间差
        for(var key in currentParticles){
            var particle = getParticleNextStatus(currentParticles[key],lastTimeSpace);
            delete currentParticles[key];
            currentParticles[key] = particle;

            if(curTime-particle.createTime>=particle.aliveTime)
                delete currentParticles[key];


        }
        lastUpdateAllTime = curTime;

//        console.log(currentParticles);
    }

//  获取当前系统中粒子的数量
    function getCurrentParticlesCount(){
        return parseInt(Object.keys(currentParticles).length);
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








