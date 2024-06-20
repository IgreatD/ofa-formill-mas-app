<template>
  <div class="item-card">
    <div class="item-title">
      {{ data.formfillName }}
    </div>
    <uv-divider style="margin: 0" />
    <div class="item-list">
      <template v-for="(item, index) in itemList" :key="index">
        <div class="item-wrapper" @click="onItemClick(item)">
          <span class="item-label">{{ item.label }}</span>
          <span class="item-value">{{ item.value }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(["itemClick"]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const itemList = computed(() => {
  const data = props.data;
  return [
    {
      label: "期数",
      value: data.periodValue,
    },
    {
      label: "开始时间",
      value: data.sendTime,
    },
    {
      label: "结束时间",
      value: data.formfillEndTime,
    },
    {
      label: "任务状态",
      value: formatFillState(data.fillState),
    },
  ];
});

const formatFillState = (fillState) => {
  switch (fillState) {
    case "UNFILLED":
      return "未填写";
    case "FILLED":
      return "已填写";
    case "REVIEWING":
      return "审核中";
    case "REVIEW_REJECT":
      return "已驳回";
    case "REVIEWED":
      return "审核通过";
    case "REVIEW_RETURN":
      return "已退回";
    case "UNDER_REVIEW":
      return "待审核";
    case "REVIEW_INITIATING":
      return "审核发起中";
    case "REVIEW_REVOKE":
      return "已撤销";
    case "REVIEWING_ONGOING":
      return "审核进行中";
    default:
      return "";
  }
};

const onItemClick = (item) => {
  emits("itemClick", item);
};
</script>

<style lang="scss" scoped>
.item-card {
  margin-top: 32rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  .item-title {
    font-size: 32rpx;
    color: #181818;
    padding: 16rpx;
  }
  .item-list {
    .item-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 16rpx 32rpx;
      // border-bottom: 1px solid #f7f7f7;
      font-size: 26rpx;
      .item-label {
        color: #999999;
      }
      .item-value {
        color: #666666;
      }
    }
  }
}
</style>
