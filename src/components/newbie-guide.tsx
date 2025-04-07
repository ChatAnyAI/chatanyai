import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

// Define step interface
interface Step {
  target: string;
  title?: string;
  content: string;
  placement: "top" | "right" | "bottom" | "left";
  disableBeacon?: boolean;
  isFixed?: boolean;
}

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
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!runTour) return;
    
    const updateTooltipPosition = () => {
      const step = steps[currentStep];
      if (!step) return;
      
      const targetElement = document.querySelector(step.target);
      if (!targetElement) return;
      
      const rect = targetElement.getBoundingClientRect();
      const tooltipWidth = tooltipRef.current?.offsetWidth || 300;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 300;
      
      let top = 0;
      let left = 0;
      
      switch (step.placement) {
        case 'top':
          top = rect.top - tooltipHeight - 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'right':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.right + 10;
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
          break;
        case 'left':
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
          left = rect.left - tooltipWidth - 10;
          break;
      }
      
      // Keep tooltip in viewport
      top = Math.max(10, Math.min(top, window.innerHeight - tooltipHeight - 10));
      left = Math.max(10, Math.min(left, window.innerWidth - tooltipWidth - 10));
      
      setTooltipPosition({ top, left });
    };
    
    updateTooltipPosition();
    window.addEventListener('resize', updateTooltipPosition);
    
    // Special handling for step 9 (index starts from 0)
    if (currentStep === 9) {
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
    
    return () => {
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [currentStep, runTour]);
  
  if (!runTour) return null;
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tour finished
      setRunTour(false);
      localStorage.setItem('hasShownTour', 'true');
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    setRunTour(false);
    localStorage.setItem('hasShownTour', 'true');
  };
  
  // Create overlay
  const overlay = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    />
  );

  const currentStepData = steps[currentStep];
  const imageSrc = stepImages[currentStep] || "/static/placeholder.svg?height=240&width=480";
  
  const tooltip = (
    <div 
      ref={tooltipRef}
      style={{
        position: 'fixed',
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        zIndex: 10000,
        pointerEvents: 'auto',
      }}
      className="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden"
    >
      {/* Close button */}
      <button
        onClick={handleSkip}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
        aria-label="Close"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{currentStepData.title}</h2>

        {/* Image */}
        <div className="relative h-36 mb-3 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={imageSrc}
            alt={currentStepData.title || "Tour step"}
            className="object-contain"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 mb-4">{currentStepData.content}</p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {currentStep + 1}/{steps.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      {overlay}
      {tooltip}
    </>,
    document.body
  );
}

// Map step index to image path
const stepImages: Record<number, string> = {
  0: "/static/tour-images/welcome.svg", // Welcome
  1: "/static/tour-images/sidebar-overview.svg", // Left Sidebar
  2: "/static/tour-images/home-navigation.svg", // Home Navigation
  3: "/static/tour-images/recent-files.svg", // Recent Files
  4: "/static/tour-images/shared-content.svg", // Shared Content
  5: "/static/tour-images/workspaces.svg", // Workspaces
  6: "/static/tour-images/add-workspace.svg", // Add Workspace
  7: "/static/tour-images/admin-area.svg", // Admin Area
  8: "/static/tour-images/user-profile.svg", // User Profile
  9: "/static/tour-images/chat-header.svg", // Chat Header
  10: "/static/tour-images/model-selector.svg", // AI Model Selection
  11: "/static/tour-images/chat-messages.svg", // Conversation Area
  12: "/static/tour-images/chat-suggestions.svg", // Quick Suggestions
  13: "/static/tour-images/chat-input.svg", // Message Input
  14: "/static/tour-images/utility-buttons.svg", // Utility Tools
}
