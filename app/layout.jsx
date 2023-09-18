'use client'
import './globals.css'

import Head from 'next/head'
import { MantineProvider } from '@mantine/core'
import { Provider } from 'react-redux'
import store from './store'

export default function App ({ children }) {
  return (
    <>
      <html>
        <Head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <title>MJA Wash</title>
        </Head>

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'light'
          }}
        >
          <body>
            <Provider store={store}>

              {children}
            </Provider>
          </body>
        </MantineProvider>
      </html>
    </>
  )
}
