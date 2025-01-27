import classNames from 'classnames'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface LogoProps extends CommonProps {
  type?: 'full' | 'streamline'
  mode?: 'light' | 'dark'
  imgClass?: string
  logoWidth?: number | string
  fullWidth?: boolean
}

const LOGO_SRC_PATH = '/img/logo3/'

const Logo = (props: LogoProps) => {
  const {
    type = 'full',
    mode = 'light',
    className,
    imgClass,
    style,
    logoWidth = 'auto',
    fullWidth = false,
  } = props

  return (
    <div
      className={classNames(
        'logo',
        'flex items-center space-x-2',
        { 'justify-center': props.type == 'streamline' },
        className
      )}
      style={{
        ...style,
        ...{ width: logoWidth },
      }}
    >
      <img
        className={imgClass}
        src={`${LOGO_SRC_PATH}logo-${mode}-${type}.png`}
        alt={`${APP_NAME} logo`}
        height={fullWidth ? undefined : 20}
        style={
          fullWidth
            ? {}
            : {
                height: 30,
              }
        }
      />
    </div>
  )
}

export default Logo
