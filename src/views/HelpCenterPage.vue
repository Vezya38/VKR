<template>
  <div v-if="getNumberVM != ''">
    <div class="page" style="color: white;">
      <v-textarea label="Обращение в тех. поддержку" v-model="question" solo full-width></v-textarea>
      <div style="display: flex; justify-content: flex-start;">
        <v-btn @click="send()" style="border-radius: 5px;">Отправить</v-btn>
      </div>
      <h2 style="display: flex; justify-content: flex-start; margin-top: 20px; margin-bottom: 20px;">Мои обращения:</h2>

      <div style="margin-bottom: 20px; border: 1px solid grey;" class="container" v-for="item in userQuestions"
        :key="item.id">
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
          <h2 style="margin-bottom: 10px; margin-top: 5px; margin-left: 10px;">Обращение:</h2>
          <p style="margin-bottom: 10px; margin-left: 10px;">{{ item.question }}</p>
          <h2 style="margin-bottom: 10px; margin-left: 10px;">Ответ поддержки:</h2>
          <p style="margin-bottom: 10px; margin-left: 10px;">{{ item.answer }}</p>
        </div>
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
import { ref, push, onValue } from "firebase/database";
import { db } from "@/firebase.js";
import RightSideСalendar from '../components/RightSideСalendar.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    RightSideСalendar
  },
  data() {
    return {
      question: '',
      questions: [] // добавлено поле для хранения вопросов
    }
  },
  computed: {
    ...mapGetters(["getNumberVM", "getId"]),
    userQuestions() {
      return this.questions.filter(question => question.user === this.getId);
    }
  },
  methods: {
    send() {
      const questionRef = ref(db, 'Questions');
      push(questionRef, {
        user: this.getId,
        question: this.question,
        answer: '-'
      }).then(() => {
        alert("Отправлено!");
        this.question = '';
        this.fetchQuestions(); // обновляем список вопросов после отправки
      }).catch((error) => {
        console.error('Ошибка при отправке: ', error);
      });
    },
    fetchQuestions() {
      const questionRef = ref(db, 'Questions');
      onValue(questionRef, (snapshot) => {
        const data = snapshot.val();
        const questionsArray = [];
        for (let key in data) {
          questionsArray.push({ id: key, ...data[key] });
        }
        this.questions = questionsArray;
      });
    }
  },
  created() {
    this.fetchQuestions(); // вызов метода при создании компонента
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
