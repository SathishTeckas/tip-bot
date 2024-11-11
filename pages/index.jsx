import Layout from "../components/Layout";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWalletAddress } from "../store/features/uiSlice";
import {
  WhiteListedTokens,
  DepositedTokens,
  WithdrawnTokens,
  TotalTips,
  ActiveUsers,
  AccessKeys,
} from "../public/icons/dashboardIcons";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import axios from "../config/axios";
import IntroCard from "../components/introCard";

export default function Home({ auth }) {
  const dispatch = useDispatch();

  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
  });

  const loading = useSelector((state) => state.ui.loading);

  const depositedTokens = useSelector(
    (state) => state.contract.depositedTokens
  );

  const withdrawnTokens = useSelector(
    (state) => state.contract.withdrawnTokens
  );

  const totalTips = useSelector((state) => state.contract.totalTips);

  const userCount = useSelector((state) => state.contract.userCount);

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

  return (
    <Layout>
      <div className="md:px-11 hidden lg:block">
        <div className="bg-textBackgroundLight px-10 py-2 rounded-full">
          <h1 className="text-textColorBlack">Home / Dashboard</h1>
        </div>
      </div>
      <div className="bg-textBackground md:hidden rounded-lg h-40 mb-5 flex items-center px-5">
        <div>
          <Image src={"/tipBot.svg"} width={80} height={80} />
        </div>
        <div className="text-center font-thin text-sm">
          <p className="text-textColorWhite">
            Connect, withdraw & send a tip to telegram users through the Aurora
            TipBot in seconds.
          </p>

          <button
            className={"connectWalletButton mt-2"}
            onClick={loginWithMetaMask}
          >
            Connect Wallet
          </button>
        </div>
      </div>
      <div className="md:px-11">
        <div className="grid md:grid-cols-3 gap-5 lg:mt-10">
          <div
            style={{ height: 150 }}
            className="walletCard w-full text-textColorWhite rounded-lg shadow-lg overflow-hidden"
          >
            <div>
              <div
                style={{ height: 75 }}
                className="p-5 flex items-center relative  text-center"
              >
                <WhiteListedTokens />
                <h1 className="ml-7 absolute left-0 right-0">
                  Whitelisted Tokens
                </h1>
              </div>
            </div>
            <div className="bg-greenBackground text-center p-5 justify-between h-full">
              Aurora
            </div>
          </div>

          <div
            style={{ height: 150 }}
            className="walletCard w-full text-textColorWhite rounded-lg shadow-lg overflow-hidden"
          >
            <div>
              <div
                style={{ height: 75 }}
                className="p-5 flex items-center relative  text-center"
              >
                <DepositedTokens />
                <h1 className="ml-7 absolute left-0 right-0">
                  Deposited Tokens
                </h1>
              </div>
            </div>
            <div className="bg-greenBackground text-center p-5 justify-between h-full">
              <span>
                {" "}
                17
                {/*{loading
                  ? "Loading..."
                  : formatter.format(depositedTokens) + " AURORA"} */}
              </span>
            </div>
          </div>

          <div
            style={{ height: 150 }}
            className="walletCard w-full text-textColorWhite rounded-lg shadow-lg overflow-hidden"
          >
            <div>
              <div
                style={{ height: 75 }}
                className="p-5 flex items-center relative  text-center"
              >
                <DepositedTokens />
                <h1 className="ml-7 absolute left-0 right-0">
                  Withdrawn Tokens
                </h1>
              </div>
            </div>
            <div className="bg-greenBackground text-center p-5 justify-between h-full">
              <span>
                8
                {/* {loading
                  ? "Loading..."
                  : formatter.format(withdrawnTokens) + "  AURORA"}{" "} */}
              </span>
            </div>
          </div>

          <div
            style={{ height: 150 }}
            className="walletCard w-full text-textColorWhite rounded-lg shadow-lg overflow-hidden"
          >
            <div>
              <div
                style={{ height: 75 }}
                className="p-5 flex items-center relative  text-center"
              >
                <TotalTips />
                <h1 className="ml-7 absolute left-0 right-0">Total Tips</h1>
              </div>
            </div>
            <div className="bg-greenBackground text-center p-5 justify-between h-full">
              <span>
                250
                {/* {loading
                  ? "Loading..."
                  : formatter.format(totalTips) + " AURORA"}{" "} */}
              </span>
            </div>
          </div>

          <div
            style={{ height: 150 }}
            className="walletCard w-full text-textColorWhite rounded-lg shadow-lg overflow-hidden"
          >
            <div>
              <div
                style={{ height: 75 }}
                className="p-5 flex items-center relative  text-center"
              >
                <ActiveUsers />
                <h1 className="ml-7 absolute left-0 right-0">Active Users</h1>
              </div>
            </div>
            <div className="bg-greenBackground text-center p-5 justify-between h-full">
              <span>
                147
                {/* {loading ? "Loading..." : formatter.format(userCount)} */}
              </span>
            </div>
          </div>
        </div>
        <IntroCard />
      </div>
    </Layout>
  );
}
