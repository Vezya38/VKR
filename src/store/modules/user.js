// store.js
export default {
    state: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        role: '',
        numberVM: '',
        password: ''
    },

    getters: {
        getId(state) {
            return state.id;
        },
        getUser(state) {
            return state.firstName + " " + state.lastName;
        },
        getGender(state) {
            return state.gender;
        },
        getMail(state) {
            return state.email;
        },
        getPhone(state) {
            return state.phone;
        },
        getRole(state) {
            return state.role;
        },
        getNumberVM(state) {
            return state.numberVM;
        },
        getPassword(state) {
            return state.password;
        }
    },

    mutations: {
        changeUser(state, payload) {
            const { user, userId } = payload;
            state.id = userId;
            state.firstName = user.firstName;
            state.lastName = user.lastName;
            state.email = user.email;
            state.phone = user.phone;
            state.gender = user.gender;
            state.role = user.role;
            state.numberVM = user.numberVM;
            state.password = user.password
        },
        changeNumberVM(state, newNumberVM) {
            state.numberVM = newNumberVM;
        }
    },

    actions: {}
};
