import { z } from 'zod';
export const productSchema = z.object({
    name: z.string().nonempty(),
    description: z.string().optional(),
    price: z.number().positive(),
    vendor: z.string().optional(),
    category: z.string().optional(), // add enum later
    stock: z.number().int().nonnegative().default(0),
    rating: z.number().min(0).max(5).default(0),
    reviews: z.array(z.object({
        user: z.string(),
        review: z.string().optional(),
        rating: z.number().min(0).max(5)
    })).optional(),
    orders: z.array(z.string()).optional(),
    boughtBy: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional()
});
