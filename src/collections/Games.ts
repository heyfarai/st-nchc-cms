import type { CollectionConfig } from 'payload'
import { validateTime, validateMaxArrayLength } from '../utils/validation'

export const Games: CollectionConfig = {
  slug: 'games',
  admin: {
    useAsTitle: 'gameTitle',
    defaultColumns: ['gameTitle', 'gameDate', 'gameTime', 'status', 'venue'],
    group: 'Scheduling',
  },
  fields: [
    {
      name: 'gameNumber',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Auto-generated game number',
      },
    },
    {
      name: 'session',
      type: 'relationship',
      relationTo: 'sessions',
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
      name: 'division',
      type: 'relationship',
      relationTo: 'divisions',
      required: true,
    },
    {
      name: 'homeTeam',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      index: true,
    },
    {
      name: 'awayTeam',
      type: 'relationship',
      relationTo: 'teams',
      required: true,
      index: true,
      // @ts-expect-error - Payload validation function types are complex
      validate: async (val, { data }) => {
        if (val && data.homeTeam && val === data.homeTeam) {
          return 'Away team cannot be the same as home team'
        }
        return true
      },
    },
    {
      name: 'gameDate',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'gameTime',
      type: 'text',
      required: true,
      validate: validateTime,
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
    },
    {
      name: 'venue',
      type: 'text',
      required: true,
      admin: {
        description: 'Specific court/field within the location',
      },
    },
    {
      name: 'assignedOfficials',
      type: 'relationship',
      relationTo: 'officials',
      hasMany: true,
      validate: validateMaxArrayLength(3),
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Halftime', value: 'halftime' },
        { label: 'Final', value: 'final' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Postponed', value: 'postponed' },
        { label: 'Forfeited', value: 'forfeited' },
      ],
      defaultValue: 'scheduled',
      index: true,
    },
    {
      name: 'score',
      type: 'group',
      fields: [
        {
          name: 'homeScore',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'awayScore',
          type: 'number',
          min: 0,
          defaultValue: 0,
        },
        {
          name: 'periods',
          type: 'array',
          fields: [
            {
              name: 'period',
              type: 'number',
              required: true,
            },
            {
              name: 'homeScore',
              type: 'number',
              min: 0,
            },
            {
              name: 'awayScore',
              type: 'number',
              min: 0,
            },
          ],
        },
        {
          name: 'overtime',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'gameStats',
      type: 'group',
      fields: [
        {
          name: 'attendance',
          type: 'number',
          min: 0,
        },
        {
          name: 'weatherConditions',
          type: 'text',
          admin: {
            condition: (data) => data.location?.type === 'outdoor',
          },
        },
        {
          name: 'technicalFouls',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
        {
          name: 'ejections',
          type: 'number',
          defaultValue: 0,
          min: 0,
        },
      ],
    },
    {
      name: 'gameTitle',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated game title',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Game notes, incidents, or special circumstances',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        // Auto-generate game number
        if (operation === 'create') {
          const gameCount = await req.payload.count({
            collection: 'games',
            where: { season: { equals: data.season } },
          })
          data.gameNumber = gameCount.totalDocs + 1
        }

        // Auto-generate game title
        if (data.homeTeam && data.awayTeam) {
          const homeTeam = await req.payload.findByID({
            collection: 'teams',
            id: data.homeTeam,
          })
          const awayTeam = await req.payload.findByID({
            collection: 'teams',
            id: data.awayTeam,
          })
          data.gameTitle = `${awayTeam.shortName || awayTeam.name} @ ${homeTeam.shortName || homeTeam.name}`
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update team stats when game is completed
        if (doc.status === 'final' && doc.score && operation === 'update') {
          const homeScore = doc.score.homeScore || 0
          const awayScore = doc.score.awayScore || 0

          // Update home team stats
          const homeTeam = await req.payload.findByID({
            collection: 'teams',
            id: doc.homeTeam,
          })

          const awayTeam = await req.payload.findByID({
            collection: 'teams',
            id: doc.awayTeam,
          })

          // Determine winner and update records
          let homeWins = homeTeam.stats?.wins || 0
          let homeLosses = homeTeam.stats?.losses || 0
          let awayWins = awayTeam.stats?.wins || 0
          let awayLosses = awayTeam.stats?.losses || 0

          if (homeScore > awayScore) {
            homeWins++
            awayLosses++
          } else if (awayScore > homeScore) {
            awayWins++
            homeLosses++
          }

          // Update both teams
          await req.payload.update({
            collection: 'teams',
            id: doc.homeTeam,
            data: {
              stats: {
                ...homeTeam.stats,
                wins: homeWins,
                losses: homeLosses,
                pointsFor: (homeTeam.stats?.pointsFor || 0) + homeScore,
                pointsAgainst: (homeTeam.stats?.pointsAgainst || 0) + awayScore,
                gamesPlayed: (homeTeam.stats?.gamesPlayed || 0) + 1,
              },
            },
          })

          await req.payload.update({
            collection: 'teams',
            id: doc.awayTeam,
            data: {
              stats: {
                ...awayTeam.stats,
                wins: awayWins,
                losses: awayLosses,
                pointsFor: (awayTeam.stats?.pointsFor || 0) + awayScore,
                pointsAgainst: (awayTeam.stats?.pointsAgainst || 0) + homeScore,
                gamesPlayed: (awayTeam.stats?.gamesPlayed || 0) + 1,
              },
            },
          })
        }
      },
    ],
  },
  timestamps: true,
}
