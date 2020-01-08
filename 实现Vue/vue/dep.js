// 依赖管理类
class Dep {
  subscribers = null; // 订阅者

  constructor () {
    subscribers = [];
  }

  // 收集依赖
  depend () {
    this.subscribers.push(Dep.target);
  }

  // 触发更新
  notify () {
    for (const subscriber : subscribers) {
      subscriber.update();
    }
  }
}

// (全局)当前活跃Watchers
Dep.target = null;
let currWatchers = [];

function pushTarget (watcher) {
  currWatchers.push(watcher);
  Dep.target = watcher;
}

function popTarget () {
  Dep.target = currWatchers.pop();
}

module.exports = {
  Dep,
  pushTarget,
  popTarget
}