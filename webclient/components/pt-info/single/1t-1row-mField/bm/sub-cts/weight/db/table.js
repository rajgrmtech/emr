// For ref implementation see name/db/structure/table.js
import clientSideTableManage from '~/components/core/crud/manage-rows-of-table-in-client-side-orm.js'

const { v1: uuidv1 } = require('uuid')

let count = 0
const intUniqueID = () => ++count

export default class ptWeight extends clientSideTableManage {
  static entity = 'weight'
  static apiUrl = 'http://localhost:8000/public/api/weight/v20'

  static graphSeries1FieldName = 'weightInPounds'
  static graphSeries1Unit = 'Lbs'

  static fields() {
    return {
      ...super.fields(),

      id: this.uid(() => intUniqueID()),
      uuid: this.uid(() => uuidv1()),

      weightInPounds: this.number(null), // number type of vuex-orm will also store decimals
      timeOfMeasurement: this.string(null), // refer to /name/db/structure/table.js notes for ROW_END
      notes: this.string(null),
      recordChangedByUUID: this.string(null),
      recordChangedFromIPAddress: this.string(null),
      recordChangedFromSection: this.string(null),

      ROW_START: this.number(0),
      ROW_END: this.number(2147483647.999999),
    }
  }
}
