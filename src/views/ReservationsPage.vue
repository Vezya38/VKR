<template>
  <div v-if="getNumberVM != ''">
    <div class="page" style="color: white;">

      <div style="display: flex; justify-content: flex-start;">
        <v-btn @click="dialog = true" style="border-radius: 5px;">Добавить бронь</v-btn>
      </div>

      <br>

      <div style="height: 400px; margin-bottom: 30px;" class="container" v-for="reservation in userReservations"
        :key="reservation.key">

        <div class="top-half">
          <div class="dbtn">
            <v-btn @click="openInfo(reservation.description, reservation.param)"
              style="margin: 1.5%; border-radius: 10px;">Информация</v-btn>
              <v-btn v-if="reservation.status === 'Одобрена'" @click="$router.push('/vm')"
              style="margin-top: 1.5%; border-radius: 10px;">Виртуальная машина</v-btn>
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
              <v-btn @click="lookStatus(reservation.status, reservation.ram, reservation.os, reservation.disk)"
                style="width: 170px; margin-bottom: 19px; border-radius: 10px;">Узнать статус</v-btn>
              <v-btn @click="deleteRecord(reservation.key)" style="width: 170px; border-radius: 10px;">Отменить</v-btn>
            </div>
          </div>

        </div>
      </div>

      <v-dialog v-model="dialog" width="auto">
        <div class="fdial">
          <h4 style="margin-top: 10px; margin-bottom: 10px;">Цель</h4>

          <v-text-field label="Введите цель бронирования" v-model="target" hide-details="auto"></v-text-field>

          <h4 style="text-align: left; margin-top: 10px; margin-bottom: 10px;">
            Выберите время
          </h4>
          <v-btn :style="backcol[0]" @click="changeBaccol(0)" class="ftime">08:00 - 09:00</v-btn>
          <v-btn :style="backcol[1]" @click="changeBaccol(1)" class="ftime">09:00 - 10:00</v-btn>
          <v-btn :style="backcol[2]" @click="changeBaccol(2)" class="ftime">10:00 - 11:00</v-btn>
          <v-btn :style="backcol[3]" @click="changeBaccol(3)" class="ftime">11:00 - 12:00</v-btn>
          <v-btn :style="backcol[4]" @click="changeBaccol(4)" class="ftime">12:00 - 13:00</v-btn>
          <v-btn :style="backcol[5]" @click="changeBaccol(5)" class="ftime">13:00 - 14:00</v-btn>
          <v-btn :style="backcol[6]" @click="changeBaccol(6)" class="ftime">14:00 - 15:00</v-btn>
          <v-btn :style="backcol[7]" @click="changeBaccol(7)" class="ftime">15:00 - 16:00</v-btn>
          <v-btn :style="backcol[8]" @click="changeBaccol(8)" class="ftime">16:00 - 17:00</v-btn>

          <hr style="margin-bottom: 10px;">

          <h4 style="margin-bottom: 10px; margin-top: 10px;">Дополнительная информация</h4>
          <v-text-field label="Добавьте информацию" v-model="description" hide-details="auto"></v-text-field>
          <h4 style="margin-bottom: 10px; margin-top: 10px;">Укажите параметры</h4>
          <v-text-field label="Добавьте параметры системы" v-model="param" hide-details="auto"></v-text-field>

          <div class="forbd">
            <v-btn @click="reserv()"
              style="width: 200px; margin-right: 20px; border-radius: 10px;">Забронировать</v-btn>
            <v-btn @click="dialog = false" style="width: 200px; border-radius: 10px;">Отмена</v-btn>
          </div>
        </div>
      </v-dialog>

      <v-dialog v-model="dialogStatus" width="auto">
        <div class="infoDial">
          <p style="margin-bottom: 10px;">Статус заявки: {{ status }}</p>
          <p style="margin-bottom: 20px;"> {{ parametrs }}</p>
          <v-btn @click="dialogStatus = false">
            Ок
          </v-btn>
        </div>
      </v-dialog>

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
import { ref, push, onValue, remove } from "firebase/database";
import { db } from "@/firebase.js";
import RightSideСalendar from '../components/RightSideСalendar.vue';
import { mapGetters } from "vuex";

export default {
  components: {
    RightSideСalendar
  },
  data() {
    return {
      dialog: false,
      dialogStatus: false,
      dialogInformation: false,
      inform: "",
      status: "",
      parametrs: "",
      backcol: [
        "", "", "", "", "", "", "", "", ""
      ],
      target: '',
      description: '',
      param: '',
      time: [
        "false", "false", "false", "false", "false", "false", "false", "false", "false"
      ],
      reservations: [],
      times: {}
    }
  },
  computed: {
    ...mapGetters(["getNumberVM", "getId"]),
    userReservations() {
      return this.reservations.filter(reservation => reservation.user === this.getId);
    },
    filteredTimes() {
      return (reservationKey) => {
        const times = this.times[reservationKey] ? this.times[reservationKey][0] : {};
        return Object.entries(times).filter(([key]) => key !== 'reserv');
      };
    }
  },
  methods: {
    deleteRecord(id) {
      const resRef = ref(db, `Reservations/${id}`);
      remove(resRef).then(() => {
        const timesRef = ref(db, 'Times');
        onValue(timesRef, (snapshot) => {
          const data = snapshot.val();
          for (let key in data) {
            if (data[key].reserv === id) {
              const timeRef = ref(db, `Times/${key}`);
              remove(timeRef).catch((error) => {
                console.error('Ошибка при удалении времени: ', error);
              });
            }
          }
        });
      }).catch((error) => {
        console.error('Ошибка при удалении записи: ', error);
      });
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
    openInfo(info, par) {
      this.dialogInformation = true;
      this.inform = info + ', ' + par;
    },
    lookStatus(stat, ram, os, disk) {
      this.dialogStatus = true;
      this.status = stat;
      if(os === '') {
        this.parametrs = 'Параметры не заданы';
      }
      else
        this.parametrs = ' RAM: ' + ram + ', OS: ' + os + ', Объем диска: ' + disk;
    },
    chengeTheme(emp) {
      if (emp == "true") {
        return "background-color: #C0C0C0";
      }
      else
        return "";
    },
    changeBaccol(N) {
      if (this.backcol[N] == "") {
        this.backcol[N] = "background-color: #C0C0C0;";
        this.time[N] = "true";
      }
      else {
        this.backcol[N] = "";
        this.time[N] = "false";
      }
    },
    reserv() {
      const resRef = ref(db, 'Reservations');
      push(resRef, {
        target: this.target,
        description: this.description,
        param: this.param,
        user: this.getId,
        ram: '',
        os: '',
        disk: '',
        status: 'На рассмотрении'
      }).then((newResRef) => {
        const newKey = newResRef.key;

        const timeRef = ref(db, 'Times');
        push(timeRef, {
          reserv: newKey,
          "08:00-09:00": this.time[0],
          "09:00-10:00": this.time[1],
          "10:00-11:00": this.time[2],
          "11:00-12:00": this.time[3],
          "12:00-13:00": this.time[4],
          "13:00-14:00": this.time[5],
          "14:00-15:00": this.time[6],
          "15:00-16:00": this.time[7],
          "16:00-17:00": this.time[8],
          "17:00-18:00": 'false',
          "18:00-19:00": 'false',
          "19:00-20:00": 'false'
        }).then(() => {
          this.dialog = false;
          this.target = '';
          this.description = '';
          this.param = '';
          for (let i = 0; i < this.backcol.length; i++) {
            this.backcol[i] = "";
            this.time[i] = "false";
          }
        }).catch((error) => {
          console.error('Ошибка при добавлении записи: ', error);
        });

      }).catch((error) => {
        console.error('Ошибка при добавлении записи: ', error);
      });
    }
  },
  created() {
    this.fetchReservations(); // вызов метода при создании компонента
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

.forbd {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.forp {
  border-radius: 10px;
  background-color: #C0C0C0;
  padding: 6px;
}

.faces-container {
  height: 50px;
  display: flex;
  align-items: center;
}

.ftime {
  width: 150px;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.fdial {
  background-color: #ececec;
  width: 520px;
  padding: 20px;
  border-radius: 10px;
}
</style>