import axios from 'axios'

const account_id = '1bb1bad530f7fe11d1ad7016ef1eb9af'
const apitoken = 'JxwlZS1nYZ2DcM_nxiT86PWyRq6SlBf5sWeb2SUT'
const subdomain = 'customer-yqugg24pvdqrkyn9.cloudflarestream.com'

export const createNewStreamChannel = (lesson_name) => {
  return axios
    .post(
      `https://api.cloudflare.com/client/v4/accounts/${account_id}/stream/live_inputs`,
      {
        meta: {
          name: lesson_name,
        },
        recording: {
          mode: 'automatic',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apitoken}`,
        },
      }
    )
    .then((r) => r.data.result)
}
