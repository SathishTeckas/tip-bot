import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { setCookie } from "cookies-next";

export default async function verify(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { user }: any = req.query;
  const { message, signature } = req.body;
  const method = req.method;

  if (method != "POST") {
    res.status(400).send({
      status: 400,
      message: "Invalid Request",
    });
    return;
  }
  try {
    const walletAddress = await ethers.utils.verifyMessage(message, signature);
    const JWT_PRIVATE_KEY: any = process.env.JWT_PRIVATE_KEY;
    if (walletAddress.toLowerCase() == user.toLowerCase()) {
      const token = jwt.sign(
        {
          walletAddress: walletAddress,
        },
        JWT_PRIVATE_KEY,
        { expiresIn: "30d" }
      );
      setCookie("token", token, { req: req, res: res, maxAge: 43800 });
      res.status(200).send({
        status: 200,
        walletAddress: walletAddress,
        message: "Login Success!",
      });
      return;
    } else {
      res.status(403).send({
        status: 403,
        message: "Forbidden",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    return;
  }
}
