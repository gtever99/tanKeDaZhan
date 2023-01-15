import BattleCity from './BattleCity'

// 地图、类
export default class CreateMap extends BattleCity{
  // 关卡数
  levelSum: number
  // 当前 关卡
  currentLevel: number

  constructor() {
    super()

    this.levelSum = mapObj.length
    this.currentLevel = -1
  }

  create() {
    // 需要减去像素比
    this.barrierObj = []
    this.currentLevel = this.level
    this.levelParams = mapObj[this.level]
    // 当前地图
    const cm = mapObj[this.level].map
    // 绘画格子宽度
    const dw = this.cw / cm[0].length
    // 绘画格子高度
    const dh = this.ch / cm.length
    // 循环当前地图
    cm.forEach((v1, i1) => {
      // 遍历字符串
      for (let i2 = 0; i2 < v1.length; i2 ++) {
        const x = (dw * i2) / devicePixelRatio, y = (dh * i1) / devicePixelRatio
        if (v1[i2] !== ' ') {
          this.barrierObj.push({
            x,
            y,
            w: (dw / devicePixelRatio),
            h: (dh / devicePixelRatio),
            type: v1[i2]
          })
        }
      }
    })
    this.drawMap()
  }

  // 绘制地图
  drawMap = () => {
    this.barrierObj.forEach(v => {
      v.type === 'q' ? this.drawWall(v.x, v.y, v.w, v.h, this.config.wallColor) : false
      v.type === 'j' ? this.drawFamily(v.x, v.y, v.w, v.h) : false
      v.type === 'z' ? this.drawBarrier(v.x, v.y, v.w, v.h) : false
    })
  }

  // 绘制墙壁
  // 该方法会根据canvas的宽高进行计算、并且平铺
  drawWall(x: number, y: number, w: number, h: number, color: string) {
    const { ctx } = this

    ctx.fillStyle = color
    // 墙的主体绘制
    ctx.beginPath()
    ctx.fillRect(x, y, w, h)
    ctx.closePath()

    // 墙里面的线绘制
    const num = h / 2
    ctx.strokeStyle = this.config.wallLineColor
    ctx.lineWidth = 2
    for (let i = 1; i <= 2; i ++) {
      if (i % 2 === 1) {
        // 这里 加1、减1是为了让线贴合到墙里面，不让它超出
        ctx.beginPath()
        ctx.strokeRect(x, y + (num * i) - num, (w - w / 2), num)
        ctx.moveTo((x) + (w - w / 2), y + num * i)
        ctx.lineTo(x + w, y + num * i)
        ctx.moveTo((x) + (w - w / 2), y + (num * i) - num)
        ctx.lineTo(x + w, y + (num * i) - num)
        ctx.stroke()
        ctx.closePath()
      } else {
        ctx.beginPath()
        ctx.moveTo(x + w / 4, y + (num * i))
        ctx.lineTo(x + w / 4, y + (num * i) - num)
        ctx.moveTo(x + (w / 2) + (w / 4), y + (num * i))
        ctx.lineTo(x + (w / 2) + (w / 4), y + (num * i) - num)
        ctx.stroke()
        ctx.closePath()
      }
    }
  }

  // 绘制家
  drawFamily(x: number, y: number, w: number, h: number) {
    const { ctx } = this
    ctx.beginPath()
    ctx.strokeStyle = 'red'
    ctx.font=`${parseInt(String((w / 1.5)))}px Arial`;
    ctx.fillText('家',x,y + h)
    ctx.closePath()
  }

  // 绘制 障碍
  drawBarrier(x: number, y: number, w: number, h: number) {
    const { ctx } = this
    ctx.beginPath()
    ctx.save()
    ctx.fillStyle = '#fff'
    ctx.fillRect(x, y, w, h)
    ctx.restore()
    ctx.closePath()
  }
}

/*
*   q = 墙
*   j = 家
*   z = 障碍
*
* */
const mapObj = [
  // @enemySeed 敌人速度
  // @enemyCeiling 敌人上限(地图最多可以出现多少敌人)
  // @enemyAmount 敌人数量
  // @enemyLife 敌人生命
  // @myTankLife 主角生命
  // @enemyCreateSeed 敌人创建速度(毫秒)
  {
    enemySeed: 2,
    enemyAmount: 10,
    enemyCeiling: 5,
    enemyLife: 2,
    myTankLife: 4,
    enemyCreateSeed: 1500,
    map: [
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '                                ',
      '          q         q           ',
      '         q q       q q          ',
      '        q   q     q   q         ',
      '       q     q   q     q        ',
      'q     q       q q       q      q',
      'qq     q       q       q      qq',
      'qqq     q             q      qqq',
      'qqqq     q           q      qqqq',
      'qqqqq     q         q      qqqqq',
      '           q       q            ',
      '            q     q             ',
      '             q   q              ',
      '              q q               ',
      '               q                ',
      '    zzzzz              zzzzz    ',
      '    zzzzz              zzzzz    ',
      '                                ',
      '            qqqqqqq             ',
      '            qqjjjqq             ',
      '            qqjjjqq             ',
    ]
  },
  {
    enemySeed: 2.5,
    enemyAmount: 100,
    enemyCeiling: 20,
    enemyLife: 3,
    myTankLife: 5,
    enemyCreateSeed: 800,
    map: [
      '                                ',
      '                                ',
      '                                ',
      '     qqqzzqqqqqqqqqqqqzzqqq     ',
      '     qqq  q   qqqq   q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  qqqqqqq    q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  q    qqqqqqq  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  qqqqqqq    q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  q    qqqqqqq  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  q          q  qqq     ',
      '     qqq  qqqqqqqqqqqq  qqq     ',
      '      q                  q      ',
      '       zz              zz       ',
      '    z       qqqqqqq        z    ',
      '    z       qqjjjqq        z    ',
      '            qqjjjqq             ',
    ]
  },
  {
    enemySeed: 3,
    enemyAmount: 200,
    enemyCeiling: 50,
    enemyLife: 4,
    myTankLife: 10,
    enemyCreateSeed: 500,
    map: [
      '                                ',
      '                                ',
      '         zzz       zzz          ',
      '         zzz       zzz          ',
      '                                ',
      '                                ',
      '    qqqqqqqqqqqqqqqqqqqqqqqqqqqq',
      '    qqqqqqqqqqqqqqqqqqqqqqqqqqqq',
      '                                ',
      '                                ',
      'qqqqqqqqqqqqqqqqqqqqqqqqqqqq    ',
      'qqqqqqqqqqqqqqqqqqqqqqqqqqqq    ',
      '                                ',
      '                                ',
      '   qqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
      '   qqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
      '                                ',
      '                                ',
      '    zzz     qqqqqqqq     zzz    ',
      '    zzz     qqqqqqqq     zzz    ',
      '                                ',
      'qqqqqqqqq              qqqqqqqqq',
      '            qqqqqqq             ',
      '            qqqqqqq             ',
      '            qqjjjqq             ',
      '            qqjjjqq             ',
    ]
  }
]
