<template>
   <main>
     <div id="app-container">
        <MateIcon />
       <h1>Mate Timer</h1>

       <div class="input-section">
         <label for="minutes-input">Minutos:</label>
      <input
        type="number"
        id="minutes-input"
        v-model.number="minutesInput"
        placeholder="Insira os minutos"
        min="1"
        :disabled="isProgressing"
      />
    <button v-if="!isProgressing" @click="startProgress" :disabled="isProgressing || minutesInput <= 0">
      Inciar Timer
    </button>
    <button v-if="isProgressing" @click="stopProgress" class="stop-button">Parar Timer</button>
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
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import MateIcon from './components/MateIcon.vue'

import { ref, computed } from 'vue'

// Variável reativa para o valor do input de minutos
const minutesInput = ref(0)
// Variável reativa para o progresso atual (0-100%)
const progress = ref(0)
// ID do intervalo para limpar quando o progresso terminar ou for parado
let intervalId: number | null = null
// Duração total em segundos
let durationInSeconds = 0
// Tempo de início da barra de progresso
let startTime = 0
// Flag para indicar se o progresso está em andamento
const isProgressing = ref(false)
// Tempo restante em segundos
const timeRemaining = ref(0)
// Mensagens para o usuário
const message = ref('')
const messageType = ref('') // 'success', 'error', 'info'

/**
 * Inicia a barra de progresso.
 */
const startProgress = () => {
  // Limpa qualquer progresso anterior para evitar múltiplos intervalos
  stopProgress()

  if (minutesInput.value <= 0 || !Number.isInteger(minutesInput.value)) {
    showMessage('Por favor, insira um número inteiro positivo de minutos.', 'error')
    return
  }

  durationInSeconds = minutesInput.value * 60
  progress.value = 0
  startTime = Date.now()
  isProgressing.value = true
  timeRemaining.value = durationInSeconds
  showMessage('Progresso iniciado!', 'info')

  // Atualiza a barra de progresso a cada 100ms
  intervalId = setInterval(() => {
    const elapsedTime = (Date.now() - startTime) / 1000 // Tempo decorrido em segundos
    progress.value = (elapsedTime / durationInSeconds) * 100

    // Calcula o tempo restante
    const remaining = durationInSeconds - elapsedTime
    timeRemaining.value = Math.max(0, Math.floor(remaining)) // Garante que não seja negativo

    if (progress.value >= 100) {
      progress.value = 100 // Garante que o progresso não ultrapasse 100%
      stopProgress()
      showMessage('Progresso concluído!', 'success')
    }
  }, 100) // Intervalo de atualização (100ms para uma animação suave)
}

/**
 * Para a barra de progresso.
 */
const stopProgress = () => {
  if (intervalId !== null) {
    clearInterval(intervalId)
    intervalId = null
  }
  isProgressing.value = false
  timeRemaining.value = 0
  if (progress.value < 100 && progress.value > 0) {
    showMessage('Progresso parado.', 'info')
  }
}

/**
 * Propriedade computada para a largura da barra de preenchimento.
 * Garante que a largura seja sempre entre 0% e 100%.
 */
const progressBarWidth = computed(() => {
  return `${Math.min(100, Math.max(0, progress.value))}%`
})

/**
 * Formata o tempo em segundos para um formato legível (MM:SS).
 * @param {number} seconds - O tempo em segundos.
 * @returns {string} O tempo formatado.
 */
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  const pad = (num: number) => num < 10 ? '0' + num : num
  return `${pad(minutes)}:${pad(remainingSeconds)}`
}

/**
 * Exibe uma mensagem para o usuário.
 * @param {string} msg - A mensagem a ser exibida.
 * @param {string} type - O tipo da mensagem ('success', 'error', 'info').
 */
const showMessage = (msg: string, type: string) => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
    messageType.value = ''
  }, 3000) // Mensagem desaparece após 3 segundos
}
</script>

<style>
/* Estilos globais para centralizar e melhorar a leitura */
body {
  font-family: 'Inter', sans-serif; /* Usando Inter como a fonte padrão */
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
  border-radius: 12px; /* Cantos arredondados */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 90%; /* Responsivo */
  box-sizing: border-box; /* Inclui padding e border no width */
}

h1 {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.8em;
}

.input-section {
  margin-bottom: 30px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #555;
}

input[type="number"] {
  padding: 12px 15px;
  width: calc(100% - 30px); /* Ajusta a largura considerando o padding */
  max-width: 200px; /* Limita a largura máxima do input */
  border: 1px solid #ccc;
  border-radius: 8px; /* Cantos arredondados */
  font-size: 1em;
  margin-right: 10px;
  box-sizing: border-box;
}

button {
  background-color: #4CAF50; /* Verde vibrante */
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px; /* Cantos arredondados */
  cursor: pointer;
  font-size: 1em;
  margin: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding-top: ;
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
  background-color: #f44336; /* Vermelho para parar */
}

.stop-button:hover:not(:disabled) {
  background-color: #da190b;
}

.progress-bar-container {
  width: 100%;
  height: 30px;
  background-color: #f0f0f0; /* Branco para o fundo */
  border: 1px solid #ddd;
  border-radius: 8px; /* Cantos arredondados */
  overflow: hidden; /* Garante que o preenchimento verde não saia */
  margin: 20px 0;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-bar-fill {
  height: 100%;
  background-color: #4CAF50; /* Verde para o preenchimento */
  width: 0%; /* Começa com largura zero */
  transition: width 0.1s linear; /* Transição suave para o preenchimento */
  border-radius: 8px 0 0 8px; /* Cantos arredondados apenas na esquerda para o preenchimento */
}

/* Ajusta o border-radius quando a barra está 100% preenchida */
.progress-bar-fill[style*="width: 100%"] {
    border-radius: 8px;
}

.progress-text, .time-remaining {
  margin-top: 15px;
  font-size: 1.1em;
  font-weight: 500;
  color: #444;
}

/* Estilos para mensagens */
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

/* Responsividade básica */
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

