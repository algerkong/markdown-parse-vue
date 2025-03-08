import { defineComponent, computed, PropType } from 'vue'
import MarkdownIt from 'markdown-it'

export interface TextRenderProps {
  content: string
}

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

export default defineComponent({
  name: 'TextRender',
  props: {
    content: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const renderedContent = computed(() => {
      return md.render(props.content)
    })

    return () => (
      <div class="text-render" innerHTML={renderedContent.value} />
    )
  },
}) 