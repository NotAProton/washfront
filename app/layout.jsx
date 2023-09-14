'use client';
import { AppProps } from 'next/app';
import './globals.css'

import Head from 'next/head';
import { MantineProvider } from '@mantine/core';

export default function App({ children }) {

  return (
    <>
      <html>
        <Head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>

        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'light',
          }}
        >
          <body>

            {children}
          </body>
        </MantineProvider>
      </html>
    </>
  );
}