<template>
  <div v-if="getNumberVM != ''">
    <div class="page" style="color: white;">
      <div v-if="getNumberVM != '-'">
        <div>
          <v-textarea label="node1 [Работает]" v-model="inputText" solo full-width auto-grow
            @keyup.enter="appendText"></v-textarea>
        </div>
      </div>
      <div v-else>
        <h1>Нет доступных бронирований!</h1>
      </div>

    </div>
    <RightSideСalendar />
  </div>
  <div class="centered-container" v-else>
    <h1 style="color: white; margin-bottom: 15px;">Выполните вход!</h1>
    <v-btn @click="$router.push('/')" class="transparent-button">
      Войти
    </v-btn>
  </div>
</template>

<script>
import RightSideСalendar from '../components/RightSideСalendar.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    RightSideСalendar
  },
  data() {
    return {
      inputText: 'user@node1~$: ',
    }
  },
  computed: {
    ...mapGetters(["getPeoples", "getNumberVM"]),
  },
  methods: {
    appendText() {
      this.inputText += 'user@node1~$: ';
    }
  }
}
</script>

<style scoped>
.centered-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.page {
  margin-top: 4.5%;
  color: azure;
  margin-left: 3.4%;
  width: 70%;
}
</style>
