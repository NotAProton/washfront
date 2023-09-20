'use client'
import './globals.css'

import { MantineProvider } from '@mantine/core'
import { Provider } from 'react-redux'
import store from './store'

export default function App ({ children }) {
  return (

      <html>
        <head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <meta property="og:title" content="MJA Wash" />
          <title>MJA Wash</title>
        </head>

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

  )
}
