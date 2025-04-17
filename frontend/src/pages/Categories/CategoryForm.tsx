import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { api } from '../../services/api'
import { Category } from '../../types'

interface CategoryFormProps {
  open: boolean
  onClose: () => void
  category: Category | null
  refresh: () => void
}

const validationSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
})

export default function CategoryForm({ open, onClose, category, refresh }: CategoryFormProps) {
  const formik = useFormik({
    initialValues: {
      name: category?.name || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (category) {
          await api.put(`/categories/${category._id}`, values)
        } else {
          await api.post('/categories', values)
        }
        refresh()
        onClose()
      } catch (error) {
        console.error('Error saving category:', error)
      }
    }
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Nome"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => formik.handleSubmit()} variant="contained" color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
