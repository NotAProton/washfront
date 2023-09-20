import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './book/slice'
import statusReducer from './status/slice'
import cancelReducer from './cancel/slice'

export default configureStore({
  reducer: {
    main: mainReducer,
    status: statusReducer,
    cancel: cancelReducer
  }
})
