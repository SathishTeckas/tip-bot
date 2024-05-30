import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import ContractAbi from "../../../BotV1.json";

export default async function botVerify(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userName } = req.body;
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

  const checkSession = await contract.getSession(userName);

  if (!checkSession.token) {
    res.status(200).send({
      status: 403,
      message: "Unauthorized",
    });
    return;
  }

  res.status(200).send({
    status: 200,
    message: "Authenticated",
  });
}
