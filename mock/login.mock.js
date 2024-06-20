import { defineMock } from "./base";

export default defineMock([
  {
    url: "/login",
    method: ["POST"],
    body: {
      code: "200",
      data: {
        roles: ["READ"],
        token:
          "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJudW1iZXIiOiI2NTdkMmNmNzRjZWRmZDAwMDkyYjNjY2UiLCJlbmhhbmNlT3JnYW5pemF0aW9uSW5mbyI6bnVsbCwidXNlcl9uYW1lIjoibmoxMzAwMDAiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwibmFtZSI6Iuays-WMl-ecgSIsInRlbmFudElkIjoicm9vdF90ZW5hbnRfaWQiLCJlbnRlcnByaXNlSWQiOiI2NTdkMmM3MjRjZWRmZDAwMDkyYjFhNmQiLCJleHAiOjE3MTg4Njc4NDcsImVuaGFuY2VBcHBTdWJBY2NvdW50SW5mbyI6bnVsbCwiYXV0aG9yaXRpZXMiOlsiREFUQV9GSUxMX1RBU0siLCJST0xFX0ZJTExJTkciLCJEQVRBX0ZJTEwiXSwianRpIjoiZDA0ODZmNWItNWM4Yy00MmIwLWE0OGQtZGU1MmQwOTMyMGY4IiwiY2xpZW50X2lkIjoiYTVlNjliMGItM2MzYy00MWZiLWEzMWUtNWMwYjcyMDZmYjhjIn0.N8qaZh0eleaBxenuugn02VsX8Fcps2y4Jabkqsyuhi39vmO1tPoHD7wv6HJkhe_jEUxVwRWVLZ49v1oEayYEJvH3QqslL1xbZ3B7hvxmq05OTl_z8xYWbYOFhn9OnIt8EfG2tdctpGNyWHGi5k-p8uhnyfnXWrZNhtEP6CUj3yOKcSvXPxcyFL0VyDDzi2YKCDCd8ngYoNYrLG65bbElbM-esmotfv_vkbzmRsE0NnfD-QfJpLVFu8kLIuBbM0yOxty5HxokpONnEVClDJHp4ULaIkOTSoqPOtJvBb6oju6QbbHniR2yav0yzs7P6wMHRbhvQGfphMP9L8369GEcpg",
      },
      message: "操作成功",
    },
  },
]);
