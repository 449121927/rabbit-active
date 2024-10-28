'use client'
import { useState } from 'react'
import { Button, Input, message, Card} from "antd"
import CryptoJS from 'crypto-js'
import { JSEncrypt } from "jsencrypt"

export default function Playground() {

  const [encryptedCode, setEncryptedCode] = useState('')
  const [decryptedCode, setDecryptedCode] = useState('')
  const [activationCode, setActivationCode] = useState('')


  const [days, setDays] = useState('')
  const [decryptedData, setDecryptedData] = useState({})
  const [messageApi, contextHolder] = message.useMessage()
  const keystr = 'JIANXINGZHEPSVMC';

  const stringToHex = (str) => {
    return str
      .split('')
      .map((c) => c.charCodeAt(0).toString(16))
      .join('')
  };

  const generateEncryptedActivationMessage = async () => {

    if (encryptedCode && decryptedData) {
      if (days) {
        const timeBegin = Math.floor(Date.now() / 1000);
        const timeEnd = timeBegin + parseInt(days) * 24 * 60 * 60;
        console.log(days)
        const actmsg2 = {
          ...decryptedData,
          days: days,
          time_begin: timeBegin,
          time_end: timeEnd,
        };

        const actmsg2String = JSON.stringify(actmsg2);
        const key = CryptoJS.enc.Hex.parse(stringToHex(keystr));
        const encrypted = CryptoJS.AES.encrypt(actmsg2String, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
        });

        setActivationCode(encrypted.ciphertext.toString());
      } else {
        messageApi.open({
          type: 'error',
          content: '填写激活天数'
        })
      }
    } else {
      messageApi.open({
        type: 'error',
        content: '机器码为空或未解码'
      })
    }
  };

  const decryptActivationCode = () => {
    try {
      let key = stringToHex(keystr);
      key = CryptoJS.enc.Hex.parse(key);
      const decrypted = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(encryptedCode), key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      const decryptedString = CryptoJS.enc.Utf8.stringify(decrypted);
      setDecryptedCode(decryptedString);

      const parsedData = JSON.parse(decryptedString);
      setDecryptedData(parsedData);

      messageApi.open({
        type: 'success',
        content: '解密成功'
      })
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '解密失败'
      }).then(() => {
        console.log(error)
      })
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activationCode).then(
      () => messageApi.open({
        type: 'success',
        content: '复制成功'
      }),
      () => messageApi.open({
        type: 'error',
        content: '复制失败'
      })
    );
  };

  return (
    <>
      { contextHolder }
      <div className="flex h-screen flex-row items-center justify-around">
        <div className="flex w-2/5 flex-col space-y-10">

          <Card title="兔兔打印注册机">
            <div className="flex flex-col space-y-14">

              <div className="space-y-2">
                <p className="text-2xl font-bold">查看用户注册信息</p>
                <Input
                  type="text"
                  placeholder="请输入用户识别码"
                  value={ encryptedCode }
                  onChange={ (e) => setEncryptedCode(e.target.value) }
                  style={ { width: '100%', marginBottom: '10px', padding: '8px' } }
                />
                <div className="flex justify-center">
                  <Button type="primary" shape="round" onClick={ decryptActivationCode } style={ { width: '95%', padding: '10px' } }>
                    查看信息
                  </Button>
                </div>
                <div style={ { wordBreak: 'break-all' } }>
                  <p className="text-xl">用户信息：</p>
                  <p>{ decryptedCode }</p>
                </div>

              </div>
              {/* 生成激活码 */ }
              <div className="space-y-2">
                <p className="text-2xl font-bold">生成激活码</p>
                <Input
                  type="text"
                  placeholder="请输入需要激活的天数"
                  value={ days }
                  onChange={ (e) => setDays(e.target.value) }
                  style={ { width: '100%', marginBottom: '10px', padding: '8px' } }
                />
                <div className="flex justify-center">
                  <Button color="danger" variant="solid" shape="round" className="w-[95%]" onClick={ generateEncryptedActivationMessage }
                  >
                    生成
                  </Button>
                </div>

                <div style={ { marginTop: '20px', wordBreak: 'break-all' } }>
                  <p className="text-xl">激活码（加密）：</p>
                  <p className="mt-10">{ activationCode }</p>
                </div>
                <Button onClick={ copyToClipboard } style={ { width: '100%', padding: '10px', marginTop: '10px' } }>
                  复制激活码
                </Button>
              </div>

            </div>
          </Card>

        </div>
      </div>
    </>
  )
}
