// import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';

// const FallingContainer = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   overflow: hidden;
//   pointer-events: none;
// `;

// const FallingText = styled.span`
//   position: absolute;
//   color: rgba(255, 255, 255, 0.8);
//   user-select: none;
// `;

// const Falling = ({ text = '❄', count = 50, speed = 5 }) => {
//   const [fallingItems, setFallingItems] = useState([]);

//   useEffect(() => {
//     const items = Array.from({ length: count }, (_, index) => ({
//       id: index,
//       x: Math.random() * 100,
//       y: -(Math.random() * 100),
//       speed: Math.random() * speed + 1,
//       landed: false,
//     }));

//     setFallingItems(items);

//     const animate = () => {
//       setFallingItems(prevItems =>
//         prevItems.map(item => {
//           if (item.landed) return item;

//           const newY = item.y + item.speed;

//           if (newY >= 100) {
//             return { ...item, y: 100, landed: true };
//           }

//           return { ...item, y: newY };
//         })
//       );

//       requestAnimationFrame(animate);
//     };

//     const animationFrame = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationFrame);
//   }, [count, speed]);

//   return (
//     <FallingContainer>
//       {fallingItems.map(item => (
//         <FallingText
//           key={item.id}
//           style={{
//             left: `${item.x}%`,
//             top: `${item.y}%`,
//           }}
//         >
//           {text}
//         </FallingText>
//       ))}
//     </FallingContainer>
//   );
// };

// export default Falling;