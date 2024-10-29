import { MessageInstance } from 'antd/lib/message/interface'


function copyToClipboard(text: string, messageAPI: MessageInstance) {
  navigator.clipboard.writeText(text).then(
    () => messageAPI.open({
      type: 'success',
      content: '复制成功'
    }),
    () => messageAPI.open({
      type: 'error',
      content: '复制失败'
    })
  )
}

export { copyToClipboard }
