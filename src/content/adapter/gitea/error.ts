import { AxiosResponse } from 'axios'

import { ApiError } from '../errors'

// prettier-ignore
const CREATE_TOKEN_URL = `${location.protocol}//${location.host}/settings/tokens/new?scopes=repo&description=Octotree%20browser%20extension`

export function createError({ status, statusText, headers }: AxiosResponse): ApiError {
  let error,
    message,
    needAuth = false

  switch (status) {
    case 0:
      error = '连接错误'
      message = `无法连接到网站. 如果你的网络连接这个网站很好,也许有一个中断的API. 请稍后再试.`
      needAuth = false
      break
    case 206:
      error = '仓库太大'
      message = `这个仓库检索太大. 如果你经常使用这个库,去设置和取消“立即加载整个仓库”的选项.`
      break
    case 401:
      error = '无效的token'
      message = `token是无效的.<br/>
          <a href="${CREATE_TOKEN_URL}" target="_blank">点此</a>
           去创建一个access token并粘贴到下面.`
      needAuth = true
      break
    case 409:
      error = '空仓库'
      message = '空仓库.'
      break
    case 404:
      error = '私人仓库'
      message = `访问私有仓库需要access token.<br/>
           <a href="${CREATE_TOKEN_URL}" target="_blank">点此链接</a>
           去创建一个access token并粘贴到下面.`
      needAuth = true
      break
    case 403:
      if (~headers.indexOf('X-RateLimit-Remaining: 0')) {
        // It's kinda specific for GitHub
        error = 'API超过限制'
        message = `你已经超过GitHub API小时限制和需要GitHub访问令牌进行额外的请求.<br/>
              <a href="${CREATE_TOKEN_URL}" target="_blank">点此</a>
               去创建一个access token并粘贴到下面.`
        needAuth = true
        break
      } else {
        error = '禁止访问'
        message = `禁止访问.
             你可能需要提供 access token.<br/>
           <a href="${CREATE_TOKEN_URL}" target="_blank">点此链接</a>
           去创建一个access token并粘贴到下面.`
        needAuth = true
        break
      }
    default:
      error = message = statusText
      needAuth = false
      break
  }
  return new ApiError({
    error: `错误信息: ${error}`,
    message: message,
    needAuth: needAuth
  })
}
