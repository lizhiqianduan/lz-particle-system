# lz-particle-system
Javascript写的粒子系统

# 简介
看了几个游戏引擎的粒子系统，感觉很有意思，于是模仿着写一个。

目前基本的效果有了，参数和代码结构需再优化。

看效果的话，效果直接下载，点击index.html即可，欢迎拍砖点赞。

# 用法

## 1、配置json信息，示例

```javascript
    var config = {
        emmitterArea:{x0:0,y0:-100,x1:2000,y1:0},       // 粒子发射区域
        accelerationXArea:[-5,5],                       // x轴粒子的加速度范围
        accelerationYArea:[10,20],                        // y轴粒子的加速度范围
        axisXInitSpeedArea:[0,10],                      // x轴粒子的初始速度范围
        axisYInitSpeedArea:[100,200],                      // y轴粒子的初始速度范围
        particlesMaxCount:200                           // 粒子最大数目
    };
```

## 2、新建系统

```javascript
    var sys = new Particles(config);
```

## 3、启动

```javascript    
    sys.start();
```

## 4、监听事件对应绘制

```javascript
    sys.onFrameComputed = renderAllParticles;

    function renderAllParticles(particles){
      // 这里对所有粒子进行渲染，可以是dom、也可以是canvas
    }
```

更多示例请查看demo示例！

更多经验技术，欢迎访问我的博客网址 http://www.lizhiqianduan.com
