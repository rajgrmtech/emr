// For ref implementation see name/db/structure/table.js
import clientSideTableManage from '~/components/core/crud/manage-rows-of-table-in-client-side-orm.js'

const { v1: uuidv1 } = require('uuid')

let count = 0
const intUniqueID = () => ++count

export default class ptBloodSugar extends clientSideTableManage {
  static entity = 'tblBloodSugar'
  static apiUrl = 'http://localhost:8000/public/api/blood-sugar/v20'

  static graphSeries1FieldName = 'bloodSugarInBpm'
  static graphSeries1Unit = 'Bpm'

  static primaryKey = 'clientSideUniqRowId'

  static fields() {
    return {
      ...super.fields(),

      clientSideUniqRowId: this.uid(() => intUniqueID()),
      serverSideRowUuid: this.uid(() => uuidv1()),

      bloodSugarInBpm: this.number(null), // number type of vuex-orm will also store decimals
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
