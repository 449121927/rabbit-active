'use client'
import { useState } from 'react'
import { Button, Input, message, Card, Radio } from 'antd'

import { decryptRSA, signRSA } from '@/hooks/rsa'

import { privateKey } from '@/utils/key'
import { copyToClipboard } from '@/utils/clipboard'

export default function Home() {

  const [days, setDays] = useState('')
  const [messageApi, contextHolder] = message.useMessage()
  const options = [
    { label: '2天', value: 2 },
    { label: '180天', value: 180 },
    { label: '1000天', value: 1000 },
    { label: '永久', value: 9999 }
  ]

  const [cipherText, setCipherText] = useState('')
  const [plainText, setPlainText] = useState('')
  const [signature, setSignature] = useState('')

  function decryptCipherText() {
    const text = decryptRSA(cipherText, privateKey)
    if (text) {
      setPlainText(text)
      messageApi.success('解密成功').then()
    } else {
      messageApi.error('解密失败111').then(() => console.log('text\t' + text))
    }
  }

  function signActivationCode() {
    const jsonText = JSON.parse(plainText)
    const newText = JSON.stringify({
      name: jsonText.name,
      email: jsonText.email,
      mac: jsonText.mac,
      beginTime: jsonText.beginTime,
      days: days,
    })
    const sign = signRSA(newText, privateKey)
    if (sign){
      setSignature(sign)
      messageApi.success('生成激活码成功').then(() => console.log(newText))
    }
    else messageApi.error('生成激活码失败').then(r => console.log(r))
  }


  return (
    <>
      { contextHolder }
      <div className="flex h-screen flex-row items-center justify-around">
        <div className="flex w-[47%] min-w-[600px] flex-col space-y-10">

          <Card title="兔兔打印注册机">
            <div className="flex flex-col space-y-8">

              <div className="mt-4 space-y-3">
                <p className="text-2xl font-bold">查看用户注册信息</p>
                <Input
                  type="text"
                  placeholder="请输入用户的兔兔ID"
                  value={ cipherText }
                  onChange={ (e) => setCipherText(e.target.value) }
                  style={ { width: '100%', marginBottom: '10px', padding: '8px' } }
                />
                <div className="flex justify-center">
                  <Button type="primary" shape="round" onClick={ decryptCipherText } style={ { width: '95%', padding: '10px' } }>
                    查看信息
                  </Button>
                </div>
                <div style={ { wordBreak: 'break-all' } }>
                  <p className="text-xl">用户信息：</p>
                  <p>{ plainText }</p>
                </div>
              </div>


              {/* 生成激活码 */ }
              <div className="space-y-4">
                <p className="text-2xl font-bold">生成激活码</p>
                <Radio.Group block
                             options={ options }
                             defaultValue={ 2 }
                             optionType="button"
                             buttonStyle="solid"
                             onChange={ (e) => {
                               setDays(e.target.value)
                               console.log(e.target.value)
                             } }
                />

                <div className="mt-2 flex justify-center">
                  <Button color="danger" variant="solid" shape="round" className="w-[95%]" onClick={ signActivationCode }
                  >
                    生成
                  </Button>
                </div>

                <div style={ { marginTop: '20px', wordBreak: 'break-all' } }>
                  <p className="mt-2 w-full text-xl">激活码:</p>
                  <p className="mt-1">{ signature }</p>
                </div>
                <div className="flex w-full">
                  <Button className="ml-5" onClick={ () => copyToClipboard(signature, messageApi) }>
                    复制激活码
                  </Button>
                </div>
              </div>

            </div>
          </Card>

        </div>
      </div>
    </>
  )
}
