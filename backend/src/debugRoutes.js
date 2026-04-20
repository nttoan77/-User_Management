export const logRoutes = (app) => {
    console.log("===== DANH SÁCH API BACKEND =====");
  
    if (!app._router) {
      console.log("⚠️ Chưa có router nào được đăng ký");
      return;
    }
  
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        const methods = Object.keys(middleware.route.methods)
          .join(", ")
          .toUpperCase();
        console.log(`${methods} ${middleware.route.path}`);
      } else if (middleware.name === "router") {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const methods = Object.keys(handler.route.methods)
              .join(", ")
              .toUpperCase();
            console.log(`${methods} ${handler.route.path}`);
          }
        });
      }
    });
  };
  