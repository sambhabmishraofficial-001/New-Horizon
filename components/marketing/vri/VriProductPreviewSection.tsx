"use client";

import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { VriProductPreview } from "@/components/marketing/vri/VriProductPreview";
import { VriDomainPills } from "@/components/marketing/vri/VriDomainPills";

export function VriProductPreviewSection() {
  return (
    <>
      <ContainerScroll compact className="-mt-10 md:-mt-14">
        <VriProductPreview />
      </ContainerScroll>
      <VriDomainPills className="mx-auto mt-8 max-w-[1400px] px-4 sm:mt-10 sm:px-6" />
    </>
  );
}
