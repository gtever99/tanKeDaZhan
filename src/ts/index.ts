import '../styles/indexl.scss'
// 解决canvas模糊问题
import 'hidpi-canvas/dist/hidpi-canvas.min'

import Controller from './module/Controller'

let c = new Controller()

// 关卡父级容器
const selectLevel = (document.querySelector('.selectLevel') as Element)
const divElAll: Array<HTMLDivElement> = []

// 遍历最大关卡数量
for (let i = 0; i < c.CreateMap.levelSum; i ++) {
  let divEl = document.createElement('div')
  // 自定义属性--索引
  divEl.setAttribute('index', String(i))
  divEl.innerText = `第${i + 1}关`;
  divEl.classList.add('level');
  divElAll.push(divEl)
  // 插入元素
  selectLevel.appendChild(divEl)
}

// 事件委托
selectLevel.addEventListener('click', (e) => {
  // 获取索引
  const index = (e.target as HTMLDivElement).getAttribute('index') as string
  // 设置选中样式
  divElAll.forEach(v => v.classList.remove('active'))
  divElAll[parseInt(index)]?.classList.add('active')
  // 开始游戏
  c.start(parseInt(index))
});

// 说明弹框
(document.querySelector('.explain') as HTMLDivElement).addEventListener('click', () => {
  c.Bullet.dialog.alert( {
    content: `
      操作：↑↓←→<br>Space：发射子弹<br>点击选择关卡，每一关难度不同<br>
      我设置了三个关卡<br>第一关：简单，第二关：困难，第三关：地狱<br>
      胜利条件：消灭所有敌人<br>
      失败条件：家全部被毁灭，或主角生命&lt;=0
    `,
    buttons: {
      ok(){
        return true;
      },
    }
  })
})
