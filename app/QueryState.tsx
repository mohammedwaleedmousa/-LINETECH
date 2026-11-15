"use client";
import {Suspense,useEffect,useState} from "react";
import {useSearchParams} from "next/navigation";

function QueryObserver({onChange}:{onChange:(value:string)=>void}){
  const query=useSearchParams().toString();
  useEffect(()=>onChange(query),[query,onChange]);
  return null;
}

// Isolate the query-dependent boundary so the page's real content is still
// prerendered in the static export, before browser hydration completes.
export function usePageQuery(){
  const [query,setQuery]=useState("");
  return {params:new URLSearchParams(query),queryObserver:<Suspense fallback={null}><QueryObserver onChange={setQuery}/></Suspense>};
}
