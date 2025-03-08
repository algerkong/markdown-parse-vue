import {
  defineComponent,
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
  PropType,
  onUnmounted,
} from 'vue'
import mermaid from 'mermaid'
import panzoom from 'panzoom'
import '@/assets/styles/MermaidRender.scss'

export interface MermaidRenderProps {
  /** Mermaid 图表内容 */
  content: string
  /** Mermaid 配置选项 */
  options?: {
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
  /** 错误处理回调 */
  onError?: (error: Error) => void
  /** 渲染完成回调 */
  onRender?: (content: string) => void
}

export default defineComponent({
  name: 'MermaidRender',
  props: {
    content: {
      type: String as PropType<string>,
      required: true,
    },
    options: {
      type: Object as PropType<MermaidRenderProps['options']>,
      default: () => ({}),
    },
    onError: {
      type: Function as PropType<(error: Error) => void>,
      default: undefined,
    },
    onRender: {
      type: Function as PropType<(content: string) => void>,
      default: undefined,
    },
  },
  setup(props) {
    const isLoading = ref(true)
    const hasError = ref(false)
    const errorMessage = ref('')
    const isFullscreen = ref(false)
    const mermaidId = ref(`mermaid-${Math.random().toString(36).substr(2, 9)}`)
    const mermaidContainer = ref<HTMLElement | null>(null)
    const panzoomInstance = ref<ReturnType<typeof panzoom> | null>(null)
    const scale = ref(1)
    const MIN_SCALE = 0.1
    const MAX_SCALE = 3

    const cleanMermaidContent = computed(() => {
      try {
        return props.content
          .replace(/```mermaid\n/, '')
          .replace(/```$/, '')
          .trim()
      } catch (error) {
        console.error('Error extracting mermaid content:', error)
        return ''
      }
    })

    function initPanzoom() {
      if (!mermaidContainer.value || !isFullscreen.value) return

      if (panzoomInstance.value) {
        panzoomInstance.value.dispose()
      }

      panzoomInstance.value = panzoom(mermaidContainer.value, {
        maxZoom: MAX_SCALE,
        minZoom: MIN_SCALE,
        zoomDoubleClickSpeed: 1,
        beforeWheel: (e) => {
          e.preventDefault()
          return true
        },
        smoothScroll: false,
        zoomSpeed: 0.1,
      })

      panzoomInstance.value.on('zoom', (e) => {
        const transform = (e as any).getTransform()
        scale.value = transform.scale
      })
    }

    async function renderMermaid() {
      if (!cleanMermaidContent.value || !mermaidContainer.value) return

      try {
        isLoading.value = true
        hasError.value = false

        // 初始化 Mermaid 配置
        mermaid.initialize({
          startOnLoad: false,
          theme: props.options?.theme || 'default',
          flowchart: {
            useMaxWidth: true,
            curve: props.options?.flowchart?.curve || 'basis',
          },
          sequence: props.options?.sequence || { showSequenceNumbers: true },
          gantt: props.options?.gantt,
        })

        const { svg } = await mermaid.render(
          mermaidId.value,
          cleanMermaidContent.value
        )

        if (mermaidContainer.value) {
          mermaidContainer.value.innerHTML = svg
          initPanzoom()
          props.onRender?.(cleanMermaidContent.value)
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        hasError.value = true
        errorMessage.value = error instanceof Error ? error.message : '图表渲染失败'
        props.onError?.(error as Error)
      } finally {
        isLoading.value = false
      }
    }

    async function toggleFullscreen() {
      isFullscreen.value = !isFullscreen.value
      await nextTick()
      initPanzoom()
    }

    function resetZoom() {
      if (panzoomInstance.value) {
        panzoomInstance.value.zoomAbs(0, 0, 1)
        panzoomInstance.value.moveTo(0, 0)
        scale.value = 1
      }
    }

    // 监听内容和配置变化
    watch([() => props.content, () => props.options], () => {
      nextTick().then(renderMermaid)
    }, { deep: true })

    onMounted(() => {
      nextTick().then(renderMermaid)
    })

    onUnmounted(() => {
      if (panzoomInstance.value) {
        panzoomInstance.value.dispose()
      }
    })

    return () => (
      <div class={['mermaid-render', { 'is-fullscreen': isFullscreen.value }]}>
        <div class="toolbar">
          <button class="toolbar-btn" onClick={toggleFullscreen}>
            <i
              class={
                isFullscreen.value
                  ? 'ri-fullscreen-exit-line'
                  : 'ri-fullscreen-line'
              }
            />
          </button>
          {isFullscreen.value && (
            <>
              <button class="toolbar-btn" onClick={resetZoom}>
                <i class="ri-refresh-line" />
              </button>
              <span class="zoom-text">{Math.round(scale.value * 100)}%</span>
            </>
          )}
        </div>

        {isLoading.value ? (
          <div class="loading-wrapper">
            <div class="loading-spinner" />
            <span class="loading-text">图表生成中</span>
          </div>
        ) : hasError.value ? (
          <div class="error-message">
            <i class="ri-error-warning-line" />
            {errorMessage.value}
          </div>
        ) : null}

        <div
          class={['mermaid-container', { 'is-fullscreen': isFullscreen.value }]}
        >
          <div ref={mermaidContainer} class="mermaid-content" />
        </div>
      </div>
    )
  },
})
