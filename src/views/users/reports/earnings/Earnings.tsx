import React, { useState, useEffect } from 'react'

interface RowData {
  id: string
  name: string
  email: string
  earnings: number
}

interface EarningsProps {
  data: RowData[]
}

type Earnings = RowData[]

const Earnings: React.FC<EarningsProps> = ({ ...rest }) => {
  const [users, setUsers] = useState<Earnings>([])

  const loadPage = async () => {
    try {
      fetch('http://localhost:8080/users/top-earnings')
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          setUsers(data)
        })
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }

  useEffect(() => {
    loadPage()
  }, [])

  return (
    <div {...rest} className="ov overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              TOP
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Correo
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ganancias Del Mes
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((item: RowData, key: number) => {
            return (
              <tr
                key={key}
                className="hover:bg-gray-100 transition-colors text-center"
              >
                <td className="py-4 whitespace-nowrap">{key + 1}</td>
                <td className="py-4 whitespace-nowrap">{item.name}</td>
                <td className="py-4 whitespace-nowrap">{item.email}</td>
                <td className="py-4 whitespace-nowrap">{`$ ${item.earnings.toFixed(
                  2
                )}`}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Earnings
