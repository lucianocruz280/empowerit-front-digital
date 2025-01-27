import { Suspense, useEffect, useState } from 'react'
import Loading from '@/components/shared/Loading'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import PageContainer from '@/components/template/PageContainer'
import { Routes, Route, Navigate } from 'react-router-dom'
import { setUser, useAppDispatch, useAppSelector } from '@/store'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import AppRoute from '@/components/route/AppRoute'
import type { LayoutType } from '@/@types/theme'
import dayjs from 'dayjs'
import { payRoute } from '@/configs/routes.config/routes.config'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import GlobalComponents from './GlobalComponents'
import { getCustomToken } from '@/services/AuthService'

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  const userAuthority = useAppSelector((state) => state.auth.user.authority)

  const expires = useAppSelector(
    (state) => state.auth.user.membership_expires_at || null
  )
  const Franchises = [
    '49-pack',
    '100-pack',
    '300-pack',
    '500-pack',
    '1000-pack',
    '2000-pack',
    'FD200',
    'FD300',
    'FD500',
    'FP200',
    'FP300',
    'FP500',
  ]

  const franchise = useAppSelector((state) => state.auth.user.membership)

  const isAdmin = useAppSelector((state) =>
    state.auth.user.authority?.includes('ADMIN')
  )

  const [redirectToPay, setRedirectToPay] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      if (
        Franchises.includes(user?.membership || '') ||
        user.has_automatic_franchises
      ) {
        setRedirectToPay(false)
      } else if (!expires || dayjs().isAfter(dayjs(expires))) {
        // ya vencio la membresia
        setRedirectToPay(true)
      } else {
        setRedirectToPay(false)
      }
    } else {
      setRedirectToPay(false)
    }
  }, [expires, isAdmin, franchise])

  useEffect(() => {
    if (user.uid) {
      const unsubs = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
        const data: any = snap.data()
        getCustomToken(user.uid!).then((customToken) => {
          dispatch(setUser({ uid: user.uid, customToken, ...data }))
        })
      })
      return () => {
        unsubs()
      }
    }
  }, [user.uid])

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
        <Route
          path="/"
          element={<Navigate replace to={authenticatedEntryPath} />}
        />
        {redirectToPay &&
          payRoute.map((route, index) => (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                <AuthorityGuard
                  userAuthority={userAuthority}
                  authority={route.authority}
                >
                  <PageContainer {...props} {...route.meta}>
                    <AppRoute
                      routeKey={route.key}
                      component={route.component}
                      {...route.meta}
                    />
                  </PageContainer>
                </AuthorityGuard>
              }
            />
          ))}
        {!redirectToPay &&
          protectedRoutes.map((route, index) => (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                <AuthorityGuard
                  userAuthority={userAuthority}
                  authority={route.authority}
                >
                  <PageContainer {...props} {...route.meta}>
                    <AppRoute
                      routeKey={route.key}
                      component={route.component}
                      {...route.meta}
                    />
                  </PageContainer>
                </AuthorityGuard>
              }
            />
          ))}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
                {...route.meta}
              />
            }
          />
        ))}
      </Route>
    </Routes>
  )
}

const Views = (props: ViewsProps) => {
  return (
    <Suspense fallback={<Loading loading={true} />}>
      <AllRoutes {...props} />
      <GlobalComponents />
    </Suspense>
  )
}

export default Views
