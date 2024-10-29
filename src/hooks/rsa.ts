import { JSEncrypt } from 'jsencrypt'
import CryptoJS from 'crypto-js'

function decryptRSA(encrypted: string, privateKey: string): string | false {
  const decrypt = new JSEncrypt()
  decrypt.setPrivateKey(privateKey)
  return decrypt.decrypt(encrypted)
}

function sha256(data: string): string {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex)
}

function signRSA(data: string, privateKey: string): string | false {
  const sign = new JSEncrypt()
  sign.setPrivateKey(privateKey)
  return sign.sign(data, sha256, 'sha256')
}

function stringToHex(str: string): string {
  return str.split('').map(c => c.charCodeAt(0).toString(16)).join('')
}


export { decryptRSA, signRSA, stringToHex }
