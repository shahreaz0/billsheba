import { httpV1 } from "./lib/xior"

async function getToken() {
  return httpV1
    .request({
      method: "post",
      url: "/users/login",
      data: {
        phone: "01844668099",
        password: "@112233@#",
      },
    })
    .then((res) => res.data)
}

const res = await getToken()

console.log(res)
