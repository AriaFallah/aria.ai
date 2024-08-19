import { defineCollection, z } from 'astro:content';

export const collections = {
  blog: defineCollection({
    type: 'content',
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        cover: image().optional(),
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
