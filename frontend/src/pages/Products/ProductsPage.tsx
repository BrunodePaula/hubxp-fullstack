import { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Container, Box, Typography } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import {api} from '../../services/api'
import ProductForm from './ProductForm'
import { Category, Product } from '../../types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const fetchProducts = async () => {
    const { data } = await api.get('/products')
    setProducts(data.map((prod: Product) => ({ ...prod, id: prod._id })))
  }

  useEffect(() => { fetchProducts() }, [])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'price', headerName: 'Preço', type: 'number', width: 120 },
    { field: 'description', headerName: 'Descrição', flex: 2 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            onClick={async () => {
              try {
                const { data } = await api.get(`/products/${params.row.id}`)
                setSelectedProduct({
                  ...data,
                  id: data._id,
                  categoryIds: Array.isArray(data.categoryIds)
                    ? data.categoryIds.map((cat: Category) =>
                        typeof cat === 'string' ? cat : cat._id
                      )
                    : []
                })
                setOpenForm(true)
              } catch (error) {
                console.error('Error searching for product for editing:', error)
              }
            }}
          >
            <Edit />
          </Button>
          <Button onClick={() => handleDelete(params.row.id)} color="error">
            <Delete />
          </Button>
        </>
      )
    }
  ]

  const handleDelete = async (id: string) => {
    await api.delete(`/products/${id}`)
    fetchProducts()
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Produtos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedProduct(null)
            setOpenForm(true)
          }}
        >
          Novo Produto
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>

      <ProductForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        product={selectedProduct}
        refresh={fetchProducts}
      />
    </Container>
  )
}