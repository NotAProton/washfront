'use client';
import { useState } from 'react';
import { Container, TextInput, Text, Button, Loader } from '@mantine/core';

export default function Page() {
    const [otp, setotp] = useState('');
    const [loading, setLoading] = useState(false);



    const handleOTPChange = (event) => {
        setotp(event.target.value);
    };
    const isOtpValid = () => {
        const regex = /^\d\d\d\d$/;
        return regex.test(otp);
    };


    const handleButtonClick = () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('otp', otp);

        fetch('https://notaproton.github.io/login', {
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
                } else if (response.status === 201) {
                    //store response auth token in local storage
                    response.text().then((token) => {
                        localStorage.setItem("token", token);
                    })
                } else {
                    console.log(response)
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
                    Enter the OTP sent to your Email</h3>
                <div className="text-sm sm:text-lg sm:mt-3 sm:text-left">
                    <TextInput label="OTP" placeholder="0000"
                        value={otp}
                        onChange={handleOTPChange}
                    />
                </div>
                <div>
                    <Button
                        disabled={!isOtpValid() || loading}
                        onClick={handleButtonClick}
                        className='mt-3 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        style={{ border: '2px solid rgb(190,190,190)' }}
                    >
                        {loading ? <Loader size={'xs'} /> : 'Proceed'}

                    </Button>
                </div>

            </Container>
        </div>
    )
}