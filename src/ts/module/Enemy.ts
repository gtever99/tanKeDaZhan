import BattleCity from './BattleCity'
import Tank from "./Tank";

// 敌人
export default class Enemy extends BattleCity{
  createEnemyId: NodeJS.Timer | null

  constructor() {
    super();
    this.createEnemyId = null
  }

  // 创建敌人
  create() {
    // 防止多次开计时器
    if (this.createEnemyId !== null) clearInterval(this.createEnemyId)
    // 上来就创建一个敌人
    this.createHandle()
    // 创建
    this.createEnemyId = setInterval(() => {
      // 限制地图上最大显示的敌人坦克数量
      // 并且限制 关卡敌人数量 - 消灭敌人数量
      if (
        this.enemyAll.length <= this.levelParams.enemyCeiling &&
        (this.levelParams.enemyAmount - this.enemyVanishNum) > this.enemyAll.length - 1
      ) this.createHandle()
    }, this.levelParams.enemyCreateSeed)
    this.move()
  }

  // 转向
  // @tankObj 要转向的坦克对象
  // @not 随机值不会随机到这个位置
  turnTo(tankObj: Tank, not?: string) {
    const arr = ['下', '上', '左', '右'].filter(v => not !== v)
    this.enemyAll = this.enemyAll.map((v) => {
      // 判断哪一个坦克需要转向
      if (tankObj === v.tankObj) {
        // 取随机值
        v.tankObj.dir = arr[Math.floor(Math.random() * arr.length)] as '上' | '下' | '左' | '右'
        return v
      }
      return  v
    })
  }

  // 创造敌人的操作
  createHandle() {
    // 时间间隔
    const arrLaunch = [1.2, 1.5, 1.8, 2, 2.2, 2.5]
    // 随机获取发射间隔的值
    const launchVal = arrLaunch[Math.floor(Math.random() * arrLaunch.length)] as 2 | 2.5 | 3 | 3.5 | 4
    // new 坦克对象
    const tankObj = new Tank(this.levelParams.enemySeed, 'e80000',this.levelParams.enemyLife, 100, 0, )
    // 发射子弹的定时器
    const bulletId = setInterval(() => {
      this.enemyBullet(tankObj)
    }, (launchVal * 1000) / 1.5)
    // 转向的定时器
    const turnToId = setInterval(() => {
      this.turnTo(tankObj)
    }, launchVal * 1000)
    // 创造敌人
    this.enemyAll.push({
      bulletId,
      turnToId,
      tankObj
    })
    this.draw()
  }

  // 绘制敌人
  draw = () => {
    this.enemyAll.forEach(v => {
      v.tankObj.drawTank()
    })
  }

  // 敌人移动
  move = () => {
    this.enemyAll = this.enemyAll.map((v) => {
      // 这个判断成立代表这次遍历的坦克是主角，不需要移动
      if (v.tankObj.color === 'yellow') return v
      // 如果非主角需要移动
      v.tankObj.move().then(() => {
        this.turnTo(v.tankObj, v.tankObj.dir)
      })
      return v
    })
  }

  // 敌人发射子弹
  enemyBullet = (tankObj: Tank) => {
    const { tankW, tankH, tankX, tankY, dir } = tankObj
    this.bulletAll.push({
      dir,
      x: tankX + tankW / 2,
      y: tankY + tankH / 2,
      seed: 4,
      color: 'red'
    })
  }
}
