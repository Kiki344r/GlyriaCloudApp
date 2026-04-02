<template>
  <div>
    <UButton
      label="Rejoindre un groupe"
      color="primary"
      variant="outline"
      class="cursor-pointer"
      :on-click="onClick"
    />
  </div>
</template>

<script setup lang="ts">
const store = useGroupCodeStore()

const onClick = () => {
  store.open = true
}
</script>
