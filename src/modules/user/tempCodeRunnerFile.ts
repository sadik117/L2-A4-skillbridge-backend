const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: No user session found" });
    }
    console.log(user);