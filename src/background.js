global.browser = require('webextension-polyfill');

// inject content scripts
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status !== 'loading') return;

    // try injected
    chrome.tabs.executeScript(tabId, {
        code: 'var injected = window.giteeInjected; window.giteeInjected = true; injected;',
        runAt: 'document_start'
    }, function (res) {
        if (chrome.runtime.lastError || res[0]) return; // has errors or injected.

        chrome.tabs.executeScript(tabId, { file: 'content/content.js', runAt: 'document_start' });
    });
});

// request custom site permission
chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
    const handler = {
        requestPermissions: () => {
            const urls = (req.urls || [])
                .filter((url) => url.trim() !== '')
                .map((url) => {
                    if (url.slice(-2) === '/*') return url
                    if (url.slice(-1) === '/') return url + '*'
                    return url + '/*'
                })

            if (urls.length === 0) {
                sendRes(true)
                removeUnnecessaryPermissions()
            }
            else {
                chrome.permissions.request({ origins: urls }, (granted) => {
                    sendRes(granted)
                    removeUnnecessaryPermissions()
                })
            }
            return true

            function removeUnnecessaryPermissions() {
                const whitelist = urls.concat([
                    'https://github.com/*',
                    'https://bitbucket.org/*'
                ])
                chrome.permissions.getAll((permissions) => {
                    const toBeRemovedUrls = permissions.origins.filter((url) => {
                        return !~whitelist.indexOf(url)
                    })

                    if (toBeRemovedUrls.length) {
                        chrome.permissions.remove({ origins: toBeRemovedUrls })
                    }
                })
            }
        }
    }

    return handler[req.type]()
});
