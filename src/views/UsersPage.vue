<template>
  <div v-if="getNumberVM != ''">
    <div class="page" style="color: white;">
      <h2 style="display: flex; justify-content: flex-start; margin-top: 20px; 
        margin-bottom: 20px;">Пользователи системы</h2>

      <div style="margin-bottom: 20px; border: 1px solid grey;" class="container" v-for="user in users" :key="user.id">
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
          <p style="margin-bottom: 10px; margin-left: 10px; margin-top: 10px;">{{ user.firstName }} {{ user.lastName }}
          </p>
          <p style="margin-bottom: 10px; margin-left: 10px;">Почта: {{ user.email }}</p>
          <p style="margin-bottom: 10px; margin-left: 10px;">Телефон: {{ user.phone }}</p>
          <p style="margin-bottom: 10px; margin-left: 10px;">Пол: {{ user.gender }}</p>
          <p style="margin-bottom: 10px; margin-left: 10px;">Роль: {{ user.role }}</p>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-bottom: 10px; margin-right: 10px;">
          <v-btn @click="deleteRecord(user.id)" style="border-radius: 5px; margin-right: 10px;">Удалить</v-btn>
          <v-btn @click="changeRecord(user)" style="border-radius: 5px;">Изменить</v-btn>
        </div>
      </div>
    </div>

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
import { ref, onValue, remove, update } from "firebase/database";
import { db } from "@/firebase.js";
import RightSideСalendar from '../components/RightSideСalendar.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    RightSideСalendar
  },
  data() {
    return {
      users: [],
      dialog: false,
      mail: '',
      phone: '',
      password: '',
      userId: ''

    }
  },
  computed: {
    ...mapGetters(["getNumberVM", "getId"]),
  },
  methods: {
    enter() {
      const userRef = ref(db, `Users/${this.userId}`);
      update(userRef, {
        email: this.mail,
        phone: this.phone,
        password: this.password
      }).then(() => {
        this.change = false;
      }).catch((error) => {
        console.error('Ошибка при обновлении записи: ', error);
      });
      this.dialog = false;
    },
    fetchUsers() {
      const userRef = ref(db, 'Users');
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        const usersArray = [];
        for (let key in data) {
          usersArray.push({ id: key, ...data[key] });
        }
        this.users = usersArray;
      });
    },
    changeRecord(user) {
      this.dialog = true;
      this.userId = user.id;
      this.mail = user.email;
      this.phone = user.phone;
      this.password = user.password;

    },
    deleteRecord(id) {
      const userRef = ref(db, `Users/${id}`);
      remove(userRef).then(() => {
        this.fetchUsers();
      }).catch((error) => {
        console.error('Ошибка при удалении записи: ', error);
      });
    }
  },
  created() {
    this.fetchUsers();
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

.centered-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.container {
  border-radius: 10px;
}

.page {
  margin-top: 4.5%;
  color: azure;
  margin-left: 3.4%;
  width: 70%;
}
</style>