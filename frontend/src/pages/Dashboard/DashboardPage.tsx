import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Alert,
} from '@mui/material'
import { api } from '../../services/api'
import { Metrics } from '../../types'
import dayjs from 'dayjs'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    avgOrderValue: 0,
    totalRevenue: 0,
  })

  const [filters, setFilters] = useState({
    start: '',
    end: '',
    groupBy: 'day',
    productId: '',
    categoryId: '',
  })

  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  useEffect(() => {
    const fetchMetrics = async () => {
      if (
        filters.start &&
        filters.end &&
        dayjs(filters.start).isAfter(dayjs(filters.end))
      ) {
        setError('The start date cannot be greater than the end date.')
        return
      }

      setError('')

      try {
        const cleanedFilters: Record<string, string> = {}
        Object.entries(filters).forEach(([key, value]) => {
          if (value) cleanedFilters[key] = value
        })

        const { data } = await api.get('/dashboard', {
          params: cleanedFilters,
        })

        const totalOrders = data.reduce((sum: number, d: Metrics) => sum + d.totalOrders, 0)
        const totalRevenue = data.reduce((sum: number, d: Metrics) => sum + d.totalRevenue, 0)
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

        setMetrics({
          totalOrders,
          totalRevenue,
          avgOrderValue,
        })
      } catch (error) {
        console.error('Error fetching metrics:', error)
      }
    }

    fetchMetrics()
  }, [filters])

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard de KPIs
      </Typography>

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Data Inicial"
          type="date"
          name="start"
          value={filters.start}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Data Final"
          type="date"
          name="end"
          value={filters.end}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Agrupar por"
          name="groupBy"
          value={filters.groupBy}
          onChange={handleChange}
        >
          <MenuItem value="day">Diário</MenuItem>
          <MenuItem value="week">Semanal</MenuItem>
          <MenuItem value="month">Mensal</MenuItem>
        </TextField>
        <TextField
          label="Product ID"
          name="productId"
          value={filters.productId}
          onChange={handleChange}
        />
        <TextField
          label="Category ID"
          name="categoryId"
          value={filters.categoryId}
          onChange={handleChange}
        />
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" gap={2} flexWrap="wrap">
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">Total de Pedidos</Typography>
            <Typography variant="h4">{metrics.totalOrders}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">Valor Médio por Pedido</Typography>
            <Typography variant="h4">
              R$ {metrics.avgOrderValue.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant="h6">Receita Total</Typography>
            <Typography variant="h4">
              R$ {metrics.totalRevenue.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
