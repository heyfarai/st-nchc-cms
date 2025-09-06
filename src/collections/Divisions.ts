import type { CollectionConfig } from 'payload'

export const Divisions: CollectionConfig = {
  slug: 'divisions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'conference', 'season', 'teamCount', 'ageGroup'],
    group: 'League Management',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'conference',
      type: 'relationship',
      relationTo: 'conferences',
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
      name: 'ageGroup',
      type: 'select',
      required: true,
      options: [
        { label: 'Youth (Under 12)', value: 'youth' },
        { label: 'Middle School (12-14)', value: 'middle' },
        { label: 'High School (15-18)', value: 'high-school' },
        { label: 'Adult Recreation (18+)', value: 'adult-rec' },
        { label: 'Senior (35+)', value: 'senior' },
      ],
    },
    {
      name: 'skillLevel',
      type: 'select',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Elite', value: 'elite' },
      ],
    },
    {
      name: 'teamLimits',
      type: 'group',
      fields: [
        {
          name: 'maxTeams',
          type: 'number',
          min: 4,
          max: 20,
          defaultValue: 12,
        },
        {
          name: 'minTeams',
          type: 'number',
          min: 4,
          max: 20,
          defaultValue: 6,
        },
        {
          name: 'currentTeams',
          type: 'number',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      fields: [
        {
          name: 'gamesPerTeam',
          type: 'number',
          min: 1,
          max: 30,
          defaultValue: 10,
        },
        {
          name: 'playoffTeams',
          type: 'number',
          min: 2,
          max: 8,
          defaultValue: 4,
        },
        {
          name: 'regularSeasonWeeks',
          type: 'number',
          min: 4,
          max: 20,
          defaultValue: 8,
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
