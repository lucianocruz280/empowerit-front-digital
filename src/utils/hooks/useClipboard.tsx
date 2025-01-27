import { toast, Notification } from '@/components/ui'

const useClipboard = () => {
  const copy = async (data: string) => {
    await navigator.clipboard.writeText(data)
    toast.push(<Notification title={'Copiado'} type="success" />, {
      placement: 'top-center',
    })
  }
  return { copy }
}

export default useClipboard
