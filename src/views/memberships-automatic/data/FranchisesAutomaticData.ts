import { FranchiseAutomaticProps } from '../FranchiseAutomatic'

export const AUTOMATIC_FRANCHISE: FranchiseAutomaticProps[] = [
  {
    name: 'FA500',
    binary_points: 50,
    range_points: 100,
    cap: 1000,
    image: '/img/Franchises/FA500.png',
  },
  {
    name: 'FA1000',
    binary_points: 100,
    range_points: 200,
    cap: 2000,
    image: '/img/Franchises/FA1000.png',
  },
  {
    name: 'FA2000',
    binary_points: 200,
    range_points: 400,
    cap: 4000,
    image: '/img/Franchises/FA2000.png',
  },
  {
    name: 'FA5000',
    binary_points: 500,
    range_points: 1000,
    cap: 10000,
    image: '/img/Franchises/FA5000.png',
  },
  {
    name: 'FA10000',
    binary_points: 1000,
    range_points: 2000,
    cap: 20000,
    image: '/img/Franchises/FA10000.png',
  },
  {
    name: 'FA20000',
    binary_points: 2000,
    range_points: 4000,
    cap: 40000,
    image: '/img/Franchises/FA20000.png',
  },
]

export const AUTOMATIC_FRANCHISES_PRICES: Record<string, number> = {
  FA500: 500,
  FA1000: 1000,
  FA2000: 2000,
  FA5000: 5000,
  FA10000: 10000,
  FA20000: 20000,
}
