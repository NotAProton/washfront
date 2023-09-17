'use client';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import { Container, TextInput, Text, Button, Loader, PasswordInput, Modal } from '@mantine/core';
import { AlertIcon } from '@primer/octicons-react'
import { apiDomain } from '../config';



export default function Page() {
    const [openErrorModal, setOpenErrorModal] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    let urlParams, email, oldPassword;
    if (typeof window !== "undefined") {
        urlParams = new URLSearchParams(window.location.search);
        email = urlParams.get('mailID');
        oldPassword = urlParams.get('otp');
    }


    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const isPasswordValid = () => {
        return password.length < 20 && password.length >= 3
    }

    const handleButtonClick = () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('mailID', email);
        params.append('password', oldPassword);
        params.append('newPassword', password)

        fetch(`${apiDomain}/changepassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })
            .then((response) => {
                if (response.status === 401) {
                    console.log('Unauthorized');
                    setOpenErrorModal(true)
                } else {
                    if (typeof window !== "undefined") {
                        window.location.href = '/status';
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error)
            })
            .finally(() => setLoading(false));
    };


    return (
        <div className='flex flex-col items-center h-screen'>
            <Modal opened={openErrorModal} title={<AlertIcon size={32} fill='#9f1225' className='block content-center' />} withCloseButton={false}>
                <h3 className='text-2xl text-rose-800 text-center mt-0 p-0 mb-2'>Error</h3>
                Invalid password reset link. You may request a new one by contacting the admin.
            </Modal>

            <Container className="text-neutral-700 items-center text-center rounded-lg bg-neutral-200"
                style={{ marginTop: '10rem', padding: '1.5rem' }}>
                <h3 className="text-1xl text-center sm:text-2xl">
                    Enter a new password</h3>
                <div className="text-sm sm:text-lg sm:mt-3 sm:text-left mt-5 sm:mt-7">

                    <PasswordInput
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                <div>
                    <Button
                        disabled={loading || !isPasswordValid()}
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