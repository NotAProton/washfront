'use client'
import { Button, Container } from '@mantine/core'
import { HomeFillIcon } from '@primer/octicons-react'
import Link from 'next/link'

export default function Page () {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('emailID')
    localStorage.removeItem('key')
  }

  return (
        <div className='flex flex-col items-center h-screen'>
            <Container className="text-neutral-700 items-center text-center rounded-lg bg-neutral-200"
                style={{ marginTop: '10rem', padding: '1.5rem' }}>
                <h3 className="text-1xl text-center sm:text-2xl">
                    Successfully Logged Out</h3>
                <div className="text-sm sm:text-lg sm:text-left mt-5 sm:mt-7">
                    You may now close this window.
                </div>
                <Link href='/'>
                <Button size='sm'
                className={'bg-gray-500 hover:bg-gray-700 rounded-md mt-2'}
                ><HomeFillIcon fill='#F5FFFA' className='m-5'/></Button>
                </Link>

            </Container>
            <div className='fixed mt-2 inset-x-0 bottom-3 text-center text-gray-800'>Built and Maintained by Akshat</div>

        </div>
  )
}
