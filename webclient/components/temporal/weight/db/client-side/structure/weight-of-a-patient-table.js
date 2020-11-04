// For docs read webclient/docs/models.md
import clientTblManage from '~/components/def-processors/crud/manage-rows-of-table-in-client-side-orm.js'
import { required, minLength, between } from 'vuelidate/lib/validators'

const { v1: uuidv1 } = require('uuid')
let count = 0
const intUniqueId = () => ++count

const defaultValueOfTimeOfMeasurementInMilliseconds = () => Math.floor(Date.now())

export default class weight extends clientTblManage {
  static entity = 'tblWeight'

  /* 
    Goal: Change baseurl as per NODE_ENV value. eg: If NODE_ENV == dev then baseurl = "http://localhost:8000" or If NODE_ENV == test then baseurl = "http://ptserver:8000"
    baseurl is defined in nuxt.config.js
    on 3000 json-server runs
    on 8000 nodejs runs along with sequalize
    On 8001 php/lumen/eloquent is running
    
    To check if the api is working you can enter this in the browser:
    http://127.0.0.1:8000/weight/getAll

    To make post request:
    enter http://127.0.0.1:8000/weight/getAll in https://hoppscotch.io/

    Options:
    1. static apiUrl = process.env.baseUrl + '/weight'

  */

  static apiUrl = 'http://localhost:8000/public/api/weight/v20'

  static primaryKey = 'clientSideUniqRowId'

  static fields() {
    return {
      ...super.fields(),

      clientSideUniqRowId: this.uid(() => intUniqueId()), // if this is not set then update based on primary key will not work
      serverSideRowUuid: this.uid(() => uuidv1()),
      ptUuid: this.string(null),
      weightInPounds: this.string(''),
      notes: this.string(null).nullable(), // Ref: https://vuex-orm.org/guide/model/defining-models.html#primitive-types. Without specifying .null notes gets the default value of "null"
      timeOfMeasurementInMilliseconds: this.uid(() => defaultValueOfTimeOfMeasurementInMilliseconds()),
      recordChangedByUuid: this.string(null),
      recordChangedFromIPAddress: this.string(null),
      recordChangedFromSection: this.string(null),

      ROW_START: this.number(0),
      ROW_END: this.number(2147483648000), // this is unix_timestamp*1000 value from mariaDB for ROW_END.  When a record is created new in MariaDB system versioned table, this value is set by MariaDB. Internally everywhere timeInMilliseconds is used.
    }
  }
}

export const weightFormDef = {
  id: 'weight',
  plural: 'weight',
  singular: 'weight',
  fieldsDef: [
    {
      fieldNameInDb: 'weightInPounds',
      fieldNameInUi: 'Weight',
      fieldType: 'number',
      span: 24,
      showFieldLabel: false,
      unitOfMeasurement: 'pounds',
    },
    {
      fieldNameInDb: 'notes',
      fieldNameInUi: 'Notes',
      fieldType: 'textarea',
      span: 24,
      showFieldLabel: true,
    },
    {
      fieldNameInDb: 'timeOfMeasurementInMilliseconds',
      fieldNameInUi: 'Measured on',
      fieldType: 'date',
      span: 24,
      showFieldLabel: true,
    },
  ],
  showFormReviewedButton: false,
  maxNumberOfRows: 1,
  atLeastOneOfFieldsForCheckingIfRowIsEmpty: ['weightInPounds'],
  fnCreated: function () {
    // it is critical that empty array is returned. Since v-model uses it. And validation uses v-model
    return []
  },

  styleForEachRow: 'padding: 0px; margin: 0px; display: grid; grid-template-columns: 1fr; grid-column-gap: 1rem',
  // Ref: https://vuelidate.js.org/#sub-dynamic-validation-schema
  validationsObj: {
    value: {
      weightInPounds: {
        minLength: minLength(2),
      },
      notes: {
        minLength: minLength(0),
      },
      timeOfMeasurementInMilliseconds: {
        minLength: minLength(0),
      },
    },
  },
  graphObj: {
    series: [{ fieldName: 'weightInPounds', fieldLabel: 'Weight' }],
  },
}
