// For ref implementation see name/db/orm.js
import rowManage from '~/cts/core/crud/row-manage.js'

const { v1: uuidv1 } = require('uuid')

let count = 0
const intUniqueID = () => ++count

export default class ptBloodSugar extends rowManage {
  static entity = 'bloodSugar'
  static apiUrl = 'http://localhost:3000/blood-Sugar'

  static graphSeries1FieldName = 'bloodSugarInBpm'
  static graphSeries1Unit = 'Bpm'

  static fields() {
    return {
      ...super.fields(),

      id: this.uid(() => intUniqueID()),
      uuid: this.uid(() => uuidv1()),

      bloodSugarInBpm: this.number(null), // number type of vuex-orm will also store decimals
      timeOfMeasurement: this.number(null), // refer to /name/db/orm.js notes for ROW_END
      notes: this.string(null),
      recordChangedByUUID: this.string(null),
      recordChangedFromIPAddress: this.string(null),
      recordChangedFromSection: this.string(null),

      ROW_START: this.number(0),
      ROW_END: this.number(2147483647.999999),
    }
  }
}
