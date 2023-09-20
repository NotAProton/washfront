'use client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { Container, TextInput, Text, Button, Loader, PasswordInput } from '@mantine/core'
import { apiDomain } from '../config'
import Swal from 'sweetalert2'

export default function Page () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const isEmailValid = () => {
    const regex = /^[A-Za-z]{1,20}23(b|B)[A-Za-z]{2}\d{1,3}$/
    return regex.test(email)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const isPasswordValid = () => {
    return password.length < 20 && password.length >= 3
  }

  const handleButtonClick = () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.append('mailID', email)
    params.append('password', password)

    let urlParams, nextRedirect
    if (typeof window !== 'undefined') {
      urlParams = new URLSearchParams(window.location.search)
      nextRedirect = urlParams.get('next')
    }

    fetch(`${apiDomain}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
      .then((response) => {
        if (response.status === 401) {
          Toast.fire({
            icon: 'error',
            title: 'Email or Password incorrect'
          })
        } else {
          response.text().then((data) => {
            localStorage.setItem('emailID', email)
            localStorage.setItem('key', data)
            window.location.href = `/${nextRedirect}`
          })
        }
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => setLoading(false))
  }

  return (
        <div className='flex flex-col items-center h-screen'>
            <Container className="text-neutral-700 items-center text-center rounded-lg bg-neutral-200"
                style={{ marginTop: '10rem', padding: '1.5rem' }}>
                <h3 className="text-1xl text-center sm:text-2xl">
                    Login using your Institute Mail</h3>
                <div className="text-sm sm:text-lg sm:text-left mt-5 sm:mt-7">
                    <TextInput label="Your email" placeholder="name23bte00" rightSection={
                        <Text className='bg-neutral-250 text-sm'>@iiitkottayam.ac.in</Text>}
                        rightSectionWidth={120}
                        value={email}
                        onChange={handleEmailChange}
                    />
                    <PasswordInput label="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div>
                    <Button
                        disabled={!isEmailValid() || loading || !isPasswordValid()}
                        onClick={handleButtonClick}
                        className='mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        style={{ border: '2px solid grey' }}
                    >
                        {loading ? <Loader size={'xs'} /> : 'Proceed'}

                    </Button>
                </div>

            </Container>
            <div className='fixed mt-2 inset-x-0 bottom-3 text-center text-gray-800'>Built and Maintained by Akshat</div>

        </div>
  )
}
