import type { Meta, StoryObj } from '@storybook/react'
import ProductsPage from './ProductsPage'

const meta: Meta<typeof ProductsPage> = {
  title: 'Product/ProductsPage',
  component: ProductsPage,
  tags: ['autodocs'],
}
export default meta

type Story = StoryObj<typeof ProductsPage>

export const Default: Story = {}
