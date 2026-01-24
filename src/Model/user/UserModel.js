class UserModel {
    UserLogin={
        email: "",
        passwordHash: ""
    }
    UserRegister={
        email: "",
        passwordHash: "",
    }
    UserInfo={
        uid: 0,
        email: "",
        passwordHash: "",
        nickName: "",
        createdAt: "",
        avatarPath: ""
    }
}
// {
//     "uid": 14,
//     "email": "test1@test1.com",
//     "passwordHash": null,
//     "nickName": "测试1",
//     "createdAt": "2025-08-06T11:43:35",
//     "avatarPath": "E:\\SmartSecurity\\user\\14.jpg"
// }

const userModel = new UserModel()
export default userModel;