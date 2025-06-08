"use client"

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import paperImg from "@/../public/paper2.jpg"
import winTitle from "@/../public/win-title2.png"
import failTitle from "@/../public/fail-title2.png"
import Link from "next/link";
import { useMemo } from 'react';

export default function GamePage() {
  const isHitRef = useRef(false);

  const gameRef = useRef(null);
  const playerRef = useRef(null);
  const [enemies, setEnemies] = useState([]);
  const [trail, setTrail] = useState([]); // 滑鼠軌跡

  const playerSize = 40;
  const enemySize = 30;
  const enemyIdCounter = useRef(0);
  const [lives, setLives] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isInvincible, setIsInvincible] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [count, setCount] = useState(20); //計時
  const [isCleared, setIsCleared] = useState(false);

  const isGameEnded = isCleared || isGameOver;

  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

  const [isClient, setIsClient] = useState(false);

  const playAgain = function(){
    window.location.reload();
  }

//   const slashSounds = useMemo(() => [
//     new Audio('/audio/writing1.mp3'),
//     new Audio('/audio/writing2.mp3'),
//     new Audio('/audio/writing3.mp3'),
//     new Audio('/audio/writing4.mp3'),
//     new Audio('/audio/writing5.mp3')
//   ], []);

// const playRandomSlashSound = () => {
//   if (typeof window === 'undefined') return; // ⛔ 避免伺服器端執行

//   const randomIndex = Math.floor(Math.random() * slashSounds.length);
//   const sound = slashSounds[randomIndex];
//   // 若已在播放則先重設再播放，避免卡住
//   sound.pause();         // 停止當前播放
//   sound.currentTime = 0; // 回到開頭
//   sound.play();          // 播放音效
// };


  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const x = window.innerWidth / 2 - playerSize / 2;
    const y = window.innerHeight / 2 - playerSize / 2;
    setPlayerPos({ x, y });
  }, []);

  let uniqueId = 0;
  function getUniqueId() {
    return uniqueId++;
  }

  //計時
  useEffect(() => {
    if (isGameEnded) return;
  
  if (count <= 0) {
    if (!isGameOver) {  // 只有還沒失敗時才會進入通關狀態
      setIsCleared(true); // ✅ 通關判定
    }
    return;
  }

  const timer = setTimeout(() => {
    setCount(prev => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [count]);

  //滑鼠移動軌跡點
  useEffect(() => {
    if (isGameEnded) return;

    const handleMouseMove = (e) => {
      const point = { id: getUniqueId(), x: e.clientX, y: e.clientY };
      setTrail((prev) => [...prev, point]);
      setTimeout(() => {
        setTrail((prev) => prev.filter(p => p.id !== point.id));
      }, 200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  //消滅敵人
  useEffect(() => {
    let animationId;
    const checkCollisions = () => {
      setEnemies(prevEnemies =>
        prevEnemies.filter(enemy => {
          return !trail.some(point => {
            const dx = enemy.x + enemySize / 2 - point.x;
            const dy = enemy.y + enemySize / 2 - point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < enemySize / 2;
          });
        })
      );
      animationId = requestAnimationFrame(checkCollisions);
    };
    animationId = requestAnimationFrame(checkCollisions);
    return () => cancelAnimationFrame(animationId);
  }, [trail, enemySize]);
// useEffect(() => {
//   let animationId;

//   const checkCollisions = () => {
//     setEnemies(prevEnemies => {
//       const newEnemies = [];
//       let hitOccurred = false;

//       for (let enemy of prevEnemies) {
//         const wasHit = trail.some(point => {
//           const dx = enemy.x + enemySize / 2 - point.x;
//           const dy = enemy.y + enemySize / 2 - point.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);
//           return distance < enemySize / 2;
//         });

//         if (wasHit) {
//           hitOccurred = true; // 紀錄是否有敵人被擊中
//         } else {
//           newEnemies.push(enemy); // 沒被擊中的敵人才保留
//         }
//       }

//       // 隨機播放音效（如果有敵人被筆跡打到）
//       if (hitOccurred && !isGameEnded) {
//         playRandomSlashSound();
//       }

//       return newEnemies;
//     });

//     animationId = requestAnimationFrame(checkCollisions);
//   };

//   animationId = requestAnimationFrame(checkCollisions);
//   return () => cancelAnimationFrame(animationId);
// }, [trail, enemySize]);

  // 敵人生成
  useEffect(() => {
    if (isGameEnded) return;

    const spawnEnemy = () => {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      switch (side) {
        case 0: x = Math.random() * window.innerWidth; y = -enemySize; break;
        case 1: x = window.innerWidth + enemySize; y = Math.random() * window.innerHeight; break;
        case 2: x = Math.random() * window.innerWidth; y = window.innerHeight + enemySize; break;
        case 3: x = -enemySize; y = Math.random() * window.innerHeight; break;
      }
      setEnemies(prev => {
        const id = enemyIdCounter.current++;
        return [...prev, { id, x, y }];
      });
    };
    const interval = setInterval(spawnEnemy, 500); // 2000 = 每 2 秒生成一個敵人
    return () => clearInterval(interval);
  }, []);

  // 敵人移動
  useEffect(() => {
    if (playerPos.x === 0 && playerPos.y === 0) return; // 尚未初始化完畢
    if (isGameEnded) return;

    const moveEnemies = () => {
      setEnemies(prev =>
        prev.map(enemy => {
          const dx = playerPos.x - enemy.x;
          const dy = playerPos.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const speed = 1.2;
          return {
            ...enemy,
            x: enemy.x + (dx / distance) * speed,
            y: enemy.y + (dy / distance) * speed,
          };
        })
      );
      requestAnimationFrame(moveEnemies);
    };
    moveEnemies();
  }, [playerPos]);

  // 檢查角色與敵人的碰撞
useEffect(() => {
  if (isGameEnded) return;

  const isHitRef = { current: false }; // 避免重複碰撞處理
  let animationId;

  const checkPlayerCollisions = () => {
    setEnemies(prevEnemies => {
      const remainingEnemies = [];
      let collided = false;

      for (let enemy of prevEnemies) {
        const dx = (enemy.x + enemySize / 2) - (playerPos.x + playerSize / 2);
        const dy = (enemy.y + enemySize / 2) - (playerPos.y + playerSize / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (enemySize + playerSize) / 2) {
          collided = true; // 一律消除敵人
          // 不加進 remainingEnemies → 被消除
        } else {
          remainingEnemies.push(enemy);
        }
      }

      // 扣血與進入無敵狀態：只在非 invincible 時執行
      if (collided && !isInvincible && !isHitRef.current) {
        isHitRef.current = true;

        if (!isCleared) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setIsGameOver(true);
            }
            return newLives;
          });
        }

        // 啟動無敵與閃爍
        setIsInvincible(true);
        setIsFlashing(true);

        setTimeout(() => {
          setIsInvincible(false);
          setIsFlashing(false);
          isHitRef.current = false;
        }, 1000);
      }

      return remainingEnemies;
    });

    animationId = requestAnimationFrame(checkPlayerCollisions);
  };

  animationId = requestAnimationFrame(checkPlayerCollisions);
  return () => cancelAnimationFrame(animationId);
}, [playerPos.x, playerPos.y, isGameOver, isCleared, isInvincible]);


  return (
    <div
      ref={gameRef}
      className="w-full h-screen bg-[#fff9ef] relative overflow-hidden"
      style={{
        backgroundImage: `url(${paperImg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        cursor: 'url(pencil.png) 0 32, auto',
      }}
    >
      <div className="absolute top-4 left-4 text-lg font-bold text-red-600">
        ❤️ x {lives}
      </div>

      <div className="absolute top-4 right-4 text-lg font-bold text-black">
        計時：{count} 秒
      </div>

      {/* 玩家 */}
      <div
        ref={playerRef}
        style={{
          width: playerSize,
          height: playerSize,
          borderRadius: '50%',
          background: '#333',
          position: 'absolute',
          left: playerPos.x,
          top: playerPos.y,
          opacity: isFlashing ? 0.3 : 1,
          transition: 'opacity 0.1s ease-in-out',
        }}
      />

      {/* 敵人 */}
      {!isGameEnded && enemies.map(enemy => (
        <div
          key={enemy.id}
          style={{
            width: enemySize,
            height: enemySize,
            borderRadius: '50%',
            background: 'crimson',
            position: 'absolute',
            left: enemy.x,
            top: enemy.y,
          }}
        />
      ))}

      {/* 滑鼠軌跡 */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <polyline
          points={trail.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 遊戲結束視窗 */}
      {isGameOver && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-stone-700 bg-opacity-60 text-white text-3xl font-bold z-50">
          <div>
            <Image src={failTitle} alt='failTitle' className="" />
          </div>

          <div className='flex flex-row gap-10'>

            <Link href="">
              <div className="px-4 py-2 mt-4 rounded-full bg-white text-black text-lg hover:bg-gray-200 transition" onClick={playAgain}>
                再來一次
              </div>
            </Link>


            <Link href="/">
            <div className="px-4 py-2 mt-4 rounded-full flex justify-center item-center bg-white text-black text-lg hover:bg-gray-200 transition">
              不要了！
            </div>
            </Link>

          </div>
        </div>
      )}

      {isClient && isCleared && (
        <div className="absolute inset-0 flex justify-center items-center flex-col bg-zinc-700 bg-opacity-60 text-white text-3xl font-bold z-50">
          <div>
            <Image src={winTitle} alt='failTitle' className="" />
          </div>
            

    <Link href="/">
      <div className="px-4 py-2 mt-4 rounded-full bg-white text-black text-lg hover:bg-gray-200 transition">
        回主畫面
      </div>
    </Link>
  </div>
      )}

    </div>
  );
}