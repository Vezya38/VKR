<template>
    <div class="sidebar">
        <div class="cal-item" style="display: flex; justify-content: center; align-items: center;">
            <vue-cal class="vuecal--date-picker" xsmall hide-view-selector :time="false" :transitions="false"
                active-view="month" :disable-views="['week']" style="width: 200px; height: 230px; color: black;">
            </vue-cal>
        </div>
    </div>
</template>
  
<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { mapGetters } from "vuex";

export default {
    computed: mapGetters(["getName", "getGuarantor", "getJobTitle", "getTime", "getItems"]),
    components: { VueCal },
    name: 'RightSideСalendar',
}

</script>
  
<style scoped>

.cal-item {
    text-align: center;
    background-color: #ececec;
    border-radius: 10px;
}

.forp {
    margin-right: 7px;
    border-radius: 10px;
    background-color: #C0C0C0;
    padding: 9px;
}

.elem {
    /* Стили для элемента карусели */
    text-align: center;
    padding: 20px;
    background-color: black;
    border-radius: 2px;
}

body {
    margin: 0;
    padding: 0;
    display: flex;
}

.content {
    flex: 1;
    padding: 20px;
}

.sidebar {
    margin-top: 6.7%;
    color: azure;
    width: 20%;
    position: fixed;
    right: 0;
    margin-right: 3%;
    top: 0;
}
</style>
  