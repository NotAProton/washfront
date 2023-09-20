'use client'
import { useEffect, useRef } from 'react'
import { Grid, Container, Text, Button, Loader, Modal } from '@mantine/core'
import { compileWeekList, emptyDaySlotArray, formatName, getCurrentSlotInfo, getDateFromSlotID, getSlotInfo } from '../helpers'
import { apiDomain } from '../config'
import Swal from 'sweetalert2'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal, openModal, setWeeklist, setChosenSlotID } from './slice'

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
  const weeklist = useSelector(state => state.status.weeklist)
  const dispatch = useDispatch()

  useInterval(() => {
    fetch(`${apiDomain}/status`, {
      method: 'POST'
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            dispatch(setWeeklist(compileWeekList(data, emptyDaySlotArray())))
          })
        } else if (response.status === 204) {
          dispatch(setWeeklist(compileWeekList([], emptyDaySlotArray())))
        }
      })
      .catch((error) => { Swal.fire('Error', error, 'error') })
  }, 30000)

  return (
        <div className='flex flex-col items-center h-screen'>

            {weeklist.length === 0
              ? <Loader size={'lg'} className='mt-3' />
              : <div><SlotModal /><Navbar /><StatusWidget data={weeklist} /> <Week data={weeklist} /> <div className='mt-2 inset-x-0 bottom-0 text-center'>Built and Maintained by Akshat</div>
            </div>}
        </div>
  )
}

function Week ({ data }) {
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

function ButtonMod ({ item }) {
  const dispatch = useDispatch()
  return (
        <Button disabled={item.status !== 'booked'} size={'lg'} className={'block mt-2 rounded-md'}
            style={{
              backgroundColor: item.status === 'booked' ? 'rgb(128,128,128)' : 'rgba(12, 156, 94, 0.5)',
              width: '100%',
              border: item.status === 'booked' ? '2px solid rgb(190,190,190)' : '2px solid rgb(9, 121, 105)',
              color: item.status === 'booked' ? 'rgb(249,249,249)' : 'rgb(0,53,0)'
            }}
            onClick={() => { dispatch(openModal()); dispatch(setChosenSlotID(item.slotno)) }}
            >{item.label}</Button>
  )
}

function StatusWidget ({ data }) {
  let [currentSlot, nextSlot] = getCurrentSlotInfo(data[0].slots)
  console.log(nextSlot)

  if (nextSlot === null) {
    nextSlot = data[1].slots[0]
  }
  return (
        <div className='flex mb-2 mt-1'>
            <Container className='w-2/3 inline mr-0 rounded-l-lg' style={{ border: '3px solid rgb(186,186,186)', borderRight: '1.5px solid rgb(186,186,186)' }}>
                <h3 className='text-xl sm:text-2xl'> Now: {(currentSlot && currentSlot.status === 'booked') ? <><span className='text-red-700 font-medium'>Reserved <br /></span> <span className='text-lg'>{formatName(currentSlot.bookedBy)} </span></> : 'Unreserved'} </h3>
                <Text>{currentSlot ? currentSlot.label : 'General'}</Text>
            </Container>
            <Container className='ml-0 w-1/3 inline px-px rounded-r-lg' style={{ border: '3px solid rgb(186,186,186)', borderLeft: '1.5px solid rgb(186,186,186)' }}>
                <h3 className=' text-xl sm:text-xl' > Up next: {(nextSlot.status === 'booked') ? <><span className='text-red-700 font-medium'>Reserved</span> <span className='text-lg'> {formatName(nextSlot.bookedBy)} </span> </> : 'Unreserved'} </h3>
                <Text>{nextSlot.label}</Text>
            </Container>
        </div >
  )
}

function Navbar () {
  return (
        <nav className='flex mx-auto max-w-screen-xl px-4 py-3 rounded-b-lg p-0 align-middle' style={{ border: '3px solid rgb(186,186,186)', borderTop: '0px' }}>
            <div className="text-blue-gray-900 text-4xl my-auto" >
                MJA Wash
            </div>
            <div className="ml-auto">
                <Button size='xl' onClick={handleBookNowCLick} className={'bg-violet-800 hover:bg-violet-900 block rounded-md'}
                    style={{
                      width: '100%',
                      border: '2px solid rgb(190,190,190)',
                      color: 'rgb(249,249,249)'
                    }}>Book a Slot</Button>
            </div>

        </nav>
  )
}

function handleBookNowCLick () {
  // Redirect to /book
  window.location.href = '/book'
}

function SlotModal () {
  const weeklist = useSelector(state => state.status.weeklist)
  const slotno = useSelector(state => state.status.chosenSlotID)
  const opened = useSelector(state => state.status.modalOpened)
  const dispatch = useDispatch()
  const slot = getSlotInfo(slotno, weeklist)
  return (
    <Modal centered={true} opened={opened} onClose={() => dispatch(closeModal())} title={<>{slot.label} ({getDateFromSlotID(slotno)})</>}>
      {slot.status === 'booked'
        ? <><span className='text-red-700 font-medium'>Reserved <br /></span> <span className='text-lg'>{formatName(slot.bookedBy)} </span></>
        : 'Unreserved'}</Modal>
  )
}
