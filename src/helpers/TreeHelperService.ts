import { supabase } from "@/supabase"
import { MapBoxCoordinates, FullTree} from "@/typings/typings"

export default{
  async getAllBoundingTreesGeoJSON(bounds: { _sw:MapBoxCoordinates,_ne:MapBoxCoordinates }):Promise<object[]> {
    const { data: trees, error } = await supabase
    .from('TreesTable')
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
  },
  
  async getTree(id: number):Promise<FullTree | null> {
    const { data: tree, error } = await supabase
    .from('TreesTable')
    .select('*')
    .eq('id', id)
    .range(0, 1)

    if(error) {
      console.log("An error occured while loading the supabase database.", error)
      return null
    }

    return tree !== null ? tree[0] : null
  },

  async getTreesByTreeNumber(treeNr: string):Promise<FullTree[] | null>{
    const { data: trees, error } = await supabase
    .from('TreesTable')
    .select('*')
    .eq('tree_nr', treeNr)

    if(error) {
      console.log("An error occured while loading the supabase database.", error)
      return null
    }

    return trees !== null ? trees : null
  },

  async getHeightLookup():Promise<any | null>{
    const { data: HeightLookupTable, error } = await supabase
    .from('HeightLookupTable')
    .select('*')

    if(error) {
      console.log("An error occured while loading the supabase database.", error)
      return null
    }

    return HeightLookupTable !== null ? HeightLookupTable : null
  },

  async getCrownDiameterLookup():Promise<any | null>{
    const { data: CrowndiameterLookupTable, error } = await supabase
    .from('CrowndiameterLookupTable')
    .select('*')

    if(error) {
      console.log("An error occured while loading the supabase database.", error)
      return null
    }

    return CrowndiameterLookupTable !== null ? CrowndiameterLookupTable : null
  }
}