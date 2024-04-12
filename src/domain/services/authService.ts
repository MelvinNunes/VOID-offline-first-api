const jwt = require("jsonwebtoken");

export default class AuthService {
  static generateAccessToken(username: string) {
    return jwt.sign({ name: username }, process.env.TOKEN_SECRET, {
      expiresIn: "48h",
    });
  }
}
