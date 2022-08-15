/* eslint no-use-before-define: 0 */
const fs = require('fs')

const properties = {
  height: [
    {
      min: 0,
      max: 5
    },
    {
      min: 6,
      max: 10
    },
    {
      min: 11,
      max: 15
    },
    {
      min: 16,
      max: 20
    },
    {
      min: 21,
      max: 25
    },
    {
      min: 26,
      max: 30
    },
    {
      min: 31,
      max: 35
    },
    {
      min: 36
    }
  ],
  crowndiameter: [
    {
      min: 0,
      max: 3
    },
    {
      min: 4,
      max: 6
    },
    {
      min: 7,
      max: 9
    },
    {
      min: 10,
      max: 12
    },
    {
      min: 13,
      max: 15
    },
    {
      min: 16,
      max: 18
    },
    {
      min: 19,
      max: 21
    },
    {
      min: 22
    }
  ]
}

const header = "id;lat;long;tree_nr;name;year;height;circumference;crowndiameter\n"
let body = ""
let sum = 0;

function exportTreesCSV() {
  fs.writeFile('./export/TreesTable.csv', header + body, err => {
    if(err) console.log(err)
  })
  console.log('Created the files')
}

function exportHeightLookup(){
  const th = 'id;min;max\n'
  let tb = ''
  let counter = 0
  properties.height.forEach(item => {
    counter ++
    tb = tb + `${counter};${item.min};${item.max}\n`
  })
  fs.writeFile('./export/HeightLookupTable.csv', th + tb, err => {
    if(err) console.log(err)
  })
}

function exportCrowndiameterLookup(){
  const th = 'id;min;max\n'
  let tb = ''
  let counter = 0
  properties.crowndiameter.forEach(item => {
    counter ++
    tb = tb + `${counter};${item.min};${item.max}\n`
  })
  fs.writeFile('./export/CrowndiameterLookupTable.csv', th + tb, err => {
    if(err) console.log(err)
  })
}

function convertWien() {
  fs.readFile('./data/Wien.json', 'utf-8', (err, jsonString) => {
  if (err) console.log(err)
  else {
    const data = JSON.parse(jsonString)
    data.features.forEach(element => {
      sum++
      body = body + (`${sum};${element.geometry.coordinates[1]};${element.geometry.coordinates[0]};${element.properties['BAUMNUMMER']};${element.properties['GATTUNG_ART']};${element.properties['PFLANZJAHR']};${element.properties['BAUMHOEHE']};${element.properties['STAMMUMFANG']};${element.properties['KRONENDURCHMESSER']}\n`)
    });
    convertLinz()
    }
  })
}


function convertLinz() {
  fs.readFile('./data/Linz.csv', 'utf-8', (err, csvString) => {
  if (err) console.log(err)
  else {
    const data = csvString
    const rows = data.split('\n')
    rows.shift()
    rows.pop()
    rows.forEach(item => {
      sum++
      const columns = item.split(';')
      body = body + (`${sum};${columns[13].substring(0, columns[13].length-1)};${columns[12]};${columns[1]};${columns[2]} ${columns[3]} (${columns[5]});n.a.;${columns[6]};${columns[8]};${columns[7]}\n`)
    })
    convertInnsbruck()
  }
})
}

function convertInnsbruck() {
  fs.readFile('./data/Innsbruck.csv', 'utf-8', (err, csvString) => {
  if (err) console.log(err)
  else {
    const data = csvString
    const rows = data.split('\n')
    rows.shift()
    rows.pop()
    rows.forEach(item => {
      sum++
      const columns = item.split(';')
      body = body + (`${sum};${columns[9].replace(',', '.').substring(0, columns[9].length-1)};${columns[8].replace(',', '.')};${columns[2]};${columns[4]} (${columns[3]});${columns[5].split('.')[2] || 'n.a.'};n.a.;n.a.;n.a.\n`)
    })
    exportTreesCSV()
  }
})
}

async function exportAll(){
  exportHeightLookup()
  exportCrowndiameterLookup()
  await convertWien()
}

exportAll()




