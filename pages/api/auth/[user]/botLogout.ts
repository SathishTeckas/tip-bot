import { NextApiRequest, NextApiResponse } from "next";
import { getCookie, deleteCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import firebase from "config/firebase";
import { ethers } from "ethers";
import ContractAbi from "../../../../BotV1.json";

export default async function botLogout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token: any = getCookie("bot_token", { req, res });

  const JWT_PRIVATE_KEY: any = process.env.JWT_PRIVATE_KEY;

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

  try {
    const verify: any = jwt.verify(token, JWT_PRIVATE_KEY);

    const logout = await contract.logout(verify.tUserName);
    await logout.wait();

    deleteCookie("bot_token", { req, res });
    res.status(200).send({
      status: 200,
      message: "Logout Success!",
    });
    return;
  } catch (err) {
    console.log(err);
    deleteCookie("bot_token", { req, res });
    res.status(200).send({
      status: 200,
      message: "Logout Success!",
    });
    return;
  }
}
