import { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Button, Container, Box, Typography } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { api } from '../../services/api'
import CategoryForm from './CategoryForm'
import { Category } from '../../types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [openForm, setOpenForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const fetchCategories = async () => {
    const { data } = await api.get('/categories')
    setCategories(data.map((cat: Category) => ({ ...cat, id: cat._id })))
  }

  useEffect(() => { fetchCategories() }, [])

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => {
            setSelectedCategory(params.row)
            setOpenForm(true)
          }}>
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
    await api.delete(`/categories/${id}`)
    fetchCategories()
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Categorias</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedCategory(null)
            setOpenForm(true)
          }}
        >
          Nova Categoria
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={categories}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
        />
      </Box>

      <CategoryForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        category={selectedCategory}
        refresh={fetchCategories}
      />
    </Container>
  )
}
