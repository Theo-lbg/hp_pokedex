<template>
  <div id="app">
    <header class="header-vintage">
      <div class="device-header">
        <div class="header-left">
          <div class="brand-label">🧙 MAGICAL DEVICE™</div>
        </div>
        <h1>{{ $t('header.title') }}</h1>
        <div class="header-right">
          <button class="vintage-toggle lang-btn" @click="toggleLanguage">
            {{ isFrench ? '🇫🇷 FR' : '🇬🇧 EN' }}
          </button>
        </div>
      </div>
      <div class="header-accent"></div>
    </header>
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useLanguage } from './composables/useLanguage'

const { toggleLanguage, isFrench } = useLanguage()
</script>

<style scoped>
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-vintage {
  background: linear-gradient(135deg, var(--vintage-red) 0%, #6b2a2a 100%);
  border-bottom: 6px solid var(--vintage-gold);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  padding: 0;
}

.device-header {
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-left,
.header-right {
  flex: 1;
  max-width: 150px;
}

.brand-label {
  display: inline-block;
  background: var(--vintage-gold);
  color: var(--vintage-dark);
  padding: 6px 12px;
  border: 2px solid var(--vintage-dark);
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.device-header h1 {
  flex: 1;
  text-align: center;
  color: var(--vintage-gold);
  font-size: 24px;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  font-weight: bold;
}

.lang-btn {
  width: 100%;
  padding: 8px 12px;
  font-size: 11px;
}

.header-accent {
  height: 8px;
  background: repeating-linear-gradient(
    90deg,
    var(--vintage-gold) 0px,
    var(--vintage-gold) 2px,
    var(--vintage-red) 2px,
    var(--vintage-red) 4px
  );
}

.main-content {
  flex: 1;
  padding: 30px;
  background: linear-gradient(135deg, #1a1714 0%, #2a2620 50%, #1a1714 100%);
}

@media (max-width: 768px) {
  .device-header {
    flex-direction: column;
    padding: 15px 20px;
  }

  .device-header h1 {
    font-size: 18px;
  }

  .header-left,
  .header-right {
    max-width: 100%;
  }
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', 'Courier', monospace;
  background: linear-gradient(135deg, #1a1714 0%, #2a2620 50%, #1a1714 100%);
  color: var(--vintage-dark, #2a2620);
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
