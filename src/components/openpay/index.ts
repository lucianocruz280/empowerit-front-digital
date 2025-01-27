/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable no-case-declarations */
import axios from 'axios'
import antifraud from './antifraud'
import { CardTypes, OpenPayCard } from './types'

const OpenPay = {
  enabled: true,
  id: '',
  _merchant_id: import.meta.env.VITE_OPENPAY_MERCHANT_ID,
  public_key: import.meta.env.VITE_OPENPAY_PK as string,
  isSandbox: import.meta.env.NODE_ENV === 'production' ? false : true,
  _isDevelopMode: import.meta.env.NODE_ENV === 'production' ? false : true,
  hostname: 'https://api.openpay.mx/v1/',
  sandboxHostname: 'https://sandbox-api.openpay.mx/v1/',
  developHostname: 'https://sandbox-api.openpay.mx/v1/',
  deviceId: antifraud.getDeviceDataId(),
  getDeviceID: (newone?: boolean) => antifraud.getDeviceDataId(newone),
  log: () => (OpenPay._isDevelopMode ? console.log : undefined),
  setId: (merchant_id: string) => {
    OpenPay.id = merchant_id
  },
  setApiKey: (apikey: string) => {
    OpenPay.public_key = apikey
  },
  setSandboxMode: (mode: boolean) => {
    OpenPay.isSandbox = mode
  },
  setIsDevelopMode: (mode: boolean) => {
    OpenPay._isDevelopMode = mode
  },
  getSandboxMode: () => OpenPay.isSandbox,
  send: (_endpoint: string, _data: OpenPayCard) => {
    if (!validateCredentials(OpenPay.id, OpenPay.public_key)) {
      throw new Error('Validate credencials failed')
    }
    const _auth = OpenPay.public_key
    let _url = getHostname()
    _url = _url + OpenPay.id + '/' + _endpoint
    return sendXhr(_url, _auth, _data)
  },

  token: {
    create: (_params: OpenPayCard) => {
      const _endpoint = 'tokens'
      return OpenPay.send(_endpoint, _params)
    },
    whitelistedAttrs: [
      'card_number',
      'holder_name',
      'cvv2',
      'expiration_month',
      'expiration_year',
      'address',
    ],
  },

  card: {
    validateCardNumber: function (_number: string): boolean {
      return (
        (_number = (_number + '').replace(/\s+|-/g, '')),
        /^\d+$/.test(_number) &&
          _number.length >= 10 &&
          _number.length <= 19 &&
          OpenPay.card.luhnCheck(_number) &&
          OpenPay.card.validateCardNumberLength(_number) &&
          OpenPay.card.validateAcceptCardNumber(_number)
      )
    },
    validateCVC: function (_cvv_number: string, _card_number: string): boolean {
      switch (arguments.length) {
        case 1:
          return (
            (_cvv_number = OpenPay.utils.trim(_cvv_number)),
            /^\d+$/.test(_cvv_number) &&
              _cvv_number.length >= 3 &&
              _cvv_number.length <= 4
          )
          break

        case 2:
          const cardType = OpenPay.card.cardType(_card_number)
          if ('American Express' == cardType) {
            return (
              (_cvv_number = OpenPay.utils.trim(_cvv_number)),
              /^\d+$/.test(_cvv_number) && _cvv_number.length == 4
            )
          } else {
            return (
              (_cvv_number = OpenPay.utils.trim(_cvv_number)),
              /^\d+$/.test(_cvv_number) && _cvv_number.length == 3
            )
          }
          break

        default:
          return false
          break
      }
    },
    validateExpiry: function (_month: string, _year: string): boolean {
      var r, i
      var _year = OpenPay.utils.trim(_year)
      if (_year.length === 2) {
        _year = '20' + _year
      }
      return (
        (_month = OpenPay.utils.trim(_month)),
        _year,
        /^\d+$/.test(_month)
          ? /^\d+$/.test(_year)
            ? parseInt(_month, 10) <= 12 && parseInt(_month, 10) >= 1
              ? ((i = new Date(Number(_year), Number(_month))),
                (r = new Date()),
                i.setMonth(i.getMonth() - 1),
                i.setMonth(i.getMonth() + 1, 1),
                i > r)
              : !1
            : !1
          : !1
      )
    },
    validateCardNumberLength: function (_number: string): boolean {
      var _cardObj = null
      if ((_cardObj = OpenPay.card.cardAbstract(_number))) {
        var _i = _cardObj.length.length
        while (_i--) {
          if (_cardObj.length[_i] == _number.length) {
            return true
          }
        }
        return false
      }
      return _number.length >= 10 && _number.length <= 19
    },
    validateAcceptCardNumber: function (_number: string) {
      return true
    },
    luhnCheck: function (_number: string) {
      let n = (_number + '').split(''),
        digit = 0,
        sum = parseInt(n[_number.length - 1])
      for (var index = n.length - 2, i = 1; index >= 0; index--, i++) {
        digit = parseInt(n[index])
        if (i % 2 != 0) {
          digit *= 2
          if (digit > 9) {
            digit -= 9
          }
        }
        sum += digit
      }
      return sum % 10 == 0
    },
    cardType: function (_number: string): string {
      var _cardObj = null
      if ((_cardObj = OpenPay.card.cardAbstract(_number))) {
        return _cardObj._key
      }
      return ''
    },
    cardTypes: function (): CardTypes {
      return {
        visa_electron: {
          name: 'Visa Electron',
          regx: /^(4026|417500|4508|4844|491(3|7))/,
          length: [16],
          icon: 'https://i.ibb.co/WD28yGh/visa-electron-logo.png',
          accept: true,
        },
        visa: {
          name: 'Visa',
          regx: /^4/,
          length: [16],
          icon: 'https://i.ibb.co/jbKNvPf/icons8-visa.png',
          accept: true,
        },
        mastercard: {
          name: 'Mastercard',
          regx: /^5[1-5]/,
          length: [16],
          icon: 'https://i.ibb.co/HhLhx0N/master-card-logo.png',
          accept: true,
        },
        mc: {
          name: 'Mastercard',
          regx: /^2[0-8]/,
          length: [16],
          icon: 'https://i.ibb.co/HhLhx0N/master-card-logo.png',
          accept: true,
        },
        amex: {
          name: 'American Express',
          regx: /^3[47]/,
          length: [15],
          icon: 'https://i.ibb.co/4RDSYMc/amex-logo.png',
          accept: true,
        },
      }
    },
    cardAbstract: function (_number: string) {
      const _cardTypes: any = OpenPay.card.cardTypes()
      for (const _key in _cardTypes) {
        const _cardObj: any = _cardTypes[_key]
        if (_number.match(_cardObj.regx)) {
          return { ..._cardObj, _key }
        }
      }
      return false
    },
    whitelistedAttrs: [
      'holder_name',
      'cvv2',
      'expiration_month',
      'expiration_year',
    ],
  },

  utils: {
    trim: function (e: string) {
      return (e + '').replace(/^\s+|\s+$/g, '')
    },
  },
}

function validateCredentials(_id: string, _key: string) {
  if (typeof _id === 'undefined' || !/^[a-z0-9]+$/i.test(_id)) {
    throw new Error('Empty or invalid Openpay ID')
  }
  if (typeof _key === 'undefined' || !/^pk_[a-z0-9]+$/i.test(_key)) {
    throw new Error('Empty or invalid Openpay API Key')
  }
  return true
}

function makeBaseAuth(apikey: string) {
  const tok = apikey + ':'
  const hash = btoa(tok)
  return hash
}

function getHostname() {
  if (OpenPay.isSandbox) {
    return OpenPay.sandboxHostname
  } else if (OpenPay._isDevelopMode) {
    return OpenPay.developHostname
  } else {
    return OpenPay.hostname
  }
}

async function sendXhr(_url: string, _auth: string, _data: any) {
  return axios.post(_url, _data, {
    auth: {
      username: _auth,
      password: '',
    },
  })
}

export default OpenPay
