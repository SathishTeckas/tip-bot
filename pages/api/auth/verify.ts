import { NextApiRequest, NextApiResponse } from "next";
import { getCookie, setCookie } from "cookies-next";
import jwt from "jsonwebtoken";

export default async function verify(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = getCookie("token", { req: req, res: res });
  const botToken: any = getCookie("bot_token", { req: req, res: res });

  const JWT_PRIVATE_KEY: any = process.env.JWT_PRIVATE_KEY;
  if (!botToken) {
    try {
      const verify: any = jwt.verify(token, JWT_PRIVATE_KEY);

      res.status(200).send({
        status: 200,
        auth: {
          walletAddress: verify.walletAddress,
        },
      });
      return;
    } catch (err) {
      res.status(200).send({
        status: 200,
        auth: null,
      });
      return;
    }
  }

  if (botToken) {
    try {
      const verify: any = jwt.verify(token, JWT_PRIVATE_KEY);

      const verifyBotToken: any = jwt.verify(botToken, JWT_PRIVATE_KEY);

      console.log("Web Token");
      console.log(verify);
      console.log("Bot Token");
      console.log(verifyBotToken);
      if (verify.walletAddress !== verifyBotToken.walletAddress) {
        const token = jwt.sign(
          {
            tUserName: verifyBotToken.tUserName,
            walletAddress: verifyBotToken.walletAddress,
          },
          JWT_PRIVATE_KEY,
          { expiresIn: "30d" }
        );

        setCookie("token", token, {
          req: req,
          res: res,
          maxAge: 43800,
        });

        res.status(200).send({
          status: 200,
          auth: {
            walletAddress: verifyBotToken.walletAddress,
          },
        });
        return;
      }
      res.status(200).send({
        status: 200,
        auth: {
          walletAddress: verifyBotToken.walletAddress,
        },
      });
      return;
    } catch (err) {
      res.status(200).send({
        status: 200,
        auth: null,
      });
      return;
    }
  }
}
