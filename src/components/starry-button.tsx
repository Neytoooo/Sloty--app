"use client";

import React from 'react';
import Link from 'next/link';

export default function StarryButton({ href, children }: { href: string; children: React.ReactNode }) {
  const btnColor = "#2563eb"; // bg-blue-600
  const starColor = "#ef4444"; // red

  return (
    <>
      <style>{`
        .starry-btn {
          position: relative;
          padding: 16px 32px;
          background: ${btnColor};
          font-size: 1.125rem;
          font-weight: 700;
          color: white;
          border: 2px solid ${btnColor};
          border-radius: 9999px;
          box-shadow: 0 4px 14px 0 rgba(37, 99, 235, 0.39);
          transition: all 0.3s ease-in-out;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        @media (min-width: 768px) {
          .starry-btn {
            width: auto;
          }
        }

        .starry-btn svg.star-svg {
          fill: ${starColor};
        }

        .star-base {
          position: absolute;
          height: auto;
          filter: drop-shadow(0 0 0 ${starColor});
          z-index: -5;
        }

        .starry-btn .star-1 {
          top: 20%; left: 20%; width: 25px;
          transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);
        }
        .starry-btn .star-2 {
          top: 45%; left: 45%; width: 15px;
          transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
        }
        .starry-btn .star-3 {
          top: 40%; left: 40%; width: 5px;
          transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);
        }
        .starry-btn .star-4 {
          top: 20%; left: 40%; width: 8px;
          transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01);
        }
        .starry-btn .star-5 {
          top: 25%; left: 45%; width: 15px;
          transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01);
        }
        .starry-btn .star-6 {
          top: 5%; left: 50%; width: 5px;
          transition: all 0.8s ease;
        }

        .starry-btn:hover {
          background: transparent;
          color: ${btnColor};
          box-shadow: 0 0 25px rgba(37, 99, 235, 0.5);
        }

        .starry-btn:hover .star-1 {
          top: -80%; left: -30%;
          filter: drop-shadow(0 0 10px ${starColor});
          z-index: 2;
        }
        .starry-btn:hover .star-2 {
          top: -25%; left: 10%;
          filter: drop-shadow(0 0 10px ${starColor});
          z-index: 2;
        }
        .starry-btn:hover .star-3 {
          top: 55%; left: 25%;
          filter: drop-shadow(0 0 10px ${starColor});
          z-index: 2;
        }
        .starry-btn:hover .star-4 {
          top: 30%; left: 80%;
          filter: drop-shadow(0 0 10px ${starColor});
          z-index: 2;
        }
        .starry-btn:hover .star-5 {
          top: 25%; left: 115%;
          filter: drop-shadow(0 0 10px ${starColor});
          z-index: 2;
        }
        .starry-btn:hover .star-6 {
          top: 5%; left: 60%;
          filter: drop-shadow(0 0 10px ${starColor});
          z-index: 2;
        }
      `}</style>
      <Link href={href} className="starry-btn">
        {children}
        <div className="star-base star-1">
          <svg className="star-svg" viewBox="0 0 784.11 815.53"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" /></svg>
        </div>
        <div className="star-base star-2">
          <svg className="star-svg" viewBox="0 0 784.11 815.53"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" /></svg>
        </div>
        <div className="star-base star-3">
          <svg className="star-svg" viewBox="0 0 784.11 815.53"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" /></svg>
        </div>
        <div className="star-base star-4">
          <svg className="star-svg" viewBox="0 0 784.11 815.53"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" /></svg>
        </div>
        <div className="star-base star-5">
          <svg className="star-svg" viewBox="0 0 784.11 815.53"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" /></svg>
        </div>
        <div className="star-base star-6">
          <svg className="star-svg" viewBox="0 0 784.11 815.53"><path d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z" /></svg>
        </div>
      </Link>
    </>
  );
}
