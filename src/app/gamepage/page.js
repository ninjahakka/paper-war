"use client"

import { useEffect, useRef, useState } from 'react';

export default function GamePage() {
  const gameRef = useRef(null);
  const playerRef = useRef(null);
  const [enemies, setEnemies] = useState([]);
  const [trail, setTrail] = useState([]); // 滑鼠軌跡

  const playerSize = 40;
  const enemySize = 30;

  const enemyIdCounter = useRef(0);

  const [lives, setLives] = useState(3); // 生命值
  const [isGameOver, setIsGameOver] = useState(false); // 是否結束



  // 玩家固定在畫面中央

  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const x = window.innerWidth / 2 - playerSize / 2;
    const y = window.innerHeight / 2 - playerSize / 2;
    setPlayerPos({ x, y });
  }, []);

  let uniqueId = 0;

  function getUniqueId() {
    return uniqueId++;
  }


  //滑鼠移動軌跡點
  useEffect(() => {
    const handleMouseMove = (e) => {
      const point = { id: getUniqueId(), x: e.clientX, y: e.clientY };
      setTrail((prev) => [...prev, point]);

      // 自動移除該軌跡點（例如 200ms 後）
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



  // 敵人生成
useEffect(() => {
  const spawnEnemy = () => {
    const side = Math.floor(Math.random() * 4); // 0上, 1右, 2下, 3左
    let x = 0, y = 0;

    switch (side) {
      case 0: // 上
        x = Math.random() * window.innerWidth;
        y = -enemySize;
        break;
      case 1: // 右
        x = window.innerWidth + enemySize;
        y = Math.random() * window.innerHeight;
        break;
      case 2: // 下
        x = Math.random() * window.innerWidth;
        y = window.innerHeight + enemySize;
        break;
      case 3: // 左
        x = -enemySize;
        y = Math.random() * window.innerHeight;
        break;
    }

    setEnemies(prev => {
  const id = enemyIdCounter.current++;
  return [...prev, { id, x, y }];
});
  };

  const interval = setInterval(spawnEnemy, 2000); // 每 2 秒生成一個敵人
  return () => clearInterval(interval);
}, []);


  // 敵人移動
useEffect(() => {
  if (playerPos.x === 0 && playerPos.y === 0) return; // 尚未初始化完畢

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
}, [playerPos])

  //https://hackmd.io/@Heidi-Liu/nextjs-error-fix
  useEffect(() => {
    // Client-side-only        
    console.log('window: ', window);
    
    window.addEventListener('scroll', (e) => {
    console.log('srcoll: ', e)
  })
},[])

// 檢查角色與敵人的碰撞
useEffect(() => {
  //if (isGameOver) return;

  let animationId;

  const checkPlayerCollisions = () => {
    setEnemies(prevEnemies => {
      const remainingEnemies = [];
      let hit = false;

      for (let enemy of prevEnemies) {
        const dx = (enemy.x + enemySize / 2) - (playerPos.x + playerSize / 2);
        const dy = (enemy.y + enemySize / 2) - (playerPos.y + playerSize / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (enemySize + playerSize) / 2) {
          hit = true; // 被撞到
        } else {
          remainingEnemies.push(enemy);
        }
      }


      if (hit) {
        setLives(prev => {
          const newLives = prev - 0.5;
          if (newLives <= 0) {
            setIsGameOver(true);
          }
          return newLives;
        });
      }

      return remainingEnemies; // 移除撞到角色的敵人
    });

    animationId = requestAnimationFrame(checkPlayerCollisions);
  };

  animationId = requestAnimationFrame(checkPlayerCollisions);
  return () => cancelAnimationFrame(animationId);
}, [playerPos.x, playerPos.y, isGameOver]);


return (
  <div
    ref={gameRef}
    className="w-full h-screen bg-[#fff9ef] relative overflow-hidden"
  >

    {/* 生命條 */}
    <div className="absolute top-4 left-4 text-lg font-bold text-red-600">
      ❤️ x {lives}
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
      }}
    />

    {/* 敵人 */}
    {enemies.map((enemy) => (
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


      {/* 滑順 SVG 滑鼠軌跡 */}
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

  </div>
);

}
