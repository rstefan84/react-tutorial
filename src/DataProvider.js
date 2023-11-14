// Dummy Data - to be replaced by Server Data
const ELEMENT_DATA = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

// Data Provider Class
class DataProvider {
  getMainListData() {
    return new Promise(
      (resolve, reject) => {
        // Do external call to server
        // or use dummy data :-)
        setTimeout(() => {
          let result_data = ELEMENT_DATA
          resolve(result_data)
        }, 2000)
      }
    )
  }
}

// global data Provider instance holder
DataProvider.__instance__ = null

// Singleton Factory Method
export default function getDataProvider() {
  if (!DataProvider.__instance__) {
    DataProvider.__instance__ = new DataProvider()
  }
  return DataProvider.__instance__
}