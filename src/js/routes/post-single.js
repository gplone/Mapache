import { qs, qsa } from '../app/app.variables'

export default {
  init () {
    const shareBox = qs('.post-share-inner')

    if (!shareBox) return

    const intersectsSel = ['.kg-width-full', '.kg-width-wide']
    const observe = [].slice.call(qsa(intersectsSel.join(',')))

    if (!observe.length) return

    // Intersect share box with image => return true or false
    // -----------------------------------------------------------------------------
    const intersects = (el1, el2) => {
      const rect1 = el1.getBoundingClientRect()
      const rect2 = el2.getBoundingClientRect()

      return !(rect1.top > rect2.bottom || rect1.right < rect2.left || rect1.bottom < rect2.top || rect1.left > rect2.right)
    }

    // the floating fade sharing in the sidebar
    // -----------------------------------------------------------------------------
    const shareFade = () => {
      let isHidden = false

      for (const i in observe) {
        if (intersects(shareBox, observe[i])) {
          isHidden = true
          break
        }
      }

      isHidden ? shareBox.classList.add('is-hidden') : shareBox.classList.remove('is-hidden')
    }

    window.addEventListener('scroll', shareFade)
  }
}
