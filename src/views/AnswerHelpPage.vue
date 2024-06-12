<template>
  <div v-if="getNumberVM != ''">
    <div class="page" style="color: white;">

      <h2 style="display: flex; justify-content: flex-start; margin-top: 20px; margin-bottom: 20px;">Обращения в
        поддержку:</h2>

      <div style="margin-bottom: 20px; border: 1px solid grey;" class="container" v-for="item in answerQuestions"
        :key="item.key">
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
          <h2 style="margin-bottom: 10px; margin-top: 5px; margin-left: 10px;">Обращение:</h2>
          <p style="margin-bottom: 10px; margin-left: 10px;">{{ item.question }}</p>
          <v-textarea label="Ответ на обращение" v-model="inputText" solo
            style="width: 600px; margin-left: 10px;"></v-textarea>
          <div>
            <v-btn @click="changeAnswer(item.key)"
              style="border-radius: 5px; margin-left: 10px; margin-bottom: 10px;">Ответить</v-btn>
          </div>
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
import { ref, update, onValue } from "firebase/database";
import { db } from "@/firebase.js";
import RightSideСalendar from '../components/RightSideСalendar.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    RightSideСalendar
  },
  data() {
    return {
      inputText: '',
      questions: []
    }
  },
  computed: {
    ...mapGetters(["getNumberVM"]),
    answerQuestions() {
      return this.questions.filter(question => question.answer === '-');
    }
  },
  methods: {
    fetchQuestions() {
      const questionRef = ref(db, 'Questions');
      onValue(questionRef, (snapshot) => {
        const data = snapshot.val();
        const questionsArray = [];
        for (let key in data) {
          questionsArray.push({ key, ...data[key] });
        }
        this.questions = questionsArray;
      });
    },
    changeAnswer(key) {
      const qRef = ref(db, `Questions/${key}`);
      update(qRef, {
        answer: this.inputText
      }).then(() => {
        this.fetchQuestions();
        this.inputText = ''; // Очистка текстового поля после отправки ответа
      }).catch((error) => {
        console.error('Ошибка при ответе: ', error);
      });
    }
  },
  created() {
    this.fetchQuestions(); 
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
