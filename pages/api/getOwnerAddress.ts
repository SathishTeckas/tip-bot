import { NextApiRequest, NextApiResponse } from "next";
import { ethers } from "ethers";
import ContractAbi from "../../BotV1.json";

export {};

export default async function getOwnerAddress(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    const ownerAddress = await contract.getOwner();

    res.status(200).send(ownerAddress);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
    return;
  }
}

export {};
