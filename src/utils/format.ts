export function prettyUUID(uuid: string | number, index = 0): string {
  if (!uuid) return '-'
  const res = uuid.toString().split('-')[index]
  return (res.length > 8 ? res.substring(0, 8) : res).toUpperCase()
}

export const formatNumberWithCommas = (
  rawNumber: string | number | any,
  decimals = -1,
  default_value?: string,
  removeRightZeros = true
): string => {
  if (!rawNumber && rawNumber !== 0) return default_value ?? '-'

  let text = (
    decimals == -1
      ? rawNumber
      : (typeof rawNumber == 'number' ? rawNumber : parseFloat(rawNumber))
          .toFixed(decimals)
          .replace(removeRightZeros ? /\.0+$/ : '', '')
  ).toString()

  try {
    text = text.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
  } catch (Err) {
    console.error('REGEX NO SUPPORTED')
    text = Number(text).toLocaleString('en-US')
  }

  return text
}
