<template>
  <div class="card-container">
    <a :href="href" target="_blank">
      <div class="title">
        <div>{{ title }}</div>
      </div>
      <div class="desc">
        {{ desc }}
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  desc: string;
  href: string;
}>();
</script>

<style lang="scss">
.card-container {
  position: relative;
  width: calc(50% - 24px);
  margin: 20px 12px 0 12px;
  padding: 10px 10px;
  background-color: #fff;
  border: 1px solid var(--vp-c-brand);
  .title {
    font-size: 16px;
    font-weight: 600;
  }
  .desc {
    color: rgba(55, 65, 81);
  }
  cursor: pointer;
  &::before {
    top: -4px;
    left: -4px;
  }
  &::after {
    bottom: -4px;
    right: -4px;
  }
  &::after,
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    width: 30px;
    height: 30px;
    background-image: linear-gradient(
      to right,
      #eea2a2 0%,
      #bbc1bf 19%,
      #57c6e1 42%,
      #b49fda 79%,
      #7ac5d8 100%
    );
  }
  &:hover {
    border-radius: 10px;
    // transform: translateY(-10px);
    transition: all ease-in-out 0.3s;
    &::before,
    &::after {
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      border-radius: 10px;
      transition: all ease-in-out 0.3s;
    }
  }
}
</style>
