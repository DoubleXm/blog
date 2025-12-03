## Calendar 日历

> [!CAUTION]
> 日历的核心就是 Date， 本组件使用 `Day.js` 来处理日期相关的逻辑。
>
> 本组件核心使用到的 API 如下，Dayjs 最大的特点是**链式调用**，可以很方便的处理日期相关的逻辑。
> ```ts :no-line-numbers
> dayjs(new Date()).daysInMonth(); // 获取本月有多少天
> dayjs(new Date()).startOf('month') // 获取本月第一天
> dayjs(new Date()).endOf('month') // 获取本月最后一天
> dayjs(new Date()).subtract(1, 'day') // 当前日期减 1 天
> dayjs(new Date()).add(1, 'day') // 当前日期加 1 天
> dayjs(new Date()).format('YYYY-MM-DD') // 当前日期格式化
> dayjs(new Date()).date() // 获取当前日期，1-31 之间的整数
> dayjs(new Date()).day() // 获取当前星期，0-6 之间的整数，0 表示星期日
> dayjs(new Date()).month() // 获取当前月份，0-11 之间的整数，0 表示一月
> dayjs(new Date()).year() // 获取当前年份
> ```

![alt text](/react/components/calendar/05.png)

> [!INFO]
> 1. 渲染不同月份日期
> 2. 月份切换、今日点击直达
> 3. renderDate 允许自定义单元格内容
> 4. renderInnerContent 允许增量单元格内容
> 5. 点击切换日期，切换到当前日期的月份
> 6. 支持受控、非受控模式
> 7. 支持国际化内容
> 8. 支持根标签的类名、样式拓展
>
> 组件拆分为 `Header` `MonthCalendar` 两个部分，一个控制月份切换，一个控制渲染日期。

## 类名、样式拓展及受控非受控模式

![alt text](/react/components/calendar/06.png)

使用 `classnames` 来处理类名的合并。[classnames 文档](https://www.npmjs.com/package/classnames)

## 日期渲染

![alt text](/react/components/calendar/07.png)

先将顶部周一至周日渲染出来，后期可以考虑将 `weekList` 中的值作为 `key` 作为国际化的映射。

> [!INFO]
> 1. 渲染当前月份的日期
> 2. 渲染上一个月份的日期
> 3. 渲染下一个月份的日期
> 4. 始终渲染 6 * 7 个单元格

```ts :no-line-numbers
interface DayInfo {
  date: Dayjs;
  isCurrentMonth: boolean;
}
const formatterDays = (date: Dayjs) => {
  const startDate = date.startOf('month'); // 本月第一天
  const day = startDate.day(); // 本月第一天是星期几
  const daysInfo = new Array<DayInfo>(6 * 7);

  // 渲染上个月的日期
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(i + 1, 'day'),
      isCurrentMonth: false
    }
  }
  // 渲染本月及下个月日期
  for (let i = day; i < daysInfo.length; i++) {
    const addedDate = startDate.add(i - day, 'day');
    daysInfo[i] = {
      date: addedDate,
      isCurrentMonth: addedDate.month() === date.month()
    }
  }
  return daysInfo;
}
```
先维护一个完整的 `6 * 7` 数组，并且将日期和是否为当前月份的信息维护在数组中。

核心就是先获取当前月份的第一天 `date.startOf('month')`，然后通过 `add` 以及 `subtract` 来加减日期。

如果需要调试，可以给 `daysInfo` 中的日期加上 `format` 方法，方便查看日期是否正确。

![alt text](/react/components/calendar/08.png)

### 自定义单元格内容

从父组件中接收 `value` `dateRender` `dateInnerContent` 为日期渲染做准备。

![alt text](/react/components/calendar/10.png)

子组件中继承父组件的 `props`。

![alt text](/react/components/calendar/11.png)

``` ts :no-line-numbers
const MonthCalendar: React.FC<MonthCalendarProps> = (props) => {
  const {
    value, 
    renderDate,
    dateInnerContent
  } = props;
  const allDays = formatterDays(value!);

  const renderDays = () => {
    const monthDays = [];
    for (i = 0; i < 6; i++) {
      const weekDays = [];
      for (j = 0; j < 7; j++) {
        const day = allDays[i * 7 + j];
        weekDays[j] = (
          // 日期 jsx 渲染
        )
      }
      monthDays.push(weekDays);
    }
    return monthDays.map(row => <div className="calendar-month-body-row" key={row[0].key}>{row}</div>)
  }
}
```
![alt text](/react/components/calendar/12.png)

- 通过 `isCurrentMonth` 来判断是否为当前月份的日期，通过类名区分
- 通过 `value.format('YYYY-MM-DD')` 作比较是否为今天
- 如果用户传递了 `renderDate`， 则使用用户的 `renderDate` 来渲染单元格
- 如果用户传递了 `dateInnerContent`， 则使用用户的 `dateInnerContent` 增量渲染单元格

### 日期的选择

父组件传递 `onDateChange` 回调函数，子组件在日期切换时调用。

```tsx :no-line-numbers
const Calendar: React.FC<CalendarProps> = (props) => {
  const onDateChange = (date: Dayjs) => {
    setCurValue(date);
  }

  return <>
    <div className={cs('calendar', className)} style={style}>
      <Header />
      <MonthCalendar {...props} value={curValue} onDateChange={onDateChange} />
    </div>
  </>
}
```
![alt text](/react/components/calendar/13.png)

## Header 组件

```tsx :no-line-numbers
const Header: React.FC = () => {
  return <div className="calendar-header">
    <div className="calendar-header-left">
      <div className="calendar-header-icon" >&lt;</div>
      <div className="calendar-header-value">2025 年 12 月</div>
      <div className="calendar-header-icon" >&gt;</div>
      <button className="calendar-header-btn">Today</button>
    </div>
  </div>
}
```

### 月份切换及显示

将月份的切换和显示状态放在父组件中维护，子组件只负责渲染。子组件的日期显示只需要  `curMonth.format('YYYY-MM-DD')` 即可。

![alt text](/react/components/calendar/14.png)

此时虽然可以完成月份的切换，但是日期却没有任何变化。

**原因是 `setCurMonth` 的时候 `curValue` 其实没有任何变化。将 `curMonth` 传递到 `MonthCalendar` 中。**

**每次 `formatterDays` 调用的时候，根据 `curMonth` 来格式化日期。**

### 今日点击直达

今日直达要考虑同时更新 `curMonth` 和 `curValue` 避免用户不在当月时点击，月份回不去的情况。

```ts :no-line-numbers
const onToday = () => {
  const today = dayjs(new Date());
  setCurMonth(today);
  setCurValue(today);
}
```

同理在 `MonthCalendar` 中的 `onDateChange` 也不能只更新 `curValue`。

![alt text](/react/components/calendar/15.png)

## 国际化

新增 `locales` 文件夹，存储不同语言的配置文件，以及 `context`。

通过 `createContext` 加 `useContext` 来实现国际化。

::: code-group

```ts [index.ts] :no-line-numbers
import { zhCN } from './zh-CN';
import { enUS } from './en-US';
import { createContext } from 'react';

// key 名与 navigator.language 保持一致
const allLocales = {
  'zh-ZN': zhCN,
  'en': enUS,
} as const;
const LocaleContext = createContext<keyof typeof allLocales>(allLocales)
```

```ts [zh-CN.ts] :no-line-numbers
export const zhCN = {
  formatMonth: 'YYYY 年 MM 月',
  today: '今天',
  week: {
    monday: '周一',
    tuesday: '周二',
    wednesday: '周三',
    thursday: '周四',
    friday: '周五',
    saturday: '周六',
    sunday: '周日',
  }
} as const
```

```ts [en-US.ts] :no-line-numbers
export const enUS = {
  formatMonth: 'MMM YYYY',
  today: 'Today',
  week: {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  },
} as const;
```
:::

![alt text](/react/components/calendar/16.png)

在 `Calendar` 中注入国际化内容。随后使用时直接从 `useContext` 中获取即可。

![alt text](/react/components/calendar/17.png)
