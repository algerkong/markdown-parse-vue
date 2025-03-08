import { defineComponent, computed, PropType } from 'vue'
import MarkdownIt from 'markdown-it'
import './TableRender.scss'

export interface TableRenderProps {
  content: string
}

const md = new MarkdownIt({
  html: true,
  breaks: true,
})

export default defineComponent({
  name: 'TableRender',
  props: {
    content: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const isTable = computed(() => {
      return props.content.includes('|') && props.content.includes('\n')
    })

    const renderedContent = computed(() => {
      if (!isTable.value)
        return ''
      return md.render(props.content)
    })

    return () => (
      isTable.value && (
        <div class="table-render">
          <table innerHTML={renderedContent.value} />
        </div>
      )
    )
  },
}) 