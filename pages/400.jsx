import Image from "next/image";
import { useRouter } from "next/router";

const Custom400 = () => {
  const router = useRouter();
  return (
    <div className="flex items-center flex-col">
      <Image src={"/400.jpg"} width={500} height={500} />
      <p>Invalid client request.</p>
      <p>Please check the URL you are entered.</p>
      <button
        onClick={() => router.push("/")}
        className="p-2 border-black border-2 rounded-md mt-5"
      >
        Go to home
      </button>
    </div>
  );
};

export default Custom400;
