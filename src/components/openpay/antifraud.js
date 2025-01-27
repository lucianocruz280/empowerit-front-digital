/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import sjcl from 'sjcl'

const OpenPay = {}

// Device Data Handling
const _deviceData = {
  _hostname: 'https://api.openpay.mx/',
  _sandboxHostname: 'https://sandbox-api.openpay.mx/',
  _developHostname: 'https://dev-api.openpay.mx/',
  _deviceDataId: undefined,
}

function getDeviceDataId(newone) {
  if (_deviceData._deviceDataId === undefined || newone) {
    _deviceData._deviceDataId = sjcl.codec.base64
      .fromBits(sjcl.random.randomWords(6, 0))
      .replace(/[\+\/]/g, '0')
  }
  return _deviceData._deviceDataId
}

// Anti-Fraud Components Retrieval
function get_antifraud_comp(hostname, merchant, sessionId) {
  const antifraudURL = `${hostname}antifraud/${merchant}/components?s=${sessionId}`

  if (window.XDomainRequest) {
    const xdr = new XDomainRequest()
    xdr.open('GET', antifraudURL)
    xdr.onload = function () {
      document.body.insertAdjacentHTML('beforeend', xdr.responseText)
    }
    setTimeout(() => {
      xdr.send()
    }, 0)
  } else {
    const xmlhttp = new XMLHttpRequest()
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        document.body.insertAdjacentHTML('beforeend', xmlhttp.responseText)
      }
    }
    xmlhttp.open('GET', antifraudURL, true)
    xmlhttp.send()
  }
}

// Device Data Collection
function collect() {
  let hostname
  const sessionId = getDeviceDataId()

  if (OpenPay.developMode) {
    hostname = _deviceData._developHostname
  } else if (OpenPay.sandboxMode) {
    hostname = _deviceData._sandboxHostname
  } else {
    hostname = _deviceData._hostname
  }

  const merchant = OpenPay.getId()
  get_antifraud_comp(hostname, merchant, sessionId)

  return getDeviceDataId()
}

// Export the needed methods
export const setupDeviceData = (_formId, _hiddenFieldName) => {
  const sessionId = getDeviceDataId()
  if (_formId && document.getElementById(_formId)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.value = sessionId
    input.name = _hiddenFieldName || 'deviceDataId'
    input.id = _hiddenFieldName || 'deviceDataId'
    document.getElementById(_formId).appendChild(input)
  }
  return collect()
}

export const getBeaconKey = (
  endpoint,
  publicKey,
  userId,
  sessionId,
  hostname
) => {
  // This function would include the AJAX call to retrieve the beacon key
  // Assuming a similar structure to the existing _getBeaconKey implementation
}

// Setup Sift Science or other device fingerprinting integrations
export const setupDeviceDataSC = (userId, sessionId, beaconKey, hostname) => {
  console.log('Sift Snippet')
  // Insert the sift science snippet setup here
}

// Export high-level OpenPay API
export default {
  getDeviceDataId,
  setupDeviceData,
  getBeaconKey,
  setupDeviceDataSC,
}
