export interface FullTree {
  id: number
  lat: number
  long: number
  tree_nr: string
  name: string
  year: "2012"
  height: "3"
  circumference: "99"
  crowndiameter: "2"
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

