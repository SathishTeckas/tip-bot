import React from "react";
import Layout from "../components/Layout";
import {
  AuroraTipBotCommands,
  HowToSendAurora,
  HowToUseAuroraTipBot,
  HowToWithdrawAurora,
} from "../public/icons/aboutPageIcons";

const About = () => {
  return (
    <Layout>
      <div className="md:px-11 hidden lg:block">
        <div className="bg-textBackgroundLight px-10 py-2 rounded-full">
          <h1 className="text-textColorBlack">Home / About</h1>
        </div>
      </div>
      <div className="md:px-10">
      <div className="aboutPageCardComponent md:flex items-center justify-between">
        <div>
          <h1 className="text-2xl">How to Use Aurora TipBot</h1>
          <h2 className="mt-3 font-thin mb-3">
            Connect Your MetaMask wallet to Your Telegram Account.
          </h2>

          <ul className="list-outside list-disc font-thin">
            <li>
              to see the list of commands - send a message to @aurora_tip_bot on
              Telegram;
            </li>
            <li>
              type /login with your Metamask address that has Aurora tokens;
            </li>
            <li>
              pass by the link to authenticate your wallet with the Aurora
              Community Tipbot;
            </li>
            <li>
              You’ll be sent a link to authenticate the wallet with the Aurora
              TipBot
            </li>
            <li>
              The link navigates to connect to MetaMask. Once connected, the
              Aurora telegram bot will have access.
            </li>
            <li>
              Return to the chat with @aurora_tip_bot and perform various
              actions.
            </li>
            <li>You can now start sending tips to anyone instantly!</li>
          </ul>
        </div>
        <div className="hidden md:block">
          <HowToSendAurora />
        </div>
      </div>

      <div className="aboutPageCardComponent md:flex items-center justify-between">
        <div>
          <h1 className="text-2xl">How to Send $AURORA?</h1>
          <ul className="list-outside list-disc font-thin">
            <li>
              Once you have connected your wallet to your Telegram account,
              you’re ready to Tip.
            </li>
            <li>
              Type /tip with the no: of tokens you wanna send with respective
              telegram username For eg: /tip 3 @username
            </li>
            <li>
              Since MetaMask is connected already, Voila, the tokens will be
              sent.
            </li>
            <li>
              If successful, you’ll receive Aurora transaction link to verify
              the same
            </li>
          </ul>
        </div>
        <div className="hidden md:block">
          <HowToWithdrawAurora />
        </div>
      </div>

      <div className="aboutPageCardComponent md:flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Aurora TipBot Commands</h1>
          <h2 className="mt-3 font-thin mb-3">Account</h2>
          <ul className="list-outside list-disc font-thin">
            <li>
              /login walletAddress - TipBot Login with your Metamask wallet.
            </li>
            <li>/viewaccount - view wallet details</li>
            <li>/balance - get token balance</li>
            <li>/logout - logout currently logged in user</li>
          </ul>

          <h2 className="mt-3 font-thin mb-3">Bot Features</h2>
          <ul className="list-outside list-disc font-thin">
            <li>/tipbot - TipBot Features</li>
            <li>/tip amount @userName - tip tokens</li>
            <li>/deposit - deposit aurora tokens into bot contract</li>
            <li>/withdraw amount - withdraw tokens from contract</li>
            <li>/about - information about this bot</li>
          </ul>
        </div>
        <div className="hidden md:block">
          <AuroraTipBotCommands />
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default About;
