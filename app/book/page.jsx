'use client';
import { useState, useEffect, useRef } from 'react';
import { Grid, Container, TextInput, Text, Button, Loader, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { getDateFromSlotID, compileWeekList, emptyDaySlotArray, getCurrentSlotInfo, getDayFromSlotNo, getSlotLabel } from '../helpers';
import { apiDomain } from '../config';
import Swal from 'sweetalert2';

function useInterval(callback, delay) {
    const savedCallback = useRef();
    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        tick()
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

let chosenSlotID = null

export default function Page() {

    const [weeklist, setWeeklist] = useState([])
    const [opened, setOpenModal] = useState(false);
    if (typeof window !== "undefined") {
        if (!window.localStorage.getItem('key')) {
            window.location.href = "/login"
        }
    }


    const params = new URLSearchParams();
    useInterval(() => {
        refresh(setWeeklist)
    }, 30000);

    return (
        <div className='flex flex-col items-center h-screen'>

            {weeklist.length === 0 ? <Loader size={'xs'} /> : <div><Navbar /><BookingModal opened={opened} setOpenModal={setOpenModal} setData={setWeeklist} /><Week data={weeklist} openModal={setOpenModal} /> </div>}
        </div>
    )
}

function Week({ data, openModal }) {
    return (
        <div className="flex flex-col md:flex-row">
            <div>
                {data.slice(0, 3).map((item, index) => (
                    <Day openModal={openModal} day={item.day} data={item.slots} key={index} />
                ))}
            </div>
            <div>
                {data.slice(3, 6).map((item, index) => (
                    <Day openModal={openModal} day={item.day} data={item.slots} key={index} />
                ))}
            </div>
        </div>
    )
}
function Day({ day, data, openModal }) {
    const odd = data.filter((_, i) => i % 2 === 0);
    const even = data.filter((_, i) => i % 2 !== 0);

    return (
        <div className='block m-0.5 sm:m-1 my-2'>
            <Container className="p-1 text-neutral-700 items-center text-center rounded-lg bg-neutral-100" style={{ border: '3px solid rgb(186,186,186)' }}>
                <h3 className="text-xl text-center sm:text-2xl">{day}</h3>
                <Grid columns={8}>
                    <Grid.Col span={4} >
                        {odd.map((item, index) => (
                            <ButtonMod item={item} key={index} openModal={openModal} />
                        ))}
                    </Grid.Col>
                    <Grid.Col span={4}>
                        {even.map((item, index) => (
                            <ButtonMod item={item} key={index} openModal={openModal} />
                        ))}
                    </Grid.Col>
                </Grid>
            </Container>
        </div >
    )
}

function ButtonMod({ item, openModal }) {
    return (
        <Button disabled={item.status === 'booked' ? true : false} onClick={() => { openModal(true); handleSlotClick(item) }} size={'lg'} className={' mt-2 rounded-md block'}
            style={{
                backgroundColor: item.status === 'booked' ? 'rgb(128,128,128)' : 'rgba(12, 156, 94, 0.5)',
                width: '100%',
                border: item.status === 'booked' ? '2px solid rgb(190,190,190)' : '2px solid rgb(9, 121, 105)',
                color: item.status === 'booked' ? "rgb(249,249,249)" : "rgb(0,53,0)",
            }}>{item.label}</Button>
    )
}



function Navbar() {
    return (
        <nav className="flex px-6 py-3 rounded-b-lg p-0" style={{ border: '3px solid rgb(186,186,186)', borderTop: '0px' }}>
            <div className="justify-between text-blue-gray-900 text-xl" >
                MJA Wash
            </div>



        </nav>
    );
}



function BookingModal({ opened, setOpenModal, setData }) {
    const [loading, setLoading] = useState(false);
    return (
        <Modal yOffset={100} closeOnClickOutside={false} opened={opened} onClose={() => { () => { setOpenModal(false); refresh(setData) } }} title="Book slot">
            <h3 className="text-xl"> {getDayFromSlotNo(chosenSlotID)}({getDateFromSlotID(chosenSlotID)}): {getSlotLabel(chosenSlotID)} </h3>
            <div className='mt-2 text-center'>
                {!loading ?
                    <Button onClick={() => {
                        setLoading(true)
                        confirmBooking(chosenSlotID).then(() => {
                            setLoading(false)
                            setOpenModal(false)
                        })
                    }} className='mt-3 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        style={{ border: '2px solid grey' }}>Confirm Booking</Button>
                    : <Loader size={'xs'} />
                }
            </div>

        </Modal >
    )
}

function handleSlotClick(e) {
    chosenSlotID = e.slotno
}

//return promise true when done
function confirmBooking(e) {
    return new Promise((resolve) => {
        let key = localStorage.getItem('key');
        const params = new URLSearchParams();
        params.append('slot', e);

        fetch(`${apiDomain}/book`, {
            method: 'POST',
            headers: {
                'Authorization': key,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })
            .then((response) => {
                if (response.status === 401) {
                    Swal.fire(
                        'Booking Failed',
                        'Please login and try again',
                        'error'
                    )
                    localStorage.removeItem('key')
                    window.location.href = "/login"
                } else if (response.status === 200) {
                    Swal.fire(
                        'Success',
                        'Booking Confirmed',
                        'success'
                    )
                } else if (response.status === 403) {
                    Swal.fire(
                        'Booking Failed',
                        'You already booked 2 slots this week',
                        'error'
                    )
                } else if (response.status === 208) {
                    Swal.fire(
                        'Booking Failed',
                        'Sorry, that slot is no longer available',
                        'error'
                    )
                }
            })
            .catch((error) => console.error('Error:', error))
            .finally(() => resolve(true));
    })

}

function refresh(setWeeklist) {
    fetch(`${apiDomain}/status`, {
        method: 'POST',
    })
        .then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    setWeeklist(compileWeekList(data, emptyDaySlotArray()))
                })
            } else {
                console.log(response)

            }
        })
        .catch((error) => { Swal.fire('Error', error, 'error') })
} 