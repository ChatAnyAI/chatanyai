import { useState } from "react";
import Joyride, { STATUS, type Step, type TooltipRenderProps, type CallBackProps } from "react-joyride"
import { Button } from "./ui/button";
import { X } from "lucide-react";

const steps: Step[] = [
  {
    target: "[data-sidebar=\"header\"]",
    content: "Welcome to ChatAnyAI! This is the main interface.",
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "[data-name=\"home\"]",
    content: "Here you can quickly return to the home page.",
    placement: "right",
  },
  {
    target: "[data-name=\"files\"]",
    content: "Here shows content shared with you.",
    placement: "right",
  },
  {
    target: "[data-name=\"shared\"]",
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
    target: "[data-name=\"Admin Area\"]",
    content: "Admin area for system settings and management.",
    placement: "top",
  },
  {
    target: "[data-sidebar=\"footer\"]",
    content: "Here shows your personal information and account settings.",
    placement: "top",
  },
  {
    target: "[data-name=\"Workspace-sub\"]",
    content: "This is your workspace, click to switch between different work environments. You can drag and drop to reorder your workspaces as needed.",
    placement: "right",
  },

  // Chat interface steps
  {
    target: "[data-name=\"chat-header\"]",
    title: "Chat Header",
    content: "View conversation details and sharing options.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: "[data-name=\"model-selector\"]", 
    title: "AI Model Selection",
    content: "Choose different AI models for your conversation.",
    placement: "bottom",
    isFixed: true,
  },
  {
    target: "[data-name=\"suggested-actions\"]", 
    title: "Quick Suggestions",
    content: "Click on these suggestions to quickly ask common questions.",
    placement: "top",
    isFixed: true,
  },
];

export function Guide() {
  const [runTour, setRunTour] = useState(() => {
    const hasShownTour = localStorage.getItem('hasShownTour');
    return !hasShownTour;
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data
    if (index === 9) {
      const ws = document.querySelector("[data-name=\"Workspace\"]");
      const children = ws?.nextElementSibling?.children;
      if (children && children.length) {
        for (let i = 0; i < children.length; i++) {
          const element = children[i] as HTMLElement;
          const spanElement = Array.from(element.querySelectorAll('span')).find(s => s.textContent === 'Just Chat');

          if (spanElement && spanElement.textContent === 'Just Chat') {
            // Found the element
            spanElement?.parentElement?.click();
            spanElement?.parentElement?.click();
            break;
          }
        }
      }
    }
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
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
    tooltipComponent={CustomTooltip}
    styles={{
      options: {
        zIndex: 10000,
        arrowColor: "#fff",
        backgroundColor: "#fff",
        overlayColor: "rgba(0, 0, 0, 0.5)",
        width: "auto",
      },
      tooltip: {
        padding: 0,
        borderRadius: 8,
      },
      buttonNext: {
        display: "none",
      },
      buttonBack: {
        display: "none",
      },
      buttonClose: {
        display: "none",
      },
    }}
    floaterProps={{
      disableAnimation: true,
      offset: 10,
      styles: {
        arrow: {
          display: "none",
        },
        floater: {
          filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
        },
      },
    }}
  />;
}



// Map step index to image path
const stepImages: Record<number, string> = {
  0: "/tour-images/welcome.svg", // Welcome
  1: "/tour-images/sidebar-overview.svg", // Left Sidebar
  2: "/tour-images/home-navigation.svg", // Home Navigation
  3: "/tour-images/recent-files.svg", // Recent Files
  4: "/tour-images/shared-content.svg", // Shared Content
  5: "/tour-images/workspaces.svg", // Workspaces
  6: "/tour-images/add-workspace.svg", // Add Workspace
  7: "/tour-images/admin-area.svg", // Admin Area
  8: "/tour-images/user-profile.svg", // User Profile
  9: "/tour-images/chat-header.svg", // Chat Header
  10: "/tour-images/model-selector.svg", // AI Model Selection
  11: "/tour-images/chat-messages.svg", // Conversation Area
  12: "/tour-images/chat-suggestions.svg", // Quick Suggestions
  13: "/tour-images/chat-input.svg", // Message Input
  14: "/tour-images/utility-buttons.svg", // Utility Tools
}

export default function CustomTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  isLastStep,
  size,
}: TooltipRenderProps) {
  // Ensure we're using the correct image for the current step
  const imageSrc = stepImages[index] || "/placeholder.svg?height=240&width=480"

  return (
    <div {...tooltipProps} className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
      {/* Close button */}
      <button
        {...closeProps}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{step.title}</h2>

        {/* Image */}
        <div className="relative h-36 mb-3 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={step.title as string || "Tour step"}
            className="object-contain"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4">{step.content}</p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {index + 1}/{size}
          </div>
          <div className="flex gap-2">
            {index > 0 && (
              <Button variant="outline" size="sm" {...backProps}>
                Previous
              </Button>
            )}
            <Button size="sm" {...primaryProps}>
              {isLastStep ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
