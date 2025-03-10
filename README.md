# Markdown Parse Vue

A Vue 3 based Markdown rendering component that supports code highlighting, tables, Mermaid diagrams, and ECharts.

## Features

- Standard Markdown syntax support
- Code highlighting
- Table rendering
- Mermaid diagram support
- ECharts support
- Custom code block rendering
- Custom renderers
- Rich configuration options
- TypeScript support

## Installation

```bash
npm install markdown-parse-vue
```

## Usage

```vue
<template>
  <MarkdownRender
    :content="markdown"
    :codeBlockTypes="customCodeBlocks"
    :markdownOptions="markdownOptions"
    :mermaidOptions="mermaidOptions"
    :echartsOptions="echartsOptions"
    :customRenderers="customRenderers"
    @error="handleError"
    @render="handleRender"
  />
</template>

<script setup lang="ts">
import 'markdown-parse-vue/style.css'
import { MarkdownRender } from 'markdown-parse-vue'

// See configuration examples below
</script>
```

## Configuration Options

### MarkdownRenderProps

| Property | Type | Required | Default | Description |
|----------|------|----------|----------|-------------|
| content | string | Yes | - | Markdown content |
| codeBlockTypes | CodeBlockType[] | No | [] | Custom code block type configuration |
| markdownOptions | object | No | {} | Markdown-it configuration options |
| mermaidOptions | object | No | {} | Mermaid configuration options |
| echartsOptions | object | No | {} | ECharts configuration options |
| customRenderers | object | No | {} | Custom renderers |
| onError | function | No | - | Error handling callback |
| onRender | function | No | - | Render completion callback |

### CodeBlockType

```typescript
interface CodeBlockType {
  name: string              // Code block type name
  startMarker: RegExp       // Start marker regex
  endMarker: RegExp         // End marker regex
  validate?: (content: string) => boolean  // Content validation function
  message?: string          // Loading message
  render?: (content: string) => JSX.Element | null  // Custom render function
}
```

### Configuration Examples

```typescript
// Custom code blocks
const customCodeBlocks = [
  {
    name: 'custom',
    startMarker: /^```custom\s*$/,
    endMarker: /^```$/,
    validate: content => content.length > 0,
    message: 'Custom rendering...',
    render: content => (
      <div class="custom-block">{content}</div>
    ),
  },
]

// Markdown configuration
const markdownOptions = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    // Code highlighting configuration
  },
}

// Mermaid configuration
const mermaidOptions = {
  theme: 'default',
  flowchart: {
    curve: 'basis',
  },
  sequence: {
    showSequenceNumbers: true,
  },
}

// ECharts configuration
const echartsOptions = {
  renderer: 'canvas',
  devicePixelRatio: window.devicePixelRatio,
  useUTC: false,
}

// Custom renderers
const customRenderers = {
  text: content => (
    <div class="custom-text">{content}</div>
  ),
  table: content => (
    <div class="custom-table">{content}</div>
  ),
}
```

## Events

### onError

Error handling callback function.

```typescript
function handleError(error: Error) {
  console.error('Render error:', error)
}
```

### onRender

Render completion callback function.

```typescript
function handleRender(type: string, content: string) {
  console.log(`Render type: ${type}`, content)
}
```

## License

MIT

---

# Markdown Parse Vue (中文文档)

一个基于 Vue 3 的 Markdown 渲染组件，支持代码高亮、表格、Mermaid 图表和 ECharts 图表。

## 特性

- 支持标准 Markdown 语法
- 支持代码高亮
- 支持表格渲染
- 支持 Mermaid 图表
- 支持 ECharts 图表
- 支持自定义代码块渲染
- 支持自定义渲染器
- 丰富的配置选项
- TypeScript 支持

## 安装

```bash
npm install markdown-parse-vue
```

## 使用

```vue
<template>
  <MarkdownRender
    :content="markdown"
    :codeBlockTypes="customCodeBlocks"
    :markdownOptions="markdownOptions"
    :mermaidOptions="mermaidOptions"
    :echartsOptions="echartsOptions"
    :customRenderers="customRenderers"
    @error="handleError"
    @render="handleRender"
  />
</template>

<script setup lang="ts">
import 'markdown-parse-vue/style.css'
import { MarkdownRender } from 'markdown-parse-vue'

// 配置示例见下文
</script>
```

## 配置选项

### MarkdownRenderProps

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| content | string | 是 | - | Markdown 内容 |
| codeBlockTypes | CodeBlockType[] | 否 | [] | 自定义代码块类型配置 |
| markdownOptions | object | 否 | {} | Markdown-it 配置选项 |
| mermaidOptions | object | 否 | {} | Mermaid 配置选项 |
| echartsOptions | object | 否 | {} | ECharts 配置选项 |
| customRenderers | object | 否 | {} | 自定义渲染器 |
| onError | function | 否 | - | 错误处理回调 |
| onRender | function | 否 | - | 渲染完成回调 |

### CodeBlockType

```typescript
interface CodeBlockType {
  name: string              // 代码块类型名称
  startMarker: RegExp       // 开始标记的正则表达式
  endMarker: RegExp         // 结束标记的正则表达式
  validate?: (content: string) => boolean  // 内容验证函数
  message?: string          // 加载提示信息
  render?: (content: string) => JSX.Element | null  // 自定义渲染函数
}
```

### 配置示例

```typescript
// 自定义代码块
const customCodeBlocks = [
  {
    name: 'custom',
    startMarker: /^```custom\s*$/,
    endMarker: /^```$/,
    validate: content => content.length > 0,
    message: '自定义渲染中...',
    render: content => (
      <div class="custom-block">{content}</div>
    ),
  },
]

// Markdown 配置
const markdownOptions = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    // 代码高亮配置
  },
}

// Mermaid 配置
const mermaidOptions = {
  theme: 'default',
  flowchart: {
    curve: 'basis',
  },
  sequence: {
    showSequenceNumbers: true,
  },
}

// ECharts 配置
const echartsOptions = {
  renderer: 'canvas',
  devicePixelRatio: window.devicePixelRatio,
  useUTC: false,
}

// 自定义渲染器
const customRenderers = {
  text: content => (
    <div class="custom-text">{content}</div>
  ),
  table: content => (
    <div class="custom-table">{content}</div>
  ),
}
```

## 事件

### onError

错误处理回调函数。

```typescript
function handleError(error: Error) {
  console.error('渲染错误:', error)
}
```

### onRender

渲染完成回调函数。

```typescript
function handleRender(type: string, content: string) {
  console.log(`渲染类型: ${type}`, content)
}
```

## 许可证

MIT
