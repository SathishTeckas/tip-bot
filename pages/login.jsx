import Image from "next/image";
import axios from "../config/axios";
import jwt from "jsonwebtoken";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import ContractAbi from "../BotV1.json";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import { setLoadingFalse, setLoadingTrue } from "../store/features/uiSlice";
import { setCookie } from "cookies-next";

const Login = ({ telegramUserName, walletAddress, auth }) => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState("");
  const loading = useSelector((state) => state.ui.loading);
  const dispatch = useDispatch();
  const signMessage = async () => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    if (!accounts[0]) {
      alert("Connect Wallet");
      return;
    }

    const contract = ethers.ContractFactory.getContract(
      contractAddress,
      ContractAbi.abi,
      signer
    );

    const chainId = window.ethereum.networkVersion;

    if (typeof window.ethereum == "undefined") {
      alert("Metamask Not Found!");
    }

    if (chainId == process.env.NEXT_PUBLIC_CHAIN_ID) {
      const message = `Authentication Code:0x${Math.floor(
        Math.random() * 1000000
      )}`;

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, window.ethereum.selectedAddress],
      });

      try {
        dispatch(setLoadingTrue());

        await axios.post(`auth/${walletAddress}/botLogin`, {
          message: message,
          signature: signature,
          tusername: telegramUserName,
        });

        dispatch(setLoadingFalse());
        router.push("/");
      } catch (err) {
        console.log(err);
        dispatch(setLoadingFalse());
        alert("Please logout from telegram before connecting new wallet");
        return;
      }

      return;
    } else {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: process.env.NEXT_PUBLIC_CHAINID_HEX,
              rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL],
              chainName: process.env.NEXT_PUBLIC_NETWORK_NAME,
              blockExplorerUrls: [process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL],
            },
          ],
        });
      } catch (err) {
        if (err.code == -32602) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: process.env.NEXT_PUBLIC_CHAINID_HEX }],
          });
        }
      }
      router.reload();
    }
  };

  const changeWallet = async () => {
    await ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    router.reload();
  };

  const loginWithMetaMask = async () => {
    await ethereum.request({
      method: "eth_requestAccounts",
    });
    router.reload();
  };

  const logoutUser = async () => {
    dispatch(setLoadingTrue());
    await axios.get(`auth/${walletAddress}/botLogout`);
    dispatch(setLoadingFalse());
    router.reload();
  };

  const setSelectedWalletAddress = async () => {
    await window.ethereum.enable();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const account = accounts[0];
    setSelectedAddress(account);
  };

  useEffect(() => {
    console.log(window.ethereum.selectedAddress);
    // setSelectedAddress(window.ethereum.selectedAddress);
    setSelectedWalletAddress();
  }, []);

  return (
    <div>
      <div className="grid place-items-center mt-5">
        <div className="flex items-center">
          <Image src={"/aurora-logo.webp"} width={200} height={100} />
          <span className="font-bold text-2xl">+</span>
          <Image src={"/telegram.png"} width={80} height={80} />
        </div>
      </div>
      <div className="grid place-items-center mt-10">
        <h1>wallet Address:{walletAddress} </h1>
        {auth ? <h1>Already Logged In</h1> : null}
        <br />
        {auth ? (
          <>
            {loading ? (
              <button className="bg-blue-600 text-white flex items-center font-bold rounded-lg px-3 py-1">
                <span className="ml-2">Loading...</span>
              </button>
            ) : (
              <button
                onClick={logoutUser}
                className="bg-red-600 text-white flex items-center font-bold rounded-lg px-3 py-1"
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                <span className="ml-2">Logout</span>
              </button>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <button className="bg-blue-600 text-white flex items-center font-bold rounded-lg px-3 py-1">
                <span className="ml-2">Loading...</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  selectedAddress
                    ? selectedAddress.toLowerCase() ==
                      walletAddress.toLowerCase()
                      ? signMessage()
                      : changeWallet()
                    : loginWithMetaMask();
                }}
                className={`${
                  selectedAddress
                    ? selectedAddress.toLowerCase() ==
                      walletAddress.toLowerCase()
                      ? "bg-black"
                      : "bg-red-500"
                    : "bg-black"
                } text-white flex items-center font-bold rounded-lg px-3 py-1`}
              >
                <Image src={"/metamask.svg"} width={30} height={30} />{" "}
                {selectedAddress
                  ? selectedAddress.toLowerCase() == walletAddress.toLowerCase()
                    ? "Login With Metamask"
                    : "Wallet Address not match"
                  : "Connect Wallet"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { tusername, walletAddress } = context.query;
  const { bot_token } = context.req.cookies;
  const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

  const { data } = await axios.post("auth/botVerify", {
    userName: tusername,
  });

  if (!walletAddress || !tusername) {
    return {
      redirect: {
        permanent: false,
        destination: "/400",
      },
    };
  }

  if (data.status == 403) {
    return {
      props: {
        telegramUserName: tusername,
        walletAddress,
        auth: false,
      },
    };
  }

  if (tusername && walletAddress) {
    try {
      const verify = jwt.verify(bot_token, JWT_PRIVATE_KEY);

      if (verify.walletAddress == walletAddress) {
        return {
          props: {
            telegramUserName: tusername,
            walletAddress,
            auth: true,
          },
        };
      } else {
        return {
          props: {
            telegramUserName: tusername,
            walletAddress,
            auth: false,
          },
        };
      }
    } catch (err) {
      console.log(err);
      return {
        props: {
          telegramUserName: tusername,
          walletAddress,
          auth: false,
        },
      };
    }
  } else {
    return {
      notFound: true,
      props: {},
    };
  }
}

export default Login;
