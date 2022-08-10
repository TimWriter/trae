import { supabase } from "@/supabase"
import { MapBoxCoordinates, Tree } from "@/typings/typings"

export default{
  async getAllTrees():Promise<Tree[]> {
    const { data: trees, error } = await supabase
    .from('trees')
    .select('id,lat,long')

    if(error) {
      console.log("An error occured while loading the supabase database.", error)
      return []
    }

    return trees as Tree[]
  },

  async getAllBoundingTrees(bounds: { _sw:MapBoxCoordinates,_ne:MapBoxCoordinates }):Promise<Tree[]> {
    const { data: trees, error } = await supabase
    .from('trees')
    .select('id,lat,long')
    .gt('lat', bounds._sw.lat)
    .gt('long', bounds._sw.lng)
    .lt('lat', bounds._ne.lat)
    .lt('long', bounds._ne.lng)

    if(error) {
      console.log("An error occured while loading the supabase database.", error)
      return []
    }

    return trees as Tree[]
  },

  async getAllBoundingTreesGeoJSON(bounds: { _sw:MapBoxCoordinates,_ne:MapBoxCoordinates }):Promise<object[]> {
    const { data: trees, error } = await supabase
    .from('trees')
    .select('id,lat,long')
    .gt('lat', bounds._sw.lat)
    .gt('long', bounds._sw.lng)
    .lt('lat', bounds._ne.lat)
    .lt('long', bounds._ne.lng)

    if(error) {
      console.log("An error occured while loading the supabase database.", error)
      return []
    }

    const geoJSON:Array<object> = []

    trees?.forEach(tree => {
      geoJSON.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [tree.long, tree.lat]
        },
        id: tree.id
      })
    })
    return geoJSON
  }
}