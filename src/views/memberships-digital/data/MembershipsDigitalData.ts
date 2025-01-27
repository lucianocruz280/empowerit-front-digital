export interface MembershipsDigitalProps {
  name: MembershipsDigitalNames
  binary_points: number
  range_points: number
  image: string
  cap: number
}

export type MembershipsDigitalNames = 'FD200' | 'FD300' | 'FD500'

export const MEMBERSHIPS_DIGITAL: MembershipsDigitalProps[] = [
  {
    name: 'FD200',
    binary_points: 100,
    range_points: 200,
    image: '/img/memberships/FD200.png',
    cap: 500,
  },
  {
    name: 'FD300',
    binary_points: 150,
    range_points: 300,
    image: '/img/memberships/FD300.png',
    cap: 1000,
  },
  {
    name: 'FD500',
    binary_points: 250,
    range_points: 500,
    image: '/img/memberships/FD500.png',
    cap: 2000,
  },
]
