import { createSlice } from '@reduxjs/toolkit'

const statusSlice = createSlice({
  name: 'status',
  initialState: {
    modalOpened: false,
    weeklist: [],
    chosenSlotID: 1
  },
  reducers: {
    openModal: (state) => {
      state.modalOpened = true
    },
    closeModal: (state) => {
      state.modalOpened = false
    },
    setWeeklist: (state, action) => {
      state.weeklist = action.payload
    },
    setChosenSlotID: (state, action) => {
      state.chosenSlotID = action.payload
    }
  }
})

export const { openModal, closeModal, setWeeklist, setChosenSlotID } = statusSlice.actions

export default statusSlice.reducer
