import Image from "next/image";
import Link from "next/link";
import paperImg from "@/../public/paper2.jpg"
import titleImg from "@/../public/title2.png"

export default function Home() {

  return (
    <div className="w-screen h-screen bg-[#fff9ef] p-[30px]"
    style={
              { backgroundImage: `url(${paperImg.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'}
            }
    >

            <Link href="https://doro.zeabur.app">
              <div className="rounded-full w-auto h-10 text-white mb-45 flex justify-center items-center
              bg-cyan-800 hover:bg-cyan-600 font-medium text-l px-4 sm:px-5 sm:w-50">
                🎪回去逛主題樂園🎪
              </div>
            </Link>


    <div className="flex flex-col justify-center items-center gap-4">

      
      <div className="text-black pb-4">
        <Image src={titleImg} alt='Title' className="" />
      </div>


      <div>
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
              {/* <Image
                className="dark:invert"
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              /> */}
              ✏️開始遊戲
            </div>
          </div>
          </Link>
      </div>


      <div className="text-black">
        準備用你手上的鉛筆，對付不斷滋生的敵人吧！
      </div>
                    
        </div>
    </div>




  
  );
}
