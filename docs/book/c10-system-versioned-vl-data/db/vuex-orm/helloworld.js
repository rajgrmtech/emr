// For docs read
// https://vuex-orm.org/guide/model/defining-models.html
// webclient/docs/models.md

import clientSideTableManage from "~/cts/core/crud/orm-row-manage.js";
export default class helloworldCh10 extends clientSideTableManage {
  static entity = "helloworldCh10";
  static primaryKey = "clientSideUniqRowId";

  static fields() {
    return {
      ...super.fields(),
      id: this.uid(),
      msg: this.string(null),
      ROW_END: this.number(2147483648000), // this is unix_timestamp value from mariaDB for ROW_END when a record is created new in MariaDB system versioned table.
    };
  }
}
