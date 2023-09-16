'use client';
import { useState, useEffect, useRef } from 'react';
import { Grid, Container, TextInput, Text, Button, Loader } from '@mantine/core';
import { emptyDaySlotArray } from './helpers';

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
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

export default function Page() {
    const [weeklist, setWeeklist] = useState([])

    const params = new URLSearchParams();
    useInterval(() => {
        fetch('https://notaproton.github.io/status', {
            method: 'POST',
        })
            .then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        setData(data)
                    })
                } else {
                    console.log(response)

                }
            })
            .catch((error) => console.error('Error:', error))
            .finally(() => {
                setWeeklist(emptyDaySlotArray())
            });
    }, 5000);

    return (
        <div className='flex flex-col items-center h-screen'>

            {weeklist.length === 0 ? <Loader size={'xs'} /> : <div><StatusWidget /> <Week data={weeklist} /> </div>}
        </div>
    )
}

function Week({ data, setWeeklist }) {
    return (
        <div className="flex flex-col md:flex-row">
            <div>
                {data.slice(0, 3).map((item, index) => (
                    <Day day={item.day} data={item.slots} key={index} />
                ))}
            </div>
            <div>
                {data.slice(3, 6).map((item, index) => (
                    <Day day={item.day} data={item.slots} key={index} />
                ))}
            </div>



        </div>
    )
}
function Day({ day, data }) {
    const odd = data.filter((_, i) => i % 2 === 0);
    const even = data.filter((_, i) => i % 2 !== 0);

    return (
        <div className='block m-0.5 sm:m-1 my-2'>
            <Container className="p-1 text-neutral-700 items-center text-center rounded-lg bg-neutral-100" style={{ border: '3px solid rgb(186,186,186)' }}>
                <h3 className="text-xl text-center sm:text-2xl"> {day} </h3>
                <Grid columns={8}>
                    <Grid.Col span={4} >
                        {odd.map((item, index) => (
                            <ButtonMod item={item} key={index} />
                        ))}
                    </Grid.Col>
                    <Grid.Col span={4}>
                        {even.map((item, index) => (
                            <ButtonMod item={item} key={index} />
                        ))}
                    </Grid.Col>
                </Grid>
            </Container>
        </div >
    )
}

function ButtonMod({ item }) {
    return (
        <Button disabled={true} size={'lg'} className={'block mt-2 rounded-md'}
            style={{
                backgroundColor: item.status === 'booked' ? 'rgb(128,128,128)' : 'rgba(12, 156, 94, 0.5)',
                width: '100%',
                border: item.status === 'booked' ? '2px solid rgb(190,190,190)' : '2px solid rgb(9, 121, 105)',
                color: item.status === 'booked' ? "rgb(249,249,249)" : "rgb(0,53,0)",
            }}>{item.label}</Button>
    )
}

function StatusWidget({ currentItem, nextItem }) {
    return (
        <div className='flex'>
            <Container className='w-2/3 inline mr-0 rounded-l-lg' style={{ border: '3px solid rgb(186,186,186)', borderRight: '1.5px solid rgb(186,186,186)' }}>
                <h3 className='text-xl sm:text-2xl'> Now: </h3>

            </Container>
            <Container className='ml-0 w-1/3 inline px-px rounded-r-lg' style={{ border: '3px solid rgb(186,186,186)', borderLeft: '1.5px solid rgb(186,186,186)' }}>
                <h3 className=' text-xl sm:text-2xl' > Up next: </h3>
            </Container>
        </div >
    )
}