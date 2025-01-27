const Events = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-4 w-full">
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border cursor-pointer bg-slate-100 rounded-[10px]"
          role="presentation"
        >
          <img src="/img/dashboard-1.jpg" className="w-full" />
        </div>
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border cursor-pointer bg-slate-100 rounded-[10px]"
          role="presentation"
        >
          <img src="/img/dashboard-2.jpg" className="w-full" />
        </div>
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400  p-4  card-border cursor-pointer bg-slate-100 rounded-[10px]"
          role="presentation"
        >
          <img src="/img/dashboard-3.jpg" className="w-full" />
        </div>
      </div>
    </>
  )
}

export default Events
