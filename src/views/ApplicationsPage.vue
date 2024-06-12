<template>
  <div v-if="getNumberVM != ''">
    <div class="page" style="color: white;">

      <div style="height: 400px; margin-bottom: 30px;" class="container" v-for="reservation in filteredReservations"
        :key="reservation.key">

        <div class="top-half">
          <div class="dbtn">
            <v-btn @click="openInfo(reservation.description, reservation.param)"
              style="margin: 1.5%; border-radius: 10px;">Информация</v-btn>
          </div>
          <div class="ttit">
            <h2>{{ reservation.target }}</h2>
          </div>
        </div>
        <div class="bottom-half">
          <div class="child1">
            <div class="parent">
              <div class="elem" v-for="([time, value], index) in filteredTimes(reservation.key)"
                :style="chengeTheme(value)" :key="index">
                {{ time }}
              </div>
            </div>
          </div>
          <div class="child2" style="color: black;">
            <div>
              <v-btn @click="enterRes(reservation.key, reservation.user)"
                style="width: 170px; margin-bottom: 19px; border-radius: 10px;">Принять</v-btn>
              <v-btn @click="changeStatus(reservation.key, 'Отклонена', reservation.user)"
                style="width: 170px; border-radius: 10px;">Отклонить</v-btn>

            </div>
          </div>
        </div>
      </div>

      <v-dialog v-model="dialogInformation" width="auto">
        <div class="infoDial">
          <h2 style="margin-bottom: 20px;">Информация</h2>
          <p>
            {{ inform }}
          </p>
          <br>
          <v-btn @click="dialogInformation = false">
            ок
          </v-btn>
        </div>
      </v-dialog>

      <v-dialog v-model="dialogEnter" width="auto">
        <div class="fdial">

          <h4 style="margin-top: 10px; margin-bottom: 10px;">RAM</h4>
          <v-text-field label="Укажите RAM (Гб)" v-model="ram" hide-details="auto"></v-text-field>

          <hr style="margin-bottom: 10px;">

          <h4 style="margin-bottom: 10px; margin-top: 10px;">Общий объем диска</h4>
          <v-text-field label="Укажите общий объем диска (Гб)" v-model="disk" hide-details="auto"></v-text-field>

          <h4 style="margin-bottom: 10px; margin-top: 10px;">Операционная система</h4>
          <v-text-field label="Выберите ОС" v-model="os" hide-details="auto"></v-text-field>

          <div class="forbd">
            <v-btn @click="changeStatus(this.keyRes, 'Одобрена', this.userRes)"
              style="width: 200px; margin-right: 20px; border-radius: 10px;">Выделить ресурсы</v-btn>
            <v-btn @click="dialogEnter = false" style="width: 200px; border-radius: 10px;">Отмена</v-btn>
          </div>
        </div>
      </v-dialog>

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
import { ref, onValue, update } from "firebase/database";
import { db } from "@/firebase.js";
import RightSideСalendar from '../components/RightSideСalendar.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    RightSideСalendar
  },
  data() {
    return {
      keyRes: '',
      userRes: '',
      ram: '',
      disk: '',
      os: '',
      dialogInformation: false,
      dialogEnter: false,
      inform: "",
      reservations: []
    }
  },
  computed: {
    ...mapGetters(["getReservation", "getNumberVM"]),
    filteredReservations() {
      return this.reservations.filter(reservation => reservation.status === 'На рассмотрении');
    },
    filteredTimes() {
      return (reservationKey) => {
        const times = this.times[reservationKey] ? this.times[reservationKey][0] : {};
        return Object.entries(times).filter(([key]) => key !== 'reserv');
      };
    }
  },
  methods: {
    enterRes(newKey, newUser) {
      this.dialogEnter = true;
      this.keyRes = newKey;
      this.userRes = newUser;
    },
    changeStatus(id, newStatus, user) {
      const resRef = ref(db, `Reservations/${id}`);
      update(resRef, {
        status: newStatus,
        ram: this.ram,
        disk: this.disk,
        os: this.os,
      }).then(() => {
        if (newStatus != 'Отклонена') {
          const usRef = ref(db, `Users/${user}`);
          update(usRef, {
            numberVM: Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000
          }).then(() => {
            this.fetchReservations();
          }).catch((error) => {
            console.error('Ошибка при обновлении статуса: ', error);
          });
        }
        else {
          this.fetchReservations();
        }
      }).catch((error) => {
        console.error('Ошибка при обновлении статуса: ', error);
      });

      this.ram = '';
      this.disk = '';
      this.os = '';
      this.dialogEnter = false;
    },
    openInfo(info, par) {
      this.dialogInformation = true;
      this.inform = info + '\n' + par;
    },
    chengeTheme(emp) {
      if (emp == "true") {
        return "background-color: #C0C0C0";
      } else {
        return "";
      }
    },
    fetchReservations() {
      const resRef = ref(db, 'Reservations');
      onValue(resRef, (snapshot) => {
        const data = snapshot.val();
        const reservationsArray = [];
        for (let key in data) {
          reservationsArray.push({ key, ...data[key] });
        }
        this.reservations = reservationsArray;
        this.fetchTimes();
      });
    },
    fetchTimes() {
      const timeRef = ref(db, 'Times');
      onValue(timeRef, (snapshot) => {
        const data = snapshot.val();
        const timesObj = {};
        for (let key in data) {
          const time = data[key];
          if (!timesObj[time.reserv]) {
            timesObj[time.reserv] = [];
          }
          timesObj[time.reserv].push(time);
        }
        this.times = timesObj;
      });
    },
  },
  created() {
    this.fetchReservations(); // вызов метода при создании компонента
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

.infoDial {
  text-align: center;
  background-color: #ececec;
  width: 400px;
  padding: 20px;
  border-radius: 10px;
}

.elem {
  display: flex;
  color: black;
  margin-right: 5px;
  margin: 6px;
  border-radius: 10px;
  height: 40px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border: 2px solid #C0C0C0;
}

.parent {
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  align-items: center;
}

.child1 {
  width: 130%;
  background-color: #ececec;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
  align-items: center;

}

.child2 {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.ttit {
  display: flex;
  align-items: left;
  margin-top: 140px;
  margin-left: 2%;
  color: black;
}

.dbtn {
  display: flex;
  align-items: left;
}

.top-half {
  background-color: #C0C0C0;
  height: 65%;
}

.bottom-half {
  background-color: #ececec;
  height: 35%;
  display: flex;
}

.bottom-half>div {
  margin-right: 10px;
}

.container {
  height: 300px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.page {
  margin-top: 4.5%;
  color: azure;
  margin-left: 3.4%;
  width: 70%;
}
</style>