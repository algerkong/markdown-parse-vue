declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.scss' {
  const content: { [className: string]: string }
  export default content
}

declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any
  }
} 