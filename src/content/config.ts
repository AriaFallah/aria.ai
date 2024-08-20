import { defineCollection, z } from 'astro:content';

export const collections = {
  blog: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      cover: z.string().optional(),
    }),
  }),
  thoughts: defineCollection({
    type: 'content',
    schema: z.object({
      date: z.coerce.date(),
      timezone: z.string(),
    }),
  }),
};
