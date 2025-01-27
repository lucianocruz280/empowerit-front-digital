import { create } from 'zustand'

export type Slice = {
  open: boolean;
  user_id: null | string;
  openModal: (user_id: string) => void;
  closeModal: () => void;
}

const useUserModalStore = create<Slice>((set) => ({
  open: false,
  user_id: null,
  openModal: (user_id: string) => {
    set({
      open: true,
      user_id,
    })
  },
  closeModal: () => {
    set({
      open: false,
      user_id: null,
    })
  },
}))

export default useUserModalStore
