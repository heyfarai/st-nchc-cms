import type { CollectionConfig } from 'payload'
import { 
  validateMinLength, 
  validateMaxLength, 
  validateHexColor 
} from '../utils/validation'

export const Teams: CollectionConfig = {
  slug: 'teams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'division', 'headCoach', 'status', 'currentRecord'],
    group: 'Teams',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
      validate: validateMinLength(2),
    },
    {
      name: 'shortName',
      type: 'text',
      admin: {
        description: 'Abbreviated team name for schedules/scores',
      },
      validate: validateMaxLength(8),
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Team logo image',
      },
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'region',
          type: 'text',
        },
        {
          name: 'homeVenue',
          type: 'relationship',
          relationTo: 'locations',
        },
      ],
    },
    {
      name: 'colors',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'text',
          required: true,
          validate: validateHexColor,
        },
        {
          name: 'secondary',
          type: 'text',
          validate: validateHexColor,
        },
        {
          name: 'accent',
          type: 'text',
          validate: validateHexColor,
        },
      ],
    },
    {
      name: 'division',
      type: 'relationship',
      relationTo: 'divisions',
      required: true,
      index: true,
    },
    {
      name: 'season',
      type: 'relationship',
      relationTo: 'seasons',
      required: true,
      index: true,
    },
    {
      name: 'headCoach',
      type: 'text',
      required: true,
    },
    {
      name: 'staff',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Head Coach', value: 'head-coach' },
            { label: 'Assistant Coach', value: 'assistant-coach' },
            { label: 'Team Manager', value: 'manager' },
            { label: 'Trainer', value: 'trainer' },
            { label: 'Volunteer', value: 'volunteer' },
          ],
          required: true,
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'certifications',
          type: 'array',
          fields: [
            {
              name: 'certification',
              type: 'text',
            },
            {
              name: 'expirationDate',
              type: 'date',
            },
          ],
        },
        {
          name: 'backgroundCheckDate',
          type: 'date',
          admin: {
            description: 'Date of most recent background check',
          },
        },
      ],
    },
    {
      name: 'contacts',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Team Manager', value: 'manager' },
            { label: 'Parent Coordinator', value: 'parent' },
            { label: 'Team Representative', value: 'representative' },
            { label: 'Emergency Contact', value: 'emergency' },
          ],
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'roster',
      type: 'relationship',
      relationTo: 'players',
      hasMany: true,
      admin: {
        description: 'Current team roster',
      },
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'wins',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'losses',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'ties',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'pointsFor',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'pointsAgainst',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'gamesPlayed',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
      ],
    },
    {
      name: 'currentRecord',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-calculated from wins/losses',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending Registration', value: 'pending' },
        { label: 'Suspended', value: 'suspended' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'registrationInfo',
      type: 'group',
      fields: [
        {
          name: 'registrationDate',
          type: 'date',
        },
        {
          name: 'feePaid',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'documentsSubmitted',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'rosterSubmitted',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about the team',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-calculate current record
        if (data.stats) {
          const { wins = 0, losses = 0, ties = 0 } = data.stats
          data.currentRecord = ties > 0 ? `${wins}-${losses}-${ties}` : `${wins}-${losses}`
        }
        return data
      },
    ],
  },
  timestamps: true,
}
