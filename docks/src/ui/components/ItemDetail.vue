<script setup lang="ts">
import { ref } from 'vue'
import { ITEMS } from '@/data/items'
import { equipItem } from '@/engine/systems/EquipmentSystem'
import { eatFood } from '@/engine/systems/FoodSystem'
import { addGold } from '@/engine/systems/EconomySystem'
import { removeItem } from '@/engine/systems/InventorySystem'
import { eventBus } from '@/engine/events/EventBus'
import { RARITY_SELL_MULTIPLIER } from '@/data/items'

const visible = ref(false)
const itemId = ref('')

const item = () => ITEMS[itemId.value]
const rarityColor = () => {
  const map: Record<string, string> = {
    common: 'var(--text-dim)', uncommon: 'var(--success)',
    rare: 'var(--xp)', epic: 'var(--mp, #5c9ce6)', legendary: 'var(--gold)',
  }
  return map[item()?.rarity ?? 'common'] ?? 'var(--text-dim)'
}

function show(id: string) {
  if (!ITEMS[id]) return
  itemId.value = id
  visible.value = true
}

function hide() { visible.value = false }

function onEquip() {
  equipItem(itemId.value)
  hide()
}

function onUse() {
  eatFood(itemId.value)
  hide()
}

function onSell() {
  const it = item()
  if (!it) return
  const price = Math.floor(it.value * (RARITY_SELL_MULTIPLIER[it.rarity] ?? 0.5))
  removeItem(itemId.value, 1)
  addGold(price)
  eventBus.emit('toast', { message: `出售 ${it.name}，获得 ${price} 💰`, type: 'success' })
  hide()
}

defineExpose({ show })
</script>

<template>
  <Teleport to="body">
    <div v-if="visible && item()" class="overlay" @click.self="hide">
      <div class="detail-card">
        <button class="close-btn" @click="hide"><i class="fa-solid fa-xmark"></i></button>

        <div class="detail-icon" :style="{ borderColor: rarityColor() }">
          <i class="fa-solid" :class="item().icon" :style="{ color: rarityColor() }"></i>
        </div>

        <h2 class="detail-name" :style="{ color: rarityColor() }">{{ item().name }}</h2>
        <span class="detail-rarity">{{ item().rarity }}</span>

        <div class="detail-stats">
          <div v-if="item().atk" class="detail-stat">
            <span>⚔️ 攻击力</span>
            <strong>+{{ item().atk }}</strong>
          </div>
          <div v-if="item().def" class="detail-stat">
            <span>🛡️ 防御力</span>
            <strong>+{{ item().def }}</strong>
          </div>
          <div v-if="item().heal" class="detail-stat">
            <span>❤️ 恢复</span>
            <strong>+{{ item().heal }} HP</strong>
          </div>
          <div class="detail-stat">
            <span>💰 价值</span>
            <strong>{{ item().value }} 金币</strong>
          </div>
          <div v-if="item().slot" class="detail-stat">
            <span>📌 槽位</span>
            <strong>{{ item().slot }}</strong>
          </div>
        </div>

        <div class="detail-actions">
          <button v-if="item().slot" class="act-btn equip" @click="onEquip">
            <i class="fa-solid fa-shield-halved"></i> 装备
          </button>
          <button v-if="item().heal" class="act-btn use" @click="onUse">
            <i class="fa-solid fa-bowl-food"></i> 使用
          </button>
          <button class="act-btn sell" @click="onSell">
            <i class="fa-solid fa-coins"></i> 出售
          </button>
          <button class="act-btn cancel" @click="hide">
            <i class="fa-solid fa-xmark"></i> 关闭
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 5000;
  animation: fadeIn 0.15s ease;
}
.detail-card {
  background: var(--bg-card); border: 2px solid var(--border-hi); border-radius: 16px;
  padding: 32px; width: 320px; text-align: center; position: relative;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6);
}
.close-btn {
  position: absolute; top: 10px; right: 10px; width: 28px; height: 28px;
  background: transparent; border: none; color: var(--text-dim); font-size: 16px;
  cursor: pointer; border-radius: 50%; display: flex; align-items: center; justify-content: center;
}
.close-btn:hover { background: var(--bg-card-hi); color: var(--text); }

.detail-icon {
  width: 72px; height: 72px; margin: 0 auto 12px; border-radius: 50%;
  background: var(--bg-base); border: 2px solid; display: flex; align-items: center;
  justify-content: center; font-size: 32px;
}
.detail-name { font-size: 20px; font-weight: 700; margin-bottom: 2px; }
.detail-rarity {
  font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
  color: var(--text-faint); margin-bottom: 20px; display: block;
}

.detail-stats { text-align: left; margin-bottom: 20px; }
.detail-stat {
  display: flex; justify-content: space-between; padding: 8px 0;
  border-bottom: 1px solid var(--border); font-size: 13px;
}
.detail-stat:last-child { border-bottom: none; }
.detail-stat span { color: var(--text-dim); }
.detail-stat strong { color: var(--gold); }

.detail-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.act-btn {
  padding: 10px; border-radius: 8px; border: 1px solid var(--border);
  cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-family: var(--font-body); background: var(--bg-base); color: var(--text);
}
.act-btn:hover { border-color: var(--border-hi); }
.act-btn.equip:hover { border-color: var(--success); color: var(--success); background: rgba(124,179,66,0.1); }
.act-btn.use:hover { border-color: var(--xp); color: var(--xp); background: rgba(243,156,18,0.1); }
.act-btn.sell:hover { border-color: var(--gold); color: var(--gold); background: rgba(230,181,102,0.1); }
.act-btn.cancel:hover { border-color: var(--danger); color: var(--danger); }
</style>
