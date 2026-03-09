export const loginApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          token: "askdjaskd",
          user: "admin",
          password: "password",
        },
      });
    }, 500);
  });
};
