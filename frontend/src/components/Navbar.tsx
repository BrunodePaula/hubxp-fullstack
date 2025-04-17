// src/components/Navbar.tsx
import { AppBar, Toolbar, Typography, Button } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ 
      marginBottom: 3,
      backgroundColor: (theme) => theme.palette.primary.main,
      boxShadow: 'none'
    }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          HubXP
        </Typography>
        <Button 
          color="inherit" 
          component={Link} 
          to="/"
          sx={{ 
            bgcolor: (theme) => location.pathname === "/" ? 
              theme.palette.action.selected : 'transparent'
          }}
        >
          Dashboard
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/products"
          sx={{ 
            bgcolor: (theme) => location.pathname === "/products" ? 
              theme.palette.action.selected : 'transparent'
          }}
        >
          Produtos
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/categories"
          sx={{ 
            bgcolor: (theme) => location.pathname === "/categories" ? 
              theme.palette.action.selected : 'transparent'
          }}
        >
          Categorias
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/orders"
          sx={{ 
            bgcolor: (theme) => location.pathname === "/orders" ? 
              theme.palette.action.selected : 'transparent'
          }}
        >
          Pedidos
        </Button>
      </Toolbar>
    </AppBar>
  )
}