import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Stack,
  MenuItem,
  Box,
  CircularProgress
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import {api} from '../../services/api'
import { Product, Category } from '../../types'

interface ProductFormProps {
  open: boolean
  onClose: () => void
  product: Product | null
  refresh: () => void
}

const validationSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  price: yup.number().required('Preço é obrigatório').positive(),
  description: yup.string().required('Descrição é obrigatória'),
  categoryIds: yup.array().of(yup.string()).min(1, 'Selecione ao menos uma categoria'),
  imageUrl: yup.string().optional(),
})


export default function ProductForm({ open, onClose, product, refresh }: ProductFormProps) {
  const [image, setImage] = useState<File | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  // Carrega as categorias disponíveis
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await api.get('/categories')
        setCategories(data.map((cat: Category) => ({ ...cat, id: cat._id })))
      } catch (error) {
        console.error('Failed to load categories', error)
      }
    }
    if (open && !product) {
      setImage(null)
      formik.resetForm()
    }
    loadCategories()
  }, [open, product])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: product?.name || '',
      price: product?.price || 0,
      description: product?.description || '',
      categoryIds: product?.categoryIds || [],
      imageUrl: product?.imageUrl || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        const formData = new FormData()
    
        formData.append('name', values.name)
        formData.append('price', String(values.price))
        formData.append('description', values.description)
        values.categoryIds.forEach(id => {
          formData.append('categoryIds[]', id)
        })
        
        if (image) {
          formData.append('file', image)
        }
    
        if (!image && values.imageUrl) {
          formData.append('imageUrl', values.imageUrl)
        }
    
        if (product) {
          await api.put(`/products/${product._id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        } else {
          await api.post('/products', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        }
    
        refresh()
        onClose()
      } catch (error) {
        console.error('Error saving product:', error)
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{product ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
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
            
            <TextField
              name="price"
              label="Preço"
              type="number"
              fullWidth
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              InputProps={{
                startAdornment: 'R$ '
              }}
            />
            
            <TextField
              name="description"
              label="Descrição"
              multiline
              rows={4}
              fullWidth
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            
            <TextField
              select
              SelectProps={{
                multiple: true,
                value: formik.values.categoryIds,
                onChange: (e) =>
                  formik.setFieldValue('categoryIds', e.target.value),
              }}
              name="categoryIds"
              label="Categorias"
              fullWidth
              error={formik.touched.categoryIds && Boolean(formik.errors.categoryIds)}
              helperText={formik.touched.categoryIds && formik.errors.categoryIds}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>

            
            <Box>
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0])
                  }
                }}
              />
              <label htmlFor="image-upload">
                <Button variant="outlined" component="span">
                  Upload de Imagem
                </Button>
              </label>
              {image && <Box mt={1}>Arquivo selecionado: {image.name}</Box>}
            </Box>
            
            {image ? (
              <Box mt={2}>
                <img 
                  src={URL.createObjectURL(image)} 
                  alt="Preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    marginTop: 8,
                    borderRadius: 4
                  }} 
                />
              </Box>
            ) : formik.values.imageUrl && (
              <Box mt={2}>
                <img 
                  src={formik.values.imageUrl} 
                  alt="Preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: 200,
                    marginTop: 8,
                    borderRadius: 4
                  }} 
                />
              </Box>
            )}

          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={() => formik.handleSubmit()} 
          variant="contained" 
          color="primary"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}