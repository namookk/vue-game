<template>
  <div>
      <input type="checkbox" v-model="chk" value="123"/>
      <input type="checkbox" v-model="chk" value="456"/>
  </div>
</template>

<script>
export default {
    name : 'test',
    data() {
        return{
           text : "<b>황남욱</b>" ,
           chk : ''
        }
    }
}
</script>

<style>

</style>