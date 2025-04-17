import type { Meta, StoryObj } from '@storybook/react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box } from '@mui/material'

const meta: Meta<typeof DataGrid> = {
  title: 'Components/DataTable',
  component: DataGrid,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof DataGrid>

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Nome', width: 150 },
  { field: 'price', headerName: 'Preço', type: 'number', width: 110 },
]

const rows = [
  { id: 1, name: 'Produto A', price: 100 },
  { id: 2, name: 'Produto B', price: 200 },
  { id: 3, name: 'Produto C', price: 300 },
]

export const Primary: Story = {
  render: () => (
    <Box sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  ),
}