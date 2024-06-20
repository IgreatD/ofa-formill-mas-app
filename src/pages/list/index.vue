<template>
  <z-paging ref="paging" v-model="dataList" @query="getList">
    <template #top>
      <uv-tabs :list="tabList" @click="onTabClick" :scrollable="false" />
    </template>
    <ListItem
      v-for="item in currentDataList"
      :key="item.id"
      :data="item"
      @item-click="onItemClick(item)"
    />
  </z-paging>
</template>

<script setup>
import RecordApi from "@/apis/record";
import { useXiruilink } from "@/utils/xiruilink";
const tabList = ref([
  {
    name: "待提交",
    state: "UNFILLED",
  },
  {
    name: "已提交",
    state: "FILLED",
  },
]);

const current = ref("UNFILLED");
const paging = ref(null);
const dataList = ref([]);

const currentDataList = computed(() => {
  return dataList.value.filter((item) => item.fillState === current.value);
});

const onTabClick = (tab) => {
  current.value = tab.state;
};

const onItemClick = (item) => {
  uni.navigateTo({
    url: `/pages/edit/index`,
    success: (res) => {
      res.eventChannel.emit("acceptDataFromListPage", {
        data: toRaw(item),
        isEditMode: current.value === 0,
      });
    },
  });
};

const getList = () => {
  RecordApi.getReleaseRecordList({
    pageNo: 1,
    pageSize: 10,
  })
    .then(({ data }) => {
      paging.value.completeByTotal(data.data.records, data.data.totalCount);
    })
    .catch((err) => {
      console.error(err);
      paging.value.complete(false);
    });
};

const refresh = () => {
  paging.value.refresh();
};

useXiruilink("填报列表");

defineExpose({
  refresh,
});
</script>

<style lang="scss" scoped>
:deep(.zp-paging-main) {
  padding: 0 16rpx;
}
</style>
