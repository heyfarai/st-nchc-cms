import type { CollectionConfig } from 'payload'
import { 
  validateZipCode, 
  validatePhone, 
  validateUrl, 
  validateTime 
} from '../utils/validation'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'state', 'capacity', 'isActive'],
    group: 'Facilities',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'address',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'state',
      type: 'select',
      required: true,
      options: [
        { label: 'California', value: 'CA' },
        { label: 'Texas', value: 'TX' },
        { label: 'New York', value: 'NY' },
        { label: 'Florida', value: 'FL' },
        { label: 'Illinois', value: 'IL' },
        { label: 'Pennsylvania', value: 'PA' },
        { label: 'Ohio', value: 'OH' },
        { label: 'Georgia', value: 'GA' },
        { label: 'North Carolina', value: 'NC' },
        { label: 'Michigan', value: 'MI' },
        // Add more states as needed
      ],
    },
    {
      name: 'zipCode',
      type: 'text',
      required: true,
      validate: validateZipCode,
    },
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        {
          name: 'latitude',
          type: 'number',
          admin: {
            step: 0.000001,
          },
        },
        {
          name: 'longitude',
          type: 'number',
          admin: {
            step: 0.000001,
          },
        },
      ],
    },
    {
      name: 'capacity',
      type: 'number',
      min: 0,
      admin: {
        description: 'Maximum seating capacity',
      },
    },
    {
      name: 'courts',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'courtName',
          type: 'text',
          required: true,
        },
        {
          name: 'courtType',
          type: 'select',
          options: [
            { label: 'Full Court', value: 'full' },
            { label: 'Half Court', value: 'half' },
            { label: 'Practice Court', value: 'practice' },
          ],
          defaultValue: 'full',
        },
        {
          name: 'isAvailable',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'facilities',
      type: 'array',
      fields: [
        {
          name: 'facility',
          type: 'select',
          required: true,
          options: [
            { label: 'Parking', value: 'parking' },
            { label: 'Concessions', value: 'concessions' },
            { label: 'Restrooms', value: 'restrooms' },
            { label: 'Locker Rooms', value: 'lockers' },
            { label: 'Scoreboards', value: 'scoreboards' },
            { label: 'Sound System', value: 'sound' },
            { label: 'Live Streaming', value: 'streaming' },
            { label: 'Wheelchair Accessible', value: 'accessible' },
          ],
        },
      ],
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'facilityManager',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
          validate: validatePhone,
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'website',
          type: 'text',
          validate: validateUrl,
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
          required: true,
        },
        {
          name: 'openTime',
          type: 'text',
          required: true,
          validate: validateTime,
        },
        {
          name: 'closeTime',
          type: 'text',
          required: true,
          validate: validateTime,
        },
      ],
    },
    {
      name: 'pricing',
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
          name: 'notes',
          type: 'textarea',
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
