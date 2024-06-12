<template>
    <div class="centered-container">

        <h1 style="color: white; margin-bottom: 15px;">Регистрация</h1>

        <div style="color: white; width: 300px;">
            <v-text-field label="Имя" v-model="firstName" hide-details="auto"></v-text-field>
            <v-text-field label="Фамилия" v-model="lastName" hide-details="auto"></v-text-field>
            <v-text-field label="Почта" v-model="email" hide-details="auto"></v-text-field>
            <v-text-field label="Телефон" v-model="phone" hide-details="auto"></v-text-field>
            <v-text-field label="Пол" v-model="gender" hide-details="auto"></v-text-field>
            <v-text-field label="Пароль" v-model="password"></v-text-field>
        </div>

        <div style="margin-bottom: 5px;">
        <v-btn @click="addUser()" class="transparent-button">
            Зарегистрироваться
        </v-btn>
    </div>
        <v-btn @click="$router.push('/');" class="transparent-button">
            Отмена
        </v-btn>
    

    </div>
</template>
    
<script>
import { ref, push } from "firebase/database";
import { db } from "@/firebase.js";

export default {

    data() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            gender: '',
            password: ''
        };
    },

    methods: {
        addUser() {
            const formulasRef = ref(db, 'Users');
            push(formulasRef, {
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                phone: this.phone,
                gender: this.gender,
                role: 'user',
                numberVM: '-',
                password: this.password
            }).then(() => {
                this.$router.push('/');
            }).catch((error) => {
                console.error('Ошибка при добавлении формулы: ', error);
            });
        }
    }
};
</script>
    
<style scoped>
.transparent-button {
    width: 220px;
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
    