import { defineComponent, ref } from 'vue'
import TextRender from './TextRender'
import '@/assets/styles/HtmlRender.scss'

export interface HtmlRenderProps {
  /** HTML内容 */
  content: string
}

export default defineComponent({
  name: 'HtmlRender',
  props: {
    content: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const activeTab = ref<'code' | 'preview'>('code')
    
    const switchTab = (tab: 'code' | 'preview') => {
      activeTab.value = tab
    }

    return () => (
      <div class="html-render">
        <div class="html-render__tabs">
          <div 
            class={`html-render__tab ${activeTab.value === 'code' ? 'active' : ''}`}
            onClick={() => switchTab('code')}
          >
            代码
          </div>
          <div 
            class={`html-render__tab ${activeTab.value === 'preview' ? 'active' : ''}`}
            onClick={() => switchTab('preview')}
          >
            预览
          </div>
        </div>
        
        <div class="html-render__content">
          {activeTab.value === 'code' ? (
            <div class="html-render__code">
              <TextRender content={`\`\`\`html\n${props.content}\n\`\`\``} />
            </div>
          ) : (
            <div 
              class="html-render__preview"
              innerHTML={props.content}
            />
          )}
        </div>
      </div>
    )
  }
}) 