问题分析：
当API返回 {"code":200,"local":"TW","message":"","data":[]} 时，响应拦截器会检查 data.code != 200
由于 isEnableEncryption 为 false，会执行第97-106行的逻辑
在第101行，如果 data.code != 200 就会reject，但是在第105行，如果code=200，会返回 data.data（也就是空数组 []）
在exchange页面的第131行，代码检查 result && result.code === 200，但此时 result 已经是 data.data（空数组），而不是完整的响应对象
空数组没有 code 属性，所以 result.code === 200 返回 false，进入else分支显示错误