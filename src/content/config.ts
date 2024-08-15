import { defineCollection, z } from 'astro:content';

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
});

const thoughtSchema = z.object({
  date: z.coerce.date(),
});

export const collections = {
  blog: defineCollection({
    type: 'content',
    schema: blogSchema,
  }),
  thoughts: defineCollection({
    type: 'content',
    schema: thoughtSchema,
  }),
};
