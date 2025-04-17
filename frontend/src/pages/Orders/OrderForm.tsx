import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Chip,
  Box,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { api } from '../../services/api';
import { Product, Order } from '../../types';
import dayjs, { Dayjs } from 'dayjs';

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
  order?: Order | null;
}

interface FormValues {
  date: Dayjs | null;
  productIds: string[];
  total: number;
}

const validationSchema = yup.object({
  date: yup.date().required('Date is mandatory'),
  productIds: yup.array().min(1, 'Select at least one product')
});

export default function OrderForm({ open, onClose, refresh, order }: OrderFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        const productsWithId = data.map((prod: Product) => ({ ...prod, id: prod._id }));
        setProducts(productsWithId);
      } catch (err) {
        setError('Failed to load products' + err);
      }
    };
  
    if (open) fetchProducts();
  }, [open]);
  
  useEffect(() => {
    if (order && products.length > 0) {
    
      const selected = products.filter((p: Product) =>
        (order.productIds as { _id: string }[]).some((prod) => prod._id === p._id)
      );
      setSelectedProducts(selected);
    } else if (!order) {
      setSelectedProducts([]);
    }
  }, [order, products]);



  const formik = useFormik<FormValues>({
    initialValues: {
      date: order ? dayjs(order.date) : dayjs(),
      productIds: order 
      ? order.productIds.map(p => typeof p === 'string' ? p : p._id) 
      : [],
      total: order ? order.total : 0
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const payload = {
          date: values.date?.toISOString(),
          productIds: selectedProducts.map(p => p._id),
          total: selectedProducts.reduce((sum, p) => sum + p.price, 0)
        };

        if (order) {
          await api.put(`/orders/${order._id}`, payload);
        } else {
          await api.post('/orders', payload);
        }

        refresh();
        onClose();
      } catch (err) {
        setError('Error saving order' + err);
      } finally {
        setLoading(false);
      }
    }
  });

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const total = selectedProducts.reduce((sum: number, product: Product) => sum + product.price, 0);
      formik.setFieldValue('total', total);
      formik.setFieldValue('productIds', selectedProducts.map((p: Product) => p._id));
    } else {
      formik.setFieldValue('total', 0);
      formik.setFieldValue('productIds', []);
    }
  }, [selectedProducts]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{order ? 'Editar Pedido' : 'Novo Pedido'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <DatePicker
            label="Data do Pedido"
            value={formik.values.date}
            onChange={(date) => {
              if (date && dayjs(date).isValid()) {
                formik.setFieldValue('date', date);
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                error: formik.touched.date && Boolean(formik.errors.date),
                helperText: formik.touched.date && formik.errors.date
              }
            }}
          />

          <Autocomplete
            multiple
            options={products}
            getOptionLabel={(option) => `${option.name} - ${new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(option.price)}`}
            value={selectedProducts}
            onChange={(_, newValue) => setSelectedProducts(newValue)}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Produtos"
                margin="normal"
                fullWidth
                error={formik.touched.productIds && Boolean(formik.errors.productIds)}
                helperText={formik.touched.productIds && formik.errors.productIds}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option._id}
                  label={option.name}
                />
              ))
            }
          />

          <Box mt={2}>
            <Typography variant="h6">
              Total: {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(formik.values.total)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Salvando...' : 'Salvar Pedido'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
