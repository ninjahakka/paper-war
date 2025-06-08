import Image from "next/image";
import Link from "next/link";
import paperImg from "@/../public/paper2.jpg"

export default function Home() {

  return (
    <div className="w-screen h-screen bg-[#fff9ef] flex justify-center items-center"
    style={
              { backgroundImage: `url(${paperImg.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'}
            }
    >
          <Link href="/gamepage">
            <div className="flex gap-4 items-center justify-center flex-col sm:flex-row">
            <div
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground 
              text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-2xl h-10 sm:h-12 px-4 sm:px-5 
              sm:w-auto"
              //text-sm sm:text-base
              target="_blank"
              rel="noopener noreferrer"    
            >
              <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              開始遊戲
            </div>
          </div>
          </Link>
                    
        </div>


  
  );
}
