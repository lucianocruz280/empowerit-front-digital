import classNames from 'classnames'
import ScrollBar from '@/components/ui/ScrollBar'
import {
  SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH,
  NAV_MODE_THEMED,
  SIDE_NAV_CONTENT_GUTTER,
  LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import Logo from '@/components/template/Logo'
import navigationConfig from '@/configs/navigation.config'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import useResponsive from '@/utils/hooks/useResponsive'
import { useAppSelector } from '@/store'
import useAuth from '@/utils/hooks/useAuth'

const sideNavStyle = {
  width: SIDE_NAV_WIDTH,
  minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
  width: SIDE_NAV_COLLAPSED_WIDTH,
  minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = () => {
  const themeColor = useAppSelector((state) => state.theme.themeColor)
  const primaryColorLevel = useAppSelector(
    (state) => state.theme.primaryColorLevel
  )
  const navMode = useAppSelector((state) => state.theme.navMode)
  const mode = useAppSelector((state) => state.theme.mode)
  const direction = useAppSelector((state) => state.theme.direction)
  const currentRouteKey = useAppSelector(
    (state) => state.base.common.currentRouteKey
  )
  const sideNavCollapse = useAppSelector(
    (state) => state.theme.layout.sideNavCollapse
  )
  const userAuthority = useAppSelector((state) => state.auth.user.authority)
  const userLoged = useAppSelector((state) => state.auth.user)

  const { larger } = useResponsive()

  const sideNavColor = () => {
    if (navMode === NAV_MODE_THEMED) {
      return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
    }
    return `side-nav-${navMode}`
  }

  const menuContent = (
    <VerticalMenuContent
      navMode={navMode}
      collapsed={sideNavCollapse}
      navigationTree={navigationConfig(userLoged)}
      routeKey={currentRouteKey}
      userAuthority={userAuthority as string[]}
      direction={direction}
    />
  )

  return (
    <>
      {larger.md && (
        <div
          style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
          className={classNames(
            'side-nav',
            'overflow-auto',
            sideNavColor(),
            !sideNavCollapse && 'side-nav-expand'
          )}
        >
          <div className="side-nav-header mb-4 mt-4">
            <Logo
              mode={'dark'}
              type={sideNavCollapse ? 'streamline' : 'full'}
              className={
                sideNavCollapse ? SIDE_NAV_CONTENT_GUTTER : LOGO_X_GUTTER
              }
              fullWidth
            />
          </div>
          {sideNavCollapse ? (
            menuContent
          ) : (
            <div className="side-nav-content">
              <ScrollBar autoHide direction={direction}>
                {menuContent}
              </ScrollBar>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default SideNav
