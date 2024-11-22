import { relations } from "drizzle-orm";
import { doublePrecision, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const productTypesTable = pgTable("product_types", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  productTypeId: integer("product_type_id").references(() => productTypesTable.id).notNull(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  price: doublePrecision().notNull(),
  quantity: integer().notNull(),
  image: varchar({ length: 255 }),
  brand: varchar({ length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productsTableRelations = relations(productsTable, ({ one }) => ({
  productType: one(productTypesTable, {
    fields: [productsTable.productTypeId],
    references: [productTypesTable.id]
  })
}))
