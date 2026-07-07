import { Poppins } from "next/font/google";
import Image from 'next/image';
import logo from "@/app/assets/logo.png";

const poppins = Poppins({
    subsets: ["latin"],
    weight: "400",
});

export default function Header() {
    return (
        <header className={`bg-[#0F4D92] text-white py-6 px-8 shadow-md flex justify-center ${poppins.className}`}>
            <Image
                src={logo}
                alt="Logo EpiTransfer"
                width={70}
                height={70}
                className="object-contain -mt-4"
            />
            <p className="text-4xl font-bold tracking-wide leading-none">EpiTransfer</p>
        </header>
    );
}