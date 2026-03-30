import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default("FlipFactory Editorial Team"),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    aiDisclosure: z.boolean().default(true),
    faq: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })).default([]),
  }),
});

export const collections = { blog };
