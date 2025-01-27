import React, { useState, useEffect, useMemo } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Table, Badge } from '@/components/ui'
import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { formatNumberWithCommas } from '@/utils/format'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  endBefore,
  endAt,
  where
} from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { Field, Form, Formik } from 'formik'
import debouce from "lodash.debounce";

const { Tr, Th, Td, THead, TBody } = Table

const statusColor: Record<string, string> = {
  paid: 'bg-emerald-500',
  pending: 'bg-amber-400',
}

interface RowData {
  id: string
  item: string
  status: string
  date: number
  amount: number
}

interface BillingHistoryProps {
  data: RowData[]
}

const Users: React.FC<BillingHistoryProps> = ({ data = [], ...rest }) => {
  const [users, setUsers] = useState<any>([])
  const [email, setEmail] = useState<string>("")

  const pageSize = 1000

  const loadPage = async () => {
    try {
     

        const _query = query(
          collection(db, 'users'),
          where('email', '>=', email),
          where('email', '<', email + '\uf8ff')
        )


      const snapshot = await getDocs(_query!)
      const newUsers: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        date: doc.data().created_at
          ? dayjs(doc.data().created_at.seconds * 1000).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          : null,
        sponsor: doc.data().sponsor,
        upline: doc.data().parent_binary_user_id,
        position: doc.data().position,
        profits: doc.data().profits ? doc.data().profits : "0",
      }))

      setUsers(newUsers)

    } catch (error) {
      console.error('Error loading page:', error)
    }
  }


    const handleChange = (e:any) => {
      setEmail(e.target.value);
    };
    

    const debouncedResults = useMemo(() => {
      return debouce(handleChange, 300);
    }, []);

  

  useEffect(() => {
    loadPage()
  }, [email])

  return (
    <div className='space-y-5'>
    <Formik
          initialValues={{
            name: '',
            password: '',
            confirmPassword: '',
            email: '',
            sponsor: '',
            sponsor_id: '',
          }}
          onSubmit={(values) => {
           console.log(values)
          }}
          validateOnChange
        >
          {({ touched, errors, isSubmitting }) => (
            <Form>
              <FormContainer className='lg:w-[40%] w-full'>
                <FormItem
                  label="Buscar Usuario por Email"
                  invalid={errors.name && touched.name}
                  errorMessage={errors.name}
                >
                  <Input placeholder="Email" onChange={debouncedResults} />
                </FormItem>

              </FormContainer>
            </Form>
          )}
        </Formik>
        <div {...rest} className="ov overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha y hora
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Correo
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ganancias
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sponsor
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Upline
            </th>
            <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posición
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((item: any, key: number) => {
            return (
              <tr
              key={key}
                className="hover:bg-gray-100 transition-colors text-center"
              >
                <td className="py-4 whitespace-nowrap">{item.date}</td>
                <td className="py-4 whitespace-nowrap">{item.name}</td>
                <td className="py-4 whitespace-nowrap">{item.email}</td>
                <td className="py-4 whitespace-nowrap">${Number(item.profits).toLocaleString('en',{minimumFractionDigits: 2})}</td>
                <td className="py-4 whitespace-nowrap">{item.sponsor}</td>
                <td className="py-4 whitespace-nowrap">{item.upline}</td>
                <td className="py-4 whitespace-nowrap">
                  {item.position === 'right' ? (
                    <span>Derecha</span>
                  ) : item.position === 'left' ? (
                    <span>Izquierda</span>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <div className="flex justify-center mt-4">
          {/*  <button
          className="px-4 py-2 mx-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => loadPage(false)} disabled={!firstVisible}
        >
          Anterior
        </button>
        <button
          className="px-4 py-2 mx-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={() => loadPage(true)} disabled={!lastVisible}
        >
          Siguiente
        </button> */}
        </div>
      </div>
    </div>
    </div>
   
  )
}

export default Users
