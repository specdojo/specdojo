import DefaultTheme from 'vitepress/theme'
import type { Router } from 'vitepress'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ router }: { router: Router }) {
    if (typeof window === 'undefined') return

    function setupMermaidLightbox() {
      // 既にあれば再利用、無ければ作る
      let overlay = document.querySelector<HTMLDivElement>('.mermaid-lightbox')
      let overlayImg: HTMLImageElement | null = null

      if (!overlay) {
        overlay = document.createElement('div')
        overlay.className = 'mermaid-lightbox'
        overlay.innerHTML = `<img class="mermaid-lightbox__img" />`
        document.body.appendChild(overlay)
        overlayImg = overlay.querySelector('.mermaid-lightbox__img')
      } else {
        overlayImg = overlay.querySelector('.mermaid-lightbox__img')
      }

      if (!overlayImg) return

      // オーバーレイを閉じる
      const hide: () => void = () => overlay!.classList.remove('is-active')
      overlay.addEventListener('click', hide)

      // 各 mermaid-image にクリックハンドラを付与
      const images = document.querySelectorAll<HTMLImageElement>('.mermaid-image')
      images.forEach(img => {
        // 二重登録防止
        if (img.dataset.lightboxBound === '1') return
        img.dataset.lightboxBound = '1'

        img.addEventListener('click', () => {
          overlayImg!.src = img.src
          overlay.classList.add('is-active')
        })
      })
    }

    // 初回
    window.addEventListener('load', setupMermaidLightbox)
    // ルート変更ごと（VitePress は SPA）
    router.onAfterRouteChange = () => {
      setTimeout(setupMermaidLightbox, 0)
    }
  },
}
