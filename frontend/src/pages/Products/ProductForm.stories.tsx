import type { Meta, StoryObj } from '@storybook/react'
import ProductForm from './ProductForm'

const meta: Meta<typeof ProductForm> = {
  title: 'Product/ProductForm',
  component: ProductForm,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProductForm>

export const Default: Story = {
  args: {
    open: true,
    onClose: () => console.log('Fechar'),
    product: null,
    refresh: () => console.log('Atualizar')
  }
}

export const EditandoProduto: Story = {
  args: {
    open: true,
    onClose: () => console.log('Fechar'),
    refresh: () => console.log('Atualizar'),
    product: {
      _id: '1',
      name: 'Produto Teste',
      price: 49.99,
      description: 'Descrição do produto',
      categoryIds: ['123'],
      imageUrl: 'https://via.placeholder.com/150',
    }
  }
}
