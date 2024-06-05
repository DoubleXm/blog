> `computed` 也是 `vue` 的响应式系统中至关重要的 `api`。它接收一个回调函数或者对象。
>
> - `callback`：将其作为 `getter` 执行并得到其返回值。但是 `getter` 中需要存在响应式值
> - `object`：接受一个对象包含 `getter` 和 `setter`。此种方式允许用户手动的设置值。（默认情况下 `computed` 是不允许被修改的）

`computed` 的特点：只有内部依赖的数据变化时，下次访问到该属性才会被执行。

```ts
// 示例
const count = ref(10);
const doubleCount = computed(() => {
  console.log('computed render');
  return count.value * 2;
});

doubleCount.value; // 触发 render

count.value = 20;
doubleCount.value; // 触发 render
```

分析：

- `computed` 使用方法类似于 `effect`，但是不会自己执行，只有访问到时才会。
- `computed` 并不是依赖的值发生变化才会执行，只有变化后再次访问才会执行。
- `computed` 的值会被缓存，当依赖的值没有发生变化时，每次访问的都是被缓存下来的值。

## Computed

新建 `reactivity/computed.ts`。 改造 `effect.ts` 中的 `trigger` 方法。

::: code-group

```ts [computed.ts]
import { isFunction } from '@vue/shared/src';
import { effect } from '.';
import { track, trigger } from './effect';
import { TrackOpTypes, TriggerOpTypes } from './operations';

export function computed(getterOrOptions) {
  let getter;
  let setter;

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
    setter = () => {
      console.warn('computed value must be readonly');
    };
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }

  return new ComputedRefImpl(getter, setter);
}

class ComputedRefImpl() {
  private _dirty = true; // 是不是脏的，默认为 true
  private _value; // 用来存储用户访问的值
  private effect;

  constructor(public getter, public setter) {
    this.effect = effect(this.getter, {
      lazy: true, // effect 默认会首次执行一遍，lazy 不让其首次执行
      scheduler: () => {
        // 每次依赖的响应式数据触发更新后，将 dirty 置为 true，下次访问时就直接重新获取数据
        if (!this._dirty) {
          this._dirty = true;
          trigger(this, TriggerOpTypes.SET, 'value');
        }
      }
    })
  }

  get value() {
    // 如果是脏的，就执行，执行完毕之后把值给缓存起来
    if (this._dirty) {
      this._value = this.effect(); // 手动执行 effect 拿到用户 getter 执行后的返回值
      this._dirty = false;
    }
    return this._value;
  }

  // 当用户传递对象时，不需要关心用户传递的逻辑，随他操作
  set value(newValue) {
    this.setter(newValue);
  }
}
```

```ts{49-55} [effect.ts]
/**
 * 触发更新: 找属性对应的 effect 让其执行 （对象，数组）
 * @param target
 * @param type
 * @param key
 * @param newVal
 * @param oldVal
 */
export function trigger(target, type, key?, newVal?, oldVal?) {
  // 如果这个属性没有收集过 effect 不要做任何操作
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }

  const effects = new Set();
  const add = function (effectToAdd) {
    if (effectToAdd) {
      effectToAdd.forEach(effect => {
        effects.add(effect);
      });
    }
  };
  // 将所有要执行的 effect 全部存到一个新的集合中，最终一起执行

  // 修改的是不是数组的长度，因为改长度影响比较大
  if (key === 'length' && isArray(target)) {
    // 如果对应的长度有依赖收集
    depsMap.forEach((dep, key) => {
      // 如果更改长度小于收集索引，索引也需要触发 effect 重新执行
      if (key === 'length' || key > newVal) {
        add(dep);
      }
    });
  } else {
    // 不是数组，可能是对象 肯定是修改
    if (key !== undefined) {
      add(depsMap.get(key));
    }
    // 如果修改数据索引
    switch (type) {
      case TriggerOpTypes.ADD:
        if (isArray(target) && isIntegerKey(key)) {
          add(depsMap.get('length'));
        }
    }
  }

  effects.forEach((effect: any) => {
    if (effect.options.scheduler) { 
      effect.options.scheduler(effect); 
    } else { 
      effect();
    } 
  });
}
```
:::
