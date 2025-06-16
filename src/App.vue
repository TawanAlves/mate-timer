<template>
  <main>
    <div id="app-container">
      <MateIcon />
      <h1>Mate Timer</h1>
      <div class="input-section">
        <label for="minutes-input">Tempo em Minutos:</label>
        <input type="number" id="minutes-input" v-model.number="minutesInput" placeholder="Insira os minutos" min="1"
          :disabled="inputDisabled" />

        <div class="button-container">

          <button v-if="!isProgressing && progress == 0" @click="startProgress"
            :disabled="isProgressing || minutesInput <= 0" >
            Inciar Timer
          </button>

          <button v-if="isProgressing && progress < 100" class="stop-button" @click="pauseProgress">
            Pausar
          </button>
          <button v-if="!isProgressing && progress > 0 && progress < 100" @click="continueProgress">
            Continuar
          </button>
          <button v-if="progress > 0 && !isProgressing" @click="resetProgress" class="stop-button">Zerar</button>

          <!-- <button v-if="isProgressing" @click="stopProgress" class="stop-button">Parar Timer</button> -->
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar-fill" :style="{ width: progressBarWidth }"></div>
      </div>

      <p class="progress-text">Progresso: {{ progress.toFixed(2) }}%</p>
      <p v-if="isProgressing && minutesInput > 0" class="time-remaining">
        Tempo Restante: {{ formatTime(timeRemaining) }}
      </p>

      <div v-if="message" :class="messageType">{{ message }}</div>
    </div>

  </main>
</template>

<script setup lang="ts">
import MateIcon from './components/MateIcon.vue'
import { ref, computed } from 'vue'

const minutesInput = ref(0)
const progress = ref(0)
const timeRemaining = ref(0)
const isProgressing = ref(false)

let intervalId: number | null = null
let totalDuration = 0
let elapsedTime = 0
let lastStartTime = 0

const message = ref('')
const messageType = ref('')


const inputDisabled = computed(() => isProgressing.value || (progress.value > 0 && progress.value < 100))


const startProgress = () => {
  stopProgress()

  if (minutesInput.value <= 0) {
    showMessage('Insira um número positivo de minutos.', 'error')
    return
  }

  totalDuration = minutesInput.value * 60
  elapsedTime = 0
  runTimer()
}

const runTimer = () => {
  lastStartTime = Date.now()
  isProgressing.value = true

  intervalId = setInterval(() => {
    const now = Date.now()
    const delta = (now - lastStartTime) / 1000
    const totalElapsed = elapsedTime + delta

    progress.value = (totalElapsed / totalDuration) * 100
    timeRemaining.value = Math.max(0, Math.floor(totalDuration - totalElapsed))

    if (progress.value >= 100) {
      progress.value = 100
      timeRemaining.value = 0
      stopProgress()
      showMessage('Tempo concluído!', 'success')
        playSoundThreeTimes()
    }
  }, 100)
}

const pauseProgress = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    elapsedTime += (Date.now() - lastStartTime) / 1000
    isProgressing.value = false
  }
}

const continueProgress = () => {
  if (progress.value >= 100 || isProgressing.value) return
  runTimer()
  // showMessage('Cronômetro continuado!', 'info')
}

const resetProgress = () => {
  stopProgress()
  minutesInput.value = 0
  progress.value = 0
  timeRemaining.value = 0
  elapsedTime = 0
  totalDuration = 0
  showMessage('Cronômetro zerado.', 'info')
}

const stopProgress = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  isProgressing.value = false
}

const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const progressBarWidth = computed(() => `${Math.min(100, progress.value)}%`)

const showMessage = (msg: string, type: string) => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000)
}

const playSound = () => {
  const audio = new Audio('/timer.mp3')
  audio.play()
}

const playSoundThreeTimes = () => {
  let count = 0
  const play = () => {
    if (count < 3) {
      const audio = new Audio('/timer.mp3')
      audio.play()
      count++
      audio.onended = play
    }
  }
  play()
}


</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background-color: #f0f2f5;
  color: #333;
}

#app-container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  /* Cantos arredondados */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width:  300px;
  /* Responsivo */
  box-sizing: border-box;
  /* Inclui padding e border no width */
}

h1 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.8em;
}

.input-section {
  margin-bottom: 30px;
}

.button-container {
  padding-top: 1rem;
  display: flex;
  /* align-items: ; */
  justify-content: center;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #555;
}

input[type="number"] {
  padding: 12px 15px;
  width: calc(100% - 30px);
  max-width: 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1em;
  margin-right: 10px;
  box-sizing: border-box;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1em;
  margin: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

button:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-2px);
}

button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
}

.stop-button {
  background-color: #f44336;
}

.stop-button:hover:not(:disabled) {
  background-color: #da190b;
}

.progress-bar-container {
  width: 100%;
  height: 30px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar-fill {
  height: 100%;
  background-color: #4CAF50;
  width: 0%;
  transition: width 0.1s linear;
  border-radius: 8px 0 0 8px;
}

.progress-bar-fill[style*="width: 100%"] {
  border-radius: 8px;
}

.progress-text,
.time-remaining {
  margin-top: 15px;
  font-size: 1.1em;
  font-weight: 500;
  color: #444;
}

.message {
  margin-top: 20px;
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: bold;
}

.success {
  background-color: #e6ffe6;
  color: #008000;
  border: 1px solid #008000;
}

.error {
  background-color: #ffe6e6;
  color: #cc0000;
  border: 1px solid #cc0000;
}

.info {
  background-color: #e6f7ff;
  color: #0066cc;
  border: 1px solid #0066cc;
}

@media (max-width: 600px) {
  .input-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input[type="number"] {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }

  button {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
