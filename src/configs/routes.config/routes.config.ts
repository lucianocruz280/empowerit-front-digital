import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
  // Dashboard
  {
    key: 'home',
    path: '/home',
    component: lazy(() => import('@/views/sales/SalesDashboard')),
    authority: ['USER'],
  },
  // Academy
  {
    key: 'academy',
    path: '/academy',
    component: lazy(() => import('@/views/academies/Academy.component')),
    authority: ['USER', 'ADMIN'],
  } /* 
  {
    key: 'algorithm-mr-range',
    path: '/algorithm-mr-range',
    component: lazy(() => import('@/views/algorithm-mr-range/index')),
    authority: ['ALGORITHM', 'ADMIN'],
  }, */,
  {
    key: 'academy',
    path: '/:academyType/course/:courseId',
    component: lazy(
      () => import('@/views/academies/previews/PreviewAcademy.component')
    ),
    authority: ['USER', 'ADMIN', 'ALGORITHM'],
  },
  {
    key: 'academy',
    path: '/:academyType/course/:courseId/lesson/:lessonId',
    component: lazy(() => import('@/views/video')),
    authority: ['USER', 'ADMIN', 'ALGORITHM'],
  },
  {
    key: 'academy',
    path: '/:academyType/course/:courseId/live/:lessonId',
    component: lazy(() => import('@/views/video')),
    authority: ['USER', 'ADMIN', 'ALGORITHM'],
  },
  // Membership
  {
    key: 'subscriptions-manual',
    path: '/subscriptions-manual',
    component: lazy(() => import('@/views/memberships')),
    authority: ['USER', 'STARTER'],
  },
  {
    key: 'subscriptions-automatic',
    path: '/subscriptions-automatic',
    component: lazy(() => import('@/views/memberships-automatic')),
    authority: ['USER'],
  },
  {
    key: 'subscriptions-product',
    path: '/subscriptions-product',
    component: lazy(() => import('@/views/memberships-product')),
    authority: ['USER'],
  },
  {
    key: 'subscriptions-digital',
    path: '/subscriptions-digital',
    component: lazy(() => import('@/views/memberships-digital')),
    authority: ['USER'],
  },
  {
    key: 'participations',
    path: '/participations',
    component: lazy(() => import('@/views/participations/index')),
    authority: ['PARTICIPATIONS'],
  },
  // Uninivel
  {
    key: 'order-list',
    path: '/order-list',
    component: lazy(() => import('@/views/sales/OrderList')),
    authority: ['USER'],
  },
  //Mis Franquicias
  {
    key: 'my-automatic-franchises',
    path: '/my-automatic-franchises',
    component: lazy(() => import('@/views/my-automatic-franchises')),
    authority: ['USER'],
  },
  // Binario
  {
    key: 'binary.tree',
    path: '/binary-tree',
    component: lazy(() => import('@/views/binary-tree')),
    authority: ['USER'],
  },
  {
    key: 'binary.active',
    path: '/binary-active',
    component: lazy(() => import('@/views/binary-active')),
    authority: ['USER'],
  },
  // Mapa
  {
    key: 'report-sanguine-map',
    path: '/report-sanguine-map',
    component: lazy(() => import('@/views/users/reports/map-sanguine')),
    authority: ['USER'],
  },
  // Rango
  {
    key: 'rank',
    path: '/rank',
    component: lazy(() => import('@/views/rank')),
    authority: ['USER'],
  },
  // Historial de Pagos
 
  {
    key: 'user-payroll-history',
    path: '/payroll/history',
    component: lazy(() => import('@/views/Payroll/')),
    authority: ['USER'],
  },
  {
    key: 'marketplace',
    path: '/marketplace',
    component: lazy(() => import('@/views/marketplace/index')),
    authority: [],
  },
  {
    key: 'marketplace-distributor',
    path: '/marketplace-distributor',
    component: lazy(() => import('@/views/marketplace-distributor')),
    authority: [],
  },
  {
    key: 'marketplace-digital-service',
    path: '/marketplace-digital-service',
    component: lazy(
      () =>
        import('@/views/marketplace-digital-service/MartketplaceDigitalService')
    ),
    authority: ['USER'],
  },
  {
    key: 'marketplace.history',
    path: '/marketplace/history',
    component: lazy(
      () => import('@/views/marketplace-history/MarketPlaceHistory')
    ),
    authority: ['USER'],
  },
  {
    key: 'mr-money-power.history',
    path: '/mr-money-power/history',
    component: lazy(() => import('@/views/mr-money-power-admin')),
    authority: ['ADMIN', 'MR-MONEY-POWER'],
  },
  // Top Shop
  {
    key: 'shop',
    path: '/shop',
    component: lazy(() => import('@/views/shop/index')),
    authority: [],
  },
  // Concursos DISABLED
  // Marketplace DISABLED
  // Beneficios supreme DISABLED
  // Herramientas DISABLED
  // Sistema de liderazgo
  {
    key: 'academy-leadership',
    path: '/academy-leadership',
    component: lazy(
      () => import('@/views/academies/AcademyLeadership.component')
    ),
    authority: ['USER', 'STARTER', 'ADMIN'],
  },
  {
    key: 'academy-leadership',
    path: '/academy-leadership/courses-leadership/:courseId',
    component: lazy(() => import('@/views/academy-leadership-course/index')),
    authority: ['USER', 'STARTER', 'ADMIN'],
  },
  {
    key: 'academy-leadership',
    path: '/academy-leadership/courses-leadership/:courseId/lesson/:lessonId',
    component: lazy(() => import('@/views/video')),
    authority: ['USER', 'STARTER', 'ADMIN'],
  },
  {
    key: 'academy-leadership',
    path: '/academy-leadership/courses-leadership/:courseId/live/:lessonId',
    component: lazy(() => import('@/views/video')),
    authority: ['USER', 'STARTER', 'ADMIN'],
  },
  // Historial DISABLED
  // Retiros DISABLED
  // ADMIN: Franquicias Automaticas
  {
    key: 'admin-automatic-franchises-pay',
    path: '/admin-automatic-franchises-pay',
    component: lazy(() => import('@/views/adminAutomaticFranchises')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-automatic-franchises-activate-without-volumen',
    path: '/admin-automatic-franchises-activate-without-volumen',
    component: lazy(
      () => import('@/views/adminAutomaticFranchises/activate-without-volumen')
    ),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-automatic-franchises-activate-with-volumen',
    path: '/admin-automatic-franchises-activate-with-volumen',
    component: lazy(
      () => import('@/views/adminAutomaticFranchises/activate-with-volumen')
    ),
    authority: ['ADMIN'],
  },
  // ADMIN: Pagos
  {
    key: 'admin-payroll-history-leaders',
    path: '/admin-payroll/history-leaders',
    component: lazy(() => import('@/views/admin/leader-history')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-payroll',
    path: '/admin-payroll/pays',
    component: lazy(() => import('@/views/AdminPayroll')),
    authority: ['ADMIN'],
  },
  {
    key: 'user-payroll-history',
    path: '/admin-payroll/history',
    component: lazy(() => import('@/views/AdminPayroll/history')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-payroll-withdraw',
    path: '/admin-payroll/withdraw',
    component: lazy(() => import('@/views/AdminPayroll/withdraw')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-payroll-income',
    path: '/admin-payroll/income',
    component: lazy(() => import('@/views/AdminPayroll/income')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-payroll.7-levels',
    path: 'admin-payroll/7-levels',
    component: lazy(() => import('@/views/AdminPayroll/7-levels')),
    authority: ['ADMIN'],
  },
  //ADMIN: Participations
  {
    key: 'admin-participations-payroll',
    path: '/admin-participations-payroll/pays',
    component: lazy(() => import('@/views/admin/participations')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-participations-without-volumen',
    path: '/admin-participations-without-volumen',
    component: lazy(
      () => import('@/views/admin/participations/activate-without-volumen')
    ),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-participations-with-volumen',
    path: '/admin-participations-with-volumen',
    component: lazy(
      () => import('@/views/admin/participations/activate-with-volumen')
    ),
    authority: ['ADMIN'],
  },
  // ADMIN: Academy
  {
    key: 'admin-academy',
    path: '/academy/agregar',
    component: lazy(() => import('@/views/videos')),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  {
    key: 'admin-academy-course',
    path: '/academy/admin-course',
    component: lazy(
      () => import('@/views/academies/admin/AdminAcademy.component')
    ),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  {
    key: 'editCourse',
    path: 'academy/admin/edit/:courseId',
    component: lazy(
      () => import('@/views/academies/admin/EditCourse.component')
    ),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  // ADMIN: Sistema de liderazgo
  {
    key: 'admin-academy-leadership',
    path: '/academy-leadership/agregar',
    component: lazy(() => import('@/views/leadership')),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  {
    key: 'admin-academy-leadership-course',
    path: '/academy-leadership/admin-course',
    component: lazy(
      () => import('@/views/academies/admin/AdminLeadership.component')
    ),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  {
    key: 'edit-courses-leadership',
    path: 'academy-leadership/admin/edit/:courseId',
    component: lazy(
      () => import('@/views/academies/admin/EditCourse.component')
    ),
    authority: ['ADMIN', 'EDUCATOR'],
  },
  // ADMIN: Usuarios
  {
    key: 'report-earnings',
    path: '/report-earnings',
    component: lazy(() => import('@/views/users/reports/earnings')),
    authority: ['ADMIN'],
  },
  {
    key: 'report-referrals',
    path: '/report-referrals',
    component: lazy(() => import('@/views/users/reports/referrals')),
    authority: ['ADMIN'],
  },
  {
    key: 'report-map',
    path: '/report-map',
    component: lazy(() => import('@/views/users/reports/map')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-register',
    path: '/admin-register',
    component: lazy(() => import('@/views/auth/AdminSignUp')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-volumen-register',
    path: '/admin-volumen-register',
    component: lazy(() => import('@/views/admin/active-with-volume')),
    authority: ['ADMIN'],
  },
  {
    key: 'payments-history',
    path: '/payments-history',
    component: lazy(() => import('@/views/payments-history/index')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-payments-bills',
    path: '/admin/payments/report',
    component: lazy(() => import('@/views/admin/payments-report')),
    authority: ['ADMIN'],
  },
  {
    key: 'search-users',
    path: '/search-users',
    component: lazy(() => import('@/views/users/index')),
    authority: ['ADMIN'],
  },
  {
    key: 'enter-as-user',
    path: '/admin/enter-as-user',
    component: lazy(() => import('@/views/admin/enter-as-user')),
    authority: ['ADMIN', 'SUPPORT'],
  },
  // User Info
  {
    key: 'profile',
    path: '/profile',
    component: lazy(() => import('@/views/account')),
    authority: ['USER'],
  },
  {
    key: 'password',
    path: '/password',
    component: lazy(() => import('@/views/account')),
    authority: ['USER'],
  },
  {
    key: 'billing',
    path: '/billing',
    component: lazy(() => import('@/views/account')),
    authority: ['USER'],
  },
  {
    key: 'admin-pending-ships',
    path: '/admin/pending-ships',
    component: lazy(() => import('@/views/admin/get-users-packs-ships')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-pending-fund-account',
    path: '/admin/pending-fund-account',
    component: lazy(() => import('@/views/admin/get-users-fund-account')),
    authority: ['ADMIN'],
  } /* 
  {
    key: 'admin-mr-range',
    path: '/admin/mr-range-history',
    component: lazy(
      () => import('@/views/algorithm-mr-range/admin-algorithm-mr-range')
    ),
    authority: ['ADMIN', 'MR-RANGE'],
  }, */,
  {
    key: 'admin-signals-add',
    path: '/admin/signals/add',
    component: lazy(() => import('@/views/signals/add-signal')),
    authority: ['ADMIN', 'FOREX', 'CRYPTO', 'SPORT'],
  },
  //ADMIN: Creditos
  {
    key: 'admin-credits.all',
    path: '/admin-credits/all-credits',
    component: lazy(() => import('@/views/admin/credits/all-credits')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-credits.add-credits',
    path: '/admin-credits/add-credits',
    component: lazy(() => import('@/views/admin/credits/add-credits')),
    authority: ['ADMIN'],
  },
  {
    key: 'admin-credits.history-credits',
    path: '/admin-credits/history-credits',
    component: lazy(() => import('@/views/admin/credits/history-credits')),
    authority: ['ADMIN'],
  },
]

export const payRoute = [
  {
    key: 'pay',
    path: '/home',
    component: lazy(() => import('@/views/memberships-automatic')),
    authority: [],
  },
  {
    key: 'subscriptions-automatic',
    path: '/subscriptions-automatic',
    component: lazy(() => import('@/views/memberships-automatic')),
    authority: [],
  },
  {
    key: 'subscriptions-product',
    path: 'subscriptions-product',
    component: lazy(() => import('@/views/memberships-product')),
    authority: [],
  },
  {
    key: 'subscriptions-digital',
    path: '/subscriptions-digital',
    component: lazy(() => import('@/views/memberships-digital')),
    authority: [],
  },
  {
    key: 'marketplace',
    path: '/marketplace',
    component: lazy(() => import('@/views/marketplace/index')),
    authority: [],
  },
]
