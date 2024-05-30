import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import firebase from "config/firebase";
import { setCookie } from "cookies-next";
import ContractAbi from "../../../../BotV1.json";

export default async function botLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Api Call");
  const { user }: any = req.query;
  const { message, signature, tusername } = req.body;
  const method = req.method;

  const contractAddress: any = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const rpc_url = process.env.NEXT_PUBLIC_RPC_URL;
  const network_name: any = process.env.NEXT_PUBLIC_NETWORK_NAME;
  const chainId: any = process.env.CHAIN_ID;
  const signerPrivateKey: any = process.env.SIGNER_PRIVATE_KEY;

  const provider = new ethers.providers.JsonRpcProvider(rpc_url, {
    name: network_name,
    chainId: parseInt(chainId),
  });

  const signer = new ethers.Wallet(signerPrivateKey, provider);

  const contract = new ethers.Contract(
    contractAddress,
    ContractAbi.abi,
    signer
  );

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
      console.log("Verified");
      const token = jwt.sign(
        {
          tUserName: tusername,
          walletAddress: walletAddress,
        },
        JWT_PRIVATE_KEY,
        { expiresIn: "30d" }
      );

      console.log("Transaction Started");

      try {
        const login = await contract.loginWithTelegram(
          walletAddress,
          tusername,
          token
        );

        console.log(login);

        await login.wait();
      } catch (err) {
        console.log(err);

        res.status(403).send("Unauthorized");
        return;
      }

      console.log("Transaction Completed");

      // const userRef = ref.child(walletAddress.toLocaleLowerCase());
      // userRef.set({
      //   walletAddress,
      //   token,
      //   tusername,
      // });

      setCookie("bot_token", token, {
        req: req,
        res: res,
        maxAge: 43800,
      });
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
