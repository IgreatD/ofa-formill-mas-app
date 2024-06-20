<template>
  <div class="edit">
    <uv-form :model="formData" ref="formRef">
      <template v-for="item in list" :key="item.INDEX_KEY">
        <div class="edit-item">
          <div class="item-title">
            <span>{{ item.INDEX_NAME.trim() }}</span>
            <span>（{{ item.INDEX_UNIT.trim() }}）</span>
          </div>
          <div class="item-input">
            <uv-form-item :prop="item.name">
              <template v-if="item.disabled">
                {{ formData[item.name] }}
              </template>
              <template v-else>
                <uv-input
                  v-if="item.type === 'number'"
                  type="number"
                  :disabled="!writeRole"
                  v-model="formData[item.name]"
                  :placeholder="!writeRole ? '' : '请输入'"
                />
                <uv-textarea
                  v-if="item.type === 'string'"
                  v-model="formData[item.name]"
                  :disabled="!writeRole"
                  :placeholder="!writeRole ? '' : '请输入'"
                />
              </template>
            </uv-form-item>
          </div>
        </div>
      </template>
    </uv-form>
    <template v-if="writeRole">
      <div class="bottom-payload"></div>
      <div class="edit-btns uv-border-top" v-show="list.length">
        <uv-button :customStyle="buttonStyle" type="primary" @click="saveForm">
          保存
        </uv-button>
        <uv-button :customStyle="buttonStyle" type="error" @click="onSubmit">
          提交
        </uv-button>
      </div>
    </template>
    <uv-modal
      ref="modalRef"
      align="center"
      title="提示"
      content="请确认填报内容!"
      show-cancel-button
      @confirm="modalConfirm"
    />
  </div>
</template>

<script setup>
import { useUserStore } from "@/store";
import RecordApi from "@/apis/record";
import { useXiruilink } from "@/utils/xiruilink";

const userStore = useUserStore();

const writeRole = userStore.writeRole;

const instance = getCurrentInstance().proxy;
const eventChannel = instance.getOpenerEventChannel();

const buttonStyle = {
  width: "280rpx",
  height: "70rpx",
};

let listItem = {};
const ids = {};
const modalRef = ref(null);
const formRef = ref(null);
const rules = ref({});
const formData = ref({});
const list = ref([]);

const fieldDisabled = (indexCode) => {
  return listItem.formCode === "QGNSRB"
    ? ["01", "11"].indexOf(indexCode) !== -1
      ? true
      : false
    : false;
};

const fieldType = (indexCode) => {
  return listItem.formCode === "QGNSRB"
    ? ["09", "10", "19"].indexOf(indexCode) !== -1
      ? "string"
      : "number"
    : listItem.formCode === "SXNYJXZYJDB"
      ? ["19"].indexOf(indexCode) !== -1
        ? "string"
        : "number"
      : "string";
};

// 保存草稿
const saveForm = () => {
  RecordApi.draftSaveRecord(
    {
      formUuid: listItem.formfillBindingDfUuid,
      formfillFillMarkUuid: listItem.recordMarkUuid,
      formfillReleaseRecordId: listItem.releaseRecordId,
      formfillUserId: listItem.userId,
      periodValue: listItem.periodValue,
      periodYear: listItem.periodYear,
      submitRowValueDTOS: list.value.map((item) => {
        return {
          INDEX_NAME: item.INDEX_NAME,
          INDEX_UNIT: item.INDEX_UNIT,
          INDEX_CODE: item.INDEX_CODE,
          INDEX_VALUE: formData.value[item.name],
        };
      }),
    },
    listItem.taskUuid
  )
    .then((res) => {
      uni.showToast({
        title: "保存草稿成功",
        icon: "success",
      });
    })
    .catch((err) => {
      console.error(err);
      uni.showToast({
        title: "保存草稿失败",
        icon: "none",
      });
    });
};

// 提交确认
const modalConfirm = () => {
  if (listItem.fillState === "UNFILLED") {
    submitRecord();
  } else if (listItem.fillState === "FILLED") {
    modifyRecord();
  }
};

// modifyRecord
const modifyRecord = () => {
  RecordApi.modifyRecord({
    modifySubmitRowValue: list.value.map((item) => {
      return {
        INDEX_NAME: item.INDEX_NAME,
        INDEX_UNIT: item.INDEX_UNIT,
        INDEX_CODE: item.INDEX_CODE,
        INDEX_VALUE: formData.value[item.name],
        UUID: item.UUID,
      };
    }),
    formCode: listItem.formCode,
    submitUuid: ids.value.formSubmitResultId,
  })
    .then(() => {
      deleteDraft();
    })
    .catch((err) => {
      console.error(err);
      uni.showToast({
        title: "修改失败",
        icon: "none",
      });
    });
};

// submitRecord
const submitRecord = () => {
  RecordApi.submitRecord({
    submitRowValueDTO: {
      formUuid: listItem.formfillBindingDfUuid,
      formfillFillMarkUuid: listItem.recordMarkUuid,
      formfillReleaseRecordId: listItem.releaseRecordId,
      formfillUserId: listItem.userId,
      periodValue: listItem.periodValue,
      periodYear: listItem.periodYear,
      submitRowValueDTOS: list.value.map((item) => {
        return {
          INDEX_NAME: item.INDEX_NAME,
          INDEX_UNIT: item.INDEX_UNIT,
          INDEX_CODE: item.INDEX_CODE,
          INDEX_VALUE: formData.value[item.name],
        };
      }),
    },
    taskUuid: listItem.taskUuid,
  })
    .then((res) => {
      deleteDraft();
    })
    .catch((err) => {
      console.error(err);
      uni.showToast({
        title: "提交失败",
        icon: "none",
      });
    });
};

// 删除草稿
const deleteDraft = () => {
  RecordApi.deleteDraft({
    taskFillRecordMarkUuid: listItem.recordMarkUuid,
    taskReleaseRecordUuid: listItem.releaseRecordId,
    taskUuid: listItem.taskUuid,
  }).then((res) => {
    uni.showToast({
      title: listItem.fillState === "UNFILLED" ? "提交成功" : "修改成功",
      icon: "success",
      duration: 1500,
    });
    setTimeout(() => {
      uni.navigateBack();
      // uni获取当前页面栈
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      prevPage.$vm.$.exposed.refresh();
    }, 1500);
  });
};

// 提交表单时校验
const onSubmit = () => {
  formRef.value
    .validate()
    .then((valid) => {
      if (valid) {
        modalRef.value.open();
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

// 获取已提交记录的ids
const getSubmittedRecordIds = () => {
  RecordApi.getSubmittedRecordIds(listItem.recordMarkUuid).then((res) => {
    ids.value = res.data.data;
    getRecordForm();
  });
};

// 获取表单内容
const getRecordForm = () => {
  RecordApi.getRecordForm({
    uuid: listItem.formfillBindingDfUuid,
    formUuid: listItem.formfillBindingDfUuid,
    taskUuid: listItem.taskUuid,
  }).then((res) => {
    const val = res.data.data;
    if (val.props) {
      const props = JSON.parse(val.props);
      if (props.length) {
        const initConfig = props[0].initConfig;
        const initDatas = initConfig.initDatas;
        for (let index = 0; index < initDatas.length; index++) {
          const initData = initDatas[index];
          const indexKey = `key${initData.INDEX_CODE}`;
          rules.value[indexKey] = {
            type: "string",
            required: true,
            message: `请输入`,
            trigger: ["blur", "change"],
          };
          formData.value[indexKey] = fieldDisabled(initData.INDEX_CODE)
            ? "—"
            : "";
          list.value.push({
            INDEX_NAME: initData.INDEX_NAME,
            INDEX_UNIT: initData.INDEX_UNIT,
            INDEX_CODE: initData.INDEX_CODE,
            name: indexKey,
            disabled: fieldDisabled(initData.INDEX_CODE),
            type: fieldType(initData.INDEX_CODE),
          });
        }
        formRef.value.setRules(rules.value);
      }
    }
    if (listItem.fillState === "UNFILLED") {
      getDraftRecord();
    } else if (listItem.fillState === "FILLED") {
      getReleaseRecordContent();
    }
  });
};

// 获取发布记录内容
const getReleaseRecordContent = () => {
  RecordApi.getReleaseRecordContent({
    formCode: listItem.formCode,
    formfillMarkUuid: ids.value.taskFillRecordMarkUuid,
    submitUuid: ids.value.formSubmitResultId,
  }).then((res) => {
    const data = res.data.data;
    if (data && data.records) {
      for (let index = 0; index < data.records.length; index++) {
        const record = data.records[index];
        const indexKey = `key${record.INDEX_CODE}`;
        formData.value[indexKey] = fieldDisabled(record.INDEX_CODE)
          ? "—"
          : record.INDEX_VALUE;
        const find = list.value.find(
          (item) => item.INDEX_CODE === record.INDEX_CODE
        );
        if (find) {
          find.UUID = record.UUID;
        }
      }
    }
  });
};

// 获取草稿记录
const getDraftRecord = () => {
  RecordApi.getDraftRecord({
    taskFillRecordMarkUuid: listItem.recordMarkUuid,
    taskReleaseRecordUuid: listItem.releaseRecordId,
    taskUuid: listItem.taskUuid,
  }).then((res) => {
    const data = res.data.data;
    if (data && data.submitRowValueDTO) {
      const draftForm = res.data.data.submitRowValueDTO;
      const submitRowValueDTOS = draftForm.submitRowValueDTOS;
      for (let index = 0; index < submitRowValueDTOS.length; index++) {
        const submitRowValue = submitRowValueDTOS[index];
        const indexKey = `key${submitRowValue.INDEX_CODE}`;
        formData.value[indexKey] = fieldDisabled(submitRowValue.INDEX_CODE)
          ? "—"
          : submitRowValue.INDEX_VALUE;
      }
    }
  });
};

useXiruilink("填报");

eventChannel.on("acceptDataFromListPage", (data) => {
  listItem = data.data;
  getSubmittedRecordIds();
});
</script>

<style lang="scss" scoped>
$btns-height: 120rpx;

:deep(.uv-form-item__body) {
  padding: 0;
}

:deep(.uv-form-item__body__right__message) {
  margin-left: 0 !important;
}

.edit-item {
  margin: 24rpx 0;
  padding: 32rpx;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  .item-title {
    font-size: 26rpx;
    color: #181818;
    margin-bottom: 24rpx;
  }
}

.bottom-payload {
  height: $btns-height;
}

.edit-btns {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  height: $btns-height;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 48rpx;
}
</style>
