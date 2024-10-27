import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { message, Form,Input } from 'antd'


function DecryptPage() {
    const [encryptedCode, setEncryptedCode] = useState('');
    const [decryptedCode, setDecryptedCode] = useState('');
    const [activationCode, setActivationCode] = useState('');

    const [days, setDays] = useState('');
    const [decryptedData, setDecryptedData] = useState({});
    const [messageApi, contextHolder] = message.useMessage()

    const [activeCodeForm] = Form.useForm()

    const keystr = 'JIANXINGZHEPSVMC';



    const stringToHex = (str) => {
        return str
            .split('')
            .map((c) => c.charCodeAt(0).toString(16))
            .join('');
    };

    const generateEncryptedActivationMessage = async () => {

            if (encryptedCode && decryptedData) {
                if(days){
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
                }
                else {
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
            })
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(activationCode).then(
            () =>             messageApi.open({
                type: 'success',
                content: '复制成功'
            }),
            (err) =>             messageApi.open({
                type: 'error',
                content: '复制失败'
            })
        );
    };

    return (
        <div style={{padding: '20px', maxWidth: '600px', margin: 'auto'}}>
            {contextHolder}
            <h1>解密激活码</h1>

            {/* 输入加密的激活码 */}
            <input
                type="text"
                placeholder="请输入加密的激活码"
                value={encryptedCode}
                onChange={(e) => setEncryptedCode(e.target.value)}
                style={{width: '100%', marginBottom: '10px', padding: '8px'}}
            />
            <button onClick={decryptActivationCode} style={{width: '100%', padding: '10px'}}>
                解密
            </button>
            <div style={{marginTop: '20px', wordBreak: 'break-all'}}>
                <h3>解密结果：</h3>
                <p>{decryptedCode}</p>

            </div>
            {/* 生成激活码 */}
            <h2>生成激活码</h2>
            <input
                type="text"
                placeholder="请输入需要激活的天数"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                style={{width: '100%', marginBottom: '10px', padding: '8px'}}
            />
            <button onClick={generateEncryptedActivationMessage}
                    style={{width: '100%', padding: '10px', marginTop: '10px'}}>
                生成激活码
            </button>
            <div style={{marginTop: '20px', wordBreak: 'break-all'}}>
                <h3>激活码（加密）：</h3>
                <p>{activationCode}</p>
            </div>
            <button onClick={copyToClipboard} style={{width: '100%', padding: '10px', marginTop: '10px'}}>
                复制激活码
            </button>
        </div>
    );
}

export default DecryptPage;
