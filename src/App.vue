<script>
import xiruilink from "@/utils/xiruilink";
export default {
  onLaunch() {
    document.addEventListener("UniAppJSBridgeReady", () => {
      //建立桥接，注册获取实时消息函数
      xiruilink.SYSTEM.buildSystemBridge({}, (res) => {
        if (res.code === 0 && res.data.length > 0) {
          //页面跳转
          let data = res.data[0];
          let extend = xiruilink.APPLICATION.getAppBaseInfo().extend;
          this.judgeOpenPage(data.path, data.extend, extend);
          xiruilink.SYSTEM.setSystemTheme();
        }
      });
    });
  },
  onShow: function () {
    //注册通信监听函数
    xiruilink.SYSTEM.setReceiveEvent();
  },
  methods: {
    judgeOpenPage(source, extend, pathType) {
      console.log(source, extend, pathType);
    },
  },
};
</script>

<style lnag="scss">
/*每个页面公共css */
@import "@climblee/uv-ui/index.scss";
page {
  background-color: #f7f7f7;
}
</style>
