
import PreviewAcademy from '../academies/previews/PreviewAcademy.component'
import AlgorithmTable from './components/AlgorithmTable.1';
import AlgorithmVideos from './components/AlgorithmVideos'
import { GoDownload } from "react-icons/go";

function AlgorithmMrRange() {

  return (
    <div>
      <div className="flex flex-col">
        <div className='flex space-between items-center'>
          <h3 className="text-xl font-bold">Algoritmo de Mr. Rango</h3>
          <div className='flex border rounded-lg px-3 py-1 mx-2 shadow-sm text-center'>
            <a
              href="https://storage.googleapis.com/empowerit-top.appspot.com/recursos-algorithm-mr-range/Recursos-20240605T194032Z-001.zip"
              className='flex items-center'
            >
              <button className='flex-row flex-nowrap'>
                Descargar Recursos
              </button>
              <div className='pl-1'>
                <GoDownload />
              </div>
            </a>
          </div>
          <div className='flex border rounded-lg px-3 py-1 mx-2 shadow-sm text-center'>
            <a
              href="https://storage.googleapis.com/empowerit-top.appspot.com/recursos-algorithm-mr-range/Biblioteca.zip"
              className='flex items-center'
            >
              <button className='flex-row flex-nowrap'>
                Descargar Biblioteca
              </button>
              <div className='pl-1'>
                <GoDownload />
              </div>
            </a>
          </div>
          <div className='flex border rounded-lg px-3 py-1 mx-2 shadow-sm text-center'>
            <a
              href="https://storage.googleapis.com/empowerit-top.appspot.com/recursos-algorithm-mr-range/RangeOPS%20v1.2%20(2).ex5"
              className='flex items-center'
            >
              <button className='flex-row flex-nowrap'>
                Descargar Mr.Rango
              </button>
              <div className='pl-1'>
                <GoDownload />
              </div>
            </a>
          </div>
        </div>
        <AlgorithmVideos />
        <AlgorithmTable />
      </div>
    </div>
  )
}

export default AlgorithmMrRange