import type { CollectionConfig } from 'payload'
import { validateMinLength } from '../utils/validation'

export const Seasons: CollectionConfig = {
  slug: 'seasons',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'year', 'status', 'isActive'],
    group: 'League Management',
    description: 'Manage sports seasons and their configurations',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      validate: validateMinLength(3),
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Regular Season', value: 'regular' },
        { label: 'Summer League', value: 'summer' },
        { label: 'Tournament', value: 'tournament' },
        { label: 'Preseason', value: 'preseason' },
      ],
    },
    {
      name: 'year',
      type: 'number',
      required: true,
      min: 2020,
      max: 2035,
      validate: (val: number | null | undefined): true | string => {
        const currentYear = new Date().getFullYear()
        if (val && (val < currentYear - 5 || val > currentYear + 10)) {
          return 'Year must be within reasonable range'
        }
        return true
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
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
      admin: {
        description: 'Last date for team registration',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Only one season should be active at a time',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Planning', value: 'planning' },
        { label: 'Registration Open', value: 'registration' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'planning',
    },
    {
      name: 'maxTeamsPerDivision',
      type: 'number',
      min: 4,
      max: 20,
      defaultValue: 12,
    },
    {
      name: 'gameFormat',
      type: 'group',
      fields: [
        {
          name: 'periodLength',
          type: 'number',
          label: 'Period Length (minutes)',
          defaultValue: 12,
        },
        {
          name: 'numberOfPeriods',
          type: 'number',
          defaultValue: 4,
        },
        {
          name: 'overtimeLength',
          type: 'number',
          label: 'Overtime Length (minutes)',
          defaultValue: 5,
        },
      ],
    },
    {
      name: 'locations',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: true,
      admin: {
        description: 'Available venues for this season',
      },
    },
    {
      name: 'officials',
      type: 'relationship',
      relationTo: 'officials',
      hasMany: true,
    },
    {
      name: 'rules',
      type: 'richText',
      admin: {
        description: 'Season-specific rules and regulations',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Ensure only one active season at a time
        if (data.isActive && operation === 'create') {
          await req.payload.update({
            collection: 'seasons',
            where: { isActive: { equals: true } },
            data: { isActive: false },
          })
        }
        return data
      },
    ],
  },
  timestamps: true,
}
