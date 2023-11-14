import { Subject, BehaviorSubject } from 'rxjs';


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
class ServiceDataProvider {
  constructor() {
    this.originalElements = [...ELEMENT_DATA]
    this.elements$ = new BehaviorSubject(this.originalElements)
    this.selectedElement$ = new Subject(null)
  }

  getElements$() {
    return this.elements$
  }

  getSelectedElement$() {
    return this.selectedElement$
  }

  selectElement(position) {
    let element = this.originalElements.find(el => el.position === position)
    this.selectedElement$.next(element)
  }

  filter(filterValue) {
    this.elements$.next(
      filterValue ?
        this.originalElements.filter(
          element => element.name.toLowerCase().includes(filterValue.toLowerCase())
        ) : this.originalElements
    )
  }

  saveElement(element) {
    let newOriginalElements = [
      ...this.originalElements.filter(el => el.position !== element.position),
      element
    ]
    this.originalElements = newOriginalElements
    this.elements$.next(this.originalElements)
  }

  deleteElement(position) {
    let lessOriginalElements = [
      ...this.originalElements.filter(el => el.position !== position)
    ]
    this.originalElements = lessOriginalElements
    this.elements$.next(this.originalElements)
  }

}

// global data Provider instance holder
ServiceDataProvider.__instance__ = null

// Singleton Factory Method
export default function getServiceDataProvider() {
  if (!ServiceDataProvider.__instance__) {
    ServiceDataProvider.__instance__ = new ServiceDataProvider()
  }
  return ServiceDataProvider.__instance__
}