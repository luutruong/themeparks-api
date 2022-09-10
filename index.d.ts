export interface Park extends Location {
  GetWaitTimes: () => Promise<RideWaitTimes[]>
  GetOpeningTimes: () => Promise<RideWaitTimesSchedule[]>
  BuildWaitTimesResponse: () => Promise<any>
  BuildOpeningTimesResponse: () => Promise<any>

  UpdateRide: (id: number | string, options: {[key: string]: any}) => void
  GetRideObject: (id: number | string) => {[key: string]: any}
}

export interface Location {
  Name: string
  Timezone: string
  IsValid: boolean
  Longitude: string
  Latitude: string
  LocationString: string

  toGoogleMaps: () => string
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
