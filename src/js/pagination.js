((window, document) => {
  // Next link Element
  const nextElement = document.querySelector('link[rel=next]')
  if (!nextElement) return

  // Post Feed element
  const feedElement = document.querySelector('.story-feed')
  if (!feedElement) return

  const footer = document.querySelector('.footer')

  const buffer = 300

  let ticking = false
  let loading = false

  let lastScrollY = window.scrollY
  let lastWindowHeight = window.innerHeight
  let lastDocumentHeight = document.documentElement.scrollHeight

  function onPageLoad () {
    if (this.status === 404) {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      return
    }

    // Add Loading bar
    document.body.classList.add('is-loading')

    // append contents
    const postElements = this.response.querySelector('.story-feed-content')
    feedElement.appendChild(postElements)

    // push state
    // window.history.pushState(null, document.title, nextElement.href)

    // Change Title
    // document.title = this.response.title

    // set next link
    const resNextElement = this.response.querySelector('link[rel=next]')
    if (resNextElement) {
      nextElement.href = resNextElement.href
    } else {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }

    // Remove Loanding bar
    setTimeout(() => document.body.classList.remove('is-loading'), 4000)

    // sync status
    lastDocumentHeight = document.documentElement.scrollHeight
    ticking = false
    loading = false
  }

  function onUpdate () {
    // Retur if already loading
    if (loading) return

    // return if not scroll to the bottom
    if (lastScrollY + lastWindowHeight <= lastDocumentHeight - (buffer + footer.clientHeight)) {
      ticking = false
      return
    }

    loading = true

    const xhr = new window.XMLHttpRequest()
    xhr.responseType = 'document'

    xhr.addEventListener('load', onPageLoad)

    xhr.open('GET', nextElement.href)
    xhr.send(null)
  }

  function requestTick () {
    ticking || window.requestAnimationFrame(onUpdate)
    ticking = true
  }

  function onScroll () {
    lastScrollY = window.scrollY
    requestTick()
  }

  function onResize () {
    lastWindowHeight = window.innerHeight
    lastDocumentHeight = document.documentElement.scrollHeight
    requestTick()
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)

  requestTick()
})(window, document)
