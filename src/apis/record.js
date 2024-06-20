import http from "@/utils/request";

class RecordApi {
  /**
   * 获取已发布的记录列表
   * @param {number} pageNo
   * @param {number} pageSize
   * @returns
   */
  static getReleaseRecordList({ pageNo, pageSize }) {
    return http.get("/release-record/v1", {
      params: {
        pageNo,
        pageSize,
        keyword: "",
        formfillNameNew: "",
        formfillInfo: "",
        formfillEndTime: "",
        fillTime: "",
        fillState: "",
        type: "",
      },
    });
  }

  /**
   * 获取填报记录uuid
   * @param {number} id
   * @returns
   */
  static getRecordMarkUuid(id) {
    return http.get(`/task-fill/v2/submit/record`, {
      params: {
        recordMarkUuid: id,
      },
    });
  }

  /**
   * 获取表单的填报内容
   * @param {*} data
   * @returns
   */
  static getRecordForm(data) {
    return http.get("/dynamic-form/v1/get", {
      params: {
        ...data,
      },
    });
  }

  /**
   * 保存表单的内容
   * @param {*} submitRowValueDTO
   * @param {*} taskUuid
   * @returns
   */
  static draftSaveRecord(submitRowValueDTO, taskUuid) {
    return http.put(`/release-record/v1/draft/save`, {
      submitRowValueDTO,
      taskUuid,
    });
  }

  /**
   * 提交表单的内容
   * @param {*} submitRowValueDTO
   * @param {*} taskUuid
   * @returns
   */
  static submitRecord(data) {
    return http.post(`/task-fill/v2/submit`, {
      ...data,
    });
  }

  /**
   * 获取已提交的记录ID集合
   * @param {*} recordMarkUuid
   */
  static getSubmittedRecordIds(recordMarkUuid) {
    return http.get(`/task-fill/v2/submit/record`, {
      params: {
        recordMarkUuid,
      },
    });
  }

  /**
   * 获取已发布的记录内容
   * @param {*} formCode
   * @param {*} formfillMarkUuid
   * @param {*} submitUuid
   * @returns
   */
  static getReleaseRecordContent({ formCode, formfillMarkUuid, submitUuid }) {
    return http.post(`/task-fill/v2/page`, {
      formCode,
      formfillMarkUuid,
      submitUuid,
      pageNo: 1,
      pageSize: 10000,
    });
  }

  /**
   * 获取表单的草稿内容
   * @param {*} taskReleaseRecordUuid
   * @param {*} taskUuid
   * @param {*} taskFillRecordMarkUuid
   * @returns
   */
  static getDraftRecord(data) {
    return http.get(`/release-record/v1/draft`, {
      params: {
        ...data,
      },
    });
  }

  /**
   * 修改已保存表单的内容
   * @param {*} data
   * @returns
   */
  static modifyRecord(data) {
    return http.post(`/task-fill/v2/dynamic-form/batch/modify`, data);
  }

  /**
   * 删除草稿
   * @param {*} taskUuid
   * @param {*} taskReleaseRecordUuid
   * @param {*} taskFillRecordMarkUuid
   */
  static deleteDraft(data) {
    return http.delete(`/release-record/v1/draft`, {
      params: {
        ...data,
      },
    });
  }
}

export default RecordApi;
