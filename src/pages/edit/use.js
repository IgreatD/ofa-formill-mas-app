import RecordApi from "@/apis/record";
import { onMounted } from "vue";

const fieldDisabled = (formCode, indexCode) => {
  return formCode.value === "QGNSRB"
    ? ["01", "11"].indexOf(indexCode) !== -1
      ? true
      : false
    : formCode.value === "SXNYJXZYJDB"
      ? false
      : false;
};

const fieldType = (formCode, indexCode) => {
  return formCode.value === "QGNSRB"
    ? ["09", "10", "19"].indexOf(indexCode) !== -1
      ? "string"
      : "number"
    : formCode.value === "SXNYJXZYJDB"
      ? ["19"].indexOf(indexCode) !== -1
        ? "string"
        : "number"
      : "string";
};

// 获取表单的ids
const getSubmittedRecordIds = (listItem) => {
  return new Promise((resolve, reject) => {
    RecordApi.getSubmittedRecordIds(listItem.recordMarkUuid)
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 获取表单的内容
const getRecordForm = (listItem) => {
  return new Promise((resolve, reject) => {
    RecordApi.getRecordForm({
      uuid: listItem.formfillBindingDfUuid,
      formUuid: listItem.formfillBindingDfUuid,
      taskUuid: listItem.taskUuid,
    })
      .then((res) => {
        resolve(res.data.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 获取表单的草稿内容
const getDraftRecord = (listItem) => {
  return new Promise((resolve, reject) => {
    RecordApi.draftRecord({
      taskFillRecordMarkUuid: listItem.recordMarkUuid,
      taskReleaseRecordUuid: listItem.releaseRecordId,
      taskUuid: listItem.taskUuid,
    })
      .then((res) => {
        const data = res.data.data;
        if (data && data.submitRowValueDTO) {
          resolve(data.submitRowValueDTO);
        } else {
          reject({});
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 获取已提交的表单内容
const getReleaseRecordContent = (listItem) => {
  return new Promise((resolve, reject) => {
    RecordApi.getReleaseRecordContent({
      formCode: listItem.formCode,
      formfillMarkUuid: listItem.formfillMarkUuid,
      submitUuid: listItem.submitUuid,
    })
      .then((res) => {
        const data = res.data.data;
        if (data && data.records) {
          resolve(data.records);
        } else {
          reject([]);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// 保存表单的内容
const saveForm = (listItem, list, formData) => {
  return new Promise((resolve, reject) => {
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
  });
};

const useEdit = async (listItem) => {
  let formCode = "";
  const formRef = ref(null);
  const list = ref([]);
  const formData = ref({});
  const rules = {};
  let ids = {};
  // 获取表单的ids
  const getSubmittedRecordIds = () => {
    RecordApi.getSubmittedRecordIds(listItem.recordMarkUuid)
      .then((res) => {
        ids = res.data.data;
        getRecordForm();
      })
      .catch((err) => {
        reject(err);
      });
  };
  getRecordForm().then((val) => {
    formCode = val.formCode;
    if (val.props) {
      const props = JSON.parse(val.props);
      // 判断是否有数据
      if (props.length) {
        const initConfig = props[0].initConfig;
        const initDatas = initConfig.initDatas;
        for (let index = 0; index < initDatas.length; index++) {
          const initData = initDatas[index];
          // 生成表单key
          const indexKey = `key${initData.INDEX_CODE}`;
          // 生成表单验证规则
          rules.value[indexKey] = {
            type: "string",
            required: true,
            message: `请输入`,
            trigger: ["blur", "change"],
          };
          // 生成表单数据
          formData.value[indexKey] = fieldDisabled(
            formCode,
            initData.INDEX_CODE
          )
            ? "—"
            : "";
          // 生成表单列表
          list.value.push({
            INDEX_NAME: initData.INDEX_NAME,
            INDEX_UNIT: initData.INDEX_UNIT,
            INDEX_CODE: initData.INDEX_CODE,
            name: indexKey,
            disabled: fieldDisabled(formCode, initData.INDEX_CODE),
            type: fieldType(formCode, initData.INDEX_CODE),
          });
        }
        // 设置表单验证规则
        formRef.value.setRules(rules.value);
      }
    }
  });

  onMounted(() => {
    getSubmittedRecordIds();
  });

  return {
    formRef,
    list,
    formData,
  };
};

export default useEdit;
