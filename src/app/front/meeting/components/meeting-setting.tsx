"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Wand2, Shuffle, Trash2, Plus, MessageCircle, Lightbulb } from "lucide-react"



const demoTopics = [
  "How to enhance user loyalty and brand stickiness through social platforms?",
  "How to design an effective remote team collaboration process?",
  "How to improve development efficiency while maintaining product quality?",
  "How to build a successful corporate culture?",
  "How to formulate effective marketing strategies?",
  "How to enhance the customer service experience?",
  "How to maintain a competitive edge during digital transformation?",
  "How to establish an efficient cross - departmental communication mechanism?",
  "How to optimize the user experience design of products?",
  "How to formulate a sustainable business strategy?"
]

const demoData = [
  {
    id: 1,
    name: "Alexander Reed",
    description: "A 28 - 35-year-old man working as a technical supervisor. He has the ENTJ personality type, excels in system architecture design, values teamwork, is good at innovative thinking, and is enthusiastic about new technologies.",
  },
  {
    id: 2,
    name: "Isabella Lane",
    description: "A 30 - 40-year-old woman serves as the director of user experience design. She has the INFJ personality type, possessing keen observation and empathy. She focuses on user needs analysis and pursues perfection in product experience.",
  },
  {
    id: 3,
    name: "Oliver Fox",
    description: "A 25 - 32-year-old man who is the CEO of a startup. He has the ENTP personality type, is full of entrepreneurial spirit and strategic vision, is good at seizing market opportunities, and excels in cross - border resource integration.",
  },
]


interface Character {
  id: number
  name: string
  description: string
}

export type MeetingData = {
  topic: string
  maxrounds: number
  members: {
    name: string
    description: string
  }[]
}
export default function DiscussionSetup({
  data,
  onStart,
  chatId,
}: {
  chatId: string,
  data: MeetingData,
  onStart: (data: MeetingData) => void
}) {
  const [topic, setTopic] = useState<string>(data?.topic || "")
  const [maxrounds, setMaxRounds] = useState<number>(data?.maxrounds || 2)
  const [members, setMembers] = useState<Character[]>(data?.members ? data.members.map((m, i) => ({ ...m, id: i + 1 })) : demoData)
  const { toast } = useToast()

  const isDisabled = !!data

  const addCharacter = () => {
    const newId = members.length > 0 ? Math.max(...members.map((c) => c.id)) + 1 : 1
    setMembers([...members, { id: newId, name: `New character ${newId}`, description: "" }])
  }

  const deleteCharacter = (id: number) => {
    setMembers(members.filter((c) => c.id !== id))
  }

  const updateCharacter = (id: number, field: "name" | "description", value: string) => {
    setMembers(members.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const startDiscussion = () => {
    if (!topic.trim()) {
      toast({
        title: "Please enter the discussion topic.",
        variant: "destructive"
      });
      return;
    }

    if (members.length === 0) {
      toast({
        title: "Please add at least one character.",
        variant: "destructive"
      });
      return;
    }

    const data = {
      topic,
      maxrounds,
      members: members.map(({ name, description }) => ({ name, description })),
    }
    console.log("startDiscussion", data, chatId)
    sessionStorage.setItem(`meeting-${chatId}`, JSON.stringify(data));
    onStart(data);
  }

  const generateRandomTopic = () => {
    const randomIndex = Math.floor(Math.random() * demoTopics.length)
    setTopic(demoTopics[randomIndex])
  }

  return (
    <TooltipProvider>
      <ScrollArea className="h-full pr-3 flex-1 w-full">
        <div className="flex justify-center p-4">
        <div className="space-y-4 w-full">
          <div className="max-w-5xl mx-auto mb-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-1">
              <Lightbulb className="w-8 h-8 text-primary" />
              Brainstorming
            </h1>
            <p className="mt-1 text-base text-muted-foreground">Stimulate creativity and spark intellectual collisions.</p>
          </div>

          {/* Topic Section */}
          <Card className="shadow-sm">
            <CardHeader className="space-y-1 py-3 px-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Discussion topic</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="space-y-1.5">
                <Label>Customized topics:</Label>
                <Input
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="How to enhance user loyalty and brand stickiness through social platforms?"
                    className="h-9"
                    disabled={isDisabled}
                />
              </div>
              <Button size="sm" onClick={generateRandomTopic} disabled={isDisabled}>
                <Shuffle className="w-4 h-4 mr-2" />
                Generate random topics.
              </Button>
            </CardContent>
          </Card>

          {/* MaxRounds Setting */}
          <Card className="shadow-sm">
            <CardHeader className="space-y-1 py-3 px-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Dialogue turn setting</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="space-y-1.5">
                <Label>Dialogue turns: {maxrounds}</Label>
                <Slider
                    value={[maxrounds]}
                    onValueChange={(value) => setMaxRounds(value[0])}
                    max={20}
                    min={1}
                    step={1}
                    disabled={isDisabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Character Settings */}
          <Card className="shadow-sm">
            <CardHeader className="space-y-1 py-3 px-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-primary/20 rounded-lg flex items-center justify-center">
                  <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                  >
                    <circle cx="12" cy="8" r="5" />
                    <path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold">Character setting panel</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 px-4 pb-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Character Cards */}
                {members.map((character) => (
                    <Card key={character.id} className="shadow-sm">
                      <CardContent className="p-3 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                              {character.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="space-y-1">
                              <Label>Character name</Label>
                              <Input
                                  value={character.name}
                                  onChange={(e) => updateCharacter(character.id, "name", e.target.value)}
                                  className="h-8"
                                  disabled={isDisabled}
                              />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" onClick={() => deleteCharacter(character.id)} className="h-7 w-7">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete the character.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label>Character description (maximum 200 characters)</Label>
                          <Textarea
                              value={character.description}
                              onChange={(e) => updateCharacter(character.id, "description", e.target.value)}
                              className="min-h-[80px] resize-none text-sm"
                              maxLength={200}
                              disabled={isDisabled}
                          />
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={addCharacter} disabled={isDisabled}>
                <Plus className="w-4 h-4 mr-2" />
                Add a new character
              </Button>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 pt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" onClick={startDiscussion} disabled={isDisabled}>Start the discussion</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start the discussion with the current settings.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </ScrollArea>
    </TooltipProvider>
  )
}
