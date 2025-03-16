import { useState } from "react";
import Joyride, { STATUS, type Step } from "react-joyride"

const steps: Step[] = [
  {
    target: "[data-sidebar=\"header\"]",
    content: "Welcome to ChatAnyAI! This is the main interface.",
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "[data-name=\"Home\"]",
    content: "Here you can quickly return to the home page.",
    placement: "right",
  },
  {
    target: "[data-name=\"Recently Files\"]",
    content: "Here shows content shared with you.",
    placement: "right",
  },
  {
    target: "[data-name=\"Shared with me\"]",
    content: "View your recently used files.",
    placement: "right",
  },
 
  {
    target: "[data-name=\"Workspace\"]",
    content: 'Workspace section, the "+" button appears on hover.',
    placement: "right",
  },
  {
    target: "[data-name=\"create-icon\"]",
    content: 'when the " +" button appears, Click here to add a new workspace.',
    placement: "right",
    isFixed: true,
  },
  {
    target: "[data-name=\"Workspace-sub\"]",
    content: "This is your workspace, click to switch between different work environments. You can drag and drop to reorder your workspaces as needed.",
    placement: "right",
  },
  {
    target: "[data-name=\"Admin Area\"]",
    content: "Admin area for system settings and management.",
    placement: "right",
  },
  {
    target: "[data-sidebar=\"footer\"]",
    content: "Here shows your personal information and account settings.",
    placement: "top",
  },
];

export function Guide() {
  const [runTour, setRunTour] = useState(() => {
    const hasShownTour = localStorage.getItem('hasShownTour');
    return !hasShownTour;
  });

  const handleJoyrideCallback = (data: any) => {
    const { status } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      localStorage.setItem('hasShownTour', 'true');
    }
  }

  return <Joyride
    steps={steps}
    run={runTour}
    continuous={true}
    showProgress={true}
    showSkipButton={true}
    callback={handleJoyrideCallback}
    styles={{
      options: {
        primaryColor: "#3b82f6",
        zIndex: 10000,
      },
    }}
    locale={{
      back: "Previous",
      close: "Close",
      last: "Finish",
      next: "Next",
      skip: "Skip",
    }}
  />;
}

