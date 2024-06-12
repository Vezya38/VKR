<template>
    <div class="centered-container">
        <h1 style="color: white; margin-bottom: 15px;">Вход</h1>
        <div style="color: white; width: 300px;">
            <v-text-field class="text-center" label="Почта" v-model="email" hide-details="auto"></v-text-field>
            <v-text-field label="Пароль" v-model="password"></v-text-field>
        </div>
        <v-btn @click="enter" class="transparent-button">
            Войти
        </v-btn>
        <div style="color: #C0C0C0; margin-top: 15px;">
            Нет аккаунта? <router-link style="color: blue;" to="/registration">Зарегистрироваться</router-link>
        </div>
    </div>
</template>

<script>
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { db } from "@/firebase.js";
import { mapMutations } from "vuex";

export default {
    data() {
        return {
            email: '',
            password: ''
        };
    },
    methods: {
        ...mapMutations(["changeUser"]),
        async enter() {
            if (this.email === '' || this.password === '') {
                alert('Поля не могут быть пустыми!');
                return;
            }
            
            try {
                const usersRef = ref(db, 'Users');
                const emailQuery = query(usersRef, orderByChild('email'), equalTo(this.email));
                const snapshot = await get(emailQuery);

                if (snapshot.exists()) {
                    const users = snapshot.val();
                    const userId = Object.keys(users).find(key => users[key].password === this.password);

                    if (userId) {
                        const user = users[userId];
                        console.log('Пользователь найден: ', user);
                        this.changeUser({ user, userId });
                        if (user.role === 'admin')
                            this.$router.push('/answer');
                        else
                            this.$router.push('/reservations');
                    } else {
                        alert('Неверный пароль.');
                    }
                } else {
                    alert('Пользователь с таким email не найден.');
                }
            } catch (error) {
                console.error('Ошибка при входе: ', error);
                alert('Произошла ошибка при входе.');
            }
        }
    }
};
</script>

<style scoped>
.transparent-button {
    width: 160px;
    color: white;
    border: 1px solid white;
    background-color: transparent !important;
}

.centered-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
</style>
