export interface Park {
  id: string
  name: string
  entityType: string
  slug: string
  parentId: string
  externalId: string
  latitude: number
  longitude: number
  timeZone: string
}

export interface RideWaitTimes {
  id: string
  name: string
  waitTime: number
  active: boolean
  fastPass: boolean
  meta: RideWaitTimesMeta
  status: RideWaitTimesStatus
  lastUpdate: number
  schedule: RideWaitTimesSchedule
}

export type RideWaitTimesStatus = 'Operating' | 'Closed' | 'Refurbishment' | 'Down'

export interface RideWaitTimesMeta {
  type: string
  fastPassStartTime?: string
  fastPassEndTime?: string
  singleRider: boolean
  longitude: number
  latitude: number
  area?: string
  entityId: string
}

export interface RideWaitTimesSchedule {
  date: string
  openingTime: string
  closingTime: string
  type: RideWaitTimesScheduleType
  special: {
    openingTime: number
    closingTime: number
    description: string
    type: string
  }[]
}

export type RideWaitTimesScheduleType = 'Operating' | 'Closed'
