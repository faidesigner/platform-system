"use client";

import { useState } from "react";
import StoreTypes from "@/components/sections/products/StoreTypes";
import StoreCaseStudies from "@/components/sections/products/StoreCaseStudies";

interface StoreTypeCard {
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly wide: boolean;
  readonly objectPosition?: string;
}

interface StoreTypeTab {
  readonly key: string;
  readonly label: string;
  readonly subtitle: string;
  readonly description: string;
  readonly sectionTitle: string;
  readonly cards: readonly StoreTypeCard[];
}

interface CaseStudy {
  readonly brand: string;
  readonly date: string;
  readonly store: string;
  readonly description: string;
  readonly image: string;
}

interface StoreInteractiveContainerProps {
  storeTypes: readonly StoreTypeTab[] | StoreTypeTab[];
  caseStudies: Record<string, CaseStudy[]>;
  caseStudiesEyebrow: string;
}

export default function StoreInteractiveContainer({
  storeTypes,
  caseStudies,
  caseStudiesEyebrow,
}: StoreInteractiveContainerProps) {
  const [activeTabKey, setActiveTabKey] = useState("standard");

  return (
    <>
      <StoreTypes
        tabs={storeTypes}
        activeKey={activeTabKey}
        onTabChange={setActiveTabKey}
      />
      <StoreCaseStudies
        eyebrow={caseStudiesEyebrow}
        cases={caseStudies[activeTabKey] || []}
      />
    </>
  );
}
