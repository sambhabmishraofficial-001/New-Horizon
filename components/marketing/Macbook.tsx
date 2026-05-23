"use client";

import "./macbook.css";
import { MacbookPixelHumans } from "@/components/marketing/MacbookPixelHumans";

export function Macbook() {
  return (
    <div className="product-macbook-stage" aria-hidden>
      <div className="macbook-scale">
      <div className="macbook">
        <div className="macbook__inner">
          <div className="macbook__screen">
            <div className="macbook__screen-back" aria-hidden>
              <span className="macbook__lid-logo">[HN]</span>
            </div>
            <div className="macbook__screen-face">
              <div className="macbook__camera" />
              <div className="macbook__display">
                <MacbookPixelHumans />
                <div className="macbook__display-shade" />
              </div>
            </div>
          </div>

          <div className="macbook__base">
            <div className="macbook__base-face">
              <div className="macbook__touchpad" />
              <div className="macbook__keyboard">
                {Array.from({ length: 58 }).map((_, i) => (
                  <div key={`k-${i}`} className="macbook__key" />
                ))}
                <div className="macbook__key macbook__key--space" />
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={`f-${i}`}
                    className="macbook__key macbook__key--fn"
                  />
                ))}
              </div>
            </div>
            <div className="macbook__foot macbook__foot--tl" />
            <div className="macbook__foot macbook__foot--tr" />
            <div className="macbook__foot macbook__foot--br" />
            <div className="macbook__foot macbook__foot--bl" />
          </div>
        </div>

        <div className="macbook__shadow" />
      </div>
      </div>
    </div>
  );
}
