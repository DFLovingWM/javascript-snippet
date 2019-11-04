# 继承

## 原型链

JS中的继承是通过将构造函数的原型放在同一条原型链上实现的。如果C继承B、B继承A、A什么也不继承（或者说继承`Object`），那么原型链为：

```js
null <== Object.prototype <== A.prototype <== B.prototype <== C.prototype
```

考虑上C的实例c，还得加上：

```js
C.prototype <== c
```

原型链的特点：当我们访问`c.name`这个属性时，JS会沿着原型链来寻找这个属性，找到第一个拥有`name`属性的对象就停止，找不到就返回`undefined`。

## 继承方式

继承的理想状态，用2点来阐述：

- 非函数属性：全都在实例上
- 函数属性：分布在多级原型上

实际编码中也与这2点对应：

- 构造函数窃取(Constructor stealing)
- 链接原型，有多种方式：
  - 间接链接(可取)：通过`Object.create`
  - 直接链接(可取)：访问`__proto__`或者使用ES6的`Object.setPrototypeOf`

关于链接原型的方式，从开始到完美的尝试过程可以是这样的：

1. `B.prototype = A.prototype`：访问没有问题，但是修改`B`的原型，会影响到`A`的原型。所以需要将二者分开。
1. `B.prototype = new A()`：这种做法的根据是：实例可以访问其对应的原型上的属性。本质上是将实例化等同于继承。缺点就是`B.prototype`这个对象上面会有一些多余的非函数属性，这个原型不够“纯”（原型应该只含有函数属性）。
1. `B.prototype = Object.create(A.prototype)`：解决了上面的问题。本质上是使用一个临时类来实例化。
1. 另一种可取方式：`B.prototype.__proto__ = A.prototype`。因为上面方法的最终结果就是原型处于同一条链上，通过`__ptoto__`属性链接；而该方式不从构造函数/实例化入手，而是以结果为导向，直接对原型建立链接。

## 举个例子

假如有`Human`（人）和`Student`（学生）两个类，后者继承前者。`Human`类定义如下：

```js
function Human (id) {
  this.id = id
}

Human.prototype.showId = function () {
  console.log('id:' + this.id)
}
```

`Student`类继承于`Human`类：

```js
function Student (id, score) { // 构造函数参数：需要包括父类属性，并且在最前面（理念）
  Human.call(this, id) // 2. 构造函数窃取：实际上对Student的实例赋予`id`属性
  this.score = score
}

Student.prototype = Object.create(Human.prototype) // 1. 链接原型

Student.prototype.showScore = function () {
  console.log('score:' + this.score)
}
```
