import type { CollectionConfig } from 'payload'
import { validateUrl, validateHeight } from '../utils/validation'
import { validateJerseyNumber } from '../hooks/validateJerseyNumber'

export const Players: CollectionConfig = {
  slug: 'players',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'team', 'position', 'jerseyNumber', 'gradYear'],
    group: 'Players',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      index: true,
    },
    {
      name: 'position',
      type: 'select',
      required: true,
      options: [
        { label: 'Point Guard', value: 'PG' },
        { label: 'Shooting Guard', value: 'SG' },
        { label: 'Small Forward', value: 'SF' },
        { label: 'Power Forward', value: 'PF' },
        { label: 'Center', value: 'C' },
        { label: 'Guard', value: 'G' },
        { label: 'Forward', value: 'F' },
      ],
    },
    {
      name: 'jerseyNumber',
      type: 'number',
      required: true,
      min: 0,
      max: 99,
      // Basic validation for jersey number format
      // Duplicate checking is handled in the beforeChange hook
      validate: (val: number | null | undefined): true | string => {
        if (val == null) return true; // Let required handle null/undefined
        if (val < 0 || val > 99) {
          return 'Jersey number must be between 0 and 99';
        }
        if (!Number.isInteger(val)) {
          return 'Jersey number must be a whole number';
        }
        return true;
      },
    },
    {
      name: 'personalInfo',
      type: 'group',
      fields: [
        {
          name: 'dateOfBirth',
          type: 'date',
        },
        {
          name: 'gradYear',
          type: 'number',
          required: true,
          min: 2020,
          max: 2035,
        },
        {
          name: 'height',
          type: 'text',
          validate: validateHeight,
        },
        {
          name: 'weight',
          type: 'number',
          min: 50,
          max: 400,
          admin: {
            description: 'Weight in pounds',
          },
        },
        {
          name: 'hometown',
          type: 'text',
          required: true,
        },
        {
          name: 'region',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Player headshot',
      },
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'parentEmail',
          type: 'email',
          admin: {
            condition: (data: { personalInfo?: { gradYear?: number } }): boolean => {
              const gradYear = data.personalInfo?.gradYear
              const currentYear = new Date().getFullYear()
              return gradYear ? gradYear - currentYear < 4 : false
            },
          },
        },
        {
          name: 'emergencyContact',
          type: 'group',
          fields: [
            {
              name: 'name',
              type: 'text',
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'relationship',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'seasonStats',
      type: 'group',
      label: 'Current Season Stats',
      fields: [
        {
          name: 'gamesPlayed',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'points',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'rebounds',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'assists',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'steals',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'blocks',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'turnovers',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'fouls',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'minutes',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'fieldGoalsMade',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'fieldGoalsAttempted',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'threePointersMade',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'threePointersAttempted',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'freeThrowsMade',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'freeThrowsAttempted',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
      ],
    },
    {
      name: 'careerStats',
      type: 'array',
      fields: [
        {
          name: 'season',
          type: 'relationship',
          relationTo: 'seasons',
          required: true,
        },
        {
          name: 'team',
          type: 'relationship',
          relationTo: 'teams',
          required: true,
        },
        {
          name: 'stats',
          type: 'group',
          fields: [
            {
              name: 'gamesPlayed',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'points',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'rebounds',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'assists',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'fieldGoalPercentage',
              type: 'number',
              defaultValue: 0,
              min: 0,
              max: 100,
            },
          ],
        },
      ],
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        {
          name: 'award',
          type: 'text',
          required: true,
        },
        {
          name: 'season',
          type: 'relationship',
          relationTo: 'seasons',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'dateAwarded',
          type: 'date',
        },
      ],
    },
    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'highlightVideos',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              validate: validateUrl,
            },
            {
              name: 'platform',
              type: 'select',
              options: [
                { label: 'YouTube', value: 'youtube' },
                { label: 'Hudl', value: 'hudl' },
                { label: 'Vimeo', value: 'vimeo' },
                { label: 'Other', value: 'other' },
              ],
            },
          ],
        },
        {
          name: 'socialMedia',
          type: 'group',
          fields: [
            {
              name: 'instagram',
              type: 'text',
            },
            {
              name: 'twitter',
              type: 'text',
            },
            {
              name: 'tiktok',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'eligibility',
      type: 'group',
      fields: [
        {
          name: 'isEligible',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'academicStanding',
          type: 'select',
          options: [
            { label: 'Good Standing', value: 'good' },
            { label: 'Academic Probation', value: 'probation' },
            { label: 'Ineligible', value: 'ineligible' },
          ],
          defaultValue: 'good',
        },
        {
          name: 'medicalClearance',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'insuranceOnFile',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Coaching notes, medical notes, etc.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      // Auto-generate full name
      ({ data }) => {
        if (data.firstName && data.lastName) {
          data.name = `${data.firstName} ${data.lastName}`
        }
        return data
      },
      // Validate jersey number uniqueness
      validateJerseyNumber,
    ],
  },
  timestamps: true,
}
