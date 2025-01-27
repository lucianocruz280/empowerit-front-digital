export interface ISelectOPT {
  label: string
  value: string
}

export type Country = ISelectOPT
export type State = ISelectOPT
export type City = ISelectOPT

export type Countries = Country[]
export type States = State[]
export type Cities = City[]

export interface ILocationValues {
  country: Country
  state: State
  city: City
}
