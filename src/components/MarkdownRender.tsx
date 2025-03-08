import { defineComponent, computed, ref, watchEffect, PropType } from 'vue'
import TextRender from './TextRender'
import TableRender from './TableRender'
import MermaidRender from './MermaidRender'
import EChartsRender from './EChartsRender'
import './MarkdownRender.scss'

export interface CodeBlockType {
  /** 代码块类型名称 */
  name: string
  /** 开始标记的正则表达式 */
  startMarker: RegExp
  /** 结束标记的正则表达式 */
  endMarker: RegExp
  /** 内容验证函数 */
  validate?: (content: string) => boolean
  /** 加载提示信息 */
  message?: string
  /** 自定义渲染函数 */
  render?: (content: string) => JSX.Element | null
}

export interface MarkdownRenderProps {
  /** Markdown 内容 */
  content: string
  /** 自定义代码块类型配置 */
  codeBlockTypes?: CodeBlockType[]
  /** Markdown-it 配置选项 */
  markdownOptions?: {
    /** 是否允许 HTML 标签 */
    html?: boolean
    /** 是否自动转换换行符为 <br> */
    breaks?: boolean
    /** 是否自动识别链接 */
    linkify?: boolean
    /** 是否启用 typographer */
    typographer?: boolean
    /** 引用的样式 */
    quotes?: string | string[]
    /** 代码高亮主题 */
    highlight?: (str: string, lang: string) => string
  }
  /** Mermaid 配置选项 */
  mermaidOptions?: {
    /** 主题 */
    theme?: 'default' | 'forest' | 'dark' | 'neutral'
    /** 流程图方向 */
    flowchart?: {
      /** 曲线类型 */
      curve?: 'basis' | 'linear' | 'cardinal'
    }
    /** 时序图配置 */
    sequence?: {
      /** 是否显示编号 */
      showSequenceNumbers?: boolean
    }
    /** 甘特图配置 */
    gantt?: {
      /** 左边距 */
      leftPadding?: number
    }
  }
  /** ECharts 配置选项 */
  echartsOptions?: {
    /** 主题 */
    theme?: string | object
    /** 渲染器类型 */
    renderer?: 'canvas' | 'svg'
    /** 设备像素比 */
    devicePixelRatio?: number
    /** 是否使用 UTC 时间 */
    useUTC?: boolean
  }
  /** 自定义渲染器 */
  customRenderers?: {
    /** 自定义文本渲染 */
    text?: (content: string) => JSX.Element
    /** 自定义表格渲染 */
    table?: (content: string) => JSX.Element
    /** 自定义代码块渲染 */
    [key: string]: ((content: string) => JSX.Element) | undefined
  }
  /** 事件回调 */
  onError?: (error: Error) => void
  onRender?: (type: string, content: string) => void
}

export default defineComponent({
  name: 'MarkdownRender',
  props: {
    content: {
      type: String as PropType<string>,
      required: true,
    },
    codeBlockTypes: {
      type: Array as PropType<CodeBlockType[]>,
      default: () => [],
    },
    markdownOptions: {
      type: Object as PropType<MarkdownRenderProps['markdownOptions']>,
      default: () => ({}),
    },
    mermaidOptions: {
      type: Object as PropType<MarkdownRenderProps['mermaidOptions']>,
      default: () => ({}),
    },
    echartsOptions: {
      type: Object as PropType<MarkdownRenderProps['echartsOptions']>,
      default: () => ({}),
    },
    customRenderers: {
      type: Object as PropType<MarkdownRenderProps['customRenderers']>,
      default: () => ({}),
    },
    onError: {
      type: Function as PropType<(error: Error) => void>,
      default: undefined,
    },
    onRender: {
      type: Function as PropType<(type: string, content: string) => void>,
      default: undefined,
    },
  },
  setup(props) {
    const codeBlockTypes: CodeBlockType[] = [
      {
        name: 'echarts',
        startMarker: /^```echarts\s*$/,
        endMarker: /^```$/,
        validate: content => /option\s*[:=]/.test(content),
        message: '图表生成中',
      },
      {
        name: 'mermaid',
        startMarker: /^```mermaid\s*$/,
        endMarker: /^```$/,
        message: '图表生成中',
      },
    ]

    const parseState = ref<{
      lines: string[]
      currentBlock: ContentBlock | null
      processedIndex: number
    }>({
      lines: [],
      currentBlock: null,
      processedIndex: -1,
    })

    watchEffect(() => {
      parseState.value.lines = props.content.split('\n')
    })

    // 工具函数
    function createTextBlock(line: string): ContentBlock {
      return {
        type: 'text',
        content: line.trim() ? `${line}\n` : '\n',
      }
    }

    function convertToText(content: string): ContentBlock[] {
      return content.split('\n').map(line => createTextBlock(line))
    }

    function mergeTextBlocks(blocks: ContentBlock[]): ContentBlock[] {
      return blocks.reduce((merged, block) => {
        const last = merged[merged.length - 1]
        if (block.type === 'text' && last?.type === 'text') {
          last.content += block.content
        }
        else {
          merged.push(block)
        }
        return merged
      }, [] as ContentBlock[])
    }

    function extractTableContent(startLine: number): string {
      let content = ''
      let i = startLine
      while (i < parseState.value.lines.length) {
        const line = parseState.value.lines[i]
        if (!line.includes('|'))
          break
        content += `${line}\n`
        i++
      }
      return content.trim()
    }

    // 核心解析逻辑
    const contentBlocks = computed<ContentBlock[]>(() => {
      const blocks: ContentBlock[] = []
      let currentBlock: ContentBlock | null = null
      let lineIndex = 0

      while (lineIndex < parseState.value.lines.length) {
        const line = parseState.value.lines[lineIndex]

        // 处理已打开的代码块
        if (currentBlock?.open) {
          currentBlock.content += `${line}\n`

          // 检测结束标记
          const blockType = codeBlockTypes.find(t => t.name === currentBlock?.type)
          if (blockType?.endMarker.test(line)) {
            currentBlock.open = false
            currentBlock.valid = blockType?.validate?.(
              currentBlock.content
                .replace(blockType.startMarker, '')
                .replace(blockType.endMarker, '')
                .trim(),
            ) ?? true

            if (currentBlock.valid) {
              blocks.push(currentBlock)
            }
            else {
              currentBlock.message = blockType?.message ?? '图表生成中'
              blocks.push(...convertToText(currentBlock.content))
            }
            currentBlock = null
          }
          else {
            // 未闭合时保持 open 状态
            currentBlock.open = true
          }
          lineIndex++
          continue
        }

        // 检测代码块起始标记
        let matchedType: CodeBlockType | undefined
        for (const type of codeBlockTypes) {
          if (type.startMarker.test(line)) {
            matchedType = type
            break
          }
        }

        if (matchedType) {
          currentBlock = {
            type: matchedType.name,
            content: `${line}\n`,
            open: true,
            valid: false,
            message: matchedType.message ?? '图表生成中',
          }
          lineIndex++
        }
        else {
          // 检测表格
          if (line.includes('|') && lineIndex + 1 < parseState.value.lines.length) {
            const nextLine = parseState.value.lines[lineIndex + 1]
            if (nextLine.includes('|-')) {
              const tableContent = extractTableContent(lineIndex)
              blocks.push({ type: 'table', content: tableContent, message: '表格生成中' })
              lineIndex += tableContent.split('\n').length
              continue
            }
          }

          // 普通文本
          blocks.push(createTextBlock(line))
          lineIndex++
        }
      }

      // 处理未闭合块
      if (currentBlock) {
        blocks.push(currentBlock)
      }

      return mergeTextBlocks(blocks)
    })

    function uuid() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    return () => (
      <div class="markdown-render">
        {contentBlocks.value.map((block) => {
          const key = uuid()

          if (block.type === 'text')
            return <TextRender key={key} content={block.content} />

          if (block.type === 'table')
            return <TableRender key={key} content={block.content} />

            if (block.open && codeBlockTypes.map(t => t.name).includes(block.type)) {
              return (
                <div key={key} class="loading-block">
                  <div class="loading-wrapper">
                    <div class="loading-spinner" />
                    <span class="loading-text">{block.message || '代码生成中...'}</span>
                  </div>
                  <div class="no-end-content">
                    <div class="code-block">
                      <div class="code-header">
                        <span class="code-title">{block.type}</span>
                        <div class="code-controls">
                          <span class="control close" />
                          <span class="control minimize" />
                          <span class="control maximize" />
                        </div>
                      </div>
                      <pre class="code-content">
                        <code innerHTML={block.content} />
                    </pre>
                  </div>
                </div>
              </div>
            )
          }

          if (block.type === 'mermaid' && block.valid && !block.open)
            return <MermaidRender key={key} content={block.content} />

          if (block.type === 'echarts' && block.valid && !block.open)
            return <EChartsRender key={key} content={block.content} />

          if (['mermaid', 'echarts'].includes(block.type) && !block.valid && !block.open)
            return <TextRender key={key} content={block.content} />

          return null
        })}
      </div>
    )
  },
}) 