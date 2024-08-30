import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => 'events',
    }),
    createEvent: builder.mutation({
      query: (newEvent) => ({
        url: 'events',
        method: 'POST',
        body: newEvent,
      }),
    }),
    getEvent: builder.query({
      query: (id) => `events/${id}`,
    }),
    addContribution: builder.mutation({
      query: ({ eventId, contribution }) => ({
        url: `events/${eventId}/contributions`,
        method: 'POST',
        body: contribution,
      }),
    }),
    getDashboard: builder.query({
      query: () => 'dashboard',
    }),
  }),
})

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useGetEventQuery,
  useAddContributionMutation,
  useGetDashboardQuery,
} = api