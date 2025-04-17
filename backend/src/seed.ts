import { Test } from '@nestjs/testing';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';

import {
  Category,
  CategorySchema,
} from './categories/entities/category.entity';
import { Product, ProductSchema } from './products/entities/product.entity';
import { Order, OrderSchema } from './orders/entities/order.entity';

async function bootstrap() {
  const moduleRef = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(`${process.env.MONGO_URI}`),
      MongooseModule.forFeature([
        { name: Category.name, schema: CategorySchema },
        { name: Product.name, schema: ProductSchema },
        { name: Order.name, schema: OrderSchema },
      ]),
    ],
  }).compile();

  const categoryModel = moduleRef.get<Model<Category>>(
    getModelToken(Category.name),
  );
  const productModel = moduleRef.get<Model<Product>>(
    getModelToken(Product.name),
  );
  const orderModel = moduleRef.get<Model<Order>>(getModelToken(Order.name));

  const categoryCount = await categoryModel.countDocuments();
  const productCount = await productModel.countDocuments();
  const orderCount = await orderModel.countDocuments();

  if (categoryCount === 0 && productCount === 0 && orderCount === 0) {
    await categoryModel.deleteMany({});
    await productModel.deleteMany({});
    await orderModel.deleteMany({});

    const categories = await categoryModel.insertMany(
      Array.from({ length: 5 }, () => ({
        name: faker.commerce.department(),
      })),
    );

    const products = await productModel.insertMany(
      Array.from({ length: 20 }, () => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        categoryIds: faker.helpers
          .arrayElements(categories, faker.number.int({ min: 1, max: 3 }))
          .map((cat) => cat._id),
        imageUrl: faker.image.urlLoremFlickr({ category: 'product' }),
      })),
    );

    await orderModel.insertMany(
      Array.from({ length: 15 }, () => {
        const selectedProducts = faker.helpers.arrayElements(
          products,
          faker.number.int({ min: 1, max: 5 }),
        );
        return {
          productIds: selectedProducts.map((p) => p._id),
          total: selectedProducts.reduce((sum, p) => sum + p.price, 0),
          date: faker.date.recent({ days: 30 }),
        };
      }),
    );

    console.log('Data populated successfully!');
  } else {
    console.log('Database already has data. Seed will not be executed.');
  }

  await moduleRef.close();
}

bootstrap().catch((err) => {
  console.error('Error when populating data:', err);
  process.exit(1);
});
