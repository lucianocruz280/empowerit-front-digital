import Tooltip from '@/components/ui/Tooltip'
import Menu from '@/components/ui/Menu'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import type { CommonProps } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'
import ConditionalWrapper from '@/components/shared/ConditionalWrapper'
import { ReactElement } from 'react'

const { MenuItem } = Menu

interface CollapsedItemProps extends CommonProps {
  title: string
  translateKey: string
  direction?: Direction
}

interface DefaultItemProps {
  nav: NavigationTree
  onLinkClick?: (link: { key: string; title: string; path: string }) => void
  sideCollapsed?: boolean
  userAuthority: string[]
  disabled?: boolean
  href?: string
}

interface VerticalMenuItemProps extends CollapsedItemProps, DefaultItemProps {}

const CollapsedItem = ({
  title,
  translateKey,
  children,
  direction,
}: CollapsedItemProps) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      title={t(translateKey) || title}
      placement={direction === 'rtl' ? 'left' : 'right'}
    >
      {children}
    </Tooltip>
  )
}

const DefaultItem = (props: DefaultItemProps) => {
  const { nav, onLinkClick, sideCollapsed, userAuthority, disabled, href } =
    props

  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      <MenuItem
        key={nav.key}
        eventKey={nav.key}
        className="mb-2"
        disabled={disabled}
      >
        <ConditionalWrapper
          condition={!disabled}
          wrapper={(children: ReactElement) => (
            <Link
              to={nav.href ?? nav.path}
              className="flex items-center h-full w-full"
              onClick={() =>
                onLinkClick?.({
                  key: nav.key,
                  title: nav.title,
                  path: nav.path,
                })
              }
            >
              {children}
            </Link>
          )}
        >
          <VerticalMenuIcon icon={nav.icon} />
          {!sideCollapsed && (
            <span>
              <Trans i18nKey={nav.translateKey} defaults={nav.title} />
            </span>
          )}
        </ConditionalWrapper>
      </MenuItem>
    </AuthorityCheck>
  )
}

const VerticalSingleMenuItem = ({
  nav,
  onLinkClick,
  sideCollapsed,
  userAuthority,
  direction,
  disabled,
}: Omit<VerticalMenuItemProps, 'title' | 'translateKey'>) => {
  return (
    <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
      {sideCollapsed ? (
        <CollapsedItem
          title={nav.title}
          translateKey={nav.translateKey}
          direction={direction}
        >
          <DefaultItem
            nav={nav}
            sideCollapsed={sideCollapsed}
            userAuthority={userAuthority}
            onLinkClick={onLinkClick}
            disabled={disabled}
          />
        </CollapsedItem>
      ) : (
        <DefaultItem
          nav={nav}
          sideCollapsed={sideCollapsed}
          userAuthority={userAuthority}
          onLinkClick={onLinkClick}
          disabled={disabled}
        />
      )}
    </AuthorityCheck>
  )
}

export default VerticalSingleMenuItem
