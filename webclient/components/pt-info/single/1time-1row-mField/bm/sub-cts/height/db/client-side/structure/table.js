// For docs read webclient/docs/models.md
import clientSideTableManage from '~/components/core/crud/manage-rows-of-table-in-client-side-orm.js'

const { v1: uuidv1 } = require('uuid')

let count = 0
const intUniqueID = () => ++count

export default class ptHeight extends clientSideTableManage {
  static entity = 'tblHeight'
  static graphSeries1FieldName = 'heightInInches'
  static graphSeries1Unit = 'Inches'

  // By using process.env the code can support different locations for API server. Hence dev prod and test can use different API servers.
  // baseurl is defined in nuxt.config.js
  // static apiUrl = process.env.baseUrl + '/name'
  // on 3000 json-server runs
  // on 8000 nodejs runs along with sequalize

  static apiUrl = 'http://localhost:8000/public/api/height/v20'

  static primaryKey = 'clientSideUniqRowId'

  static fields() {
    return {
      ...super.fields(),

      clientSideUniqRowId: this.uid(() => intUniqueID()), // if this is not set then update based on primary key will not work
      serverSideRowUuid: this.uid(() => uuidv1()),

      heightInInches: this.number(null),
      timeOfMeasurement: this.string(null),
      notes: this.string(null),

      recordChangedByUUID: this.string(null),
      recordChangedFromIPAddress: this.string(null),
      recordChangedFromSection: this.string(null),

      ROW_START: this.number(0),
      ROW_END: this.number(2147483647.999999), // this is unix_timestamp value from mariaDB for ROW_END when a record is created new in MariaDB system versioned table.
    }
  }
}
