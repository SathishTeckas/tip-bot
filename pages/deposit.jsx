import React, { useState, useRef } from "react";
import Layout from "../components/Layout";
import ContractAbi from "../BotV1.json";
import { BigNumber, ethers } from "ethers";
import { ToastPortal } from "../components/ToastPortal";
import { ToastProvider } from "react-toast-notifications";
import { useDispatch, useSelector } from "react-redux";
import { setBalance } from "../store/features/contractSlice";
import { setLoadingFalse, setLoadingTrue } from "../store/features/uiSlice";
import Lottie from "react-lottie";
import * as animationData from "../public/rocket-animation.json";

const Deposit = () => {
  const toastRef = useRef();

  const dispatch = useDispatch();

  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
  });

  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const loading = useSelector((state) => state.ui.loading);

  const [allowance, setAllowance] = useState(false);

  const walletAddress = useSelector((state) => state.ui.walletAddress);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const balance = useSelector((state) => state.contract.balance);
  const contractAddress = useSelector(
    (state) => state.contract.contractAddress
  );
  const tokenAddress = useSelector((state) => state.contract.tokenAddress);

  const approveContract = async (amount) => {
    if (!walletAddress) {
      toastRef.current.addMessage({
        mode: "info",
        message:
          "Please connect your metamask wallet before depositing tokens.",
      });
      return;
    }

    if (depositAmount <= 0) {
      toastRef.current.addMessage({
        mode: "info",
        message: "Enter valid amount.",
      });
      return;
    }

    setDepositLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const tokenAbi = [
      {
        inputs: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "address", name: "dao", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          {
            internalType: "uint256",
            name: "subtractedValue",
            type: "uint256",
          },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

    await tokenContract.connect(signer);

    try {
      const approve = await tokenContract.approve(
        contractAddress,
        ethers.utils.parseUnits(amount)
      );

      await approve.wait();
      setDepositLoading(false);
      setAllowance(true);
    } catch (err) {
      toastRef.current.addMessage({
        mode: "error",
        message: "Transaction Failed",
      });
    }
  };

  const deposit = async () => {
    if (!walletAddress) {
      toastRef.current.addMessage({
        mode: "info",
        message:
          "Please connect your metamask wallet before depositing tokens.",
      });
      return;
    }

    if (depositAmount <= 0) {
      toastRef.current.addMessage({
        mode: "info",
        message: "Enter valid amount.",
      });
      return;
    }
    setDepositLoading(true);
    const chainId = window.ethereum.networkVersion;
    console.log(chainId);
    console.log(process.env.NEXT_PUBLIC_CHAIN_ID);
    if (chainId == parseInt(process.env.NEXT_PUBLIC_CHAIN_ID)) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      const signer = provider.getSigner();
      if (!accounts[0]) {
        alert("Connect Wallet");
        return;
      }
      const contract = new ethers.Contract(
        contractAddress,
        ContractAbi.abi,
        signer
      );

      const tokenAbi = [
        {
          inputs: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "symbol", type: "string" },
            { internalType: "address", name: "dao", type: "address" },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "account", type: "address" },
          ],
          name: "balanceOf",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "decimals",
          outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            {
              internalType: "uint256",
              name: "subtractedValue",
              type: "uint256",
            },
          ],
          name: "decreaseAllowance",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "addedValue", type: "uint256" },
          ],
          name: "increaseAllowance",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "transfer",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
          ],
          name: "transferFrom",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      try {
        const tokenBalance = ethers.utils.formatEther(
          await tokenContract.balanceOf(accounts[0])
        );

        if (parseFloat(tokenBalance) < parseFloat(depositAmount)) {
          toastRef.current.addMessage({
            mode: "info",
            message: "Insufficient Aurora Tokens",
          });
          setDepositLoading(false);
          return;
        }

        // const approve = await tokenContract.approve(
        //   contractAddress,
        //   ethers.utils.parseUnits(depositAmount)
        // );
        // await approve.wait();
        const eth_balance = ethers.utils.formatEther(
          await provider.getBalance(accounts[0])
        );
        const gasPrice = ethers.utils.formatEther(await provider.getGasPrice());
        if (eth_balance < gasPrice) {
          toastRef.current.addMessage({
            mode: "info",
            message: "Insufficient ETH balance to pay gas fee.",
          });
          setDepositLoading(false);
          return;
        }
        const contractCall = await contract.deposit(
          ethers.utils.parseUnits(depositAmount)
        );

        console.log(contractCall);
        await contractCall.wait();

        const balance = await contract.getBalance(accounts[0]);

        dispatch(setBalance(ethers.utils.formatEther(balance)));
        setDepositLoading(false);
        toastRef.current.addMessage({
          mode: "success",
          message: `Deposited ${depositAmount} Aurora tokens.`,
        });
      } catch (err) {
        toastRef.current.addMessage({
          mode: "error",
          message: "Transaction Failed",
        });
        setDepositLoading(false);
      }
    } else {
      alert("Switch to aurora mainet");
    }
  };

  const withdraw = async () => {
    if (!walletAddress) {
      toastRef.current.addMessage({
        mode: "info",
        message: "Please connect your metamask wallet before withdraw tokens.",
      });
      return;
    }

    if (withdrawAmount <= 0) {
      toastRef.current.addMessage({
        mode: "info",
        message: "Enter valid amount.",
      });
      return;
    }
    setWithdrawLoading(true);
    const chainId = window.ethereum.networkVersion;
    if (chainId == process.env.NEXT_PUBLIC_CHAIN_ID) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      const signer = provider.getSigner();
      if (!accounts[0]) {
        return alert("Connect Wallet");
      }
      const contract = new ethers.Contract(
        contractAddress,
        ContractAbi.abi,
        signer
      );

      if (parseFloat(withdrawAmount) > parseFloat(balance)) {
        toastRef.current.addMessage({
          mode: "info",
          message: "Insufficent Funds.",
        });
        setWithdrawLoading(false);
        return;
      }
      try {
        const contractCall = await contract.withdraw(
          ethers.utils.parseEther(withdrawAmount)
        );
        await contractCall.wait();

        const balance = await contract.getBalance(accounts[0]);

        dispatch(setBalance(ethers.utils.formatEther(balance)));

        setWithdrawLoading(false);
        toastRef.current.addMessage({
          mode: "success",
          message: `Withdrawn ${withdrawAmount} Aurora from bot.`,
        });
      } catch (err) {
        toastRef.current.addMessage({
          mode: "error",
          message: "Transaction Failed.",
        });
      }
    } else {
      alert("Switch to aurora mainet.");
    }
  };

  const checkAllowance = async (amount) => {
    setDepositAmount(amount);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    if (!accounts[0]) {
      return;
    }

    const tokenAbi = [
      {
        inputs: [
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "symbol", type: "string" },
          { internalType: "address", name: "dao", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          {
            internalType: "uint256",
            name: "subtractedValue",
            type: "uint256",
          },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "sender", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

    const allowance = ethers.utils.formatEther(
      await tokenContract.allowance(accounts[0], contractAddress)
    );

    if (allowance < amount) {
      setAllowance(false);
    } else {
      setAllowance(true);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <ToastProvider>
      <ToastPortal ref={toastRef} autoClose={true} />
      {/* {loading && (
        <div className="absolute w-full h-full black_background flex flex-col items-center justify-center">
          <Lottie options={defaultOptions} height={400} width={400} />
        </div>
      )} */}

      <Layout>
        <div className="md:px-11 hidden lg:block">
          <div className="bg-textBackgroundLight px-10 py-2 rounded-full">
            <h1 className="text-textColorBlack">Home / Deposit / Withdraw</h1>
          </div>
        </div>

        <div className="md:px-11">
          <div className="walletCard text-textColorWhite w-full rounded-lg shadow-lg overflow-hidden lg:mt-10 h-36">
            <div className="flex justify-between p-5">
              <p>Wallet:</p>
              <p>
                {walletAddress.slice(
                  0,
                  walletAddress.length - (walletAddress.length - 7)
                )}
                ...
                {walletAddress.slice(
                  walletAddress.length - 7,
                  walletAddress.length
                )}
              </p>
              <div></div>
            </div>
            <div className="bg-greenBackground flex p-5 justify-between h-full">
              <p>TipBot Balance:</p>
              <p className="text-greenText md:text-2xl">{balance} AURORA</p>
              <div></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 w-full md:justify-between">
            <div>
              <div
                style={{ height: 150 }}
                className="walletCard w-full text-textColorWhite rounded-lg shadow-lg overflow-hidden mt-10"
              >
                <div>
                  <div style={{ height: 75 }} className="p-5 text-center">
                    <h1>Deposit</h1>
                    <p className="text-sm opacity-50">
                      Deposit tokens to the app and you will be able to send
                      tips in telegram:
                    </p>
                  </div>
                </div>
                <div className="bg-greenBackground text-center p-5 justify-between h-full">
                  <input
                    value={depositAmount}
                    onChange={(e) => checkAllowance(e.target.value)}
                    type="number"
                    className="inputBox"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {depositLoading ? (
                <button className="depositGradientButton w-full rounded-lg py-2 mt-10">
                  Loading...
                </button>
              ) : allowance ? (
                <button
                  onClick={deposit}
                  className="depositGradientButton w-full rounded-lg py-2 mt-10"
                >
                  Deposit Aurora
                </button>
              ) : (
                <button
                  onClick={() => approveContract(depositAmount)}
                  className="depositGradientButton w-full rounded-lg py-2 mt-10"
                >
                  Approve
                </button>
              )}
            </div>

            <div>
              <div
                style={{ height: 150 }}
                className="walletCard w-full text-textColorWhite rounded-lg shadow-lg overflow-hidden mt-10"
              >
                <div>
                  <div style={{ height: 75 }} className="p-5  text-center">
                    <h1>Withdraw</h1>
                    <p className="text-sm opacity-50">
                      Withdraw funds from contract:
                    </p>
                  </div>
                </div>
                <div className="bg-greenBackground text-center p-5 justify-between h-full">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="inputBox"
                    placeholder={"0.0"}
                  />
                </div>
              </div>

              {withdrawLoading ? (
                <button className="withdrawGradientButton w-full rounded-lg py-2 mt-10">
                  Loading...
                </button>
              ) : (
                <button
                  onClick={withdraw}
                  className="withdrawGradientButton w-full rounded-lg py-2 mt-10"
                >
                  Withdraw Aurora
                </button>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ToastProvider>
  );
};

export default Deposit;
