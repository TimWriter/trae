export interface FullTree {
  id: number
  lat: number
  long: number
  tree_nr: string
  name: string
  year: string
  height: string
  circumference: string
  crowndiameter: string
}

export interface Tree {
  id: number
  lat: number
  long: number
}

export interface MapBoxCoordinates {
  lng: number
  lat: number
}

