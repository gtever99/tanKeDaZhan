import BattleCity from './BattleCity'

// 我的、坦克
export default class Tank extends BattleCity{
  // 坦克宽度
  tankW: number
  // 坦克高度
  tankH: number
  // 坦克X位置
  tankX: number
  // 坦克Y位置
  tankY: number
  // 方向
  dir: '上' | '下' | '左' | '右'
  // 坦克颜色
  color: string
  // 坦克速度
  seed: number
  // 是否开启无敌
  isInvincible: Boolean
  // 坦克血量
  lifeVal: number

  constructor(seed: number, color: string, lifeVal:number, x?: number, y?: number) {
    super()
    this.tankW = this.config.tankWidth
    this.tankH = this.config.tankHeight
    this.tankX = x || 0
    this.tankY = y || 0
    this.dir = '上'
    this.color = color
    this.seed = seed
    this.isInvincible = false
    this.lifeVal = lifeVal

    // 坦克刚创建会有3秒无敌时间
    this.invincible(3000)
  }

  // 开启无敌
  // @time 无敌的时间（毫秒）
  invincible(time: number) {
    this.isInvincible = true
    setTimeout(() => {
      this.isInvincible = false
    }, time)
  }

  // 坦克移动
  // 返回promise reslove 碰撞
  move = () => {
    return new Promise((reslove) => {
      let { canvas, tankW, tankH, hitDetection, tankX, tankY } = this
      const cw = canvas.width
      const ch = canvas.height
      const mapBottom = (ch - (tankH * devicePixelRatio)) / devicePixelRatio

      // 移动
      if (tankX > 0) this.dir === '左' ? tankX -= this.seed : false
      if (tankX + tankW < cw) this.dir === '右' ? tankX += this.seed : false
      if (tankY > 0) this.dir === '上' ? tankY -= this.seed : false
      if (tankY < mapBottom) this.dir === '下' ? tankY += this.seed : false

      // 遍历所以墙的位置 然后于坦克的位置进行碰撞检测
      const moveResult1 = this.barrierObj.find(v => {
        return hitDetection({
          x: tankX,
          y: tankY,
          w: tankW,
          h: tankH
        }, v)
      })

      // 撞到边界
      if ((tankX <= 0 || tankX + tankW >= cw || tankY <= 0 || tankY >= mapBottom) && (this.color !== this.config.myTankColor)) reslove(null)
      // 撞到墙了
      if (moveResult1) return reslove(null)

      // 没有障碍物
      this.tankX = tankX
      this.tankY = tankY
    })
  }

  // 绘制坦克
  drawTank() {
    const x = this.tankX, y = this.tankY
    const { ctx, tankW, tankH } = this

    // 绘制左右坦轮
    ctx.beginPath()
    ctx.save()

    ctx.fillStyle = this.color
    // 根据方向旋转角度
    this.rotate(x, y, tankW, tankH, this.dir === '上' ? 0 : this.dir === '下' ? 180 : this.dir === '左' ? 270 : 90)
    ctx.fillRect(x, y, tankW / 4, tankH)
    ctx.fillRect(x + (tankW - tankW / 4), y, tankW / 4, tankH)

    ctx.strokeStyle = 'rgba(153,153,153,0.6)'

    // 一层遍历，将左右两边分开
    for (let i = 1; i <= 2; i ++) {
      ctx.lineWidth = 1
      // 绘制坦轮里面的横线
      for (let k = 1; k <= 5; k ++) {
        const currentY = y + (tankH / 5) * k
        switch (i) {
          // 左
          case 1: {
            ctx.moveTo(x, currentY)
            ctx.lineTo(x + tankW / 4, currentY)
          }
            break;
          default: {
            // 右
            ctx.moveTo(x + tankW - tankW / 4, currentY)
            ctx.lineTo(x + (tankW - tankW / 4) + tankW / 4, currentY)
          }
            break;
        }
      }
      ctx.stroke()
    }

    // 绘制坦身
    this.borderRect(x + (tankW / 2) - ((tankW / 2.6) / 2), y + ((tankH - (tankH / 1.4)) / 2), tankW / 2.6, tankH / 1.4)
    ctx.lineWidth = 1
    // 绘制炮管
    this.borderRect(x + ((tankW / 2) - ((tankW / 6) / 2)), y - 5, tankW / 6, tankH / 1.3)

    // 绘制无敌样式
    if (this.isInvincible) {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,130,0)'
      ctx.arc(x + (tankW / 2), y + (tankH / 2), tankW - 2, Math.PI * 2, 0)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.restore()
    ctx.closePath()

    // 绘制裂痕
    if (
        // 低过半血就会出现裂痕
        // 判断是主角坦克还是敌人坦克，两种坦克血量不同
        this.lifeVal <= (this.color === this.config.myTankColor ?  this.levelParams.myTankLife / 2 : this.levelParams.enemyLife / 2)
    ) {
      ctx.beginPath()
      ctx.save()
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 3
      ctx.moveTo(x + tankH / 4, y)
      ctx.lineTo(x + 5, y + tankH / 2)
      ctx.lineTo(x + tankH / 3, y + tankH / 2)
      ctx.lineTo(x + tankH / 4, y + tankH)
      ctx.moveTo(x + tankH - 5, y)
      ctx.lineTo(x + tankH - 5, y + tankH / 2)
      ctx.lineTo(x + tankH, y + tankH / 2)
      ctx.lineTo(x + tankH - 10, y + tankH)
      ctx.stroke()
      ctx.restore()
      ctx.closePath()
    }
  }
}
