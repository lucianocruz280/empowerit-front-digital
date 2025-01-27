import { useRef } from 'react'
import Input from '@/components/ui/Input'
import { HiOutlineSearch } from 'react-icons/hi'
import { useAppSelector } from '../store'
import debounce from 'lodash/debounce'
import type { ChangeEvent } from 'react'
import { usersIndex } from '@/algolia/index'
import { useOrderContext } from './OrderContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { parseRef } from '@/services/Inscriptions'

const OrderTableSearch = () => {
  const { setDatatable, fetchData } = useOrderContext()
  const user = useAppSelector((state) => state.auth.user)

  const searchInput = useRef<HTMLInputElement>(null)

  const debounceFn = debounce(handleDebounceFn, 500)

  function handleDebounceFn(val: string) {
    fetchSearchData(val)
  }

  const fetchSearchData = async (search: string) => {
    if (search) {
      const result = await usersIndex.search(search, {
        filters: `sponsor_id:${user.uid}`,
      })
      const users = await Promise.all(
        result.hits.map(async (hit) => {
          return getDoc(doc(db, `users/${hit.objectID}`)).then(parseRef)
        })
      )
      setDatatable(users)
    } else {
      fetchData()
    }
  }

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    debounceFn(e.target.value)
  }

  return (
    <Input
      ref={searchInput}
      className="lg:w-52"
      size="sm"
      placeholder="Search"
      prefix={<HiOutlineSearch className="text-lg" />}
      onChange={onEdit}
    />
  )
}

export default OrderTableSearch
