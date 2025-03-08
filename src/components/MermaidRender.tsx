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
import './MermaidRender.scss'

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
        const content = props.content
          .replace(/```mermaid\n/, '')
          .replace(/```$/, '')
          .trim()
        return content || ''
      } catch (error) {
        console.error('Error extracting mermaid content:', error)
        return ''
      }
    })

    watch(cleanMermaidContent, (newContent) => {
      if (!newContent) {
        hasError.value = true
        errorMessage.value = '图表内容为空'
      } else {
        hasError.value = false
        errorMessage.value = ''
      }
    })

    function initPanzoom() {
      if (!mermaidContainer.value) return

      if (panzoomInstance.value) {
        panzoomInstance.value.dispose()
      }

      panzoomInstance.value = panzoom(mermaidContainer.value, {
        maxZoom: MAX_SCALE,
        minZoom: MIN_SCALE,
        zoomDoubleClickSpeed: 1,
        beforeWheel: (e) => {
          if (isFullscreen.value) {
            e.preventDefault()
            return false
          }
          return true
        },
        beforeMouseDown: (e) => {
          return e.button !== 0
        },
        smoothScroll: false,
        zoomSpeed: 0.1,
      })

      panzoomInstance.value.on(
        'zoom',
        (e: { getTransform: () => { scale: number } }) => {
          scale.value = e.getTransform().scale
        }
      )
    }

    async function toggleFullscreen() {
      isFullscreen.value = !isFullscreen.value
      await nextTick()

      if (isFullscreen.value) {
        initPanzoom()
      } else {
        if (panzoomInstance.value) {
          panzoomInstance.value.zoomAbs(0, 0, 1)
          panzoomInstance.value.moveTo(0, 0)
          scale.value = 1
          panzoomInstance.value.dispose()
          panzoomInstance.value = null
        }
      }
    }

    function resetZoom() {
      if (panzoomInstance.value) {
        panzoomInstance.value.zoomAbs(0, 0, 1)
        panzoomInstance.value.moveTo(0, 0)
      }
    }

    async function renderMermaid() {
      try {
        const content = cleanMermaidContent.value
        if (!content || !mermaidContainer.value) return

        isLoading.value = true
        hasError.value = false

        mermaid.initialize({
          startOnLoad: false,
          theme: props.options?.theme || 'default',
          securityLevel: 'loose',
          logLevel: 1,
          flowchart: props.options?.flowchart,
          sequence: props.options?.sequence,
          gantt: props.options?.gantt,
        })

        if (mermaidContainer.value) {
          mermaidContainer.value.innerHTML = ''
        }

        const tempContainer = document.createElement('div')
        tempContainer.style.visibility = 'hidden'
        document.body.appendChild(tempContainer)

        try {
          const { svg } = await mermaid.render(mermaidId.value, content)
          
          if (mermaidContainer.value) {
            mermaidContainer.value.innerHTML = svg
            props.onRender?.(content)
          }
        } catch (error) {
          props.onError?.(error as Error)
          throw error
        } finally {
          document.body.removeChild(tempContainer)
        }

        isLoading.value = false
      } catch (error) {
        console.error('Mermaid rendering error:', error)
        hasError.value = true
        errorMessage.value =
          error instanceof Error ? error.message : '图表渲染失败'
        props.onError?.(error as Error)
        isLoading.value = false
      }
    }

    watch(
      () => props.content,
      () => {
        if (mermaidContainer.value) {
          nextTick().then(renderMermaid)
        }
      },
      { immediate: false }
    )

    onMounted(async () => {
      await nextTick()
      if (mermaidContainer.value) {
        renderMermaid()
      }
    })

    onUnmounted(() => {
      if (panzoomInstance.value) {
        panzoomInstance.value.dispose()
      }
    })

    return () => (
      <div class={['mermaid-render', { 'is-fullscreen': isFullscreen.value }]}>
        <div class='toolbar'>
          <button class='toolbar-btn' onClick={toggleFullscreen}>
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
              <button class='toolbar-btn' onClick={resetZoom}>
                <i class='ri-refresh-line' />
              </button>
              <span class='zoom-text'>{Math.round(scale.value * 100)}%</span>
            </>
          )}
        </div>

        {isLoading.value ? (
          <div class='loading-wrapper'>
            <div class='loading-spinner' />
            <span class='loading-text'>图表生成中</span>
          </div>
        ) : (
          hasError.value && (
            <div class='error-message'>
              <i class='ri-error-warning-line' />
              {errorMessage.value}
            </div>
          )
        )}

        <div
          class={['mermaid-container', { 'is-fullscreen': isFullscreen.value }]}
        >
          <div ref={mermaidContainer} class='mermaid-content' />
        </div>
      </div>
    )
  },
})
