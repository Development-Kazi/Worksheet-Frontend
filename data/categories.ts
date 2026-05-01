export type Category = {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  children?: Category[];
  pdfs?: {
    title: string;
    file?: string;
  }[];
};

export const categories: Category[] = [
  {
    name: "Mathematics",
    slug: "mathematics",
    description: "Learn numbers and basic math concepts",
    children: [
      {
        name: "Addition",
        slug: "addition",
        children: [
          {
            name: "1 to 100",
            slug: "1-100",
            pdfs: [
              { title: "Addition Worksheet 1" },
              { title: "Addition Worksheet 2" },
              { title: "Addition Worksheet 3" },
            ],
          },
          {
            name: "100 to 500",
            slug: "100-500",
            pdfs: [
              { title: "Addition Practice 1" },
              { title: "Addition Practice 2" },
            ],
          },
        ],
      },
      {
        name: "Subtraction",
        slug: "subtraction",
        children: [
          {
            name: "Basic Subtraction",
            slug: "basic",
            pdfs: [
              { title: "Subtraction Worksheet 1" },
              { title: "Subtraction Worksheet 2" },
            ],
          },
        ],
      },
    ],
  },

  {
    name: "English",
    slug: "english",
    description: "Improve reading and grammar skills",
    children: [
      {
        name: "Grammar",
        slug: "grammar",
        children: [
          {
            name: "Articles",
            slug: "articles",
            pdfs: [
              { title: "A, An, The Worksheet" },
              { title: "Articles Practice" },
            ],
          },
        ],
      },
      {
        name: "Phonics",
        slug: "phonics",
        children: [
          {
            name: "Rhyming Words",
            slug: "rhyming",
            pdfs: [
              { title: "Rhyming Worksheet 1" },
              { title: "Rhyming Worksheet 2" },
            ],
          },
        ],
      },
    ],
  },

  {
    name: "General Awareness",
    slug: "general-awareness",
    description: "Learn about the world around you",
    children: [
      {
        name: "Days & Months",
        slug: "days-months",
        children: [
          {
            name: "Days of Week",
            slug: "days",
            pdfs: [
              { title: "Days Worksheet 1" },
              { title: "Days Worksheet 2" },
            ],
          },
        ],
      },
    ],
  },
];