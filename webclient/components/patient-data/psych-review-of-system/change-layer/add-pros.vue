<template>
  <div>
    <ctAddForm :_formDef="formDef" _regexForFieldSubset="subjective"></ctAddForm>

    <el-tabs v-model="activeHorizontalTab" tab-position="left">
      <el-tab-pane label="Gateway mood symptoms" name="gateway_mood_symptoms"
        >Gateway mood symptoms. In the past 10 days, how many days have you:
        <ctAddForm :_formDef="formDef" _regexForFieldSubset="gateway.*"></ctAddForm>
      </el-tab-pane>
      <el-tab-pane label="Depression" name="depression"
        >Depression
        <ctAddForm :_formDef="formDef" _regexForFieldSubset="depressive.*"></ctAddForm>
      </el-tab-pane>
      <el-tab-pane label="Mania" name="mania"
        >Mania/Hypomania
        <ctAddForm :_formDef="formDef" _regexForFieldSubset="mania.*"></ctAddForm>
      </el-tab-pane>
      <el-tab-pane label="Psychosis" name="psychosis">Psychosis</el-tab-pane>
      <el-tab-pane label="Sleep" name="Sleep">Sleep</el-tab-pane>
      <el-tab-pane label="Substance abuse" name="Substance">Substance abuse</el-tab-pane>
      <el-tab-pane label="GAD" name="gad">GAD</el-tab-pane>
      <el-tab-pane label="Panic attacks" name="Panic">Panic attacks</el-tab-pane>
      <el-tab-pane label="Social anxiety" name="social">Social anxiety</el-tab-pane>
      <el-tab-pane label="OCD" name="ocd">OCD</el-tab-pane>
      <el-tab-pane label="PTSD" name="ptsd">PTSD</el-tab-pane>
      <el-tab-pane label="ADHD" name="adhd">ADHD</el-tab-pane>
      <el-tab-pane label="Anorexia" name="anorexia">Anorexia</el-tab-pane>
      <el-tab-pane label="Bulimia" name="bulimia">Bulimia</el-tab-pane>
      <el-tab-pane label="Dementia" name="dementia">Dementia</el-tab-pane>
      <el-tab-pane label="Suicide" name="suicide">Suicide</el-tab-pane>
      <el-tab-pane label="Homicide" name="homicide">Homicide</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import ctAddForm from '@/components//papers/change-appt-note/templates/add-form.vue'
import psychReviewOfSystemsOfAPatientTbl from '@/components/patient-data/psych-review-of-system/db/client-side/structure/psych-review-of-system-of-a-patient-table.js'

import { psychReviewOfSystemFormDef } from '@/components/patient-data/psych-review-of-system/db/client-side/structure/psych-review-of-system-of-a-patient-table.js'

export default {
  data: function () {
    return {
      formDef: psychReviewOfSystemFormDef,
      activeHorizontalTab: 'gateway_mood_symptoms',
    }
  },
  created() {
    // Inside this fn 'this' will refer to this ct (parent) https://stackoverflow.com/questions/59826155/vue-callback-via-props-and-this
  },

  components: {
    ctAddForm,
  },
}
</script>
