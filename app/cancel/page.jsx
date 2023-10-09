'use client'
import { useState, useEffect, useRef } from 'react'
import { Grid, Container, Button, Loader, Modal, Text } from '@mantine/core'
import { getDateFromSlotID, compileWeekList, emptyDaySlotArray, getDayFromSlotNo, getSlotLabel } from '../helpers'
import { apiDomain } from '../config'
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from 'react-redux'
import { closeCancelModal, openCancelModal, setWeeklist, setChosenSlotID } from './slice'
import { HomeFillIcon } from '@primer/octicons-react'
import { useRouter } from 'next/navigation'
let mailID
if (typeof window !== 'undefined') {
  mailID = window.localStorage.getItem('emailID')
}
function useInterval (callback, delay) {
  const savedCallback = useRef()
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick () {
      savedCallback.current()
    }
    tick()
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default function Page () {
  const weeklist = useSelector(state => state.cancel.weeklist)
  const dispatch = useDispatch()
  const router = useRouter()

  if (typeof window !== 'undefined') {
    if (!window.localStorage.getItem('key')) {
      router.push('/login?next=cancel')
    }
  }

  useInterval(() => {
    fetchWeeklist().then((data) => {
      dispatch(setWeeklist(data))
    })
  }, 30000)

  return (

        <div className='flex flex-col items-center h-screen'>

            {weeklist.length === 0 ? <Loader size={'lg'} /> : <div><Navbar /><CancelModal /><Week /> </div>}
        </div>

  )
}

function Week () {
  const data = useSelector(state => state.cancel.weeklist)

  return (
        <div className="flex flex-col md:flex-row">
            <div>
                {data.slice(0, 3).map((item, index) => (
                    <Day day={item.day} data={item.slots} key={index} />
                ))}
            </div>
            <div>
                {data.slice(3, 7).map((item, index) => (
                    <Day day={item.day} data={item.slots} key={index} />
                ))}
            </div>
        </div>
  )
}
function Day ({ day, data }) {
  const odd = data.filter((_, i) => i % 2 === 0)
  const even = data.filter((_, i) => i % 2 !== 0)

  return (
        <div className='block m-0.5 sm:m-1 my-2'>
            <Container className="p-1 text-neutral-700 items-center text-center rounded-lg bg-neutral-100" style={{ border: '3px solid rgb(186,186,186)' }}>
                <h3 className="text-xl text-center sm:text-2xl">{day}</h3>
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

function ButtonMod ({ item }) {
  const dispatch = useDispatch()
  const disabled = item.status !== 'booked' || item.bookedBy !== mailID

  return (
        <Button disabled={disabled} onClick={() => { dispatch(openCancelModal()); dispatch(setChosenSlotID(item.slotno)) }} size={'lg'} className={' mt-2 rounded-md block'}
            style={{
              backgroundColor: disabled ? 'rgb(128,128,128)' : 'rgba(255, 0, 0, 0.5)',
              width: '100%',
              border: disabled ? '2px solid rgb(190,190,190)' : '2px solid rgb(255, 0, 0)',
              color: disabled ? 'rgb(249,249,249)' : 'rgb(100, 0, 0)'
            }}>{item.label}</Button>
  )
}

function Navbar () {
  const router = useRouter()
  return (
        <nav className='mx-auto max-w-screen-xl px-4 py-3 rounded-b-lg p-0' style={{ border: '3px solid rgb(186,186,186)', borderTop: '0px' }}>
        <div className="flex flex-row">
        <div className="text-blue-gray-700 text-xl my-auto" style={{ fontFamily: 'Varela Round' }} >
            MJA Wash
        </div>
        <div className="ml-auto flex row-auto">
            <Button size='sm' onClick={() => router.push('/book')} className={'px-2 bg-violet-800 hover:bg-violet-900 rounded-md'}
                style={{
                  width: '100%',
                  border: '2px solid rgb(190,190,190)',
                  color: 'rgb(249,249,249)'
                }}>Book a Slot</Button>
              <Button size='sm' onClick={() => router.push('/')} className={'bg-violet-800 ml-2 hover:bg-violet-900 rounded-md'}
                style={{
                  width: '100%',
                  border: '2px solid rgb(190,190,190)',
                  color: 'rgb(249,249,249)'
                }}><HomeFillIcon fill='#F5FFFA'/></Button>
        </div>
        </div>

        <SubHeading />

    </nav>

  )
}

function CancelModal () {
  const [loading, setLoading] = useState(false)
  const opened = useSelector(state => state.cancel.bookingModalOpened)
  const chosenSlotID = useSelector(state => state.cancel.chosenSlotID)
  const dispatch = useDispatch()

  return (
        <Modal yOffset={100} closeOnClickOutside={false} opened={opened} onClose={() => { dispatch(closeCancelModal()) }} title="Cancel slot">
            <h3 className="text-xl"> {getDayFromSlotNo(chosenSlotID)}({getDateFromSlotID(chosenSlotID)}): {getSlotLabel(chosenSlotID)} </h3>
            <div className='mt-2 text-center'>
                {!loading
                  ? <Button onClick={() => {
                    setLoading(true)
                    cancelSlot(chosenSlotID).then(() => {
                      setLoading(false)
                      dispatch(closeCancelModal())
                      fetchWeeklist().then((data) => {
                        dispatch(setWeeklist(data))
                      })
                    })
                  }} className='mt-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                        style={{ border: '2px solid grey' }}>Confirm Cancellation</Button>
                  : <Loader size={'xs'} />
                }
            </div>

        </Modal >
  )
}

// return promise true when done
function cancelSlot (e) {
  return new Promise((resolve) => {
    const key = localStorage.getItem('key')
    const params = new URLSearchParams()
    const router = useRouter()
    params.append('slot', e)

    fetch(`${apiDomain}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    })
      .then((response) => {
        response.text().then((text) => {
          if (response.status === 403 && text === 'Cannot cancel now') {
            Swal.fire(
              'Cancellation Failed',
              'Slots must be cancelled at least 3 hours before the slot time',
              'error'
            )
          } else if (response.status === 200) {
            Swal.fire(
              'Success',
              'Slot cancelled successfully',
              'success'
            )
          } else if (response.status === 403) {
            Swal.fire(
              'Booking Failed',
              'Authentication failed: You are not authorised to cancel this slot',
              'error'
            )
          } else if (response.status === 401) {
            Swal.fire(
              'Booking Failed',
              'Authentication failed: Please login and try again',
              'error'
            ).then(() => {
              localStorage.removeItem('key')
              router.push('/login?next=cancel')
            }
            )
          } else {
            Swal.fire(
              'Booking Failed',
              'Unknown error occured',
              'error'
            )
          }
        })
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => resolve(true))
  })
}

function fetchWeeklist () {
  return new Promise((resolve) => {
    fetch(`${apiDomain}/status`, {
      method: 'POST'
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            resolve(compileWeekList(data, emptyDaySlotArray()))
          })
        } else if (response.status === 204) {
          resolve(compileWeekList([], emptyDaySlotArray()))
        } else {
          console.error(response)
        }
      })
      .catch((error) => { Swal.fire('Error', error, 'error'); resolve(null) })
  })
}

function SubHeading () {
  return (
        <div className='w-full m-1 mb-0 mt-2 text-xl'><Text>Pick a slot to cancel:</Text></div >
  )
}
