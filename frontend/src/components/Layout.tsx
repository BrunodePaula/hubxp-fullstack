import { Outlet } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Box component="main" sx={{ p: 3, maxWidth: 'lg', margin: '0 auto' }}>
        <Outlet /> 
      </Box>
    </>
  )
}