import { storageBucket } from '@/configs/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const extensions = {
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/png': 'png',
}

export const uploadImage = async (filename, path, file) => {
  const fullPath = path + '/' + filename + '.' + extensions[file.type]
  const storageRef = ref(storageBucket, fullPath)
  await uploadBytes(storageRef, file)
  const fileURL = await getDownloadURL(storageRef)

  return fileURL
}
