import { Button, Checkbox } from '@/components/ui'
import Table from '@/components/ui/Table'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import { formatNumberWithCommas } from '@/utils/format'
import axios from 'axios'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

const AdminPayroll = () => {
  const [users, setUsers] = useState<any[]>([])
  const [fee, setFee] = useState('')
  const [loadingFee, setLoadingFee] = useState(false)
  const [loadingPayment, setLoadingPayment] = useState(false)

  const getFees = async () => {
    try {
      setLoadingFee(true)
      const res = await axios.get(
        process.env.NODE_ENV == ''
          ? ''
          : `${import.meta.env.VITE_API_URL}/getFees`
      )
      setFee(res.data.standard)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingFee(false)
    }
  }

  const execPayroll = async () => {
    try {
      setLoadingPayment(true)
      await fetch(
        `${import.meta.env.VITE_API_URL}/admin/payroll?blockchain=litecoin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      window.location.reload()
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPayment(false)
    }
  }

  const getPayroll = async () => {
    try {
      setLoadingPayment(true)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/payroll`
      ).then((r) => r.json())
      setUsers(response)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPayment(false)
    }
  }

  useEffect(() => {
    getPayroll()
  }, [])

  const notAvailableID = [
    '9CXMbcJt2sNWG40zqWwQSxH8iki2',
    'BjsuClM1KiUi1FNLdUQ7BfeUHhR2',
    'Jr4lAN9ocvazunMiCElExb5toUm1',
    '2X8hQQNuRnUXh26hL0pGY21XCaz2',
    'Kz63rFBI6ddxISUwKtxqvlgWsvM2',
    '9OmNdZnvGNYaQEpFvJ9MSSYQe7G2',
  ]

  return (
    <div className="flex flex-col items-end space-y-8">
      <div className="flex space-x-4 items-center">
        <span>{fee}</span>
        {/*<Button loading={loadingFee} onClick={getFees}>
          Calcular Fees
        </Button>*/}
        <Button variant="solid" loading={loadingPayment} onClick={execPayroll}>
          REALIZAR PAGOS
        </Button>
      </div>
      <div className="w-full">
        <Table>
          <THead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>Socio</Th>
              <Th>Bono Inicio Rapido</Th>
              <Th>Bono Mentor </Th>
              <Th>Bono Presentador </Th>
              <Th>Bono Auto</Th>
              <Th>Bono Binario</Th>
              <Th>5% fee</Th>
              <Th>Total (D+B-F)</Th>
              <Th>Wallet (LTC)</Th>
              <Th>Bank</Th>
            </Tr>
          </THead>
          <TBody>
            <Tr>
              <Td></Td>
              <Td>
                <b className="whitespace-nowrap">TOTAL</b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {formatNumberWithCommas(
                    users.reduce(
                      (a, b) =>
                        a + (b?.bond_quick_start || 0) + (b?.bond_founder || 0),
                      0
                    ),
                    2
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {formatNumberWithCommas(
                    users.reduce((a, b) => a + b?.bond_mentor || 0, 0),
                    2
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {formatNumberWithCommas(
                    users.reduce((a, b) => a + b?.bond_presenter || 0, 0),
                    2
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {formatNumberWithCommas(
                    users.reduce((a, b) => a + b?.bond_car || 0, 0),
                    2
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {formatNumberWithCommas(
                    users.reduce((a, b) => a + b?.bond_binary || 0, 0),
                    2
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {formatNumberWithCommas(
                    users.reduce((a, b) => a + b?.fee || 0, 0),
                    2
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td>
                <b className="whitespace-nowrap">
                  $
                  {formatNumberWithCommas(
                    users.reduce((a, b) => a + b?.total || 0, 0),
                    2
                  )}{' '}
                  usd
                </b>
              </Td>
              <Td></Td>
              <Td></Td>
            </Tr>
            {users &&
              users
                .filter((user) => !notAvailableID.includes(user.id))
                .map((user) => (
                  <Tr
                    key={user.id}
                    className={classNames(user.total < 40 && 'bg-gray-200')}
                  >
                    <Td>
                      <Checkbox
                        disabled={!user.wallet_bitcoin || user.total < 40}
                      />
                    </Td>
                    <Td>{user.name}</Td>
                    <Td>
                      {formatNumberWithCommas(
                        (user?.bond_quick_start || 0) +
                          (user?.bond_founder || 0),
                        2
                      )}{' '}
                      USD
                    </Td>
                    <Td>
                      {formatNumberWithCommas(user?.bond_mentor || 0, 2)} USD
                    </Td>
                    <Td>
                      {formatNumberWithCommas(user?.bond_presenter || 0, 2)} USD
                    </Td>
                    <Td>{user?.bond_car || 0} USD</Td>
                    <Td>
                      {formatNumberWithCommas(user?.bond_binary || 0, 2)} USD
                    </Td>
                    <Td>-{user?.fee || 0} USD</Td>
                    <Td>{formatNumberWithCommas(user?.total || 0, 2)} USD</Td>
                    <Td>
                      {user.wallet_litecoin ? (
                        <FaCheck className="text-green-400" />
                      ) : (
                        <FaTimes className="text-red-400" />
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center">
                        <span>Bank: </span>
                        {user.bank_account ? (
                          <FaCheck className="text-green-400" />
                        ) : (
                          <FaTimes className="text-red-400" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <span>RFC: </span>
                        {user.rfc ? (
                          <FaCheck className="text-green-400" />
                        ) : (
                          <FaTimes className="text-red-400" />
                        )}
                      </div>
                    </Td>
                  </Tr>
                ))}
          </TBody>
        </Table>
      </div>
    </div>
  )
}

export default AdminPayroll
