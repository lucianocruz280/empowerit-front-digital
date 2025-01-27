
export default function BinaryActive() {
     return (
          <>
               <p className="font-bold text-3xl my-2">Binario Activo</p>
               <div className="grid  md:grid-cols-3 lg:space-x-6 lg:max-w-[1200px]">
                    <div
                         className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
                         role="presentation"
                    >
                         <div className="flex p-4 justify-center bg-slate-100 rounded-[10px] h-full">
                              <div className="flex flex-col justify-center">
                                   <p className='font-semibold text-lg'>Puntos Totales</p>
                                   <p className='text-lg text-center'>500 pts</p>
                              </div>
                         </div>
                    </div>
                    <div
                         className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
                         role="presentation"
                    >
                         <div className="flex p-4 justify-center bg-slate-100 rounded-[10px] h-full">
                              <div className="flex flex-col">
                                   <p className='font-semibold text-lg'>Puntos Izquierda</p>
                                   <p className='text-lg text-center'>450 pts</p>
                              </div>
                         </div>
                    </div>
                    <div
                         className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
                         role="presentation"
                    >
                         <div className="flex p-4 justify-center bg-slate-100 rounded-[10px] h-full">
                              <div className="flex flex-col">
                                   <p className='font-semibold text-lg'>Puntos Derecha</p>
                                   <p className='text-lg text-center text-red-500'>50 pts</p>
                              </div>
                         </div>
                    </div>
               </div>
               <div className="mt-5">
                    <p className="font-semibold">Puntos necesarios en pierna menor para binario activo: <span className="font-normal">100pts</span></p>

               </div>
          </>
     )
}
