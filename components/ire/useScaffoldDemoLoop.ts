"use client";



import * as React from "react";



/** Matches `.demo-cursor` animation duration in globals.css (9s). */

const DEMO_CYCLE_MS = 9000;



export type ScaffoldFolderId = "question" | "method" | "evidence";



export type ScaffoldDemoState = {

  createOpen: boolean;

  expandedFolder: ScaffoldFolderId | null;

  /** How many doc cards are fanned inside the active folder (0 = folder shell only). */

  visibleDocCount: number;

};



const FOLDER_WINDOWS: { id: ScaffoldFolderId; start: number; end: number }[] = [

  { id: "question", start: 0.44, end: 0.52 },

  { id: "method", start: 0.52, end: 0.61 },

  { id: "evidence", start: 0.61, end: 0.7 },

];



function docCountForWindow(localProgress: number, maxDocs: number): number {

  if (localProgress < 0.1) return 0;

  const stepped = Math.ceil(((localProgress - 0.1) / 0.9) * maxDocs);

  return Math.min(maxDocs, Math.max(0, stepped));

}



function computeScaffoldState(progress: number): ScaffoldDemoState {

  const createOpen = progress >= 0.22 && progress < 0.44;



  for (const window of FOLDER_WINDOWS) {

    if (progress >= window.start && progress < window.end) {

      const local = (progress - window.start) / (window.end - window.start);

      return {

        createOpen,

        expandedFolder: window.id,

        visibleDocCount: docCountForWindow(local, 5),

      };

    }

  }



  return { createOpen, expandedFolder: null, visibleDocCount: 0 };

}



/**

 * Choreographs Create menu + folder fan-out in sync with the marketing preview cursor.

 * Timeline (0–1 of 9s cycle):

 * - 0.00–0.22 idle

 * - 0.22–0.44 cursor on Create → menu open

 * - 0.44–0.52 Question folder + docs fan one-by-one

 * - 0.52–0.61 Method folder + docs fan one-by-one

 * - 0.61–0.70 Evidence folder + docs fan one-by-one

 * - 0.70–1.00 cursor leaves → everything normal

 */

export function useScaffoldDemoLoop(enabled: boolean): ScaffoldDemoState {

  const [state, setState] = React.useState<ScaffoldDemoState>({

    createOpen: false,

    expandedFolder: null,

    visibleDocCount: 0,

  });



  React.useEffect(() => {

    if (!enabled) {

      setState({ createOpen: false, expandedFolder: null, visibleDocCount: 0 });

      return;

    }



    const tick = () => {

      const progress = (Date.now() % DEMO_CYCLE_MS) / DEMO_CYCLE_MS;

      setState(computeScaffoldState(progress));

    };



    tick();

    const id = window.setInterval(tick, 80);

    return () => window.clearInterval(id);

  }, [enabled]);



  return state;

}

