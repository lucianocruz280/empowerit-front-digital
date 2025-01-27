import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import searchClient from './algolia'
import { InstantSearch } from 'react-instantsearch'
import './locales'
import * as Sentry from '@sentry/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import dayjs from 'dayjs'
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect } from 'react'

Sentry.init({
  dsn: 'https://42594bb6b0277fc7e82e88bd880f9117@o4505757456334848.ingest.sentry.io/4505813530771456',
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['localhost'],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
})

function App() {

  useEffect(() => {
    dayjs.extend(relativeTime)
  }, [])

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <Theme>
              <InstantSearch
                searchClient={searchClient}
                indexName="users_index"
              >
                <Layout />
              </InstantSearch>
            </Theme>
          </QueryClientProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
