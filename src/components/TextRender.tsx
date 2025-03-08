import { defineComponent, computed, PropType, onMounted, ref, watch, nextTick } from 'vue'
import { marked } from 'marked'
import { markedHighlight } from "marked-highlight"
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import '@/assets/styles/TextRender.scss'

export interface TextRenderProps {
  content: string
}

// 配置 marked 选项
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'shell'
    return hljs.highlight(code, { language }).value
  }
}))

export default defineComponent({
  name: 'TextRender',
  props: {
    content: {
      type: String as PropType<string>,
      required: true,
    }
  },
  setup(props) {
    const containerRef = ref<HTMLDivElement | null>(null)

    const renderedContent = computed(() => {
      return marked(props.content)
    })

    const copyCode = async (event: MouseEvent) => {
      const button = event.target as HTMLButtonElement
      const pre = button.closest('pre')
      if (pre) {
        const code = pre.querySelector('code')
        if (code) {
          try {
            await navigator.clipboard.writeText(code.textContent || '')
            button.textContent = '已复制!'
            setTimeout(() => {
              button.textContent = '复制'
            }, 2000)
          } catch (err) {
            console.error('复制失败:', err)
          }
        }
      }
    }

    const setupCodeBlocks = () => {
      if (!containerRef.value) return
      
      const preElements = containerRef.value.querySelectorAll('pre')
      preElements.forEach(pre => {
        if (pre.classList.contains('with-header')) return

        // 创建代码块头部容器
        const header = document.createElement('div')
        header.className = 'code-header'
        
        // 获取代码语言
        const code = pre.querySelector('code')
        const langClass = code?.className.match(/language-(\w+)/)
        const lang = langClass ? langClass[1] : 'text'
        
        // 创建语言标签
        const langLabel = document.createElement('span')
        langLabel.className = 'lang-label'
        langLabel.textContent = lang
        header.appendChild(langLabel)

        // 创建复制按钮
        const copyButton = document.createElement('button')
        copyButton.className = 'copy-button'
        copyButton.textContent = '复制'
        copyButton.addEventListener('click', copyCode)
        header.appendChild(copyButton)
        
        // 将头部插入到pre的最前面
        pre.insertBefore(header, pre.firstChild)
        
        // 给pre添加类
        pre.classList.add('with-header')
      })
    }

    onMounted(() => {
      setupCodeBlocks()
    })

    // 监听内容变化，重新设置代码块
    watch(() => props.content, () => {
      nextTick(() => {
        setupCodeBlocks()
      })
    })

    return () => (
      <div ref={containerRef} class="text-render" innerHTML={renderedContent.value} />
    )
  },
}) 