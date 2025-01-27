import { cloneElement } from 'react'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
  content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div
        className="bg-no-repeat bg-cover bg-center py-6 px-16 flex-col items-center justify-center hidden lg:flex relative"
        style={{
          backgroundImage: `url('/img/welcome.png')`,
        }}
      >
      </div>
      <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
        <div className="xl:min-w-[450px] px-8">
          <div className="mb-8">{content}</div>
          {children
            ? cloneElement(children as React.ReactElement, {
                ...rest,
              })
            : null}
        </div>
      </div>
    </div>
  )
}

export default Side
