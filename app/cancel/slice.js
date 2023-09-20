import { createSlice } from '@reduxjs/toolkit'

const cancelSlice = createSlice({
  name: 'cancel',
  initialState: {
    cacnelModalOpened: false,
    weeklist: [],
    chosenSlotID: 0
  },
  reducers: {
    openCancelModal: (state) => {
      state.bookingModalOpened = true
    },
    closeCancelModal: (state) => {
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

export const { openCancelModal, closeCancelModal, setWeeklist, setChosenSlotID } = cancelSlice.actions

export default cancelSlice.reducer
