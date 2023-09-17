import { createSlice, configureStore } from '@reduxjs/toolkit'

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        bookingModalOpened: false,
        weeklist: [],
        chosenSlotID: 0,
    },
    reducers: {
        openBookingModal: (state) => {
            state.bookingModalOpened = true
        },
        closeBookingModal: (state) => {
            state.bookingModalOpened = false
        },
        setWeeklist: (state, action) => {
            state.weeklist = action.payload
        },
        setChosenSlotID: (state, action) => {
            state.chosenSlotID = action.payload
        }
    }
})

export const { openBookingModal, closeBookingModal, setWeeklist, setChosenSlotID } = mainSlice.actions

export default mainSlice.reducer

