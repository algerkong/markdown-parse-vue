import { defineComponent, ref, computed } from 'vue'
import { MarkdownRender } from './index'
import hljs from 'highlight.js'
import TableRender from './components/TableRender'
import './App.scss'
import { MARKDOWN_TEST_CONTENT } from './constants/test-contents'

export default defineComponent({
  name: 'App',
  setup() {
      const markdown = ref(MARKDOWN_TEST_CONTENT)

    // 自定义代码块类型
    const customCodeBlocks = [
      {
        name: 'custom',
        startMarker: /^```custom\s*$/,
        endMarker: /^```$/,
        validate: (content: string) => content.length > 0,
        message: '自定义渲染中...',
        render: (content: string) => (
          <div class="custom-block">
            <h3>自定义渲染</h3>
            <pre>{content}</pre>
          </div>
        ),
      },
    ]

    // Markdown 配置
    const markdownOptions = {
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
      highlight: (str: string, lang: string) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value
          } catch (error) {
            console.error(error)
          }
        }
        return str
      },
    }

    // 主题和布局配置
    const currentTheme = ref<'default' | 'forest' | 'dark' | 'neutral'>('default')
    const currentLayout = ref<'basis' | 'linear' | 'cardinal'>('basis')

    // Mermaid 配置
    const mermaidOptions = computed(() => ({
      theme: currentTheme.value,
      flowchart: {
        curve: currentLayout.value,
      },
      sequence: {
        showSequenceNumbers: true,
      },
    }))

    // 主题切换
    const themes = [
      { label: '默认主题', value: 'default' },
      { label: '森林主题', value: 'forest' },
      { label: '暗色主题', value: 'dark' },
      { label: '中性主题', value: 'neutral' },
    ] as const

    // 布局切换
    const layouts = [
      { label: '贝塞尔曲线', value: 'basis' },
      { label: '直线', value: 'linear' },
      { label: '基数样条', value: 'cardinal' },
    ] as const

    // ECharts 配置
    const echartsOptions = {
      renderer: 'canvas' as const,
      devicePixelRatio: window.devicePixelRatio,
      useUTC: false,
    }

    // 自定义渲染器
    const customRenderers = {
      table: (content: string) => (
        <div class="custom-table">
          <div class="table-title">自定义表格</div>
          <TableRender content={content} />
        </div>
      ),
    }

    // 当前显示的 Markdown 内容
    const currentMarkdown = ref('')
    
    // 是否使用流式渲染
    const isStreamMode = ref(false)
    
    // 模拟流式输出的速度 (ms)
    const streamSpeed = ref(20)
    
    // 是否正在流式输出
    const isStreaming = ref(false)
  
    // 模拟流式输出
    async function startStreaming() {
      if (isStreaming.value) return
      
      isStreaming.value = true
      currentMarkdown.value = ''
      const chars = markdown.value.split('')
      
      for (let i = 0; i < chars.length; i++) {
        if (!isStreaming.value) break
        currentMarkdown.value += chars[i]
        await new Promise(resolve => setTimeout(resolve, streamSpeed.value))
      }
      
      isStreaming.value = false
    }

    // 停止流式输出
    function stopStreaming() {
      isStreaming.value = false
      // currentMarkdown.value = markdown.value
    }

    // 切换渲染模式
    async function toggleRenderMode() {
      isStreamMode.value = !isStreamMode.value
      if (isStreamMode.value) {
        startStreaming()
      } else {
        stopStreaming()
      }
    }

    // 实际显示的内容
    const displayMarkdown = computed(() => 
      isStreamMode.value ? currentMarkdown.value : markdown.value
    )

    return () => (
      <div class="app">
        <div class="header">
          <h1>Markdown 渲染组件测试</h1>
          <div class="controls">
            <div class="control-group">
              <span class="label">主题：</span>
              {themes.map(theme => (
                <button
                  key={theme.value}
                  class={{
                    'control-btn': true,
                    active: currentTheme.value === theme.value,
                  }}
                  onClick={() => currentTheme.value = theme.value}
                >
                  {theme.label}
                </button>
              ))}
            </div>
            <div class="control-group">
              <span class="label">布局：</span>
              {layouts.map(layout => (
                <button
                  key={layout.value}
                  class={{
                    'control-btn': true,
                    active: currentLayout.value === layout.value,
                  }}
                  onClick={() => currentLayout.value = layout.value}
                >
                  {layout.label}
                </button>
              ))}
            </div>
            <div class="control-group">
              <span class="label">渲染模式：</span>
              <button
                class={{
                  'control-btn': true,
                  'active': !isStreamMode.value,
                }}
                onClick={toggleRenderMode}
                disabled={isStreaming.value}
              >
                普通渲染
              </button>
              <button
                class={{
                  'control-btn': true,
                  'active': isStreamMode.value,
                }}
                onClick={toggleRenderMode}
                disabled={isStreaming.value}
              >
                流式渲染
              </button>
            </div>
            {isStreamMode.value && (
              <div class="control-group">
                <span class="label">输出速度：</span>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={streamSpeed.value}
                  onChange={(e: any) => {
                    streamSpeed.value = Number((e.target as HTMLInputElement).value)
                  }}
                  disabled={isStreaming.value}
                />
                <span class="speed-value">{streamSpeed.value}ms</span>

                <button onClick={startStreaming}>停止</button>
              </div>
            )}
          </div>
        </div>
        <div class="content">
          <MarkdownRender
            content={displayMarkdown.value}
            codeBlockTypes={customCodeBlocks}
            markdownOptions={markdownOptions}
            mermaidOptions={mermaidOptions.value}
            echartsOptions={echartsOptions}
            customRenderers={customRenderers}
          />
        </div>
      </div>
    )
  },
})