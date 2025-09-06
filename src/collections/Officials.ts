import type { CollectionConfig } from 'payload'
import { validatePhone } from '../utils/validation'

export const Officials: CollectionConfig = {
  slug: 'officials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'certificationLevel', 'isActive', 'gamesOfficiated'],
    group: 'Personnel',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
      validate: validatePhone,
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
    {
      name: 'certificationLevel',
      type: 'select',
      required: true,
      options: [
        { label: 'Trainee', value: 'trainee' },
        { label: 'Certified', value: 'certified' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Master', value: 'master' },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      fields: [
        {
          name: 'certificationName',
          type: 'text',
          required: true,
        },
        {
          name: 'issuedDate',
          type: 'date',
          required: true,
        },
        {
          name: 'expirationDate',
          type: 'date',
          required: true,
        },
        {
          name: 'issuingOrganization',
          type: 'text',
          required: true,
        },
        {
          name: 'certificationNumber',
          type: 'text',
        },
      ],
    },
    {
      name: 'specialties',
      type: 'array',
      fields: [
        {
          name: 'specialty',
          type: 'select',
          required: true,
          options: [
            { label: 'Youth Basketball', value: 'youth' },
            { label: 'High School', value: 'high-school' },
            { label: 'Adult Recreation', value: 'adult-rec' },
            { label: 'Tournament', value: 'tournament' },
            { label: 'Referee', value: 'referee' },
            { label: 'Scorekeeper', value: 'scorekeeper' },
            { label: 'Clock Operator', value: 'clock' },
          ],
        },
      ],
    },
    {
      name: 'availability',
      type: 'array',
      fields: [
        {
          name: 'dayOfWeek',
          type: 'select',
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'timeSlot',
          type: 'select',
          options: [
            { label: 'Morning (6AM-12PM)', value: 'morning' },
            { label: 'Afternoon (12PM-6PM)', value: 'afternoon' },
            { label: 'Evening (6PM-10PM)', value: 'evening' },
            { label: 'All Day', value: 'all-day' },
          ],
        },
      ],
    },
    {
      name: 'paymentInfo',
      type: 'group',
      fields: [
        {
          name: 'hourlyRate',
          type: 'number',
          min: 0,
        },
        {
          name: 'gameRate',
          type: 'number',
          min: 0,
        },
        {
          name: 'paymentMethod',
          type: 'select',
          options: [
            { label: 'Check', value: 'check' },
            { label: 'Cash', value: 'cash' },
            { label: 'Direct Deposit', value: 'direct-deposit' },
          ],
        },
      ],
    },
    {
      name: 'stats',
      type: 'group',
      fields: [
        {
          name: 'gamesOfficiated',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'seasonsWorked',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            step: 0.1,
            description: 'Average rating from coaches/administrators',
          },
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
