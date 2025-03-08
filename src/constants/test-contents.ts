export const MARKDOWN_TEST_CONTENT = `
# Markdown 渲染测试

### 流程图：
\`\`\`mermaid
graph TD
    A[开始] --> B{是否登录?}
    B -->|是| C[加载用户数据]
    B -->|否| D[跳转登录页]
    C --> E[显示主页]
    D --> F[显示登录表单]
    F --> G{登录是否成功?}
    G -->|是| C
    G -->|否| H[显示错误信息]
    H --> F
\`\`\`

## 1. 基础文本测试
这是一段普通文本，包含**粗体**、*斜体*和~~删除线~~。

这是一个[链接](https://github.com)，下面是一个图片：
![示例图片](https://via.placeholder.com/150)

这是一个带有 \`行内代码\` 的段落。

> 这是一段引用文本
> 可以有多行
>> 也可以嵌套引用

## 2. 列表测试
### 无序列表：
- 项目 1
  - 子项目 1.1
  - 子项目 1.2
    - 子项目 1.2.1
    - 子项目 1.2.2
- 项目 2
  - 子项目 2.1
    - 子项目 2.1.1

### 有序列表：
1. 第一步
   1. 子步骤 1.1
   2. 子步骤 1.2
2. 第二步
   1. 子步骤 2.1
   2. 子步骤 2.2
3. 第三步

### 任务列表：
- [x] 已完成任务
- [ ] 未完成任务
  - [x] 子任务 1
  - [ ] 子任务 2

## 3. 表格测试
### 基础表格：
| 姓名 | 年龄 | 城市 | 职业 |
|------|------|------|------|
| 张三 | 25 | 北京 | 工程师 |
| 李四 | 28 | 上海 | 设计师 |
| 王五 | 32 | 广州 | 产品经理 |

### 对齐方式：
| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:--------:|-------:|
| 内容 | 内容 | 内容 |
| 较长的内容 | 较长的内容 | 较长的内容 |

### 复杂表格：
| 功能 | 描述 | 状态 | 备注 |
|------|------|:----:|------|
| 基础渲染 | Markdown 基础语法 | ✅ | 已完成 |
| 代码高亮 | 支持多种语言 | ⚠️ | 进行中 |
| 图表渲染 | Mermaid & ECharts | ✅ | 已完成 |

## 4. 代码测试
### 行内代码：
这是一段包含 \`inline code\` 的文本，还有 \`const x = 42;\`。

### 代码块：
\`\`\`javascript
// 这是一个 JavaScript 函数
function hello(name) {
  console.log(\`Hello, \${name}!\`);
  return {
    message: 'success',
    timestamp: Date.now()
  };
}

// 使用异步函数
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\`

\`\`\`python
# 这是一个 Python 类
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        raise NotImplementedError()

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

# 创建实例
dog = Dog("Buddy")
print(dog.speak())  # 输出: Buddy says Woof!
\`\`\`

\`\`\`css
/* 这是一段 CSS 代码 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.card {
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background: white;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}
\`\`\`

## 5. Mermaid 图表测试
### 流程图：
\`\`\`mermaid
graph TD
    A[开始] --> B{是否登录?}
    B -->|是| C[加载用户数据]
    B -->|否| D[跳转登录页]
    C --> E[显示主页]
    D --> F[显示登录表单]
    F --> G{登录是否成功?}
    G -->|是| C
    G -->|否| H[显示错误信息]
    H --> F
\`\`\`

### 类图：
\`\`\`mermaid
classDiagram
    class Component {
        +render() void
        +mounted() void
        +updated() void
        +destroyed() void
    }
    class MarkdownRender {
        -content: string
        -options: object
        +parseContent() string
        +renderMarkdown() void
    }
    class CodeBlock {
        -language: string
        -code: string
        +highlight() string
    }
    class Chart {
        -type: string
        -data: object
        +render() void
    }
    Component <|-- MarkdownRender
    Component <|-- CodeBlock
    Component <|-- Chart
\`\`\`

### 状态图：
\`\`\`mermaid
stateDiagram-v2
    [*] --> 待处理
    待处理 --> 处理中: 开始处理
    处理中 --> 已完成: 处理成功
    处理中 --> 失败: 处理失败
    失败 --> 待处理: 重试
    已完成 --> [*]
\`\`\`

## 6. ECharts 图表测试
### 柱状图：
\`\`\`echarts
option = {
  title: {
    text: '项目完成情况统计',
    subtext: '数据来源：项目管理系统'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['计划完成', '实际完成']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['一月', '二月', '三月', '四月', '五月', '六月']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '计划完成',
      type: 'bar',
      data: [10, 15, 20, 25, 30, 35],
      itemStyle: {
        color: '#91cc75'
      }
    },
    {
      name: '实际完成',
      type: 'bar',
      data: [8, 14, 22, 23, 35, 33],
      itemStyle: {
        color: '#5470c6'
      }
    }
  ]
}
\`\`\`

### 折线图：
\`\`\`echarts
option = {
  title: {
    text: '用户增长趋势',
    subtext: '最近30天'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['新注册用户', '活跃用户', '付费用户']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: Array.from({length: 30}, (_, i) => \`\${i + 1}日\`)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '新注册用户',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: Array.from({length: 30}, () => Math.floor(Math.random() * 100 + 50))
    },
    {
      name: '活跃用户',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: Array.from({length: 30}, () => Math.floor(Math.random() * 200 + 100))
    },
    {
      name: '付费用户',
      type: 'line',
      stack: '总量',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: Array.from({length: 30}, () => Math.floor(Math.random() * 50 + 20))
    }
  ]
}
\`\`\`

### 饼图：
\`\`\`echarts
option = {
  title: {
    text: '用户分布',
    subtext: '按地区统计',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '用户分布',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '华东地区' },
        { value: 735, name: '华北地区' },
        { value: 580, name: '华南地区' },
        { value: 484, name: '西南地区' },
        { value: 300, name: '西北地区' }
      ]
    }
  ]
}
\`\`\`

## 7. 混合内容测试
### 表格 + 图表组合：
| 季度 | 目标完成率 | 同比增长 | 趋势 |
|------|------------|----------|------|
| Q1 | 89% | +5.2% | 上升 |
| Q2 | 92% | +3.8% | 上升 |
| Q3 | 88% | -2.1% | 下降 |
| Q4 | 95% | +7.5% | 上升 |

\`\`\`echarts
option = {
  title: {
    text: '季度目标完成情况'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['目标完成率', '同比增长']
  },
  xAxis: {
    type: 'category',
    data: ['Q1', 'Q2', 'Q3', 'Q4']
  },
  yAxis: [
    {
      type: 'value',
      name: '完成率',
      min: 80,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    {
      type: 'value',
      name: '增长率',
      axisLabel: {
        formatter: '{value}%'
      }
    }
  ],
  series: [
    {
      name: '目标完成率',
      type: 'bar',
      data: [89, 92, 88, 95]
    },
    {
      name: '同比增长',
      type: 'line',
      yAxisIndex: 1,
      data: [5.2, 3.8, -2.1, 7.5]
    }
  ]
}
\`\`\`

### 流程图 + 说明：
1. 系统架构图
\`\`\`mermaid
graph LR
    A[前端应用] --> B[API网关]
    B --> C[认证服务]
    B --> D[业务服务]
    B --> E[数据服务]
    D --> F[(主数据库)]
    E --> G[(分析数据库)]
\`\`\`

2. 关键节点说明：
- **前端应用**: Vue3 + TypeScript
- **API网关**: Spring Cloud Gateway
- **认证服务**: OAuth2 + JWT
- **业务服务**: Spring Boot 微服务
- **数据服务**: 数据分析和处理服务

## 8. 错误处理测试
### 未闭合的代码块：
\`\`\`mermaid
graph TD
    A --> B

### 错误的图表语法：
\`\`\`mermaid
graph TD
    A --- B[这是一个错误的语法
\`\`\`

### 错误的 ECharts 配置：
\`\`\`echarts
option = {
  xAxis: {
    type: 'category'
    data: ['A', 'B', 'C'] // 缺少逗号
  }
}
\`\`\`

### 自定义渲染器测试

\`\`\`custom
# 这是一个自定义渲染器
console.log('Hello, World!')
\`\`\`


\`\`\`html
<div style="padding: 20px; background: #f5f5f5; border-radius: 8px;">
  <h1 style="color: #333;">HTML 渲染测试</h1>
  
  <div style="margin: 20px 0;">
    <h2>1. 文本样式</h2>
    <p>这是普通文本</p>
    <p><strong>这是粗体文本</strong></p>
    <p><em>这是斜体文本</em></p>
    <p><u>这是下划线文本</u></p>
    <p><mark>这是高亮文本</mark></p>
  </div>

  <div style="margin: 20px 0;">
    <h2>2. 列表展示</h2>
    <h3>无序列表：</h3>
    <ul>
      <li>列表项 1</li>
      <li>列表项 2
        <ul>
          <li>子项 2.1</li>
          <li>子项 2.2</li>
        </ul>
      </li>
      <li>列表项 3</li>
    </ul>

    <h3>有序列表：</h3>
    <ol>
      <li>第一步</li>
      <li>第二步</li>
      <li>第三步</li>
    </ol>
  </div>

  <div style="margin: 20px 0;">
    <h2>3. 表格样式</h2>
    <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
      <thead>
        <tr style="background: #eee;">
          <th style="padding: 10px; border: 1px solid #ddd;">标题 1</th>
          <th style="padding: 10px; border: 1px solid #ddd;">标题 2</th>
          <th style="padding: 10px; border: 1px solid #ddd;">标题 3</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">内容 1</td>
          <td style="padding: 10px; border: 1px solid #ddd;">内容 2</td>
          <td style="padding: 10px; border: 1px solid #ddd;">内容 3</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px; border: 1px solid #ddd;">内容 4</td>
          <td style="padding: 10px; border: 1px solid #ddd;">内容 5</td>
          <td style="padding: 10px; border: 1px solid #ddd;">内容 6</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div style="margin: 20px 0;">
    <h2>4. 表单元素</h2>
    <form style="display: flex; flex-direction: column; gap: 10px;">
      <div>
        <label for="name">姓名：</label>
        <input type="text" id="name" placeholder="请输入姓名" style="padding: 5px;">
      </div>
      <div>
        <label for="email">邮箱：</label>
        <input type="email" id="email" placeholder="请输入邮箱" style="padding: 5px;">
      </div>
      <div>
        <label>性别：</label>
        <input type="radio" name="gender" id="male"> <label for="male">男</label>
        <input type="radio" name="gender" id="female"> <label for="female">女</label>
      </div>
      <div>
        <label>爱好：</label>
        <input type="checkbox" id="hobby1"> <label for="hobby1">阅读</label>
        <input type="checkbox" id="hobby2"> <label for="hobby2">运动</label>
        <input type="checkbox" id="hobby3"> <label for="hobby3">音乐</label>
      </div>
    </form>
  </div>

  <div style="margin: 20px 0;">
    <h2>5. 其他样式</h2>
    <div style="padding: 15px; background: #e1f5fe; border-left: 4px solid #03a9f4; margin: 10px 0;">
      这是一个提示框
    </div>
    <div style="padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; margin: 10px 0;">
      这是一个警告框
    </div>
    <button style="padding: 10px 20px; background: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
      这是一个按钮
    </button>
  </div>
</div>
\`\`\`
`
