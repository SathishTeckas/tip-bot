import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex fixed bottom-0 bg-white w-full justify-center h-10">
        <div className="flex items-center lg:ml-80">
        <h1 className="text-textBackground font-thin">
          2023 Designed by Aurora Community with
        </h1>
        <Image src={"/icons/heart.svg"} width={15} height={15} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
