'use client';
import { useState } from 'react';
import { Container, TextInput, Text, Button, Loader } from '@mantine/core';

export default function Page() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);


    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const isEmailValid = () => {
        const regex = /^[A-Za-z]{1,20}23(b|B)[A-Za-z]{2}\d{1,3}$/;
        return regex.test(email);
    };

    const handleButtonClick = () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('mailID', email);

        fetch('https://notaproton.github.io/sendOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })
            .then((response) => {
                if (response.status === 401) {
                    // Show a notification for unauthorized response
                    console.log('Unauthorized');
                } else {
                    // Redirect to /otp route
                    router.push('/otp');
                }
            })
            .catch((error) => console.error('Error:', error))
            .finally(() => setLoading(false));
    };


    return (
        <div className='flex flex-col items-center h-screen'>
            <Container className="text-neutral-700 items-center text-center rounded-lg bg-neutral-200"
                style={{ marginTop: '10rem', marginLeft: '2rem', marginRight: '2rem', padding: '1.5rem' }}>
                <h3 className="text-1xl text-center sm:text-2xl">
                    Login using your Institute Mail</h3>
                <div className="text-sm sm:text-lg sm:mt-3 sm:text-left">
                    <TextInput label="Your email" placeholder="name23bte00" rightSection={
                        <Text className='bg-neutral-250 text-sm'>@iiitkottayam.ac.in</Text>}
                        rightSectionWidth={120}
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
                <div>
                    <Button
                        disabled={!isEmailValid() || loading}
                        onClick={handleButtonClick}
                        className='mt-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        style={{ border: '2px solid grey' }}
                    >
                        {loading ? <Loader size={'xs'} /> : 'Proceed'}

                    </Button>
                </div>

            </Container>
        </div>
    )
}