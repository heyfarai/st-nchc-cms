import type { CollectionConfig } from 'payload'

export const Conferences: CollectionConfig = {
  slug: 'conferences',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'season', 'divisionCount'],
    group: 'League Management',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'season',
      type: 'relationship',
      relationTo: 'seasons',
      required: true,
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'divisionCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Auto-calculated number of divisions',
      },
    },
    {
      name: 'commissioner',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true,
}
