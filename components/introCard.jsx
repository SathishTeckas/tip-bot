import Styles from "../styles/introCard.module.css";
import Image from "next/image";

const IntroCard = () => {
  return (
    <div className={`${Styles.introCard} flex flex-col px-10 md:flex-row`}>
      <div>
        <Image src={"/tipBot.svg"} width={180} height={180} />
      </div>
      <div>
        <h1 className="text-greenText">
          Connect, withdraw & send a tip to telegram users through the Aurora
          TipBot in seconds.
        </h1>
        <p className="mt-4">
          Connect Your MetaMask wallet to Your Telegram Account.
        </p>
        <ul style={{ fontWeight: 100, listStyle: "outside" }}>
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
            Return to the chat with @aurora_tip_bot and perform various actions.
          </li>
          <li>You can now start sending tips to anyone instantly!</li>
        </ul>
      </div>
    </div>
  );
};

export default IntroCard;
