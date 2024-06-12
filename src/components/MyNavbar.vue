<template>
  <v-container fluid>
    <v-app-bar v-if="getNumberVM != ''" :elevation="0" class="transparent">
      <div style="margin-left: auto; margin-right: 15px;">

        <router-link v-if="getRole == 'admin'" to="/formulas" class="forb">
          <button class="myButton">
            Бот
          </button>
        </router-link>

        <router-link v-if="getRole == 'user'" to="/reservations" class="forb">
          <button class="myButton">
            Мои бронирования
          </button>
        </router-link>

        <a v-if="getRole == 'admin'" href="http://192.168.0.103:3000/?orgId=1" target="_blank" class="forb">
          <button class="myButton">
            Мониторинг
          </button>
        </a>

        <router-link v-if="getRole == 'admin'" to="/applications" class="forb">
          <button class="myButton">
            Заявки
          </button>
        </router-link>

        <router-link v-if="getRole == 'user'" to="/information" class="forb">
          <button class="myButton">
            О платформе
          </button>
        </router-link>

        <router-link v-if="getRole == 'user'" to="/help" class="forb">
          <button class="myButton">
            Центр помощи
          </button>
        </router-link>

        <router-link v-if="getRole == 'admin'" to="/answer" class="forb">
          <button class="myButton">
            Обращения в поддержку
          </button>
        </router-link>

        <router-link v-if="getRole == 'admin'" to="/users" class="forb">
          <button class="myButton">
            Пользователи
          </button>
        </router-link>

      </div>

      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <button v-bind="props" class="btn" style="margin-right: 2.5%; color: white;">
            <i class="fa fa-user-circle fa-2x" aria-hidden="true"></i>
          </button>
        </template>

        <v-list style="margin-top: 15px; text-align: center; border: 2px solid white;">
          <v-list-item v-if="getRole">
            <v-list-item-title>{{ getUser }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Почта: {{ getMail }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Телефон: {{ getPhone }}</v-list-item-title>
          </v-list-item>

          <v-list-item @click="changeData">
            <v-list-item-title>Изменить данные</v-list-item-title>
          </v-list-item>

          <v-list-item @click="exit">
            <v-list-item-title>Выход</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </v-container>

  <v-dialog v-model="dialog" width="auto">
      <div class="fdial">

        <h4 style="margin-top: 10px; margin-bottom: 10px;">Укажите новую почту</h4>
        <v-text-field label="Почта" v-model="mail" hide-details="auto"></v-text-field>

        <hr style="margin-bottom: 10px;">

        <h4 style="margin-bottom: 10px; margin-top: 10px;">Укажите новый телефон</h4>
        <v-text-field label="Телефон" v-model="phone" hide-details="auto"></v-text-field>

        <h4 style="margin-bottom: 10px; margin-top: 10px;">Укажите новый пароль</h4>
        <v-text-field label="Пароль" v-model="password" hide-details="auto"></v-text-field>

        <div class="forbd">
          <v-btn @click="enter()" style="width: 200px; margin-right: 20px; border-radius: 10px;">Изменить</v-btn>
          <v-btn @click="dialog = false" style="width: 200px; border-radius: 10px;">Отмена</v-btn>
        </div>
      </div>
    </v-dialog>
</template>

<script>
import { ref, update } from "firebase/database";
import { db } from "@/firebase.js";
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      dialog: false,
      password: '',
      phone: '',
      mail: ''
    }
  },
  computed: mapGetters(["getId", "getUser", "getGender", "getMail", "getPhone", "getRole", "getPassword", "getNumberVM"]),
  name: 'MyNavbar',
  methods: {
    ...mapMutations(["changeNumberVM"]),
    exit() {
      this.changeNumberVM('');
      this.$router.push('/');
    },
    changeData() {
      this.dialog = true;
      this.password = this.getPassword;
      this.phone = this.getPhone;
      this.mail = this.getMail
    },
    enter() {
      const userRef = ref(db, `Users/${this.getId}`);
      update(userRef, {
        email: this.mail,
        phone: this.phone,
        password: this.password
      }).then(() => {
        this.exit();
      }).catch((error) => {
        console.error('Ошибка при обновлении записи: ', error);
      });
      this.dialog = false;
    }
  }
}
</script>

<style scoped>

.forbd {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fdial {
  background-color: #ececec;
  width: 520px;
  padding: 20px;
  border-radius: 10px;
}

.forb {
  color: white;
  font-size: 30px;
}

.transparent {
  margin-top: 0.7%;
  background-color: transparent !important;
}

.myButton:hover {
  background-color: #C0C0C0 ; /* Изменяем цвет фона при наведении */
  color: black;
  padding: 15px;
}

.myButton {
  padding: 15px;
}
</style>
