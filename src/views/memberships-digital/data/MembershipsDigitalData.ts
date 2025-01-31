export interface MembershipsDigitalProps {
  name: MembershipsDigitalNames
  binary_points: number
  range_points: number
  image: string
  cap: number
  duration: number
}

export type MembershipsDigitalNames = 'FD150' | 'FD300' | 'FD500'

export const MEMBERSHIPS_DIGITAL: MembershipsDigitalProps[] = [
  {
    name: 'FD150',
    binary_points: 75,
    range_points: 150,
    image: '/img/memberships/FD200.png',
    cap: 500,
    duration: 1
  },
  {
    name: 'FD300',
    binary_points: 150,
    range_points: 300,
    image: '/img/memberships/FD300.png',
    cap: 1000,
    duration: 3
  },
  {
    name: 'FD500',
    binary_points: 250,
    range_points: 500,
    image: '/img/memberships/FD500.png',
    cap: 2000,
    duration: 6
  },
]
