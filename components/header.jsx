import Image from "next/image";
import styles from "./../styles/header.module.css";
import { Transition } from "@headlessui/react";
import { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadingFalse,
  setLoadingTrue,
  setWalletAddress,
} from "../store/features/uiSlice";
import {
  setTotalDepositedAmount,
  setTotalWithdrawnAmount,
  setTotalTipAmount,
  setTotalUserCount,
  setOwner,
} from "../store/features/contractSlice";
import {
  setContractAddress,
  setBalance,
  setTokenAddress,
} from "../store/features/contractSlice";
import { ethers } from "ethers";
import axios from "../config/axios";
import ContractAbi from "../BotV1.json";

const Header = () => {
  const walletAddress = useSelector((state) => state.ui.walletAddress);

  const ownerAddress = useSelector((state) => state.contract.owner);

  const balance = useSelector((state) => state.contract.balance);

  const contractAddress = useSelector(
    (state) => state.contract.contractAddress
  );

  const dispatch = useDispatch();

  const loginWithMetaMask = async () => {
    const chainId = window.ethereum.networkVersion;
    if (typeof window.ethereum == "undefined") {
      alert("Metamask Not Found!");
    }

    console.log("Chain Id", chainId);
    console.log("Chain Id from env", process.env.NEXT_PUBLIC_CHAIN_ID);
    if (chainId == process.env.NEXT_PUBLIC_CHAIN_ID) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const message = `Authentication Code:0x${Math.floor(
        Math.random() * 1000000
      )}`;

      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, window.ethereum.selectedAddress],
      });

      const res = await axios.post(
        `auth/${window.ethereum.selectedAddress}/login`,
        {
          message: message,
          signature: signature,
        }
      );
      dispatch(setWalletAddress(res.data.walletAddress));
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
    }
  };

  const getContractOwner = async () => {
    try {
      const ownerAddress = await axios.get("/getOwnerAddress");
      dispatch(setOwner(ownerAddress.data));
    } catch (err) {
      console.log(err);
      alert("Transaction Failed");
    }
  };

  const checkAccount = async () => {
    const verify = await axios.get(`auth/verify`);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    if (accounts.length) {
      const signer = await provider.getSigner();

      const signerAddress = await signer.getAddress();

      const chainId = window.ethereum.networkVersion;

      if (verify.data.auth) {
        if (signerAddress == verify.data.auth.walletAddress) {
          if (chainId != parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: process.env.NEXT_PUBLIC_CHAINID_HEX,
                  rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL],
                  chainName: process.env.NEXT_PUBLIC_NETWORK_NAME,
                  blockExplorerUrls: [
                    process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL,
                  ],
                },
              ],
            });
          } else {
            if (verify.data.auth != null) {
              dispatch(setWalletAddress(verify.data.auth.walletAddress));
            }
          }
        } else {
          await ethereum.request({
            method: "wallet_requestPermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
        }
      }
    }
  };

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const chainId = window.ethereum.networkVersion;
    if (chainId != parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) {
      return;
    }
    console.log("Contract Address", process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      ContractAbi.abi,
      provider
    );

    console.log("Wallet Address", walletAddress);
    try {
      if (walletAddress) {
        const balance = await contract.getBalance(walletAddress);
        console.log(ethers.utils.formatEther(balance));
        dispatch(setBalance(ethers.utils.formatEther(balance)));
      }
    } catch (err) {
      console.log("Error from getBalance");
      console.log(err);
    }
  };

  const getContractDate = async () => {
    const contractData = await axios.get("getContractData");

    const {
      data: { depositedTokens, withdrawnTokens, totalTips, totalUsers },
    } = contractData;

    console.log(contractData);

    dispatch(setTotalDepositedAmount(depositedTokens));
    dispatch(setTotalTipAmount(totalTips));
    dispatch(setTotalUserCount(totalUsers));
    dispatch(setTotalWithdrawnAmount(withdrawnTokens));
    dispatch(setLoadingFalse());
  };

  useEffect(() => {
    dispatch(setLoadingTrue());
    dispatch(setContractAddress(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS));
    dispatch(setTokenAddress(process.env.NEXT_PUBLIC_TOKEN_ADDRESS));
    getBalance();
    checkAccount();
    getContractDate();
    getContractOwner();
  }, []);
  const [toggleProfile, setToggleProfile] = useState(false);
  return (
    <nav className="bg-blackBackground z-10 fixed w-full h-20 justify-between items-center flex px-2 md:px-10">
      <div>
        <Image src={"/botIcon.svg"} width={158} height={50} />
      </div>
      {walletAddress ? (
        <div className="relative bg-textBackground justify-center text-textColorWhite rounded-md px-10 py-2">
          <button
            className="flex items-center"
            onClick={() => setToggleProfile(!toggleProfile)}
          >
            <span className="hidden md:block">
              {walletAddress.slice(
                0,
                walletAddress.length - (walletAddress.length - 7)
              )}
              ...
              {walletAddress.slice(
                walletAddress.length - 7,
                walletAddress.length
              )}
            </span>
            <div className="ml-3">
              <Image src={"/icons/user.svg"} width={30} height={30} />
            </div>
          </button>
          <Transition
            show={toggleProfile}
            enter="transform transition duration-[400ms]"
            enterFrom="opacity-0 scale-50"
            enterTo="opacity-100 scale-100"
            leave="transform duration-200 transition ease-in-out"
            leaveFrom="opacity-100 scale-100 "
            leaveTo="opacity-0 scale-95 " 
            className="bg-textBackground z-10 w-48 cursor-default absolute top-20 right-0 rounded-md p-5 shadow-lg"
          >
            <div className="w-full">
              <span>Tipbot Balance:</span>
              <br />
              <div className={`${styles.gradientLable} w-full`}>
                <p className="w-full">{balance} Aurora</p>
              </div>
            </div>
            <div className="mt-4 bg-green1" style={{ height: 1 }} />
            <div className="flex items-center justify-center">
              <button className="flex items-center mt-2">
                <Image src={"/icons/logout.svg"} width={15} height={13} />
                <span className="ml-2">Log Out</span>
              </button>
            </div>
          </Transition>
        </div>
      ) : (
        <button
          onClick={loginWithMetaMask}
          className={styles.connectWalletButton}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
};

export default Header;
