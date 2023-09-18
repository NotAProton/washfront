import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './book/slice'
import statusReducer from './status/slice'

export default configureStore({
  reducer: {
    main: mainReducer,
    status: statusReducer
  }
})
