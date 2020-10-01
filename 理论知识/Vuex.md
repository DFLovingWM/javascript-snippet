# Vuex

## mutation和action有什么区别？为什么要区分这两种概念？

- mutation：无副作用，因为数据改变是同步的、确定的，所以是可追踪的，可以实现time travel，用于Debug、用户行为复现。
- action：接管副作用。
