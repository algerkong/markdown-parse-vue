import { defineComponent, computed, nextTick, onMounted, ref, watch, PropType, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import panzoom from 'panzoom'
import './EChartsRender.scss'

export interface EChartsRenderProps {
  /** ECharts 配置内容 */
  content: string
  /** ECharts 配置选项 */
  options?: {
    /** 主题 */
    theme?: string | object
    /** 渲染器类型 */
    renderer?: 'canvas' | 'svg'
    /** 设备像素比 */
    devicePixelRatio?: number
    /** 是否使用 UTC 时间 */
    useUTC?: boolean
  }
  /** 错误处理回调 */
  onError?: (error: Error) => void
  /** 渲染完成回调 */
  onRender?: (content: string) => void
}

export default defineComponent({
  name: 'EChartsRender',
  props: {
    content: {
      type: String as PropType<string>,
      required: true,
    },
    options: {
      type: Object as PropType<EChartsRenderProps['options']>,
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
    const chartContainer = ref<HTMLElement | null>(null)
    const chart = ref<echarts.ECharts | null>(null)
    const isLoading = ref(true)
    const hasError = ref(false)
    const errorMessage = ref('')
    const isFullscreen = ref(false)

    const isECharts = computed(() => {
      return props.content.includes('```echarts')
    })

    const cleanEChartsContent = computed(() => {
      return (isEnd = true) => {
        if (!isECharts.value)
          return ''

        try {
          const lines = props.content.split('\n')
          let content = ''
          let isCollecting = false
          let hasEndTag = false

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            if (line.includes('```echarts')) {
              isCollecting = true
              continue
            }

            if (isCollecting && line.includes('```')) {
              isCollecting = false
              hasEndTag = true
              break
            }

            if (isCollecting) {
              content += `${line}\n`
            }
          }

          if (!hasEndTag && isEnd)
            return ''

          content = content.trim()
          if (!content || content === 'undefined' || content.length < 10)
            return ''

          if (content.startsWith('option = '))
            content = content.substring(9)

          return content
        }
        catch (error) {
          console.error('Error extracting echarts content:', error)
          return ''
        }
      }
    })

    function initChart() {
      if (!chartContainer.value) return

      // 销毁旧实例
      if (chart.value) {
        chart.value.dispose()
      }

      // 创建新实例，使用配置选项
      chart.value = echarts.init(chartContainer.value, props.options?.theme, {
        renderer: props.options?.renderer || 'canvas',
        devicePixelRatio: props.options?.devicePixelRatio,
        useUTC: props.options?.useUTC,
      })

      try {
        // 解析并应用配置
        const option = new Function(`return (${props.content})`)()
        chart.value.setOption(option)
        props.onRender?.(props.content)
      } catch (error) {
        console.error('ECharts rendering error:', error)
        props.onError?.(error as Error)
      }
    }

    function processOption(option: any) {
      if (!option?.series?.length)
        return option

      option.series = option.series.map((series: any) => {
        if (series.nodes && Array.isArray(series.nodes)) {
          const uniqueNodes = new Map()
          series.nodes.forEach((node: any) => {
            if (node.name && !uniqueNodes.has(node.name)) {
              uniqueNodes.set(node.name, node)
            }
          })
          series.nodes = Array.from(uniqueNodes.values())
        }
        if (series.data && Array.isArray(series.data)) {
          const uniqueNodes = new Map()
          series.data.forEach((node: any) => {
            if (node.name && !uniqueNodes.has(node.name)) {
              uniqueNodes.set(node.name, node)
            }
          })
          series.data = Array.from(uniqueNodes.values())
        }
        return series
      })

      return option
    }

    async function renderChart() {
      try {
        const content = cleanEChartsContent.value(true)
        if (!content)
          return

        isLoading.value = true
        hasError.value = false

        await nextTick()
        await initChart()

        if (!chart.value || chart.value.isDisposed()) {
          throw new Error('Chart instance not available')
        }

        const option = new Function(`return ${content}`)()
        const processedOption = processOption(option)

        try {
          chart.value.setOption(processedOption, true)
          isLoading.value = false
        }
        catch (e) {
          console.error('Error setting chart option:', e)
          throw e
        }
      }
      catch (error) {
        console.error('ECharts rendering error:', error)
        hasError.value = true
        errorMessage.value = error instanceof Error ? error.message : '图表渲染失败'
        isLoading.value = false
      }
    }

    watch(() => props.content, async () => {
      if (isECharts.value) {
        isLoading.value = true
        hasError.value = false

        const content = cleanEChartsContent.value
        if (!content)
          return

        await nextTick()
        renderChart()
      }
    }, { immediate: true })

    function handleResize() {
      if (chart.value && !chart.value.isDisposed()) {
        chart.value.resize()
      }
    }

    async function toggleFullscreen() {
      isFullscreen.value = !isFullscreen.value
      await nextTick()
      await renderChart()

      if (chart.value && !chart.value.isDisposed()) {
        chart.value.resize()
        setTimeout(() => {
          chart.value?.resize()
        }, 200)
      }
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
      nextTick().then(renderChart)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      if (chart.value) {
        chart.value.dispose()
        chart.value = null
      }
    })

    return () => (
      <div class={['echarts-render', { 'is-fullscreen': isFullscreen.value }]}>
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
        </div>
        <div
          ref={chartContainer}
          class={['echarts-container', { 'is-fullscreen': isFullscreen.value }]}
        />
      </div>
    )
  },
}) 