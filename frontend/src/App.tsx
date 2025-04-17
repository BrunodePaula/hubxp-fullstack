import { RouterProvider } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { router } from './routes'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <RouterProvider router={router} />
    </LocalizationProvider>
    </>
  )
}

export default App