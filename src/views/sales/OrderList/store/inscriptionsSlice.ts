import {
  createSlice,
  createAsyncThunk,
  current,
  PayloadAction,
} from '@reduxjs/toolkit'
import type { TableQueries } from '@/@types/common'
import { getInscriptions as getInscriptionsApi } from '@/services/Inscriptions'

export type Inscription = {
  id: string
  name: string
  created_at: any
  updated_at: any
  position: string
  email: string
  subscription_expires_at?: any
  payment_link?: {
    status: 'pending' | 'confirming'
  }
}

type Inscriptions = Inscription[]

type GetInscriptionsResponse = {
  data: Inscriptions
  total: number
}

export type InscriptionsListState = {
  loading: boolean
  inscriptionList: Inscriptions
  tableData: TableQueries
  deleteMode: 'single' | 'batch' | ''
  selectedRows: string[]
  selectedRow: string
}

export const SLICE_NAME = 'inscriptionsSlice'

export const getInscriptions = createAsyncThunk(
  SLICE_NAME + '/getInscriptions',
  async ({
    tableQuery,
    userId,
  }: {
    tableQuery: TableQueries
    userId: string
  }) => {
    const response = await getInscriptionsApi(userId)
    return {
      data: response.data?.data,
      total: response.data?.total,
    }
  }
)

const initialState: InscriptionsListState = {
  loading: false,
  inscriptionList: [],
  tableData: {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
      order: '',
      key: '',
    },
  },
  selectedRows: [],
  selectedRow: '',
  deleteMode: '',
}

const inscriptionListSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setInscriptionList: (state, action) => {
      state.inscriptionList = action.payload
    },
    setTableData: (state, action) => {
      state.tableData = action.payload
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload
    },
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload
    },
    addRowItem: (state, { payload }) => {
      const currentState = current(state)
      if (!currentState.selectedRows.includes(payload)) {
        state.selectedRows = [...currentState.selectedRows, ...payload]
      }
    },
    removeRowItem: (state, { payload }: PayloadAction<string>) => {
      const currentState = current(state)
      if (currentState.selectedRows.includes(payload)) {
        state.selectedRows = currentState.selectedRows.filter(
          (id) => id !== payload
        )
      }
    },
    setDeleteMode: (state, action) => {
      state.deleteMode = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInscriptions.fulfilled, (state, action) => {
        state.inscriptionList = action.payload.data || []
        state.tableData.total = action.payload.total || 0
        state.loading = false
      })
      .addCase(getInscriptions.pending, (state) => {
        state.loading = true
      })
  },
})

export const {
  setInscriptionList,
  setTableData,
  setSelectedRows,
  setSelectedRow,
  addRowItem,
  removeRowItem,
  setDeleteMode,
} = inscriptionListSlice.actions

export default inscriptionListSlice.reducer
