import type { CollectionConfig } from 'payload'

export const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'season', 'startDate', 'isActive'],
    group: 'Scheduling',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Regular Season', value: 'regular' },
        { label: 'Playoffs', value: 'playoffs' },
        { label: 'Championship', value: 'championship' },
        { label: 'Tournament', value: 'tournament' },
        { label: 'Preseason', value: 'preseason' },
        { label: 'All-Star', value: 'allstar' },
      ],
    },
    {
      name: 'season',
      type: 'relationship',
      relationTo: 'seasons',
      required: true,
      index: true,
    },
    {
      name: 'divisions',
      type: 'relationship',
      relationTo: 'divisions',
      hasMany: true,
      admin: {
        description: 'Which divisions participate in this session',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      required: true,
      validate: (val: Date | null | undefined, { data }: { data: { startDate?: Date } }): true | string => {
        if (val && data.startDate && val <= data.startDate) {
          return 'End date must be after start date'
        }
        return true
      },
    },
    {
      name: 'registrationDeadline',
      type: 'date',
    },
    {
      name: 'format',
      type: 'group',
      fields: [
        {
          name: 'roundRobin',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'singleElimination',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'doubleElimination',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
  timestamps: true,
}
