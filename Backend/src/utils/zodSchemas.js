import { z } from 'zod';
export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be a positive number"),
    seller: z.string().optional(),
    image: z.array(z.string()).optional(),
    category: z.enum([
        'Electronics',
        'Fashion',
        'Collectibles and art',
        'Beauty',
        'Services',
        'Other'
    ]).optional(),
    stock: z.object({
        available: z.number().min(0, "Available stock must be a non-negative number"),
        sold: z.number().min(0, "Sold items must be a non-negative number").default(0),
        soldAt: z.array(z.date()).optional()
    }),
    promoCode: z.object({
        code: z.string().optional(),
        numberOfUses: z.number().min(0, "Number of uses must be a non-negative number").optional(),
    }).optional(),
    rating: z.number().min(0, "Rating must be a non-negative number").max(5, "Rating cannot be greater than 5").default(0),
    reviews: z.array(z.object({
        buyer: z.string().optional(),
        review: z.string().optional(),
        rating: z.number().min(0).max(5).optional()
    })).optional(),
    orders: z.array(z.string()).optional(),
    boughtBy: z.array(z.string()).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});

