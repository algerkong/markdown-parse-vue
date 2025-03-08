import type { App } from 'vue'
import MarkdownRender from './components/MarkdownRender'
import EChartsRender from './components/EChartsRender'
import MermaidRender from './components/MermaidRender'
import TextRender from './components/TextRender'
import TableRender from './components/TableRender'
import HtmlRender from './components/HtmlRender'
import 'remixicon/fonts/remixicon.css'

export { MarkdownRender, EChartsRender, MermaidRender, TextRender, TableRender, HtmlRender }

export default {
  install: (app: App) => {
    app.component('MarkdownRender', MarkdownRender)
    app.component('EChartsRender', EChartsRender)
    app.component('MermaidRender', MermaidRender)
    app.component('TextRender', TextRender)
    app.component('TableRender', TableRender)
    app.component('HtmlRender', HtmlRender)
  }
}

// 导出类型定义
export type { MarkdownRenderProps } from './components/MarkdownRender'
export type { TextRenderProps } from './components/TextRender'
export type { TableRenderProps } from './components/TableRender'
export type { MermaidRenderProps } from './components/MermaidRender'
export type { EChartsRenderProps } from './components/EChartsRender' 