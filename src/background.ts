type WebRequest = chrome.webRequest.RequestFilter
type SendResponse = (response: any) => void
type MessageHandler = (request: WebRequest, sendResponse: SendResponse) => void
type MessageHandlers = {
  [name: string]: MessageHandler
}

global.browser = require('webextension-polyfill')
const { permissions: PERMS } = require('./manifest.json')

// inject content scripts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return
  if (tab.url && tab.url.startsWith('http') === false) return
  console.log('inject')
  // try injected
  chrome.tabs.executeScript(
    tabId,
    {
      code: 'var injected = window.giteeInjected; window.giteeInjected = true; injected;',
      runAt: 'document_start'
    },
    function([injected]) {
      if (chrome.runtime.lastError) return // has errors, ignore.
      if (injected) return // injected, ignore.

      // inject scripts
      chrome.tabs.executeScript(tabId, { file: 'vender.js', runAt: 'document_start' })
      chrome.tabs.insertCSS(tabId, { file: 'content/content.css', runAt: 'document_start' })
      chrome.tabs.executeScript(tabId, { file: 'content/content.js', runAt: 'document_start' })
    }
  )
})

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const handler = messageHandlers[request.type]
  if (handler) return messageHandlers[request.type](request, sendResponse)
})

const messageHandlers: MessageHandlers = {
  requestPermissions: (request, sendResponse) => {
    const urls = (request.urls || [])
      .filter(url => url.trim() !== '')
      .map(url => {
        if (url.slice(-2) === '/*') return url
        if (url.slice(-1) === '/') return url + '*'
        return url + '/*'
      })

    if (urls.length === 0) {
      sendResponse(true)
      removeUnnecessaryPermissions()
    } else {
      chrome.permissions.request({ origins: urls }, granted => {
        sendResponse(granted)
        removeUnnecessaryPermissions()
      })
    }
    return true

    function removeUnnecessaryPermissions() {
      const whitelist = urls.concat(PERMS)
      chrome.permissions.getAll(permissions => {
        const toBeRemovedUrls = (permissions.origins || []).filter(url => whitelist.indexOf(url) < 0)
        if (toBeRemovedUrls.length) chrome.permissions.remove({ origins: toBeRemovedUrls })
      })
    }
  }
}
