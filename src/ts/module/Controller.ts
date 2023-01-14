import CreateMap from './CreateMap'
import Tank from './Tank'
import Bullet from "./Bullet";
import Enemy from "./Enemy";

// 控制器、将所有类连接起来的桥梁
export default class Controller{
  // 敌人对象
  Enemy: Enemy
  // 子弹对象
  Bullet: Bullet
  // 地图对象
  CreateMap: CreateMap
  // 坦克对象
  Tank: Tank
  // 当前是否在移动状态
  isMove: boolean
  // 方向
  dir: '上' | '下' | '左' | '右'
  // 发射子弹的定时器ID(防抖效果)
  bulletTimeID: NodeJS.Timer | null

  constructor() {
    this.CreateMap = new CreateMap()

    const { config } = this.CreateMap
    this.Tank = new Tank(config.myTankSeed, config.myTankColor, 0)
    this.Bullet = new Bullet()
    this.Enemy = new Enemy()
    this.isMove = false
    this.dir = '下'
    this.bulletTimeID = null
    this.controllerHandle()
    this.redraw()
  }

  start(level: number) {
    // 初始化
    this.Tank.isFinish = false
    this.Tank.level = level
    this.Tank.enemyVanishNum = 0
    this.CreateMap.create()
    this.Tank.lifeVal = this.CreateMap.levelParams.myTankLife
    this.Tank.enemyAll.forEach(v => {
      clearInterval(v.bulletId)
      clearInterval(v.turnToId)
    })
    this.Tank.enemyAll = []
    this.Tank.bulletAll = []
    this.Tank.tankX = 0
    this.Tank.tankY = (this.CreateMap.canvas.height - (this.Tank.config.tankHeight * devicePixelRatio)) / devicePixelRatio
    this.Tank.enemyAll.push({
      tankObj: this.Tank
    })
    this.Enemy.create()
    this.Tank.updateStatus()
  }

  // 键盘控制操作
  controllerHandle() {
    window.onkeydown = (e) => {
      switch (e.key) {
        case 'ArrowUp': {
          this.dir = '上'
          this.move()
        }
          break;
        case 'ArrowDown': {
          this.dir = '下'
          this.move()
        }
          break;
        case 'ArrowLeft': {
          this.dir = '左'
          this.move()
        }
          break;
        case 'ArrowRight': {
          this.dir = '右'
          this.move()
        }
          break;
        case ' ': {
          this.launchBullet()
        }
      }
    }

    // 键盘抬起
    window.onkeyup = (e) => {
      // 只有在移动状态下、并且抬起的上下左右四个按钮，才会执行该方法
      if (this.isMove && (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
        this.isMove = false
      }
    }
  }

  // 控制移动
  move = () => {
    // 防止多次执行
    if (!this.isMove) {
      this.isMove = true
      this.moveHandle()
    }
  }

  // 重绘
  redraw = () => {
    const { ctx, canvas  } = this.Tank
    // 清除
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 调用绘制方法
    this.CreateMap.drawMap()
    this.Enemy.move()
    this.Bullet.move()
    this.Enemy.draw()
    this.Bullet.drawHitEffects()

    window.requestAnimationFrame(this.redraw)
  }

  // 移动操作
  moveHandle = () => {
    // 只有当键盘为按下状态的时候才会执行该方法
    if (this.isMove) {
      // 更改主角坦克的方向状态
      this.Tank.enemyAll = this.Tank.enemyAll.map(v => {
        // 判断主角坦克
        if (v.tankObj === this.Tank) {
          v.tankObj.dir = this.dir
          return v
        }
        return v
      })
      this.Tank.move()
      window.requestAnimationFrame(this.moveHandle)
    }
  }

  //  发射子弹
  launchBullet() {
    // 如果游戏状态结束不郧西发射子弹
    if (this.Tank.isFinish) return
    // 防抖
    if (this.bulletTimeID !== null) clearTimeout(this.bulletTimeID)
    this.bulletTimeID = setTimeout(() => {
      const { tankW, tankH, tankX, tankY, config } = this.Tank
      this.Bullet.bulletAll.push({
        dir: this.dir,
        x: tankX + tankW / 2,
        y: tankY + tankH / 2,
        seed: config.myBulletSeed,
        color: config.myTankColor
      })
    }, 100)
  }

}
