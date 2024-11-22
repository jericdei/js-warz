import { Hono } from 'hono'
import { db } from './database'
import { productsTable, productTypesTable } from './database/schema'

const app = new Hono()

app.get('/', (c) => c.json({ message: "Welcome to the API!" }))

app.get('/products', async (c) => {
  const products = await db.query.productsTable.findMany({
    with: {
      productType: true,
    },
  })

  return c.json({
    products,
  })
})

app.post('/products', async (c) => {
  const { productTypeId, name, description, price, quantity, image, brand } = await c.req.parseBody()

  if (!productTypeId || !name || !price || !quantity || !brand) {
    return c.json({
      error: "All fields are required",
    }, 400)
  }

  const product = await db.insert(productsTable).values({
    productTypeId: parseInt(productTypeId.toString()),
    name: name.toString(),
    description: description ? description.toString() : null,
    price: parseFloat(price.toString()),
    quantity: parseInt(quantity.toString()),
    image: image ? image.toString() : null,
    brand: brand.toString(),
  }).returning()

  return c.json({
    product,
  })
})

app.get('/product-types', async (c) => {
  const productTypes = await db.query.productTypesTable.findMany()

  return c.json({
    productTypes,
  })
})

app.post('/product-types', async (c) => {
  const { name } = await c.req.parseBody()

  if (!name) {
    return c.json({
      error: "Name is required",
    }, 400)
  }

  const productType = await db.insert(productTypesTable).values({
    name: name.toString(),
  }).returning()

  return c.json({
    productType,
  })
})

export default app
