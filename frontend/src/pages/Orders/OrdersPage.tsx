import { useState, useEffect } from 'react';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { Button, Container, Box, Typography, Alert } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { api } from '../../services/api';
import OrderForm from './OrderForm';
import { Order } from '../../types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Order[]>('/orders');
      const normalized = data.map(order => ({
        ...order,
        id: order._id
      }));
      setOrders(normalized);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/orders/${id}`);
      fetchOrders();
    } catch (err) {
      setError('Error deleting order:' + err);
    }
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Data',
      width: 150,
      renderCell: (params: GridCellParams) => {
        const date = new Date(params.row.date);
        return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString('pt-BR');
      }
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 130,
      renderCell: (params: GridCellParams) => {
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(Number(params.row.total) || 0);
      }
    },
    {
      field: 'products',
      headerName: 'Produtos',
      flex: 1,
      renderCell: (params: GridCellParams) => `${params.row.productIds.length} produto(s)`
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params: GridCellParams) => (
        <>
          <Button onClick={() => {
            setSelectedOrder(params.row);
            setOpenForm(true);
          }}>
            <Edit />
          </Button>
          <Button onClick={() => handleDelete(params.row.id)} color="error">
            <Delete />
          </Button>
        </>
      )
    }
  ];
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Pedidos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedOrder(null);
            setOpenForm(true);
          }}
        >
          Novo Pedido
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          getRowId={(row) => row._id}
        />
      </Box>

      <OrderForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedOrder(null);
        }}
        refresh={fetchOrders}
        order={selectedOrder}
      />
    </Container>
  );
}
