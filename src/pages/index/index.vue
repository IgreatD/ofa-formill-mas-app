<template>
  <view class="content" />
</template>

<script setup>
import { useUserStore } from "@/store";

const userStore = useUserStore();

const isLogin = userStore.isLogin;

if (isLogin) {
  uni.reLaunch({ url: "/pages/list/index" });
} else {
  userStore
    .login()
    .then(() => {
      uni.reLaunch({ url: "/pages/list/index" });
    })
    .catch((err) => {
      console.log(err);
      uni.showToast({
        title: "登录失败",
        icon: "none",
      });
    });
}

const title = ref("hello");
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
