import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const {category} = await params;
  
  return <div>page {category}</div>;
}
